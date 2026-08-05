import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LineChart, ChevronDown, AlertTriangle, Play, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { generateNasdaq100Series } from '../lib/backtestData';
import { STRATEGIES, runBacktest } from '../lib/backtest';
import type { StrategyId, BacktestResult } from '../lib/backtest';

type Mode = 'backtest' | 'paper';

function Fold({ title, tag, children }: { title: string; tag: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{title}</p>
          <p className="text-xs text-amber-400/70 mt-0.5">{tag}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-5 pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  const color = positive === undefined ? 'text-gray-100' : positive ? 'text-emerald-400' : 'text-red-400';
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <p className={`font-black text-base ${color}`}>{value}</p>
    </div>
  );
}

function LineChartSVG({ series, width = 600, height = 180 }: { series: { data: number[]; color: string; dashed?: boolean }[]; width?: number; height?: number }) {
  const all = series.flatMap(s => s.data);
  const min = Math.min(...all), max = Math.max(...all);
  const range = max - min || 1;
  const pad = 8;
  const toPath = (data: number[]) => data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      {series.map((s, i) => (
        <path key={i} d={toPath(s.data)} fill="none" stroke={s.color} strokeWidth={2} strokeDasharray={s.dashed ? '4 3' : undefined} />
      ))}
    </svg>
  );
}

const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
const fmtMoney = (v: number) => `£${v.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

export default function Backtest() {
  const [mode, setMode] = useState<Mode>('backtest');
  const candles = useMemo(() => generateNasdaq100Series(), []);

  const [strategyId, setStrategyId] = useState<StrategyId>('ma_cross');
  const strategy = STRATEGIES.find(s => s.id === strategyId)!;
  const [params, setParams] = useState<Record<string, number>>(() =>
    Object.fromEntries(strategy.params.map(p => [p.key, p.default])));
  const [startingCapital, setStartingCapital] = useState(10000);
  const [result, setResult] = useState<BacktestResult | null>(null);

  function selectStrategy(id: StrategyId) {
    setStrategyId(id);
    const s = STRATEGIES.find(s2 => s2.id === id)!;
    setParams(Object.fromEntries(s.params.map(p => [p.key, p.default])));
    setResult(null);
  }

  function run() {
    setResult(runBacktest(candles, strategyId, params, startingCapital));
  }

  // ===== Paper trading state =====
  const SESSION_LOOKBACK = 60;
  const SESSION_LENGTH = 120;
  const [session, setSession] = useState<{ startIdx: number; dayIndex: number; cash: number; shares: number; log: string[] } | null>(null);

  function newSession() {
    const maxStart = candles.length - SESSION_LOOKBACK - SESSION_LENGTH - 1;
    const startIdx = SESSION_LOOKBACK + Math.floor(Math.random() * Math.max(maxStart - SESSION_LOOKBACK, 1));
    setSession({ startIdx, dayIndex: 0, cash: 10000, shares: 0, log: [] });
  }

  function currentPrice() {
    if (!session) return 0;
    return candles[session.startIdx + session.dayIndex].close;
  }

  function act(action: 'buy' | 'sell' | 'hold') {
    if (!session) return;
    const price = currentPrice();
    let { cash, shares, log } = session;
    if (action === 'buy' && cash > 0) {
      shares = cash / price; cash = 0;
      log = [...log, `Day ${session.dayIndex + 1}: bought in at ${price.toFixed(2)}`];
    } else if (action === 'sell' && shares > 0) {
      cash = shares * price; shares = 0;
      log = [...log, `Day ${session.dayIndex + 1}: sold out at ${price.toFixed(2)}`];
    }
    const done = session.dayIndex >= SESSION_LENGTH - 1;
    setSession({ ...session, cash, shares, log, dayIndex: done ? session.dayIndex : session.dayIndex + 1 });
  }

  const sessionDone = session ? session.dayIndex >= SESSION_LENGTH - 1 : false;
  const sessionPortfolioValue = session ? (session.shares > 0 ? session.shares * currentPrice() : session.cash) : 0;
  const sessionSlice = session ? candles.slice(session.startIdx - SESSION_LOOKBACK, session.startIdx + session.dayIndex + 1) : [];
  const sessionBuyHoldValue = session ? 10000 / candles[session.startIdx].close * currentPrice() : 0;

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-amber-950/30 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/money?tab=trading" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Trading
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <LineChart className="text-amber-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Backtest Lab</h1>
            <p className="text-gray-500 text-sm">Test strategies · practice decisions</p>
          </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5 mb-5">
          <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-200/80 leading-relaxed">
            <span className="font-bold">The price history here is simulated</span>, not real NASDAQ100 data — this
            environment has no route to a live market data feed, so real historical prices couldn't be bundled in.
            It's generated to have realistic volatility, trends and corrections so the mechanics of testing a
            strategy and reading the results transfer directly. Treat every number as practice, not proof a
            strategy will work on the real market.
          </p>
        </div>

        <div className="flex gap-1.5 mb-6 bg-white/5 rounded-xl p-1">
          {(['backtest', 'paper'] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-amber-500 text-black' : 'text-gray-400'}`}>
              {m === 'backtest' ? 'Backtest' : 'Paper Trade'}
            </button>
          ))}
        </div>

        {mode === 'backtest' && (
          <div className="fade-up stagger space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {STRATEGIES.map(s => (
                <button key={s.id} onClick={() => selectStrategy(s.id)}
                  className={`text-left rounded-xl p-3 border transition-colors ${strategyId === s.id ? 'bg-amber-500/15 border-amber-500/50' : 'bg-[#111] border-white/8 hover:border-white/20'}`}>
                  <p className={`font-bold text-sm ${strategyId === s.id ? 'text-amber-300' : 'text-gray-200'}`}>{s.name}</p>
                </button>
              ))}
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
              <p className="text-gray-400 text-xs leading-relaxed mb-4">{strategy.description}</p>
              <div className="space-y-3">
                {strategy.params.map(p => (
                  <div key={p.key}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-300">{p.label}</label>
                      <span className="text-xs font-bold text-amber-400">{params[p.key]}</span>
                    </div>
                    <input type="range" min={p.min} max={p.max} step={p.step} value={params[p.key]}
                      onChange={e => setParams({ ...params, [p.key]: Number(e.target.value) })}
                      className="w-full accent-amber-500" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Starting capital (£)</label>
                  <input type="number" value={startingCapital} min={100} step={100}
                    onChange={e => setStartingCapital(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200" />
                </div>
              </div>
              <button onClick={run}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors">
                <Play size={16} /> Run Backtest
              </button>
            </div>

            {result && (
              <>
                <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-400">Equity curve</p>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> Strategy</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-gray-500 inline-block" style={{ borderTop: '1px dashed' }} /> Buy & hold</span>
                    </div>
                  </div>
                  <LineChartSVG series={[
                    { data: result.equityCurve, color: '#fbbf24' },
                    { data: result.buyHoldCurve, color: '#6b7280', dashed: true },
                  ]} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <StatCard label="Strategy return" value={fmtPct(result.stats.totalReturnPct)} positive={result.stats.totalReturnPct >= 0} />
                  <StatCard label="Buy & hold return" value={fmtPct(result.stats.buyHoldReturnPct)} positive={result.stats.buyHoldReturnPct >= 0} />
                  <StatCard label="CAGR" value={fmtPct(result.stats.cagrPct)} positive={result.stats.cagrPct >= 0} />
                  <StatCard label="Max drawdown" value={`-${result.stats.maxDrawdownPct.toFixed(1)}%`} positive={false} />
                  <StatCard label="Win rate" value={`${result.stats.winRate.toFixed(0)}%`} />
                  <StatCard label="Trades" value={`${result.stats.numTrades}`} />
                  <StatCard label="Avg win / loss" value={`${fmtPct(result.stats.avgWinPct)} / ${fmtPct(result.stats.avgLossPct)}`} />
                  <StatCard label="Profit factor" value={result.stats.profitFactor === Infinity ? '∞' : result.stats.profitFactor.toFixed(2)} />
                </div>

                <div className={`rounded-xl px-4 py-3 text-xs leading-relaxed ${result.stats.totalReturnPct > result.stats.buyHoldReturnPct ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-200/90' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
                  {result.stats.totalReturnPct > result.stats.buyHoldReturnPct
                    ? `This strategy beat simply buying and holding by ${fmtPct(result.stats.totalReturnPct - result.stats.buyHoldReturnPct)} over the period.`
                    : `This strategy underperformed simply buying and holding by ${fmtPct(result.stats.buyHoldReturnPct - result.stats.totalReturnPct)}. Most active strategies do — that is the real lesson most backtesters are built to teach.`}
                </div>

                <Fold title="Trade log" tag={`${result.trades.length} trades`}>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {result.trades.length === 0 && <p className="text-gray-500 text-xs">No trades triggered with these settings — try loosening the parameters.</p>}
                    {result.trades.map((t, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                        <div>
                          <p className="text-xs text-gray-300">{t.entryDate} → {t.exitDate}</p>
                          <p className="text-[10px] text-gray-600">{t.entryPrice.toFixed(2)} → {t.exitPrice.toFixed(2)} · {t.days}d</p>
                        </div>
                        <p className={`font-bold text-sm ${t.returnPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtPct(t.returnPct)}</p>
                      </div>
                    ))}
                  </div>
                </Fold>
              </>
            )}
          </div>
        )}

        {mode === 'paper' && (
          <div className="fade-up stagger space-y-4">
            {!session && (
              <div className="card-premium p-5 text-center">
                <p className="text-gray-300 font-bold mb-1">Play through a session</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  You'll get a random 120-day stretch of the simulated market, revealed one day at a time. Each day,
                  buy, sell or hold — you can't see what's coming, same as real trading. £10,000 starting cash.
                </p>
                <button onClick={newSession} className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl px-6 py-3 inline-flex items-center gap-2">
                  <Play size={16} /> Start Session
                </button>
              </div>
            )}

            {session && (
              <>
                <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-400">Day {session.dayIndex + 1} / {SESSION_LENGTH}</p>
                    <p className="text-xs font-bold text-amber-400">Price: {currentPrice().toFixed(2)}</p>
                  </div>
                  <LineChartSVG series={[{ data: sessionSlice.map(c => c.close), color: '#fbbf24' }]} height={140} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <StatCard label="Cash" value={fmtMoney(session.cash)} />
                  <StatCard label="Holding" value={session.shares > 0 ? 'Yes' : 'No'} />
                  <StatCard label="Portfolio value" value={fmtMoney(sessionPortfolioValue)} positive={sessionPortfolioValue >= 10000} />
                </div>

                {!sessionDone ? (
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => act('buy')} disabled={session.cash === 0}
                      className="bg-emerald-500/15 border border-emerald-500/40 disabled:opacity-30 text-emerald-300 font-bold rounded-xl py-3 flex flex-col items-center gap-1">
                      <TrendingUp size={16} /> Buy
                    </button>
                    <button onClick={() => act('hold')}
                      className="bg-white/5 border border-white/10 text-gray-300 font-bold rounded-xl py-3">
                      Hold
                    </button>
                    <button onClick={() => act('sell')} disabled={session.shares === 0}
                      className="bg-red-500/15 border border-red-500/40 disabled:opacity-30 text-red-300 font-bold rounded-xl py-3 flex flex-col items-center gap-1">
                      <TrendingDown size={16} /> Sell
                    </button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-amber-500/15 to-[#111] border border-amber-500/30 rounded-2xl p-5 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-300/70 mb-2">Session complete</p>
                    <p className="text-3xl font-black mb-1">{fmtMoney(sessionPortfolioValue)}</p>
                    <p className={`text-sm font-bold mb-3 ${sessionPortfolioValue >= 10000 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtPct((sessionPortfolioValue / 10000 - 1) * 100)}</p>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4">
                      Buy & hold over the same 120 days would have finished at {fmtMoney(sessionBuyHoldValue)}
                      {' '}({fmtPct((sessionBuyHoldValue / 10000 - 1) * 100)}). {sessionPortfolioValue > sessionBuyHoldValue ? "You beat it." : "Buy & hold beat you — it usually does, that's the point of this exercise."}
                    </p>
                    <button onClick={newSession} className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl px-6 py-2.5 inline-flex items-center gap-2">
                      <RotateCcw size={15} /> New Session
                    </button>
                  </div>
                )}

                {session.log.length > 0 && (
                  <Fold title="Decision log" tag={`${session.log.length} actions`}>
                    <div className="space-y-1">
                      {session.log.map((l, i) => <p key={i} className="text-xs text-gray-500">{l}</p>)}
                    </div>
                  </Fold>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
