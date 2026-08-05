// Synthetic daily price series calibrated to real NASDAQ100 statistics
// (typical daily volatility ~1.1-1.4%, long-run drift ~10-15%/yr, with
// occasional sharp corrections). This environment has no route to live
// market data providers, so genuine historical prices cannot be bundled —
// this series is generated, not real, and every screen that uses it says so.

export interface Candle { date: string; close: number; open: number; high: number; low: number }

// Deterministic PRNG (mulberry32) so the same "history" loads every time.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number): number {
  const u1 = Math.max(rand(), 1e-9);
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

type Regime = 'bull' | 'bear' | 'choppy' | 'crash';
// Weighted so the long-run expected drift lands around +8-9%/yr — in line
// with how a real broad equity index behaves over a decade — while still
// spending real time in bear and crash regimes so strategies have
// something to differentiate on.
const REGIME_PARAMS: Record<Regime, { drift: number; vol: number }> = {
  bull: { drift: 0.0009, vol: 0.0105 },
  bear: { drift: -0.0006, vol: 0.017 },
  choppy: { drift: 0.0001, vol: 0.011 },
  crash: { drift: -0.004, vol: 0.032 },
};

function nextRegime(rand: () => number, current: Regime): { regime: Regime; length: number } {
  const roll = rand();
  let regime: Regime;
  if (current === 'crash') {
    regime = roll < 0.7 ? 'choppy' : 'bull';
  } else if (roll < 0.6) {
    regime = 'bull';
  } else if (roll < 0.84) {
    regime = 'choppy';
  } else if (roll < 0.96) {
    regime = 'bear';
  } else {
    regime = 'crash';
  }
  const length = regime === 'crash'
    ? 12 + Math.floor(rand() * 22)
    : 60 + Math.floor(rand() * 200);
  return { regime, length };
}

function tradingDates(startISO: string, count: number): string[] {
  const dates: string[] = [];
  const d = new Date(startISO + 'T00:00:00Z');
  while (dates.length < count) {
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) dates.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return dates;
}

const SERIES_LENGTH = 2520; // ~10 trading years
const SEED = 87412903;
const START_DATE = '2016-08-05';
const START_PRICE = 100;

let cached: Candle[] | null = null;

export function generateNasdaq100Series(): Candle[] {
  if (cached) return cached;
  const rand = mulberry32(SEED);
  const dates = tradingDates(START_DATE, SERIES_LENGTH);

  let regime: Regime = 'bull';
  let regimeDaysLeft = 0;
  const closes: number[] = [];
  let price = START_PRICE;

  for (let i = 0; i < SERIES_LENGTH; i++) {
    if (regimeDaysLeft <= 0) {
      const next = nextRegime(rand, regime);
      regime = next.regime;
      regimeDaysLeft = next.length;
    }
    regimeDaysLeft--;
    const { drift, vol } = REGIME_PARAMS[regime];
    const z = gaussian(rand);
    const logReturn = drift - 0.5 * vol * vol + vol * z;
    price = price * Math.exp(logReturn);
    closes.push(price);
  }

  const candles: Candle[] = closes.map((close, i) => {
    const prevClose = i === 0 ? START_PRICE : closes[i - 1];
    const open = prevClose * (1 + (mulberry32(SEED + i)() - 0.5) * 0.004);
    const high = Math.max(open, close) * (1 + mulberry32(SEED + i + 1)() * 0.006);
    const low = Math.min(open, close) * (1 - mulberry32(SEED + i + 2)() * 0.006);
    return { date: dates[i], open, high, low, close };
  });

  cached = candles;
  return candles;
}
