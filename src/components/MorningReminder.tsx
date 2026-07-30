import { useState } from 'react';
import { BellRing, CalendarPlus, Check } from 'lucide-react';

const APP_URL = 'https://huffman010101.github.io/gym/';

/*
 * Daily morning reminder via a calendar subscription file.
 *
 * Why not push notifications: a real background push (one that fires when the
 * app is closed) needs a server to send it on a schedule. A recurring calendar
 * event with an alarm gives the same outcome — a notification every morning,
 * tappable straight into the app — with no account, no API key, and no backend,
 * and it works identically on iOS and Android.
 *
 * Times are written as "floating" local time (no TZID / no trailing Z) so the
 * reminder stays at the chosen wall-clock time wherever the phone is.
 */
function buildIcs(time: string): string {
  const [hh, mm] = time.split(':');
  const endTotal = parseInt(hh, 10) * 60 + parseInt(mm, 10) + 15;
  const endHH = String(Math.floor(endTotal / 60) % 24).padStart(2, '0');
  const endMM = String(endTotal % 60).padStart(2, '0');
  const now = new Date();
  const stamp =
    now.getUTCFullYear().toString() +
    String(now.getUTCMonth() + 1).padStart(2, '0') +
    String(now.getUTCDate()).padStart(2, '0') + 'T' +
    String(now.getUTCHours()).padStart(2, '0') +
    String(now.getUTCMinutes()).padStart(2, '0') +
    String(now.getUTCSeconds()).padStart(2, '0') + 'Z';

  // Start tomorrow so the first fire is a real morning, not a past time today.
  const start = new Date(now.getTime() + 86400000);
  const day =
    start.getFullYear().toString() +
    String(start.getMonth() + 1).padStart(2, '0') +
    String(start.getDate()).padStart(2, '0');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GymForge//Morning Plan//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:gymforge-morning-plan-${Date.now()}@gymforge`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${day}T${hh}${mm}00`,
    // 15-minute block rather than zero-length: some calendar apps render
    // zero-duration events oddly or drop them from day views.
    `DTEND:${day}T${endHH}${endMM}00`,
    'RRULE:FREQ=DAILY',
    'SUMMARY:Your plan for today',
    `DESCRIPTION:Open GymForge and tick off the plan you set last night.\\n${APP_URL}`,
    `URL:${APP_URL}`,
    'BEGIN:VALARM',
    'TRIGGER:PT0M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Your plan for today',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export default function MorningReminder() {
  const [time, setTime] = useState('07:00');
  const [added, setAdded] = useState(false);

  const download = () => {
    const blob = new Blob([buildIcs(time)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gymforge-morning-plan.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setAdded(true);
    try { localStorage.setItem('gymforge_morning_reminder', time); } catch { /* non-critical */ }
  };

  return (
    <div className="bg-gradient-to-br from-sky-500/15 to-[#111] border border-sky-500/30 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-sky-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
          <BellRing size={17} className="text-sky-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm text-sky-200">Morning reminder</p>
          <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">
            Get a notification every morning with a tap straight into your plan. Adds a daily
            repeating reminder to your phone&apos;s calendar — no account or setup needed.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <input
              type="time"
              value={time}
              onChange={e => { setTime(e.target.value); setAdded(false); }}
              className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/60"
            />
            <button
              onClick={download}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              {added ? <><Check size={13} /> Added — open the file</> : <><CalendarPlus size={13} /> Add daily reminder</>}
            </button>
          </div>
          {added && (
            <p className="text-[11px] text-sky-300/70 leading-relaxed mt-2">
              Your phone will ask to add it to your calendar — accept, and it repeats every day at {time}.
              To change the time later, just add it again and delete the old one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
