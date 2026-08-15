import { useEffect, useState } from 'react';
import { WifiOff, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

/*
 * Offline readiness indicator.
 *
 * The app is offline-capable via the service worker in public/sw.js, but from
 * the user's side that is completely invisible until they are actually on a
 * plane and it either works or it doesn't. This reports the three things that
 * decide it, so it can be checked BEFORE losing signal:
 *   1. is a service worker installed and controlling this page
 *   2. is the app shell actually sitting in the cache
 *   3. on iOS, is it installed to the Home Screen (Safari tabs are far more
 *      aggressively evicted than an installed PWA)
 */

type State = 'checking' | 'ready' | 'partial' | 'unsupported';

export default function OfflineStatus() {
  const [state, setState] = useState<State>('checking');
  const [files, setFiles] = useState(0);
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [refreshing, setRefreshing] = useState(false);

  const isStandalone =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari does not implement display-mode, it sets this instead.
      (navigator as unknown as { standalone?: boolean }).standalone === true);

  async function check() {
    if (!('serviceWorker' in navigator) || !('caches' in window)) {
      setState('unsupported');
      return;
    }
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const keys = await caches.keys();
      let count = 0;
      for (const k of keys) count += (await caches.open(k).then(c => c.keys())).length;
      setFiles(count);
      const controlling = !!navigator.serviceWorker.controller;
      const shell = await caches.match('./index.html').then(r => !!r).catch(() => false);
      setState(reg && controlling && count > 0 && shell ? 'ready' : 'partial');
    } catch {
      setState('partial');
    }
  }

  useEffect(() => {
    check();
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  async function refresh() {
    setRefreshing(true);
    try {
      const base = location.pathname.replace(/[^/]*$/, '');
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) await reg.update();
      else await navigator.serviceWorker.register(base + 'sw.js', { scope: base });
      // Give the new worker a moment to install and precache before re-reading.
      await new Promise(r => setTimeout(r, 2500));
      await check();
    } catch {
      /* nothing more we can do from here */
    }
    setRefreshing(false);
  }

  if (state === 'unsupported') return null;

  const ok = state === 'ready';

  return (
    <div className="max-w-6xl mx-auto px-6 pb-4">
      <div className={`rounded-2xl border p-4 ${ok ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/25'}`}>
        <div className="flex items-start gap-2.5">
          {ok
            ? <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            : <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />}
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-bold ${ok ? 'text-emerald-300' : 'text-amber-300'}`}>
              {state === 'checking'
                ? 'Checking offline copy…'
                : ok
                  ? 'Saved for offline — opens with no signal'
                  : 'Offline copy not ready yet'}
            </p>
            <p className="text-gray-500 text-xs leading-relaxed mt-1">
              {ok
                ? `${files} files stored on this device. Every section, the Backtest Lab and the Chart Quiz work with no connection — only the AI features need signal.`
                : 'Stay on wifi for a few seconds and tap Refresh. If it still will not save, close the app fully and reopen it once while online.'}
            </p>

            {!isStandalone && (
              <p className="text-gray-500 text-xs leading-relaxed mt-2">
                <span className="text-gray-300 font-semibold">On iPhone:</span> add this to your Home Screen
                (Share → Add to Home Screen) and open it from there. Safari clears cached tabs far sooner than
                an installed app, so a bookmark is the least reliable way to rely on it offline.
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={refresh}
                disabled={refreshing || !online}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-white/8 text-gray-200 px-3 py-1.5 rounded-full disabled:opacity-40">
                <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Saving…' : 'Refresh offline copy'}
              </button>
              {!online && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                  <WifiOff size={12} /> No connection right now
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
