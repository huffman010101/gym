import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Upload, Plus, ChevronRight, Loader2, Info } from 'lucide-react';
import { loadWhoop, upsertDay, latest, lastN, zoneOf, todayKey, importWhoopFile, todaysSession } from '../lib/whoop';
import type { WhoopDay } from '../lib/whoop';

const ZONE_STYLE = {
  green: { ring: 'rgb(52,211,153)', text: 'text-emerald-300', label: 'Green' },
  yellow: { ring: 'rgb(250,204,21)', text: 'text-yellow-300', label: 'Yellow' },
  red: { ring: 'rgb(251,113,133)', text: 'text-rose-300', label: 'Red' },
};

export default function WhoopPanel({ onChange }: { onChange?: (d: WhoopDay | null) => void }) {
  const [days, setDays] = useState(loadWhoop);
  const [logOpen, setLogOpen] = useState(false);
  const [form, setForm] = useState({ recovery: '', hrv: '', sleepHours: '', strain: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [help, setHelp] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const last = latest(days);
  const isToday = last?.date === todayKey();
  // Show the most recent day even if it is not today, clearly labelled, so an
  // import from yesterday is not a panel of dashes.
  const shown = last;
  const dayLabel = !last ? '' : isToday ? 'Today' : new Date(last.date + 'T12:00:00').toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
  const zone = isToday ? zoneOf(last?.recovery) : null;
  const session = todaysSession(zone);
  const trend = lastN(days, 7).filter(d => d.recovery !== undefined);

  const save = () => {
    const n = (v: string) => (v.trim() === '' ? undefined : parseFloat(v));
    const all = upsertDay({ date: todayKey(), recovery: n(form.recovery), hrv: n(form.hrv), sleepHours: n(form.sleepHours), strain: n(form.strain) });
    setDays(all);
    setLogOpen(false);
    setForm({ recovery: '', hrv: '', sleepHours: '', strain: '' });
    onChange?.(latest(all));
  };

  const importFile = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    setMsg('');
    try {
      const n = await importWhoopFile(f);
      const all = loadWhoop();
      setDays(all);
      onChange?.(latest(all));
      setMsg(`Imported ${n} days of WHOOP data.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Import failed.');
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const z = zone ? ZONE_STYLE[zone] : null;
  const R = 22;
  const C = 2 * Math.PI * R;
  const input = 'w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-center text-gray-100 outline-none focus:border-cyan-400/50';

  return (
    <div className="hud-panel p-4">
      <div className="flex items-center justify-between">
        <p className="font-hud text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300/80 flex items-center gap-1.5"><Activity size={12} /> WHOOP · {dayLabel || 'Today'}</p>
        <div className="flex gap-1.5">
          <button onClick={() => setLogOpen(o => !o)} className="text-[10px] font-hud font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-cyan-400/30 text-cyan-200"><Plus size={10} className="inline -mt-0.5" /> Log</button>
          <button onClick={() => fileRef.current?.click()} className="text-[10px] font-hud font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-white/10 text-gray-400">
            {busy ? <Loader2 size={10} className="inline animate-spin" /> : <Upload size={10} className="inline -mt-0.5" />} Import
          </button>
          <button onClick={() => setHelp(h => !h)} className="text-gray-600 hover:text-gray-300" aria-label="About WHOOP sync"><Info size={14} /></button>
          <input ref={fileRef} type="file" accept=".csv,.zip" className="hidden" onChange={e => importFile(e.target.files?.[0])} />
        </div>
      </div>

      {help && (
        <p className="text-[11px] text-gray-400 leading-relaxed mt-2 border-l-2 border-cyan-400/30 pl-2.5">
          Live sync needs a WHOOP developer app and a server to hold its secret, which this offline app does not have. Instead:
          tap <b>Log</b> each morning with the four numbers from the WHOOP app (ten seconds), or <b>Import</b> your WHOOP data export
          (WHOOP app → More → App Settings → Data Export; upload the zip or physiological_cycles.csv) to load your history.
        </p>
      )}

      <div className="flex items-center gap-4 mt-3">
        <div className="relative w-[56px] h-[56px] flex-shrink-0">
          <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
            <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
            {shown?.recovery !== undefined && (
              <circle cx="28" cy="28" r={R} fill="none" stroke={z?.ring} strokeWidth="5" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C * (1 - shown.recovery / 100)} opacity={isToday ? 1 : 0.5} />
            )}
          </svg>
          <p className={`absolute inset-0 flex items-center justify-center font-orbitron text-sm ${z?.text ?? 'text-gray-400'}`}>
            {shown?.recovery !== undefined ? `${Math.round(shown.recovery)}%` : '—'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 flex-1 text-center">
          {[
            ['HRV', shown?.hrv !== undefined ? `${Math.round(shown.hrv)}` : '—', 'ms'],
            ['Sleep', shown?.sleepHours !== undefined ? `${shown.sleepHours}` : '—', 'h'],
            ['Strain', shown?.strain !== undefined ? `${shown.strain}` : '—', ''],
          ].map(([l, v, u]) => (
            <div key={l}>
              <p className="font-orbitron text-sm text-gray-100">{v}<span className="text-[9px] text-gray-500 ml-0.5">{v !== '—' ? u : ''}</span></p>
              <p className="font-hud text-[9px] uppercase tracking-wider text-gray-500">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {trend.length > 1 && (
        <div className="flex items-end gap-1 h-8 mt-3" title="Recovery, last 7 days">
          {trend.map(d => {
            const zz = zoneOf(d.recovery)!;
            return <div key={d.date} className="flex-1 rounded-sm" style={{ height: `${Math.max(8, d.recovery!)}%`, background: ZONE_STYLE[zz].ring, opacity: 0.75 }} />;
          })}
        </div>
      )}

      {logOpen && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {([['recovery', 'Recovery %'], ['hrv', 'HRV ms'], ['sleepHours', 'Sleep h'], ['strain', 'Strain']] as const).map(([k, l]) => (
            <label key={k} className="text-[9px] font-hud uppercase tracking-wider text-gray-500 text-center">
              {l}
              <input inputMode="decimal" className={input + ' mt-1'} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
            </label>
          ))}
          <button onClick={save} className="col-span-4 rounded-lg py-2 font-hud font-bold uppercase tracking-wider text-xs bg-cyan-400/15 border border-cyan-300/40 text-cyan-100">Save today</button>
        </div>
      )}
      {last && !isToday && <p className="text-[11px] text-gray-500 mt-2">Showing your latest data. Tap Log with this morning's numbers to set today's session.</p>}
      {msg && <p className="text-[11px] text-cyan-200/80 mt-2">{msg}</p>}

      <Link to={session.to} className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/[0.06] px-3.5 py-2.5 hover:bg-yellow-400/10">
        <div className="min-w-0">
          <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-yellow-400/80">Today's session{z ? ` · ${z.label}` : ''}</p>
          <p className="text-sm font-semibold text-gray-100">{session.title}</p>
          <p className="text-[11px] text-gray-400 leading-snug">{session.detail}</p>
        </div>
        <ChevronRight size={16} className="text-yellow-300 flex-shrink-0" />
      </Link>
    </div>
  );
}
