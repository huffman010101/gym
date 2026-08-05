import type { Candle } from './backtestData';

export type StrategyId = 'ma_cross' | 'rsi' | 'breakout' | 'macd';

export interface StrategyParam { key: string; label: string; min: number; max: number; step: number; default: number }

export interface StrategyDef {
  id: StrategyId;
  name: string;
  description: string;
  params: StrategyParam[];
}

export const STRATEGIES: StrategyDef[] = [
  {
    id: 'ma_cross',
    name: 'Moving Average Crossover',
    description: 'Buy when the fast average crosses above the slow one (golden cross), sell when it crosses back below (death cross). A trend-following classic — does well in sustained moves, gets chopped up sideways.',
    params: [
      { key: 'fast', label: 'Fast SMA (days)', min: 5, max: 50, step: 1, default: 20 },
      { key: 'slow', label: 'Slow SMA (days)', min: 20, max: 200, step: 5, default: 50 },
    ],
  },
  {
    id: 'rsi',
    name: 'RSI Mean Reversion',
    description: 'Buy when RSI drops into oversold territory, sell once it climbs back into overbought territory. Bets that sharp moves snap back — works in choppy/range-bound markets, bleeds in strong trends.',
    params: [
      { key: 'period', label: 'RSI period (days)', min: 5, max: 30, step: 1, default: 14 },
      { key: 'oversold', label: 'Oversold level (buy below)', min: 10, max: 40, step: 1, default: 30 },
      { key: 'overbought', label: 'Overbought level (sell above)', min: 60, max: 90, step: 1, default: 70 },
    ],
  },
  {
    id: 'breakout',
    name: 'Donchian Breakout',
    description: 'Buy when price closes above its highest close of the last N days (a fresh high = momentum), sell when it closes below its lowest close of the last M days. Aims to catch the start of new trends.',
    params: [
      { key: 'entry', label: 'Entry breakout (days)', min: 10, max: 60, step: 5, default: 20 },
      { key: 'exit', label: 'Exit breakdown (days)', min: 5, max: 40, step: 5, default: 10 },
    ],
  },
  {
    id: 'macd',
    name: 'MACD Crossover',
    description: 'Buy when the MACD line crosses above its signal line, sell when it crosses back below. A smoothed, lagging trend-following signal — fewer false starts than raw MA cross, but enters later.',
    params: [
      { key: 'fast', label: 'Fast EMA', min: 5, max: 20, step: 1, default: 12 },
      { key: 'slow', label: 'Slow EMA', min: 15, max: 40, step: 1, default: 26 },
      { key: 'signal', label: 'Signal EMA', min: 5, max: 15, step: 1, default: 9 },
    ],
  },
];

export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  const k = 2 / (period + 1);
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (prev === null) {
      if (i >= period - 1) {
        const seed = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
        prev = seed;
        out[i] = seed;
      }
    } else {
      prev = values[i] * k + prev * (1 - k);
      out[i] = prev;
    }
  }
  return out;
}

export function rsi(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  let gainSum = 0, lossSum = 0;
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);
    if (i <= period) {
      gainSum += gain; lossSum += loss;
      if (i === period) {
        const avgGain = gainSum / period, avgLoss = lossSum / period;
        out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
      }
    } else {
      gainSum = (gainSum * (period - 1) + gain) / period;
      lossSum = (lossSum * (period - 1) + loss) / period;
      out[i] = lossSum === 0 ? 100 : 100 - 100 / (1 + gainSum / lossSum);
    }
  }
  return out;
}

export type Signal = 'buy' | 'sell' | null;

function generateSignals(closes: number[], strategyId: StrategyId, params: Record<string, number>): Signal[] {
  const n = closes.length;
  const signals: Signal[] = new Array(n).fill(null);
  let inPosition = false;

  if (strategyId === 'ma_cross') {
    const fast = sma(closes, params.fast);
    const slow = sma(closes, params.slow);
    for (let i = 1; i < n; i++) {
      if (fast[i] == null || slow[i] == null || fast[i - 1] == null || slow[i - 1] == null) continue;
      const crossUp = fast[i - 1]! <= slow[i - 1]! && fast[i]! > slow[i]!;
      const crossDown = fast[i - 1]! >= slow[i - 1]! && fast[i]! < slow[i]!;
      if (!inPosition && crossUp) { signals[i] = 'buy'; inPosition = true; }
      else if (inPosition && crossDown) { signals[i] = 'sell'; inPosition = false; }
    }
  } else if (strategyId === 'rsi') {
    const r = rsi(closes, params.period);
    for (let i = 0; i < n; i++) {
      if (r[i] == null) continue;
      if (!inPosition && r[i]! < params.oversold) { signals[i] = 'buy'; inPosition = true; }
      else if (inPosition && r[i]! > params.overbought) { signals[i] = 'sell'; inPosition = false; }
    }
  } else if (strategyId === 'breakout') {
    const entryP = params.entry, exitP = params.exit;
    for (let i = Math.max(entryP, exitP); i < n; i++) {
      const entryWindow = closes.slice(i - entryP, i);
      const exitWindow = closes.slice(i - exitP, i);
      const highestEntry = Math.max(...entryWindow);
      const lowestExit = Math.min(...exitWindow);
      if (!inPosition && closes[i] > highestEntry) { signals[i] = 'buy'; inPosition = true; }
      else if (inPosition && closes[i] < lowestExit) { signals[i] = 'sell'; inPosition = false; }
    }
  } else if (strategyId === 'macd') {
    const fastE = ema(closes, params.fast);
    const slowE = ema(closes, params.slow);
    const macdLine: (number | null)[] = closes.map((_, i) =>
      fastE[i] != null && slowE[i] != null ? fastE[i]! - slowE[i]! : null);
    const macdValues = macdLine.map(v => v ?? 0);
    const signalLine = ema(macdValues, params.signal);
    for (let i = 1; i < n; i++) {
      if (macdLine[i] == null || macdLine[i - 1] == null || signalLine[i] == null || signalLine[i - 1] == null) continue;
      const crossUp = macdLine[i - 1]! <= signalLine[i - 1]! && macdLine[i]! > signalLine[i]!;
      const crossDown = macdLine[i - 1]! >= signalLine[i - 1]! && macdLine[i]! < signalLine[i]!;
      if (!inPosition && crossUp) { signals[i] = 'buy'; inPosition = true; }
      else if (inPosition && crossDown) { signals[i] = 'sell'; inPosition = false; }
    }
  }
  return signals;
}

export interface Trade { entryDate: string; entryPrice: number; exitDate: string; exitPrice: number; returnPct: number; days: number }

export interface BacktestResult {
  equityCurve: number[];
  buyHoldCurve: number[];
  trades: Trade[];
  stats: {
    totalReturnPct: number;
    buyHoldReturnPct: number;
    cagrPct: number;
    maxDrawdownPct: number;
    winRate: number;
    numTrades: number;
    avgWinPct: number;
    avgLossPct: number;
    profitFactor: number;
    bestTradePct: number;
    worstTradePct: number;
  };
}

export function runBacktest(candles: Candle[], strategyId: StrategyId, params: Record<string, number>, startingCapital: number): BacktestResult {
  const closes = candles.map(c => c.close);
  const dates = candles.map(c => c.date);
  const signals = generateSignals(closes, strategyId, params);

  const equityCurve: number[] = new Array(closes.length).fill(startingCapital);
  const trades: Trade[] = [];
  let cash = startingCapital;
  let shares = 0;
  let entryIdx = -1;

  for (let i = 0; i < closes.length; i++) {
    if (signals[i] === 'buy' && shares === 0) {
      shares = cash / closes[i];
      cash = 0;
      entryIdx = i;
    } else if (signals[i] === 'sell' && shares > 0) {
      cash = shares * closes[i];
      const entryPrice = closes[entryIdx];
      trades.push({
        entryDate: dates[entryIdx],
        entryPrice,
        exitDate: dates[i],
        exitPrice: closes[i],
        returnPct: (closes[i] / entryPrice - 1) * 100,
        days: i - entryIdx,
      });
      shares = 0;
      entryIdx = -1;
    }
    equityCurve[i] = shares > 0 ? shares * closes[i] : cash;
  }
  // Close any still-open position at the final price for reporting purposes.
  if (shares > 0) {
    const entryPrice = closes[entryIdx];
    const lastClose = closes[closes.length - 1];
    trades.push({
      entryDate: dates[entryIdx],
      entryPrice,
      exitDate: dates[dates.length - 1],
      exitPrice: lastClose,
      returnPct: (lastClose / entryPrice - 1) * 100,
      days: closes.length - 1 - entryIdx,
    });
  }

  const buyHoldShares = startingCapital / closes[0];
  const buyHoldCurve = closes.map(c => c * buyHoldShares);

  const finalEquity = equityCurve[equityCurve.length - 1];
  const totalReturnPct = (finalEquity / startingCapital - 1) * 100;
  const buyHoldReturnPct = (buyHoldCurve[buyHoldCurve.length - 1] / startingCapital - 1) * 100;
  const years = closes.length / 252;
  const cagrPct = (Math.pow(finalEquity / startingCapital, 1 / years) - 1) * 100;

  let peak = equityCurve[0];
  let maxDrawdownPct = 0;
  for (const v of equityCurve) {
    if (v > peak) peak = v;
    const dd = (peak - v) / peak * 100;
    if (dd > maxDrawdownPct) maxDrawdownPct = dd;
  }

  const wins = trades.filter(t => t.returnPct > 0);
  const losses = trades.filter(t => t.returnPct <= 0);
  const winRate = trades.length ? (wins.length / trades.length) * 100 : 0;
  const avgWinPct = wins.length ? wins.reduce((a, t) => a + t.returnPct, 0) / wins.length : 0;
  const avgLossPct = losses.length ? losses.reduce((a, t) => a + t.returnPct, 0) / losses.length : 0;
  const grossWin = wins.reduce((a, t) => a + Math.max(t.returnPct, 0), 0);
  const grossLoss = Math.abs(losses.reduce((a, t) => a + Math.min(t.returnPct, 0), 0));
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0;
  const bestTradePct = trades.length ? Math.max(...trades.map(t => t.returnPct)) : 0;
  const worstTradePct = trades.length ? Math.min(...trades.map(t => t.returnPct)) : 0;

  return {
    equityCurve,
    buyHoldCurve,
    trades,
    stats: { totalReturnPct, buyHoldReturnPct, cagrPct, maxDrawdownPct, winRate, numTrades: trades.length, avgWinPct, avgLossPct, profitFactor, bestTradePct, worstTradePct },
  };
}
