/*
 * WHOOP data, the honest way for a static app: WHOOP's API needs a registered
 * developer app, a client secret and a server-side token exchange, none of
 * which a GitHub Pages site can hold safely. So data comes from (a) the WHOOP
 * data export (zip or physiological_cycles.csv) and (b) a 10-second manual
 * entry of today's numbers. Stored per day under gymforge_whoop.
 */

export interface WhoopDay {
  date: string;          // YYYY-MM-DD (the morning the recovery belongs to)
  recovery?: number;     // %
  hrv?: number;          // ms
  rhr?: number;          // bpm
  sleepHours?: number;
  sleepPerf?: number;    // %
  strain?: number;       // 0-21
}

const KEY = 'gymforge_whoop';

export function loadWhoop(): Record<string, WhoopDay> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') as Record<string, WhoopDay>; } catch { return {}; }
}
export function saveWhoop(days: Record<string, WhoopDay>) {
  try { localStorage.setItem(KEY, JSON.stringify(days)); } catch { /* quota */ }
}
export function upsertDay(d: WhoopDay) {
  const all = loadWhoop();
  all[d.date] = { ...all[d.date], ...Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined && v !== null && !(typeof v === 'number' && isNaN(v)))) } as WhoopDay;
  saveWhoop(all);
  return all;
}

// Local calendar date, matching how WHOOP labels a day (the day you woke up).
export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function latest(days: Record<string, WhoopDay>): WhoopDay | null {
  const keys = Object.keys(days).filter(k => days[k].recovery !== undefined).sort();
  return keys.length ? days[keys[keys.length - 1]] : null;
}

export function lastN(days: Record<string, WhoopDay>, n: number): WhoopDay[] {
  return Object.keys(days).sort().slice(-n).map(k => days[k]);
}

export type Zone = 'green' | 'yellow' | 'red';
export function zoneOf(recovery?: number): Zone | null {
  if (recovery === undefined) return null;
  return recovery >= 67 ? 'green' : recovery >= 34 ? 'yellow' : 'red';
}

/* ---------- CSV parsing ---------- */

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q; }
    else if (c === ',' && !q) { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out.map(s => s.trim());
}

/* Matches WHOOP's column names loosely, so small renames between export
 * versions do not break the import. */
export function parseCycles(csv: string): WhoopDay[] {
  const lines = csv.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const head = splitCsvLine(lines[0]).map(h => h.toLowerCase());
  const col = (...needles: string[]) => head.findIndex(h => needles.every(n => h.includes(n)));
  const iWake = col('wake onset');
  const iStart = col('cycle start');
  const iRec = col('recovery score');
  const iHrv = col('heart rate variability');
  const iRhr = col('resting heart rate');
  const iStrain = col('day strain');
  const iAsleep = col('asleep duration');
  const iPerf = col('sleep performance');
  if ((iWake < 0 && iStart < 0) || iRec < 0) return [];
  const num = (v?: string) => { const n = parseFloat((v ?? '').replace('%', '')); return isNaN(n) ? undefined : n; };
  // A recovery belongs to the morning you woke up. Key by the wake date as
  // written in the file (already local time) — converting through Date would
  // shift after-midnight sleeps onto the wrong day in the UK. Cycle start is
  // the sleep onset, so it is only a fallback.
  const dateOf = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : '');
  const days: WhoopDay[] = [];
  for (const line of lines.slice(1)) {
    const c = splitCsvLine(line);
    const key = dateOf(c[iWake]) || dateOf(c[iStart]);
    const recovery = num(c[iRec]);
    if (!key || recovery === undefined) continue;
    const asleep = num(c[iAsleep]);
    days.push({
      date: key,
      recovery,
      hrv: num(c[iHrv]),
      rhr: num(c[iRhr]),
      strain: num(c[iStrain]),
      sleepHours: asleep !== undefined ? Math.round((asleep / 60) * 10) / 10 : undefined,
      sleepPerf: num(c[iPerf]),
    });
  }
  return days;
}

export async function importWhoopFile(file: File): Promise<number> {
  let csv = '';
  if (/\.zip$/i.test(file.name)) {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(file);
    const entry = Object.values(zip.files).find(f => /physiological_cycles\.csv$/i.test(f.name))
      ?? Object.values(zip.files).find(f => /cycles.*\.csv$/i.test(f.name));
    if (!entry) throw new Error('No physiological_cycles.csv in that zip. Use the WHOOP data export.');
    csv = await entry.async('string');
  } else {
    csv = await file.text();
  }
  const parsed = parseCycles(csv);
  if (!parsed.length) throw new Error('Could not read recovery data from that file. It should be physiological_cycles.csv from the WHOOP export.');
  const all = loadWhoop();
  for (const d of parsed) all[d.date] = { ...all[d.date], ...d };
  saveWhoop(all);
  return parsed.length;
}

/* ---------- Today's training, adjusted for recovery ---------- */

export interface TodaySession { title: string; to: string; detail: string }

export function todaysSession(zone: Zone | null, date = new Date()): TodaySession {
  const dow = date.getDay(); // 0 Sun
  const plan: Record<number, { title: string; to: string }> = {
    1: { title: 'Push', to: '/programs?tab=push' },
    2: { title: 'Legs + Speed', to: '/programs?tab=legs' },
    4: { title: 'Pull', to: '/programs?tab=pull' },
    6: { title: 'Football', to: '/football?tab=warmup' },
  };
  const p = plan[dow];
  if (!p) {
    return dow === 0
      ? { title: 'Rest day', to: '/programs?tab=recovery', detail: 'Full rest. Walk, eat, sleep. Growth happens today.' }
      : { title: 'Rest + ankle work', to: '/programs?tab=plan', detail: 'Five minutes of the ankle finisher, a walk, and mobility.' };
  }
  if (zone === 'red') return { ...p, title: `${p.title} → swap for recovery`, detail: 'Red recovery. Mobility, zone 2 or a walk instead. Protect tomorrow; the session moves, it does not disappear.' };
  if (zone === 'yellow') return { ...p, detail: 'Yellow. Train as planned but leave two reps in the tank and skip any max efforts.' };
  if (zone === 'green') return { ...p, detail: 'Green. Push the top sets today — this is the day to beat the logbook.' };
  return { ...p, detail: 'Log your WHOOP recovery and I will adjust this for you.' };
}
