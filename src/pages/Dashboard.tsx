import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import type { GymSession, CombatSession, FootballSession, ConditioningEntry, BodyMetric, SkinEntry, CalendarEvent, Macros } from '../lib/types';
import { calcMacros } from '../lib/calculations';
import { Dumbbell, Activity, Zap, Trophy, Plus, X, ChevronRight, Utensils, Flame } from 'lucide-react';

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') as T[]; }
  catch { return []; }
}

function daysSince(dateStr: string): number {
  const then = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

function startOfWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function fmtDate(dateStr: string): string {
  const then = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const EVENT_COLORS: Record<CalendarEvent['type'], string> = {
  sparring: 'text-red-400 bg-red-500/10 border-red-500/20',
  match: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  competition: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  other: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

export default function Dashboard() {
  const [gymSessions, setGymSessions] = useState<GymSession[]>([]);
  const [combatSessions, setCombatSessions] = useState<CombatSession[]>([]);
  const [footballSessions, setFootballSessions] = useState<FootballSession[]>([]);
  const [conditioning, setConditioning] = useState<ConditioningEntry[]>([]);
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [skinEntries, setSkinEntries] = useState<SkinEntry[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: '', title: '', type: 'sparring' as CalendarEvent['type'] });
  const [todayFood, setTodayFood] = useState<{ calories: number; protein: number; carbs: number; fat: number } | null>(null);
  const [macroTargets, setMacroTargets] = useState<Macros | null>(null);

  useEffect(() => {
    setGymSessions(load<GymSession>('gymforge_gym_sessions'));
    setCombatSessions(load<CombatSession>('gymforge_combat_sessions'));
    setFootballSessions(load<FootballSession>('gymforge_football_sessions'));
    setConditioning(load<ConditioningEntry>('gymforge_conditioning'));
    setMetrics(load<BodyMetric>('gymforge_body_metrics'));
    setSkinEntries(load<SkinEntry>('gymforge_skin_entries'));
    setEvents(load<CalendarEvent>('gymforge_events'));

    try {
      const quizRaw = localStorage.getItem('gymforge_quiz');
      if (quizRaw) setMacroTargets(calcMacros(JSON.parse(quizRaw) as Record<string, unknown>));
    } catch {}

    try {
      const todayKey = `gymforge_food_${new Date().toISOString().split('T')[0]}`;
      const raw = localStorage.getItem(todayKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { savedAnalysis?: { totals: { calories: number; protein: number; carbs: number; fat: number } } };
        if (parsed.savedAnalysis?.totals) setTodayFood(parsed.savedAnalysis.totals);
      }
    } catch {}
  }, []);

  const weekStart = startOfWeek();
  const thisWeekGym = gymSessions.filter(s => new Date(s.date + 'T00:00:00') >= weekStart).length;
  const thisWeekCombat = combatSessions.filter(s => new Date(s.date + 'T00:00:00') >= weekStart).length;
  const thisWeekFootball = footballSessions.filter(s => new Date(s.date + 'T00:00:00') >= weekStart).length;
  const thisWeekCond = conditioning.filter(s => new Date(s.date + 'T00:00:00') >= weekStart).length;
  const totalThisWeek = thisWeekGym + thisWeekCombat + thisWeekFootball + thisWeekCond;

  const sortedMetrics = [...metrics].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestMetric = sortedMetrics[0];
  const olderMetric = sortedMetrics.find(m => daysSince(m.date) >= 6);
  const weightTrend = latestMetric && olderMetric ? latestMetric.weight - olderMetric.weight : null;

  const sortedSkin = [...skinEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastRetinol = sortedSkin.find(e => e.retinol);
  const lastBha = sortedSkin.find(e => e.bha);
  const lastAha = sortedSkin.find(e => e.aha);

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const upcomingEvents = events
    .filter(e => new Date(e.date + 'T00:00:00') >= todayMidnight)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const addEvent = () => {
    if (!newEvent.date || !newEvent.title.trim()) return;
    const ev: CalendarEvent = { ...newEvent, id: Date.now().toString() };
    const updated = [...events, ev];
    setEvents(updated);
    localStorage.setItem('gymforge_events', JSON.stringify(updated));
    setNewEvent({ date: '', title: '', type: 'sparring' });
    setShowAddEvent(false);
  };

  const removeEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    localStorage.setItem('gymforge_events', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="px-4 pt-12 pb-6 bg-gradient-to-b from-orange-950/40 to-transparent">
        <p className="text-orange-400 text-sm font-semibold mb-0.5">{greeting()}</p>
        <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-xs mt-1">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      <div className="px-4 space-y-4">

        {/* Training this week */}
        <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base flex items-center gap-2">
              <Dumbbell size={16} className="text-orange-400" /> This Week
            </h2>
            <span className={`text-xl font-black ${
              totalThisWeek >= 5 ? 'text-green-400' : totalThisWeek >= 3 ? 'text-orange-400' : 'text-red-400'
            }`}>{totalThisWeek} sessions</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Gym', count: thisWeekGym, color: 'text-orange-400' },
              { label: 'Combat', count: thisWeekCombat, color: 'text-red-400' },
              { label: 'Football', count: thisWeekFootball, color: 'text-green-400' },
              { label: 'Conditioning', count: thisWeekCond, color: 'text-blue-400' },
            ].map(({ label, count, color }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3 flex justify-between items-center">
                <span className="text-gray-400 text-sm">{label}</span>
                <span className={`font-bold text-lg ${color}`}>{count}</span>
              </div>
            ))}
          </div>
          <Link to="/training" className="flex items-center justify-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl py-2.5 text-orange-400 text-sm font-semibold transition-colors">
            Log a Session <ChevronRight size={15} />
          </Link>
        </div>

        {/* Body weight */}
        <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
          <h2 className="font-bold text-base flex items-center gap-2 mb-3">
            <Activity size={16} className="text-blue-400" /> Body Weight
          </h2>
          {latestMetric ? (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-black">{latestMetric.weight}<span className="text-base text-gray-400 ml-1">kg</span></p>
                <p className="text-gray-500 text-xs mt-0.5">Logged {daysSince(latestMetric.date) === 0 ? 'today' : `${daysSince(latestMetric.date)}d ago`}</p>
              </div>
              {weightTrend !== null && (
                <div className={`text-right text-sm font-bold ${
                  weightTrend < -0.1 ? 'text-green-400' : weightTrend > 0.1 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  <p>{weightTrend > 0 ? '+' : ''}{weightTrend.toFixed(1)} kg</p>
                  <p className="text-gray-500 font-normal text-xs">vs last week</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No weight logged yet</p>
          )}
          <Link to="/physique" className="mt-3 flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl py-2.5 text-blue-400 text-sm font-semibold transition-colors">
            Log Metrics <ChevronRight size={15} />
          </Link>
        </div>

        {/* Today's food */}
        <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
          <h2 className="font-bold text-base flex items-center gap-2 mb-3">
            <Flame size={16} className="text-green-400" /> Today's Fuel
          </h2>
          {todayFood ? (
            <>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-4xl font-black">{todayFood.calories}<span className="text-base text-gray-400 ml-1">kcal</span></p>
                  <p className="text-gray-500 text-xs mt-0.5">{todayFood.protein}g P · {todayFood.carbs}g C · {todayFood.fat}g F</p>
                </div>
                {macroTargets && (
                  <div className="text-right text-sm">
                    <span className={`font-bold ${todayFood.calories >= macroTargets.calories * 0.9 ? 'text-green-400' : 'text-orange-400'}`}>
                      {Math.round((todayFood.calories / macroTargets.calories) * 100)}%
                    </span>
                    <p className="text-gray-500 text-xs">of {macroTargets.calories} kcal target</p>
                  </div>
                )}
              </div>
              {macroTargets && (
                <div className="space-y-1.5 mb-3">
                  {([
                    { label: 'Protein', val: todayFood.protein, target: macroTargets.protein, color: 'bg-blue-500' },
                    { label: 'Carbs',   val: todayFood.carbs,   target: macroTargets.carbs,   color: 'bg-green-500' },
                    { label: 'Fat',     val: todayFood.fat,     target: macroTargets.fat,      color: 'bg-yellow-500' },
                  ] as const).map(({ label, val, target, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                        <span>{label}</span><span>{val}g / {target}g</span>
                      </div>
                      <div className="bg-white/10 rounded-full h-1.5">
                        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${Math.min(100, Math.round((val / target) * 100))}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-sm mb-3">Nothing logged yet today</p>
          )}
          <Link to="/food" className="flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-xl py-2.5 text-green-400 text-sm font-semibold transition-colors">
            {todayFood ? 'Update Food Log' : 'Log Today\'s Food'} <ChevronRight size={15} />
          </Link>
        </div>

        {/* Skin actives */}
        <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
          <h2 className="font-bold text-base flex items-center gap-2 mb-3">
            <Zap size={16} className="text-purple-400" /> Skin Actives
          </h2>
          <div className="space-y-2">
            {([
              { label: 'Retinol', entry: lastRetinol, warnDays: 3 },
              { label: 'BHA', entry: lastBha, warnDays: 3 },
              { label: 'AHA', entry: lastAha, warnDays: 5 },
            ] as const).map(({ label, entry, warnDays }) => {
              const days = entry ? daysSince(entry.date) : null;
              return (
                <div key={label} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5">
                  <span className="text-gray-300 font-medium text-sm">{label}</span>
                  {days !== null ? (
                    <span className={`text-sm font-bold ${
                      days === 0 ? 'text-green-400' : days <= warnDays ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {days === 0 ? 'Done tonight ✓' : `${days}d ago`}
                    </span>
                  ) : (
                    <span className="text-gray-600 text-xs">Never logged</span>
                  )}
                </div>
              );
            })}
          </div>
          <Link to="/physique" className="mt-3 flex items-center justify-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl py-2.5 text-purple-400 text-sm font-semibold transition-colors">
            Log Skincare <ChevronRight size={15} />
          </Link>
        </div>

        {/* Upcoming events */}
        <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" /> Upcoming Events
            </h2>
            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-1.5 text-yellow-400 transition-colors"
            >
              <Plus size={15} />
            </button>
          </div>

          {showAddEvent && (
            <div className="mb-3 p-3 bg-white/5 rounded-xl space-y-2">
              <input
                type="date"
                value={newEvent.date}
                onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400"
              />
              <input
                type="text"
                placeholder="Event title (e.g. Sparring — gym)"
                value={newEvent.title}
                onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
              <select
                value={newEvent.type}
                onChange={e => setNewEvent(p => ({ ...p, type: e.target.value as CalendarEvent['type'] }))}
                className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="sparring">Sparring</option>
                <option value="match">Match</option>
                <option value="competition">Competition</option>
                <option value="other">Other</option>
              </select>
              <button onClick={addEvent} className="w-full bg-yellow-500 hover:bg-yellow-400 rounded-lg py-2 text-black font-bold text-sm transition-colors">
                Add Event
              </button>
            </div>
          )}

          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-2">No upcoming events — tap + to add sparring or match dates</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map(ev => {
                const evDate = new Date(ev.date + 'T00:00:00');
                const daysUntil = Math.ceil((evDate.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={ev.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5">
                    <div>
                      <p className="font-semibold text-sm">{ev.title}</p>
                      <p className="text-gray-500 text-xs">
                        {fmtDate(ev.date)}{daysUntil > 1 ? ` — in ${daysUntil} days` : daysUntil === 1 ? ' — Tomorrow' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${EVENT_COLORS[ev.type]}`}>
                        {ev.type}
                      </span>
                      <button onClick={() => removeEvent(ev.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          <Link to="/training" className="bg-[#111] border border-white/10 hover:border-orange-500/30 rounded-2xl p-4 flex items-center gap-3 transition-colors">
            <Dumbbell size={22} className="text-orange-400" />
            <div>
              <p className="font-bold text-sm">Training</p>
              <p className="text-gray-500 text-xs">Log a session</p>
            </div>
          </Link>
          <Link to="/plan" className="bg-[#111] border border-white/10 hover:border-blue-500/30 rounded-2xl p-4 flex items-center gap-3 transition-colors">
            <Utensils size={22} className="text-blue-400" />
            <div>
              <p className="font-bold text-sm">View Plan</p>
              <p className="text-gray-500 text-xs">AI workout plan</p>
            </div>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
