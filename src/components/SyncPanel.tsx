import { useEffect, useState } from 'react';
import { ChevronDown, CloudCog, Loader2, AlertCircle, Check, ExternalLink } from 'lucide-react';
import { connect, disconnect, isConnected, onSyncState, syncNow, type SyncState } from '../lib/sync';

/*
 * One slim row on Home: whether this device is synced, and the one-time
 * set-up to link it. Everything else happens in src/lib/sync.ts.
 */

const TOKEN_URL = 'https://github.com/settings/tokens/new?scopes=gist&description=GymForge%20sync';

function ago(t: number) {
  if (!t) return 'not yet';
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
}

export default function SyncPanel() {
  const [st, setSt] = useState<SyncState>({ status: 'off', last: 0 });
  // A message survives the remount that follows pulling another device's data.
  const [flash] = useState(() => { try { return sessionStorage.getItem('gfsync_flash') || ''; } catch { return ''; } });
  const [open, setOpen] = useState(!!flash);
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(flash);
  const [err, setErr] = useState('');
  const [, tick] = useState(0);

  useEffect(() => onSyncState(setSt), []);
  useEffect(() => { try { sessionStorage.removeItem('gfsync_flash'); } catch { /* ignore */ } }, []);
  useEffect(() => { const id = window.setInterval(() => tick(n => n + 1), 30_000); return () => window.clearInterval(id); }, []);

  const linked = isConnected();
  const label = !linked ? 'Not synced — this device only'
    : st.status === 'syncing' ? 'Syncing…'
    : st.status === 'error' ? 'Sync problem — tap to see'
    : `Synced ${ago(st.last)}`;

  const go = async () => {
    setBusy(true); setErr(''); setMsg('');
    try {
      const existed = await connect(token);
      setToken('');
      const m = existed ? 'Linked. Your plans from your other devices are now here.' : 'Sync is on. Paste the same token on your other devices to link them.';
      try { sessionStorage.setItem('gfsync_flash', m); } catch { /* ignore */ }
      setMsg(m);
    } catch (e) {
      disconnect();
      setErr(e instanceof Error ? e.message : 'Could not connect.');
    }
    setBusy(false);
  };

  return (
    <div className="hud-panel" data-testid="sync-panel">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left">
        <span className="flex items-center gap-2 min-w-0">
          {st.status === 'syncing' ? <Loader2 size={14} className="text-cyan-300 animate-spin flex-shrink-0" />
            : st.status === 'error' ? <AlertCircle size={14} className="text-amber-300 flex-shrink-0" />
            : linked ? <Check size={14} className="text-emerald-300 flex-shrink-0" />
            : <CloudCog size={14} className="text-cyan-300 flex-shrink-0" />}
          <span className="font-hud text-[12px] font-bold uppercase tracking-[0.18em] text-cyan-200 truncate">{label}</span>
        </span>
        <ChevronDown size={16} className={`text-cyan-300 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2.5 text-xs text-gray-400">
          {linked ? (
            <>
              <p>Your plans, week goals, meals, logs and notes save to your own private GitHub gist and follow you to every device you link. Changes go up within seconds and come down when you open the app.</p>
              {st.status === 'error' && <p className="text-amber-300 flex gap-1.5"><AlertCircle size={13} className="flex-shrink-0 mt-px" />{st.error}</p>}
              <div className="flex gap-2">
                <button onClick={() => void syncNow()} className="flex-1 rounded-xl py-2 font-hud font-bold uppercase tracking-wider border border-cyan-300/40 text-cyan-100">Sync now</button>
                <button onClick={() => { if (confirm('Stop syncing this device? Your data stays here and in the gist.')) { disconnect(); setMsg(''); } }}
                  className="rounded-xl px-3 py-2 font-hud font-bold uppercase tracking-wider border border-white/10 text-gray-500">Unlink</button>
              </div>
            </>
          ) : (
            <>
              <p>Right now everything is saved on this device only. One-time set-up, about two minutes, then do step 3 on each of your other devices:</p>
              <ol className="space-y-1.5">
                <li><span className="text-cyan-300 font-semibold">1.</span> Open <a href={TOKEN_URL} target="_blank" rel="noreferrer" className="text-cyan-300 underline inline-flex items-center gap-0.5">GitHub token <ExternalLink size={10} /></a> and sign in. The <b className="text-gray-200">gist</b> box is already ticked; leave everything else.</li>
                <li><span className="text-cyan-300 font-semibold">2.</span> Set the expiry to <b className="text-gray-200">No expiration</b>, press Generate, copy the token.</li>
                <li><span className="text-cyan-300 font-semibold">3.</span> Paste it here. The same token on another device finds your data automatically.</li>
              </ol>
              <div className="flex gap-2">
                <input value={token} onChange={e => setToken(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()} placeholder="ghp_…" autoComplete="off" spellCheck={false}
                  className="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-sm text-gray-100 outline-none focus:border-cyan-400/50" aria-label="GitHub token" />
                <button onClick={go} disabled={!token.trim() || busy}
                  className="rounded-xl px-4 font-hud font-bold uppercase tracking-wider border border-cyan-300/40 text-cyan-100 disabled:opacity-35 inline-flex items-center gap-1.5">
                  {busy ? <Loader2 size={13} className="animate-spin" /> : null} Link
                </button>
              </div>
              {err && <p className="text-red-300 flex gap-1.5"><AlertCircle size={13} className="flex-shrink-0 mt-px" />{err}</p>}
              <p className="text-[11px] text-gray-600">The gist is secret: it is not listed or searchable, but anyone given its exact link could read it, so do not keep anything here you would hate leaked. Your Anthropic key and progress photos never leave this device.</p>
            </>
          )}
          {msg && <p className="text-emerald-300">{msg}</p>}
        </div>
      )}
    </div>
  );
}
