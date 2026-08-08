import type { Candle } from './backtestData';

/*
 * Chart-reading quiz. Every pattern here is CONSTRUCTED so the concept is
 * structurally guaranteed to be present — not random candles with a label
 * stuck on them. Each generator returns the candle window plus the index
 * range where the pattern actually lives, so the answer can be highlighted.
 */

export interface Concept {
  id: string;
  name: string;
  aka: string[];          // what the user might type
  short: string;          // one-line definition
  spot: string;           // how to identify it on a chart
}

export const CONCEPTS: Concept[] = [
  { id: 'uptrend', name: 'Uptrend', aka: ['up trend', 'bullish trend', 'bull trend', 'higher highs'],
    short: 'A series of higher highs AND higher lows.',
    spot: 'Each pullback bottoms out above the previous pullback, and each push up exceeds the previous peak. Both conditions must hold — higher highs alone with lower lows is not an uptrend, it is expansion.' },

  { id: 'downtrend', name: 'Downtrend', aka: ['down trend', 'bearish trend', 'bear trend', 'lower lows'],
    short: 'A series of lower highs AND lower lows.',
    spot: 'Every bounce fails below the last bounce, and every drop takes out the previous low.' },

  { id: 'range', name: 'Range / Consolidation', aka: ['ranging', 'consolidation', 'sideways', 'chop', 'accumulation'],
    short: 'Price contained between a horizontal ceiling and floor, with no directional structure.',
    spot: 'Highs land at roughly the same level and lows land at roughly the same level. No higher highs, no lower lows — just rotation between the two.' },

  { id: 'fvg_bull', name: 'Bullish Fair Value Gap', aka: ['fvg', 'fair value gap', 'imbalance', 'bullish fvg', 'bisi'],
    short: 'A three-candle imbalance where the middle candle moves so fast it leaves an untraded gap.',
    spot: 'Take candle 1 and candle 3 around a big up candle. If candle 3\'s LOW is above candle 1\'s HIGH, the range between them never traded — that unfilled space is the gap. Price often returns to it later.' },

  { id: 'fvg_bear', name: 'Bearish Fair Value Gap', aka: ['bearish fvg', 'bearish imbalance', 'sibi', 'down fvg'],
    short: 'The same three-candle imbalance, created by a fast move down.',
    spot: 'Around a big down candle: if candle 3\'s HIGH is below candle 1\'s LOW, the space between never traded.' },

  { id: 'bos_bull', name: 'Break of Structure (bullish)', aka: ['bos', 'break of structure', 'market structure break', 'msb', 'breakout'],
    short: 'Price closes decisively beyond the most recent swing high, continuing an existing uptrend.',
    spot: 'Find the last swing high in an uptrend. A BOS is a CLOSE above it, not just a wick through it. It confirms the trend is still in control.' },

  { id: 'choch_bear', name: 'Change of Character (bearish)', aka: ['choch', 'change of character', 'trend reversal', 'structure shift', 'chotch'],
    short: 'The first break of structure AGAINST the prevailing trend — the earliest structural warning of a reversal.',
    spot: 'In an uptrend of higher highs and higher lows, watch the most recent higher LOW. When price closes below it, the pattern of higher lows is broken. That is a CHoCH, not a BOS — a BOS continues the trend, a CHoCH breaks it.' },

  { id: 'cisd_bull', name: 'CISD (bullish)', aka: ['cisd', 'change in state of delivery', 'delivery shift', 'change in state'],
    short: 'Price closes back above the OPEN of the run of down candles that produced the move — bearish delivery has been invalidated.',
    spot: 'Find the consecutive down candles that drove the last leg lower, and mark the OPEN of the first one. A close back above that level means the sellers who delivered that leg are now offside. Distinct from a CHoCH, which is about swing structure — CISD is about the candle opens that produced the delivery.' },

  { id: 'sweep', name: 'Liquidity Sweep', aka: ['liquidity sweep', 'stop hunt', 'stop run', 'sweep', 'fakeout', 'liquidity grab', 'spring'],
    short: 'A wick pushes beyond an obvious high or low, then price closes straight back inside.',
    spot: 'A clear level gets taken out by the WICK only, and the candle closes back on the original side. The move existed to trigger stops sitting beyond that level, not to continue.' },

  { id: 'eqh', name: 'Equal Highs', aka: ['eqh', 'equal highs', 'double top', 'resistance', 'equal high'],
    short: 'Two or more swing highs at almost exactly the same price.',
    spot: 'A flat ceiling formed by matching highs. Stops cluster just above it, which is precisely why it often gets swept.' },

  { id: 'engulf_bull', name: 'Bullish Engulfing', aka: ['bullish engulfing', 'engulfing', 'engulfing candle', 'bullish engulf'],
    short: 'An up candle whose body completely covers the previous down candle\'s body.',
    spot: 'Two candles: the first is down, the second opens at or below the first\'s close and closes at or above the first\'s open. The buyers erased a full session of selling.' },

  { id: 'ob_bull', name: 'Bullish Order Block', aka: ['order block', 'ob', 'bullish order block', 'demand zone', 'supply demand'],
    short: 'The last down candle before an impulsive move up that breaks structure.',
    spot: 'Work backwards from a strong up leg that broke a high. The final DOWN candle before that leg started is the order block — the zone price often retraces to before continuing.' },
];

export function findConcept(input: string): Concept | null {
  const q = input.trim().toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!q) return null;

  // 1. exact match on id, name or an alias
  for (const c of CONCEPTS) {
    if (c.id === q || c.name.toLowerCase() === q || c.aka.includes(q)) return c;
  }

  // 2. whole-phrase containment, either direction — but only on aliases long
  //    enough to be unambiguous. Short ones like "ob" or "bos" must match as
  //    whole words, otherwise "obvious" would resolve to order block.
  const words = new Set(q.split(' '));
  const hasWord = (a: string) => a.split(' ').every(w => words.has(w));

  for (const c of CONCEPTS) {
    if (c.name.toLowerCase().includes(q)) return c;
    for (const a of c.aka) {
      if (a.length >= 5 && (a.includes(q) || q.includes(a))) return c;
      if (hasWord(a)) return c;
    }
  }
  return null;
}

/* ---------- candle construction helpers ---------- */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dates(n: number): string[] {
  const out: string[] = [];
  const d = new Date(Date.UTC(2024, 0, 2));
  while (out.length < n) {
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

/** Build one candle from open/close, adding wicks that never contradict the body. */
function mk(open: number, close: number, rand: () => number, wick = 0.4): Candle {
  const body = Math.abs(close - open) || 0.3;
  const hi = Math.max(open, close) + body * wick * rand();
  const lo = Math.min(open, close) - body * wick * rand();
  return { date: '', open, close, high: hi, low: lo };
}

/**
 * A leg of candles that RELIABLY lands on `to`. The step is recomputed from the
 * current price each bar, so per-bar noise cannot accumulate and drift the leg
 * off target — and the final bar closes exactly at `to`. Several patterns below
 * depend on a specific close being reached, so this guarantee matters.
 */
function leg(from: number, to: number, bars: number, rand: () => number): Candle[] {
  const out: Candle[] = [];
  let price = from;
  for (let i = 0; i < bars; i++) {
    const remaining = bars - i;
    const open = price;
    let close: number;
    if (remaining === 1) {
      close = to;                                   // land exactly
    } else {
      const step = (to - price) / remaining;
      const noise = (rand() - 0.45) * Math.abs(step) * 1.1;
      close = open + step + noise;
    }
    out.push(mk(open, close, rand));
    price = close;
  }
  return out;
}

/** Force a candle's high, keeping high/low consistent with its body. */
function setHigh(c: Candle, h: number): void {
  c.high = Math.max(h, c.open, c.close);
  c.low = Math.min(c.low, c.open, c.close);
}

export interface Question {
  candles: Candle[];
  conceptId: string;
  /** inclusive index range in `candles` where the pattern sits */
  from: number;
  to: number;
  /** price band worth highlighting (FVG gap, swept level…), optional */
  band?: [number, number];
  /** the specific thing to point out when revealing the answer */
  reveal: string;
}

type Gen = (rand: () => number) => Question;

/* ---------- one generator per concept ---------- */

const GENERATORS: Record<string, Gen> = {
  uptrend: rand => {
    let c: Candle[] = [];
    let p = 100;
    // three ascending swings: each high and each low above the last
    for (let i = 0; i < 3; i++) {
      const up = 6 + rand() * 3;
      c = c.concat(leg(p, p + up, 5, rand));
      p += up;
      const back = up * (0.35 + rand() * 0.2);      // pullback < prior push ⇒ higher low
      c = c.concat(leg(p, p - back, 4, rand));
      p -= back;
    }
    c = c.concat(leg(p, p + 5, 4, rand));
    return { candles: c, conceptId: 'uptrend', from: 0, to: c.length - 1,
      reveal: 'Each pullback low sits above the previous one, and each push exceeds the previous high — higher highs and higher lows together.' };
  },

  downtrend: rand => {
    let c: Candle[] = [];
    let p = 140;
    for (let i = 0; i < 3; i++) {
      const dn = 6 + rand() * 3;
      c = c.concat(leg(p, p - dn, 5, rand));
      p -= dn;
      const back = dn * (0.35 + rand() * 0.2);
      c = c.concat(leg(p, p + back, 4, rand));
      p += back;
    }
    c = c.concat(leg(p, p - 5, 4, rand));
    return { candles: c, conceptId: 'downtrend', from: 0, to: c.length - 1,
      reveal: 'Every bounce tops out below the last one and every leg down takes out the prior low — lower highs and lower lows.' };
  },

  range: rand => {
    let c: Candle[] = [];
    const mid = 100, half = 4;
    let p = mid;
    for (let i = 0; i < 5; i++) {
      const top = mid + half - rand() * 0.5;
      const bot = mid - half + rand() * 0.5;
      c = c.concat(leg(p, top, 4, rand));
      c = c.concat(leg(top, bot, 4, rand));
      p = bot;
    }
    return { candles: c, conceptId: 'range', from: 0, to: c.length - 1, band: [mid - half, mid + half],
      reveal: 'Highs stack at one level and lows at another, with no higher high or lower low — rotation, not trend.' };
  },

  fvg_bull: rand => {
    const pre = leg(100, 103, 7, rand);
    let p = pre[pre.length - 1].close;
    // candle 1
    const c1 = mk(p, p + 0.6, rand, 0.3);
    // candle 2: large impulse
    const c2Open = c1.close;
    const c2Close = c2Open + 5 + rand() * 2;
    const c2 = mk(c2Open, c2Close, rand, 0.15);
    // candle 3 must OPEN and stay above c1.high ⇒ guaranteed gap
    const gapFloor = c1.high + 1.2;
    const c3Open = Math.max(c2Close - 0.5, gapFloor + 0.4);
    const c3 = mk(c3Open, c3Open + 1 + rand(), rand, 0.2);
    c3.low = Math.max(c3.low, gapFloor);            // enforce the gap
    const post = leg(c3.close, c3.close + 3, 6, rand);
    const candles = [...pre, c1, c2, c3, ...post];
    const i1 = pre.length;
    return { candles, conceptId: 'fvg_bull', from: i1, to: i1 + 2, band: [c1.high, c3.low],
      reveal: `Candle 3's low (${c3.low.toFixed(1)}) is above candle 1's high (${c1.high.toFixed(1)}) — that band never traded. It is an unfilled bullish gap.` };
  },

  fvg_bear: rand => {
    const pre = leg(120, 117, 7, rand);
    const p = pre[pre.length - 1].close;
    const c1 = mk(p, p - 0.6, rand, 0.3);
    const c2Open = c1.close;
    const c2Close = c2Open - 5 - rand() * 2;
    const c2 = mk(c2Open, c2Close, rand, 0.15);
    const gapCeil = c1.low - 1.2;
    const c3Open = Math.min(c2Close + 0.5, gapCeil - 0.4);
    const c3 = mk(c3Open, c3Open - 1 - rand(), rand, 0.2);
    c3.high = Math.min(c3.high, gapCeil);
    const post = leg(c3.close, c3.close - 3, 6, rand);
    const candles = [...pre, c1, c2, c3, ...post];
    const i1 = pre.length;
    return { candles, conceptId: 'fvg_bear', from: i1, to: i1 + 2, band: [c3.high, c1.low],
      reveal: `Candle 3's high (${c3.high.toFixed(1)}) is below candle 1's low (${c1.low.toFixed(1)}) — the band between never traded.` };
  },

  bos_bull: rand => {
    // uptrend, clear swing high, pullback, then a CLOSE above that high
    let c = leg(100, 108, 6, rand);
    const swingHigh = Math.max(...c.map(x => x.high));
    c = c.concat(leg(c[c.length - 1].close, 103.5, 5, rand));
    const start = c.length;
    const breakLeg = leg(c[c.length - 1].close, swingHigh + 3.5, 5, rand);
    c = c.concat(breakLeg);
    c = c.concat(leg(c[c.length - 1].close, c[c.length - 1].close + 2, 4, rand));
    return { candles: c, conceptId: 'bos_bull', from: start, to: start + breakLeg.length - 1,
      band: [swingHigh, swingHigh],
      reveal: `Price closed above the prior swing high at ${swingHigh.toFixed(1)} rather than just wicking through it — the uptrend is confirmed, not reversed.` };
  },

  choch_bear: rand => {
    // uptrend with a clean higher low, then a close BELOW that higher low
    let c = leg(100, 107, 5, rand);
    c = c.concat(leg(107, 103, 4, rand));
    const higherLow = Math.min(...c.slice(-4).map(x => x.low));
    c = c.concat(leg(c[c.length - 1].close, 111, 5, rand));      // higher high
    const start = c.length;
    const drop = leg(c[c.length - 1].close, higherLow - 3, 6, rand);
    c = c.concat(drop);
    c = c.concat(leg(c[c.length - 1].close, c[c.length - 1].close - 1.5, 3, rand));
    return { candles: c, conceptId: 'choch_bear', from: start, to: start + drop.length - 1,
      band: [higherLow, higherLow],
      reveal: `The higher low at ${higherLow.toFixed(1)} has been closed through. The chain of higher lows is broken — that makes this a CHoCH, not a BOS.` };
  },

  cisd_bull: rand => {
    const pre = leg(110, 108, 5, rand);
    // a run of consecutive DOWN candles — the delivery leg
    const runOpen = pre[pre.length - 1].close;
    const run: Candle[] = [];
    let p = runOpen;
    for (let i = 0; i < 4; i++) {
      const close = p - (1.4 + rand() * 0.8);
      run.push(mk(p, close, rand, 0.25));
      p = close;
    }
    const firstOpen = run[0].open;                  // the CISD level
    const start = pre.length + run.length;
    // reclaim: close back above the open of the FIRST down candle
    const up = leg(p, firstOpen + 2.2, 4, rand);
    const post = leg(up[up.length - 1].close, up[up.length - 1].close + 2, 5, rand);
    const candles = [...pre, ...run, ...up, ...post];
    return { candles, conceptId: 'cisd_bull', from: pre.length, to: start + up.length - 1,
      band: [firstOpen, firstOpen],
      reveal: `The down-candle run began with an open at ${firstOpen.toFixed(1)}. Price has now CLOSED back above that level, so the bearish delivery that produced the leg is invalidated.` };
  },

  sweep: rand => {
    // build an obvious high, then wick above it and close back below
    let c = leg(100, 106, 5, rand);
    const level = Math.max(...c.map(x => x.high));
    c = c.concat(leg(c[c.length - 1].close, 102, 4, rand));
    c = c.concat(leg(c[c.length - 1].close, level - 0.4, 4, rand));
    const idx = c.length;
    // the sweep candle: high pierces the level, close is back under it
    const so = c[c.length - 1].close;
    const sweep: Candle = { date: '', open: so, close: level - 1.6, high: level + 1.9, low: level - 2.1 };
    c.push(sweep);
    c = c.concat(leg(sweep.close, sweep.close - 4, 5, rand));
    return { candles: c, conceptId: 'sweep', from: idx, to: idx, band: [level, level],
      reveal: `The marked candle's WICK ran through ${level.toFixed(1)} but it closed back below at ${sweep.close.toFixed(1)}. The level was taken for the stops above it, then rejected.` };
  },

  eqh: rand => {
    let c = leg(100, 107, 5, rand);
    const level = Math.max(...c.map(x => x.high));
    c = c.concat(leg(c[c.length - 1].close, 102.5, 4, rand));
    const start = c.length;
    // close just under the level so the forced high stays above the body
    const up = leg(c[c.length - 1].close, level - 0.9, 4, rand);
    // keep every intermediate high below the level, then match it on the last bar
    for (const k of up) setHigh(k, Math.min(k.high, level - 0.5));
    setHigh(up[up.length - 1], level + (rand() - 0.5) * 0.12);
    c = c.concat(up);
    c = c.concat(leg(c[c.length - 1].close, 103, 4, rand));
    return { candles: c, conceptId: 'eqh', from: start, to: start + up.length - 1,
      band: [level, level],
      reveal: `Two swing highs finished within a fraction of each other around ${level.toFixed(1)} — a flat ceiling, with stop orders resting just above it.` };
  },

  engulf_bull: rand => {
    const pre = leg(100, 96, 7, rand);
    const p = pre[pre.length - 1].close;
    const down = mk(p, p - 2.4, rand, 0.25);        // clear down candle
    // up candle: opens at/below down.close, closes above down.open
    const upOpen = down.close - 0.25;
    const up = mk(upOpen, down.open + 1.1, rand, 0.2);
    const post = leg(up.close, up.close + 4, 6, rand);
    const candles = [...pre, down, up, ...post];
    return { candles, conceptId: 'engulf_bull', from: pre.length, to: pre.length + 1,
      reveal: `The second candle opened at ${upOpen.toFixed(1)} (below the down candle's close) and closed at ${up.close.toFixed(1)} (above its open) — the body fully engulfs it.` };
  },

  ob_bull: rand => {
    let c = leg(100, 104, 5, rand);
    const priorHigh = Math.max(...c.map(x => x.high));
    c = c.concat(leg(c[c.length - 1].close, 100.5, 4, rand));
    // the order block: final down candle before the impulse
    const obOpen = c[c.length - 1].close;
    const ob = mk(obOpen, obOpen - 1.5, rand, 0.3);
    c.push(ob);
    const obIdx = c.length - 1;
    // impulsive leg that breaks the prior high
    c = c.concat(leg(ob.close, priorHigh + 4, 4, rand));
    c = c.concat(leg(c[c.length - 1].close, c[c.length - 1].close - 2, 4, rand));
    return { candles: c, conceptId: 'ob_bull', from: obIdx, to: obIdx, band: [ob.low, ob.high],
      reveal: `The highlighted candle is the last DOWN candle before an impulsive leg that broke the prior high at ${priorHigh.toFixed(1)}. That candle's range is the order block.` };
  },
};

export function conceptIds(): string[] {
  return Object.keys(GENERATORS);
}

/** Generate a question. Pass a conceptId to drill one concept, or omit for random. */
export function generateQuestion(conceptId?: string, seed = Date.now()): Question {
  const ids = conceptIds();
  const id = conceptId && GENERATORS[conceptId] ? conceptId : ids[Math.floor(mulberry32(seed)() * ids.length)];
  const rand = mulberry32(seed >>> 1);
  const q = GENERATORS[id](rand);
  const ds = dates(q.candles.length);
  q.candles = q.candles.map((c, i) => ({ ...c, date: ds[i] }));
  return q;
}

/** Four options: the answer plus three plausible confusables. */
const CONFUSABLES: Record<string, string[]> = {
  uptrend: ['downtrend', 'range', 'bos_bull'],
  downtrend: ['uptrend', 'range', 'choch_bear'],
  range: ['uptrend', 'downtrend', 'eqh'],
  fvg_bull: ['fvg_bear', 'ob_bull', 'engulf_bull'],
  fvg_bear: ['fvg_bull', 'sweep', 'ob_bull'],
  bos_bull: ['choch_bear', 'sweep', 'uptrend'],
  choch_bear: ['bos_bull', 'cisd_bull', 'downtrend'],
  cisd_bull: ['choch_bear', 'engulf_bull', 'ob_bull'],
  sweep: ['bos_bull', 'eqh', 'fvg_bear'],
  eqh: ['range', 'sweep', 'bos_bull'],
  engulf_bull: ['cisd_bull', 'fvg_bull', 'ob_bull'],
  ob_bull: ['fvg_bull', 'engulf_bull', 'sweep'],
};

export function optionsFor(conceptId: string, seed = Date.now()): string[] {
  const wrong = (CONFUSABLES[conceptId] || conceptIds().filter(i => i !== conceptId)).slice(0, 3);
  const all = [conceptId, ...wrong];
  // deterministic shuffle
  const rand = mulberry32(seed);
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

export function conceptById(id: string): Concept {
  return CONCEPTS.find(c => c.id === id)!;
}
