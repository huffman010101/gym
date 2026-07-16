import { useState, useEffect } from 'react';
import { BellRing, Check, Loader2 } from 'lucide-react';

type Permission = 'granted' | 'denied' | 'default';

declare global {
  interface Window {
    gymforgeEnableNotifications?: () => Promise<Permission>;
    gymforgeNotificationStatus?: () => Promise<Permission>;
  }
}

export default function NotifyPrompt() {
  const [status, setStatus] = useState<'unknown' | Permission>('unknown');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.gymforgeNotificationStatus?.()
      .then(setStatus)
      .catch(() => setStatus('default'));
  }, []);

  if (status === 'unknown' || status === 'granted') return null;

  const enable = async () => {
    setBusy(true);
    try {
      const perm = await window.gymforgeEnableNotifications?.();
      setStatus(perm ?? 'denied');
    } catch {
      setStatus('denied');
    }
    setBusy(false);
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl px-4 py-3.5 flex items-center gap-3">
      <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <BellRing size={15} className="text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-xs">
          {status === 'denied' ? 'Notifications blocked' : 'Turn on daily reminders'}
        </p>
        <p className="text-gray-600 text-[11px]">
          {status === 'denied'
            ? 'Enable notifications for this app in your phone Settings, then reopen it.'
            : 'Get nudged when your streak or plan needs attention.'}
        </p>
      </div>
      {status !== 'denied' && (
        <button onClick={enable} disabled={busy}
          className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5">
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
          Enable
        </button>
      )}
    </div>
  );
}
