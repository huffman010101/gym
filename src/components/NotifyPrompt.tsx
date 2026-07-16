import { useState, useEffect } from 'react';
import { BellRing, Check, Loader2, AlertTriangle } from 'lucide-react';

type Permission = 'granted' | 'denied' | 'default';
type Status = 'checking' | 'unsupported' | 'unavailable' | Permission;

declare global {
  interface Window {
    gymforgeEnableNotifications?: () => Promise<Permission>;
    gymforgeNotificationStatus?: () => Promise<Permission>;
  }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

export default function NotifyPrompt() {
  const [status, setStatus] = useState<Status>('checking');
  const [busy, setBusy] = useState(false);

  const checkStatus = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setStatus('unsupported');
      return;
    }
    setStatus('checking');
    withTimeout(window.gymforgeNotificationStatus?.() ?? Promise.reject(), 6000)
      .then(setStatus)
      .catch(() => setStatus('unavailable'));
  };

  useEffect(checkStatus, []);

  if (status === 'granted') return null;

  const enable = async () => {
    setBusy(true);
    try {
      const perm = await withTimeout(window.gymforgeEnableNotifications?.() ?? Promise.reject(), 8000);
      setStatus(perm);
    } catch {
      setStatus('unavailable');
    }
    setBusy(false);
  };

  const copy: Record<Status, { title: string; sub: string }> = {
    checking: { title: 'Checking notifications…', sub: 'One sec.' },
    unsupported: { title: 'Notifications not supported here', sub: 'Open GymForge from the home-screen icon (not a browser tab) on iOS 16.4+.' },
    unavailable: { title: "Couldn't reach the notification service", sub: 'Check your connection, then try again — or reopen the app.' },
    default: { title: 'Turn on daily reminders', sub: 'Get nudged when your streak or plan needs attention.' },
    denied: { title: 'Notifications blocked', sub: 'Enable notifications for this app in your phone Settings, then reopen it.' },
    granted: { title: '', sub: '' },
  };
  const c = copy[status];

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl px-4 py-3.5 flex items-center gap-3">
      <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
        {status === 'unavailable' || status === 'unsupported'
          ? <AlertTriangle size={15} className="text-amber-400" />
          : <BellRing size={15} className="text-orange-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-xs">{c.title}</p>
        <p className="text-gray-600 text-[11px]">{c.sub}</p>
      </div>
      {(status === 'default' || status === 'unavailable') && (
        <button onClick={status === 'unavailable' ? checkStatus : enable} disabled={busy}
          className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5">
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
          {status === 'unavailable' ? 'Try again' : 'Enable'}
        </button>
      )}
    </div>
  );
}
