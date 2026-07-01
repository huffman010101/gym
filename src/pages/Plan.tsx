import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Mic, MicOff, X, ChevronDown, ChevronUp, Loader2, RefreshCw, RotateCcw } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { calcMacros } from '../lib/calculations';
import { generateWorkoutPlan, generateMeals, runVoiceCommand } from '../lib/generators';
import type { WorkoutPlan, WorkoutDay, Meal, MealAlt, Macros } from '../lib/types';

const GOAL_LABEL: Record<string, string> = {
  powerlifting: 'Powerlifting', aesthetic: 'Aesthetic', weight_loss: 'Weight Loss',
  functional: 'Combat / Sports', endurance: 'Endurance', general: 'General Fitness',
};

function Chip({ label, val, unit = '', cls }: { label: string; val: number; unit?: string; cls: string }) {
  return (
    <span className="text-xs">
      <span className={`font-bold ${cls}`}>{val}</span>
      <span className="text-gray-600"> {unit}{unit ? ' ' : ''}{label}</span>
    </span>
  );
}

function PlanLoader({ msg }: { msg: string }) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-12 flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
      <p className="text-gray-500 text-sm">{msg}</p>
    </div>
  );
}

function ErrBox({ msg, retry }: { msg: string; retry: () => void }) {
  return (
    <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-6 text-center">
      <p className="text-red-400 text-sm mb-3">{msg}</p>
      <button onClick={retry} className="text-xs bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all">Try again</button>
    </div>
  );
}

function DayView({ day, expEx, setExpEx }: { day: WorkoutDay; expEx: number | null; setExpEx: (i: number | null) => void }) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5"><h3 className="font-bold text-lg">{day.focus}</h3></div>
      {day.warmup?.length > 0 && (
        <div className="px-5 py-3 border-b border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-2">Warmup</p>
          <ul className="space-y-1">
            {day.warmup.map((w, i) => (
              <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-orange-500/50 inline-block" />{w}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="divide-y divide-white/5">
        {day.exercises.map((ex, ei) => (
          <div key={ei}>
            <div className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-all" onClick={() => setExpEx(expEx === ei ? null : ei)}>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{ex.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ex.muscleGroup}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-orange-400">{ex.sets} &times; {ex.reps}</p>
                  <p className="text-xs text-gray-600">{ex.rest} rest</p>
                </div>
                {ex.notes && (expEx === ei ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />)}
              </div>
            </div>
            {expEx === ei && ex.notes && (
              <div className="mx-5 mb-4 bg-orange-500/5 border border-orange-500/10 rounded-xl px-4 py-3 text-sm text-gray-400 leading-relaxed">{ex.notes}</div>
            )}
          </div>
        ))}
      </div>
      {day.cooldown?.length > 0 && (
        <div className="px-5 py-3 border-t border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-2">Cooldown</p>
          <ul className="space-y-1">
            {day.cooldown.map((c, i) => (
              <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-500/50 inline-block" />{c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Plan() {
  const nav = useNavigate();
  const [quiz, setQuiz] = useState<Record<string, unknown> | null>(null);
  const [macros, setMacros] = useState<Macros | null>(null);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loadW, setLoadW] = useState(false);
  const [loadM, setLoadM] = useState(false);
  const [errW, setErrW] = useState('');
  const [errM, setErrM] = useState('');
  const [selDay, setSelDay] = useState(0);
  const [expEx, setExpEx] = useState<number | null>(null);
  const [expMeal, setExpMeal] = useState<number | null>(null);
  const [altsFor, setAltsFor] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceResp, setVoiceResp] = useState('');
  const [procVoice, setProcVoice] = useState(false);
  const recogRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('gymforge_quiz');
    if (!raw) { nav('/quiz'); return; }
    const q = JSON.parse(raw) as Record<string, unknown>;
    setQuiz(q);
    setMacros(calcMacros(q));
  }, []);

  useEffect(() => {
    if (!quiz || !macros) return;
    fetchWorkout(quiz);
    fetchMeals(quiz, macros);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz]);

  const fetchWorkout = async (q: Record<string, unknown>) => {
    setLoadW(true); setErrW('');
    try { const d = await generateWorkoutPlan(q); setWorkout(d); setSelDay(0); setExpEx(null); }
    catch (e) { setErrW((e as Error).message); }
    finally { setLoadW(false); }
  };

  const fetchMeals = async (q: Record<string, unknown>, m: Macros, excluded: string[] = []) => {
    setLoadM(true); setErrM(''); setAltsFor(null);
    try { const d = await generateMeals(q, m, excluded); setMeals(d); }
    catch (e) { setErrM((e as Error).message); }
    finally { setLoadM(false); }
  };

  const swapMeal = (mi: number, alt: MealAlt) => {
    setMeals(prev => prev.map((ml, i) => i !== mi ? ml : { ...ml, ...alt, alternatives: ml.alternatives.filter(a => a.id !== alt.id) }));
    setAltsFor(null);
  };

  const startVoice = () => {
    const SR = (window as Window & { webkitSpeechRecognition?: unknown; SpeechRecognition?: unknown }).webkitSpeechRecognition
      || (window as Window & { webkitSpeechRecognition?: unknown; SpeechRecognition?: unknown }).SpeechRecognition;
    if (!SR) { alert('Voice input requires Chrome or Edge.'); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = new (SR as any)();
    r.lang = 'en-US'; r.interimResults = true; r.continuous = false;
    let final = '';
    r.onresult = (e: { resultIndex: number; results: { isFinal: boolean; [n: number]: { transcript: string } }[] }) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(final || interim);
    };
    r.onend = () => { setListening(false); if (final.trim()) doVoice(final.trim()); };
    r.onerror = () => setListening(false);
    recogRef.current = r; r.start(); setListening(true); setTranscript(''); setVoiceResp('');
  };

  const stopVoice = () => { recogRef.current?.stop(); setListening(false); };

  const doVoice = async (cmd: string) => {
    if (!quiz) return;
    setProcVoice(true);
    try {
      const d = await runVoiceCommand(cmd, workout, quiz);
      setVoiceResp(d.message || '');
      if (d.updatedPlan) setWorkout(d.updatedPlan);
    }
    catch { setVoiceResp('Could not process. Please try again.'); }
    finally { setProcVoice(false); }
  };

  if (!quiz) return null;

  // Cast typed values up front to avoid TS2322 unknown-in-JSX errors
  const primaryGoal = quiz.primaryGoal as string | undefined;

  const macroItems = macros ? [
    { name: 'Calories', val: macros.calories, unit: 'kcal', tc: 'text-orange-400', bg: 'bg-orange-500/10' },
    { name: 'Protein',  val: macros.protein,  unit: 'g',    tc: 'text-blue-400',   bg: 'bg-blue-500/10'  },
    { name: 'Carbs',    val: macros.carbs,    unit: 'g',    tc: 'text-green-400',  bg: 'bg-green-500/10' },
    { name: 'Fat',      val: macros.fat,      unit: 'g',    tc: 'text-yellow-400', bg: 'bg-yellow-500/10'},
  ] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32">
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-orange-500" size={22} />
          <span className="font-black">GymForge</span>
        </div>
        <div className="flex items-center gap-3">
          {primaryGoal && (
            <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
              {GOAL_LABEL[primaryGoal] ?? primaryGoal}
            </span>
          )}
          <button onClick={() => nav('/quiz')} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-all">
            <RotateCcw size={12} /> New quiz
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-10">

        {macros && (
          <section>
            <h2 className="text-xl font-black mb-4">Daily Targets</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {macroItems.map(({ name, val, unit, tc, bg }) => (
                <div key={name} className={`${bg} rounded-2xl p-4 border border-white/5`}>
                  <p className={`text-3xl font-black ${tc}`}>{val}</p>
                  <p className="text-xs text-gray-600 mt-1">{unit} &middot; {name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">Workout Plan</h2>
            <button onClick={() => fetchWorkout(quiz)} disabled={loadW}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white disabled:opacity-40 transition-all">
              <RefreshCw size={12} className={loadW ? 'animate-spin' : ''} /> Regenerate
            </button>
          </div>
          {loadW && <PlanLoader msg="Building your personalised program…" />}
          {!loadW && errW && <ErrBox msg={errW} retry={() => fetchWorkout(quiz)} />}
          {!loadW && !errW && workout && (
            <div>
              <div className="bg-[#111] border border-white/5 rounded-2xl p-5 mb-4">
                <span className="inline-block text-xs bg-orange-500/15 text-orange-400 px-3 py-1 rounded-full mb-3">{workout.split}</span>
                <p className="text-gray-400 text-sm leading-relaxed">{workout.summary}</p>
                {workout.progressionScheme && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-1">Progression</p>
                    <p className="text-sm text-gray-400">{workout.progressionScheme}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-4">
                {workout.days.map((d, i) => (
                  <button key={i} onClick={() => { setSelDay(i); setExpEx(null); }}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${selDay === i ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}>
                    {d.day}
                  </button>
                ))}
              </div>
              {workout.days[selDay] && <DayView day={workout.days[selDay]} expEx={expEx} setExpEx={setExpEx} />}
              {workout.weeklyNotes && <p className="text-xs text-gray-600 mt-4 text-center">{workout.weeklyNotes}</p>}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-black">Meal Plan</h2>
            <button onClick={() => macros && fetchMeals(quiz, macros)} disabled={loadM}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white disabled:opacity-40 transition-all">
              <RefreshCw size={12} className={loadM ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-5">Tap the <X size={10} className="inline mx-0.5" /> on a meal to swap it for an alternative</p>
          {loadM && <PlanLoader msg="Crafting your meal rotation…" />}
          {!loadM && errM && <ErrBox msg={errM} retry={() => macros && fetchMeals(quiz, macros)} />}
          {!loadM && !errM && (
            <div className="space-y-4">
              {meals.map((meal, mi) => (
                <div key={meal.id}>
                  <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="flex items-start gap-4 p-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-xs capitalize bg-white/5 text-gray-500 px-2 py-0.5 rounded-full">{meal.mealType}</span>
                          <span className="text-xs text-gray-600">{meal.prepTime}</span>
                        </div>
                        <h3 className="font-bold text-lg leading-snug">{meal.name}</h3>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          <Chip label="kcal" val={meal.calories} cls="text-orange-400" />
                          <Chip label="protein" val={meal.protein} unit="g" cls="text-blue-400" />
                          <Chip label="carbs" val={meal.carbs} unit="g" cls="text-green-400" />
                          <Chip label="fat" val={meal.fat} unit="g" cls="text-yellow-400" />
                        </div>
                      </div>
                      <button onClick={() => setAltsFor(altsFor === mi ? null : mi)}
                        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all mt-1" title="Swap meal">
                        <X size={15} />
                      </button>
                    </div>
                    <button onClick={() => setExpMeal(expMeal === mi ? null : mi)}
                      className="w-full flex items-center justify-between px-5 py-3 border-t border-white/5 text-sm text-gray-500 hover:text-gray-300 transition-all">
                      <span>Ingredients &amp; Instructions</span>
                      {expMeal === mi ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {expMeal === mi && (
                      <div className="px-5 pb-5 pt-4 border-t border-white/5 space-y-4">
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-2">Ingredients</p>
                          <ul className="space-y-1.5">
                            {meal.ingredients.map((ing, ii) => (
                              <li key={ii} className="text-sm text-gray-400 flex items-start gap-2.5">
                                <span className="w-1 h-1 rounded-full bg-orange-500/50 flex-shrink-0 mt-[7px]" />{ing}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-2">How to Make It</p>
                          <p className="text-sm text-gray-400 leading-relaxed">{meal.instructions}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {altsFor === mi && (
                    <div className="mt-2 bg-[#161616] border border-orange-500/15 rounded-2xl overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                        <p className="font-semibold text-sm">Pick an alternative</p>
                        <button onClick={() => setAltsFor(null)} className="text-gray-600 hover:text-white transition-all"><X size={15} /></button>
                      </div>
                      {meal.alternatives.length > 0 ? (
                        <div className="divide-y divide-white/5">
                          {meal.alternatives.map(alt => (
                            <button key={alt.id} onClick={() => swapMeal(mi, alt)}
                              className="w-full px-5 py-4 text-left hover:bg-white/[0.04] transition-all group">
                              <p className="font-medium group-hover:text-white transition-colors">{alt.name}</p>
                              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                                <Chip label="kcal" val={alt.calories} cls="text-orange-400" />
                                <Chip label="protein" val={alt.protein} unit="g" cls="text-blue-400" />
                                <span className="text-xs text-gray-600">{alt.prepTime}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-5 py-6 text-center">
                          <p className="text-gray-500 text-sm mb-3">No more alternatives saved.</p>
                          <button onClick={() => { setAltsFor(null); macros && fetchMeals(quiz, macros); }}
                            className="text-orange-400 hover:text-orange-300 text-sm transition-all">Refresh all meals</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="fixed bottom-6 right-5 flex flex-col items-end gap-3 z-50">
        {(transcript || voiceResp || procVoice) && (
          <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl p-4 w-72 shadow-2xl text-sm">
            {transcript && (
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1">You said</p>
                <p className="text-gray-300">&ldquo;{transcript}&rdquo;</p>
              </div>
            )}
            {procVoice && <div className="flex items-center gap-2 text-gray-500"><Loader2 size={13} className="animate-spin" /> Processing&hellip;</div>}
            {voiceResp && !procVoice && (
              <div>
                <p className="text-xs text-green-500 mb-1">Coach</p>
                <p className="text-gray-300 leading-relaxed">{voiceResp}</p>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col items-center gap-1">
          <button onClick={listening ? stopVoice : startVoice} disabled={procVoice}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all ${listening ? 'bg-red-500 glow-pulse scale-110' : 'bg-orange-500 hover:bg-orange-600 hover:scale-105'} disabled:opacity-40`}>
            {listening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          <p className="text-xs text-gray-600">{listening ? 'Tap to stop' : 'Voice'}</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
