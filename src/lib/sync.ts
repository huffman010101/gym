/*
 * Cross-device sync with no server of our own. Every gymforge_* key is
 * mirrored to one file in a secret GitHub gist owned by the user, using a
 * personal access token with only the `gist` scope.
 *
 * - Each key carries the time it was last written; newest write wins, per key.
 * - Deletes are kept as tombstones so a removed day does not come back.
 * - The token, gist id and timestamps live under gfsync_* so they are never
 *   synced themselves, and the Anthropic key is never uploaded.
 * - Writes are caught by wrapping localStorage.setItem/removeItem, so no page
 *   has to know sync exists.
 */

const K_TOKEN = 'gfsync_token';
const K_GIST = 'gfsync_gist';
const K_META = 'gfsync_meta';
const K_LAST = 'gfsync_last';
const FILE = 'gymforge-sync.json';
const API = 'https://api.github.com';

const EXCLUDE = new Set(['gymforge_api_key', 'gymforge_jarvis_booted']);
const MAX_VALUE = 250_000;          // progress photos stay on the device
const TOMBSTONE_DAYS = 60;
const PUSH_DELAY = 8_000;

type Item = { v: string | null; t: number };
type Remote = { v: 1; items: Record<string, Item> };
export type SyncState = { status: 'off' | 'idle' | 'syncing' | 'error'; last: number; error?: string };

const ls = window.localStorage;
const rawSet = Storage.prototype.setItem;
const rawRemove = Storage.prototype.removeItem;
let applying = false;
let pushTimer: number | undefined;
let inflight: Promise<void> | null = null;
let state: SyncState = { status: 'off', last: 0 };
const listeners = new Set<(s: SyncState) => void>();

const syncable = (k: string) => k.startsWith('gymforge_') && !EXCLUDE.has(k);
const read = (k: string) => { try { return ls.getItem(k); } catch { return null; } };
const writeRaw = (k: string, v: string) => { try { rawSet.call(ls, k, v); } catch { /* quota */ } };

function loadMeta(): Record<string, number> {
  try { return JSON.parse(read(K_META) || '{}'); } catch { return {}; }
}
function saveMeta(m: Record<string, number>) { writeRaw(K_META, JSON.stringify(m)); }

function setState(patch: Partial<SyncState>) {
  state = { ...state, ...patch };
  listeners.forEach(l => l(state));
}
export function onSyncState(fn: (s: SyncState) => void) {
  listeners.add(fn);
  fn(state);
  return () => { listeners.delete(fn); };
}
export const isConnected = () => !!read(K_TOKEN) && !!read(K_GIST);

/* ---------- catching local writes ---------- */

function touch(key: string) {
  const meta = loadMeta();
  meta[key] = Date.now();
  saveMeta(meta);
  schedulePush();
}

function installHooks() {
  Storage.prototype.setItem = function (key: string, value: string) {
    const isLocal = this === ls;
    const changed = isLocal && !applying && syncable(key) && ls.getItem(key) !== String(value);
    rawSet.call(this, key, value);
    if (changed) touch(key);
  };
  Storage.prototype.removeItem = function (key: string) {
    const isLocal = this === ls;
    const existed = isLocal && !applying && syncable(key) && ls.getItem(key) !== null;
    rawRemove.call(this, key);
    if (existed) touch(key);
  };
}

function schedulePush() {
  if (!isConnected() || pushTimer !== undefined) return;
  pushTimer = window.setTimeout(() => { pushTimer = undefined; void syncNow(); }, PUSH_DELAY);
}

/* ---------- GitHub ---------- */

async function gh(path: string, init: RequestInit = {}, token = read(K_TOKEN) || '') {
  const res = await fetch(API + path, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', ...(init.headers || {}) },
    cache: 'no-store',
  });
  if (res.status === 401) throw new Error('GitHub rejected the token. Make a new one with the gist box ticked.');
  if (res.status === 404) throw new Error('The sync gist was not found. Disconnect and connect again.');
  if (!res.ok) throw new Error(`GitHub error ${res.status}. Try again in a minute.`);
  return res;
}

async function fetchRemote(gistId: string): Promise<Remote> {
  const gist = await (await gh(`/gists/${gistId}`)).json();
  const f = gist.files?.[FILE];
  if (!f) return { v: 1, items: {} };
  // Gists over ~1MB come back truncated; the raw URL has the whole file.
  const text: string = f.truncated ? await (await fetch(f.raw_url, { cache: 'no-store' })).text() : f.content;
  try {
    const parsed = JSON.parse(text) as Remote;
    return parsed && parsed.items ? parsed : { v: 1, items: {} };
  } catch { return { v: 1, items: {} }; }
}

function localKeys() {
  const keys: string[] = [];
  for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (k && syncable(k)) keys.push(k); }
  return keys;
}

/** Merge remote into local, return what changed locally and what the remote should become. */
function merge(remote: Remote) {
  const meta = loadMeta();
  const now = Date.now();
  const changed: string[] = [];
  const out: Record<string, Item> = { ...remote.items };
  let remoteStale = false;

  applying = true;
  try {
    for (const [k, item] of Object.entries(remote.items)) {
      if (!syncable(k)) continue;
      const localT = meta[k] ?? 0;
      if (item.t > localT || (localT === 0 && item.t > 0)) {
        const cur = read(k);
        if (item.v === null) { if (cur !== null) { rawRemove.call(ls, k); changed.push(k); } }
        else if (item.v.length <= MAX_VALUE && cur !== item.v) { writeRaw(k, item.v); changed.push(k); }
        meta[k] = item.t;
      }
    }
  } finally { applying = false; }

  const keys = new Set([...localKeys(), ...Object.keys(meta).filter(syncable)]);
  for (const k of keys) {
    const v = read(k);
    if (v !== null && v.length > MAX_VALUE) continue;
    let t = meta[k] ?? 0;
    const r = out[k];
    if (t === 0) { t = now; meta[k] = t; }          // data from before sync existed
    if (!r || t > r.t) { out[k] = { v, t }; remoteStale = true; }
  }

  // Forget old tombstones so the file does not grow forever.
  const cutoff = now - TOMBSTONE_DAYS * 864e5;
  for (const [k, item] of Object.entries(out)) {
    if (item.v === null && item.t < cutoff) { delete out[k]; delete meta[k]; remoteStale = true; }
  }

  saveMeta(meta);
  return { changed, next: { v: 1 as const, items: out }, remoteStale };
}

async function push(gistId: string, data: Remote) {
  await gh(`/gists/${gistId}`, { method: 'PATCH', body: JSON.stringify({ files: { [FILE]: { content: JSON.stringify(data) } } }) });
}

export function syncNow(): Promise<void> {
  if (inflight) return inflight;
  const gistId = read(K_GIST);
  if (!read(K_TOKEN) || !gistId) { setState({ status: 'off' }); return Promise.resolve(); }
  if (!navigator.onLine) return Promise.resolve();
  setState({ status: 'syncing', error: undefined });
  inflight = (async () => {
    try {
      const { changed, next, remoteStale } = merge(await fetchRemote(gistId));
      if (remoteStale) await push(gistId, next);
      const last = Date.now();
      writeRaw(K_LAST, String(last));
      setState({ status: 'idle', last });
      // Deferred so a caller awaiting this (connect) can finish before pages remount.
      if (changed.length) window.setTimeout(() => window.dispatchEvent(new CustomEvent('gymforge-synced', { detail: changed })), 50);
    } catch (e) {
      setState({ status: 'error', error: e instanceof Error ? e.message : 'Sync failed.' });
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/* ---------- connecting a device ---------- */

/** Find this account's GymForge gist, or create it. Returns true if existing data was found. */
export async function connect(token: string): Promise<boolean> {
  token = token.trim();
  if (!token) throw new Error('Paste the token first.');
  let found: string | null = null;
  let existed = true;
  for (let page = 1; page <= 5 && !found; page++) {
    const list = await (await gh(`/gists?per_page=100&page=${page}`, {}, token)).json() as { id: string; files: Record<string, unknown> }[];
    found = list.find(g => g.files && FILE in g.files)?.id ?? null;
    if (list.length < 100) break;
  }
  if (!found) {
    existed = false;
    const created = await (await gh('/gists', {
      method: 'POST',
      body: JSON.stringify({ description: 'GymForge sync — private app data', public: false, files: { [FILE]: { content: JSON.stringify({ v: 1, items: {} }) } } }),
    }, token)).json() as { id: string };
    found = created.id;
    // First device: everything already here is the starting point.
    const meta = loadMeta();
    const now = Date.now();
    for (const k of localKeys()) if (!meta[k]) meta[k] = now;
    saveMeta(meta);
  }
  writeRaw(K_TOKEN, token);
  writeRaw(K_GIST, found);
  await syncNow();
  if (state.status === 'error') throw new Error(state.error);
  return existed;
}

export function disconnect() {
  window.clearTimeout(pushTimer);
  pushTimer = undefined;
  [K_TOKEN, K_GIST, K_LAST].forEach(k => { try { rawRemove.call(ls, k); } catch { /* ignore */ } });
  setState({ status: 'off', last: 0, error: undefined });
}

/* ---------- start-up ---------- */

let started = false;
export function startSync() {
  if (started) return;
  started = true;
  installHooks();
  state = { status: isConnected() ? 'idle' : 'off', last: Number(read(K_LAST) || 0) };
  void syncNow();
  let lastVisible = Date.now();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && Date.now() - lastVisible > 20_000) { lastVisible = Date.now(); void syncNow(); }
    if (document.visibilityState === 'hidden' && pushTimer !== undefined) {
      window.clearTimeout(pushTimer);
      pushTimer = undefined;
      void syncNow();
    }
  });
  window.addEventListener('online', () => void syncNow());
}
