import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import type { GymSession, CombatSession, FootballSession, ConditioningEntry } from '../lib/types';
import { Dumbbell, Shield, Users, Zap, Plus, Save, X, ChevronDown, ChevronUp, ArrowLeft, Check, Trash2, BookOpen } from 'lucide-react';

type Tab = 'gym' | 'combat' | 'football' | 'conditioning';
type Split = 'push' | 'pull' | 'legs';

interface TplExercise {
  name: string;
  muscleGroup: string;
  defaultSets: number;
  repRange: string;
  notes?: string;
  isPowerPrimer?: boolean;
}

interface ActiveSet { reps: string; weight: string; }
interface ActiveExercise {
  name: string; muscleGroup: string; notes: string;
  isPowerPrimer: boolean; sets: ActiveSet[];
}
interface ActiveSession {
  split: Split; exercises: ActiveExercise[];
  sprintWork: string; sprintCompleted: boolean; notes: string;
}

const COMBAT_TEMPLATES = {
  muaythai_technique: {
    label: 'Muay Thai — Technique',
    rounds: 6,
    roundLength: '3 min',
    rest: '1 min',
    structure: [
      { phase: 'Warm-Up (10 min)', drills: ['3 min shadowboxing — loose, fluid movement', '2 min jump rope', '2 min neck rolls, shoulder circles, hip rotations', '3 min light pad work — jab-cross only'] },
      { phase: 'Technique Block 1 — Striking (20 min)', drills: ['Jab-cross (1-2): 5 × 2-min rounds on pads or bag', 'Jab-cross-hook (1-2-3): 3 × 2-min drill', 'Teep (front kick): 4 × 1-min each leg — push through hip, not just leg'] },
      { phase: 'Technique Block 2 — Kicks (20 min)', drills: ['Rear roundhouse: 5 × 10 reps each leg on heavy bag — snap through, not push', 'Lead roundhouse: 4 × 10 reps — step to side before kicking', 'Low kick to mid kick combo: 3 × 5 each side'] },
      { phase: 'Clinch Work (10 min)', drills: ['Neck grip entry: 3 × 2-min with partner', 'Knee strikes from clinch: 3 × 10 alternating legs', 'Trips and sweeps: drill from clinch position'] },
      { phase: 'Conditioning Finisher (10 min)', drills: ['3 × 3-min rounds on heavy bag — no stopping, constant output', '2 × 10 burpees between rounds', '100 shadowboxing combos — maintain technique under fatigue'] },
    ],
  },
  muaythai_sparring: {
    label: 'Muay Thai — Sparring/Pad Work',
    rounds: 8,
    roundLength: '3 min',
    rest: '1 min',
    structure: [
      { phase: 'Warm-Up (15 min)', drills: ['5 min jump rope', '5 min shadowboxing — work all weapons', '3 min stretch: hip flexors, hamstrings, shoulders', '2 min neck exercise — yes/no/ear-to-shoulder'] },
      { phase: 'Pad Work (24 min — 8 × 3-min rounds)', drills: ['Rounds 1-2: Jab-cross combinations, holder calls numbers', 'Rounds 3-4: Add hooks, uppercuts, and jabs to body', 'Rounds 5-6: Kicks added — calls for teeps and roundhouses', 'Rounds 7-8: Full combinations — holder controls pace and pressure'] },
      { phase: 'Sparring (15 min)', drills: ['3 × 5-min rounds — light contact, technique focus', 'Focus: movement, defence, countering', 'Reset and reset — no ego, use this to test technique'] },
      { phase: 'Cool Down (6 min)', drills: ['2 min shadowboxing — slow and loose', '4 min stretching: hip flexors, groin, lats, shoulders'] },
    ],
  },
  mma_strength_power: {
    label: 'MMA — Strength & Power',
    rounds: 0,
    roundLength: '',
    rest: '2-3 min between sets',
    structure: [
      { phase: 'Power Primers (15 min)', drills: ['Medicine ball slam: 5 × 5 — max intent each rep', 'Rotational med ball throw to wall: 4 × 6 each side', 'Box jump with broad jump landing: 4 × 4', 'Broad jump: 3 × 5 — stick landing'] },
      { phase: 'Strength Block A — Lower Body (20 min)', drills: ['Trap bar deadlift: 5 × 3 @ 85-90% 1RM — hip drive, explosiveness', 'Single leg RDL: 3 × 6 each side (stability for grappling)', 'Hip thrust: 4 × 8 — glutes drive every movement in combat'] },
      { phase: 'Strength Block B — Upper Body (20 min)', drills: ['Weighted pull-up: 5 × 3-5 — pulling strength for clinch/takedowns', 'Dumbbell bench press: 4 × 6 — horizontal pushing for punching', 'Cable woodchop: 3 × 10 each side — rotational power for hooks/kicks'] },
      { phase: 'Grip & Core (10 min)', drills: ['Farmers carry: 3 × 30m heavy — grip is a combat weapon', 'Dragon flag or hanging leg raise: 3 × 10', 'Ab wheel rollout: 3 × 8 — anti-extension core strength', 'Pallof press: 3 × 10 each side — anti-rotation stability'] },
    ],
  },
  mma_conditioning: {
    label: 'MMA — Conditioning Circuit',
    rounds: 5,
    roundLength: '5 min',
    rest: '1 min',
    structure: [
      { phase: 'Circuit — 5 × 5-min Rounds (1 min rest)', drills: ['Round 1: Bag work — all weapons, high output', 'Round 2: Wrestling shots × 20 + sprawl × 20 + sit-ups × 30', 'Round 3: Heavy bag clinch — knee strikes + throws', 'Round 4: Shadow MMA — call out your own combos', 'Round 5: All out bag — empty the tank'] },
      { phase: 'Finisher', drills: ['10 min skipping — maintain technique even when fatigued', '3 × max push-ups, 3 × max pull-ups', '5 min cold-down shadowboxing'] },
    ],
  },
  boxing_technique: {
    label: 'Boxing — Technique & Pad Work',
    rounds: 8,
    roundLength: '3 min',
    rest: '1 min',
    structure: [
      { phase: 'Footwork Warm-Up (10 min)', drills: ['Mirror drill: 5 min — stay on your toes, maintain stance', 'Side-to-side shuffle: 2 min', 'Pivot practice: 100 pivots off lead foot', 'Defensive weave: duck and slip × 50 each direction'] },
      { phase: 'Combination Drills on Pads (24 min)', drills: ['1-2 drill: 3 rounds — speed emphasis', '1-2-3 (jab-cross-hook): 2 rounds — hip rotation key on hook', '1-2-3-2 (jab-cross-hook-cross): 2 rounds', 'Body-head (hook to body, hook to head): 1 round'] },
      { phase: 'Defence Drills (10 min)', drills: ['Slip-and-counter: 3 × 2 min (slip outside the jab, counter cross)', 'Shoulder roll: practice rolling punches, then counter hook', 'Parry-and-counter: parry the jab, return 1-2'] },
    ],
  },
} as const;
type CombatTemplate = typeof COMBAT_TEMPLATES[keyof typeof COMBAT_TEMPLATES];

const MUSCLE_GUIDE = [
  {
    muscle: 'Chest',
    weeklyVolume: '12–20 sets',
    strengthReps: '3–6 reps × 4-5 sets',
    hypertrophyReps: '8–12 reps × 3-4 sets',
    pumpReps: '15–25 reps × 2-3 sets',
    topExercises: ['Barbell bench press', 'Incline dumbbell press', 'Cable fly', 'Dips'],
    powerTip: 'Explosive push-ups and med ball chest throws before heavy pressing builds fast-twitch fibres.',
  },
  {
    muscle: 'Back (Width)',
    weeklyVolume: '14–22 sets',
    strengthReps: '3–6 reps',
    hypertrophyReps: '8–15 reps',
    pumpReps: '15–25 reps',
    topExercises: ['Pull-ups', 'Lat pulldown', 'Straight-arm cable pulldown', 'Wide-grip row'],
    powerTip: 'Explosive pull-ups (jump/kip to accelerate) train rate of force development for pulling in combat.',
  },
  {
    muscle: 'Back (Thickness)',
    weeklyVolume: '14–22 sets (combined with width)',
    strengthReps: '3–6 reps',
    hypertrophyReps: '8–12 reps',
    pumpReps: '12–20 reps',
    topExercises: ['Barbell row (Pendlay/bent-over)', 'Chest-supported row', 'Cable row', 'Deadlift'],
    powerTip: 'Deadlift drives upper back thickness AND full-body power — priority for all combat athletes.',
  },
  {
    muscle: 'Shoulders',
    weeklyVolume: '12–20 sets',
    strengthReps: '5–8 reps (press)',
    hypertrophyReps: '10–15 reps',
    pumpReps: '15–30 reps (laterals)',
    topExercises: ['Overhead press', 'Lateral raise', 'Cable lateral raise', 'Face pull', 'Rear delt fly'],
    powerTip: 'Overhead press + push-press (use leg drive) builds sport-specific shoulder power.',
  },
  {
    muscle: 'Biceps',
    weeklyVolume: '10–14 sets',
    strengthReps: '5–8 reps',
    hypertrophyReps: '8–15 reps',
    pumpReps: '15–25 reps',
    topExercises: ['Barbell curl', 'Incline dumbbell curl', 'Preacher curl', 'Hammer curl', 'Reverse curl'],
    powerTip: 'Hammer curls develop the brachialis — adds arm thickness AND grappling strength.',
  },
  {
    muscle: 'Triceps',
    weeklyVolume: '10–14 sets',
    strengthReps: '5–8 reps',
    hypertrophyReps: '8–15 reps',
    pumpReps: '15–25 reps',
    topExercises: ['Close-grip bench', 'Overhead tricep extension', 'Cable pushdown', 'Skull crusher', 'Dips'],
    powerTip: "Overhead extension targets the long head (70% of tricep mass). Don't skip it.",
  },
  {
    muscle: 'Quads',
    weeklyVolume: '12–20 sets',
    strengthReps: '3–6 reps',
    hypertrophyReps: '8–15 reps',
    pumpReps: '15–25 reps',
    topExercises: ['Back squat', 'Hack squat', 'Leg press', 'Bulgarian split squat', 'Leg extension'],
    powerTip: 'Box jumps and squat jumps before heavy squats activates fast-twitch fibres for explosive leg power.',
  },
  {
    muscle: 'Hamstrings',
    weeklyVolume: '10–16 sets',
    strengthReps: '5–8 reps',
    hypertrophyReps: '8–12 reps',
    pumpReps: '12–20 reps',
    topExercises: ['Romanian deadlift', 'Nordic curl', 'Lying leg curl', 'Seated leg curl', 'Good morning'],
    powerTip: 'Nordic curl is the single best hamstring injury-prevention exercise — crucial for sprint/kick athletes.',
  },
  {
    muscle: 'Glutes',
    weeklyVolume: '12–20 sets',
    strengthReps: '5–8 reps',
    hypertrophyReps: '8–15 reps',
    pumpReps: '15–25 reps',
    topExercises: ['Hip thrust', 'Cable kickback', 'Bulgarian split squat', 'Romanian deadlift', 'Step-up'],
    powerTip: 'Hip thrust at end of every session — glutes drive punching power, kicking power, sprinting.',
  },
  {
    muscle: 'Calves',
    weeklyVolume: '8–16 sets',
    strengthReps: '6–10 reps (heavy, slow)',
    hypertrophyReps: '12–20 reps',
    pumpReps: '20–30 reps',
    topExercises: ['Standing calf raise', 'Seated calf raise', 'Single-leg calf raise', 'Donkey calf raise'],
    powerTip: 'Full ROM is critical — pause 1s at stretch, 1s at top. Most people shorten the range and limit gains.',
  },
  {
    muscle: 'Core',
    weeklyVolume: '10–16 sets',
    strengthReps: 'Plank: 3 × 60s; RKC plank 3 × 30s',
    hypertrophyReps: 'Crunches/leg raise: 3 × 15–25',
    pumpReps: '20–30 reps or time',
    topExercises: ['Ab wheel rollout', 'Hanging leg raise', 'Cable crunch', 'Pallof press', 'Dragon flag'],
    powerTip: 'Anti-rotation and anti-extension core work (Pallof press, ab wheel) transfers better to sport than crunches.',
  },
  {
    muscle: 'Neck & Traps',
    weeklyVolume: '6–12 sets',
    strengthReps: '6–10 reps',
    hypertrophyReps: '10–15 reps',
    pumpReps: '15–20 reps',
    topExercises: ['Shrug', 'Neck flexion/extension with band', 'Face pull', 'Farmer carry', 'Rack pull'],
    powerTip: 'Combat athletes must train neck. A strong neck absorbs punch impact and prevents KOs. Start light with bands.',
  },
];

const TPL: Record<Split, { powerPrimers: TplExercise[]; mainLifts: TplExercise[]; sprintWork: string }> = {
  push: {
    powerPrimers: [
      { name: 'Explosive Push-up', muscleGroup: 'Chest', defaultSets: 3, repRange: '5', notes: 'Focus on speed off the floor — control descent, explode up', isPowerPrimer: true },
      { name: 'Med Ball Chest Pass', muscleGroup: 'Chest', defaultSets: 3, repRange: '5', notes: 'Throw explosively into wall or floor — max intent every rep', isPowerPrimer: true },
    ],
    mainLifts: [
      { name: 'Bench Press', muscleGroup: 'Chest', defaultSets: 4, repRange: '4–6', notes: 'Scapulae retracted, leg drive, pause at chest' },
      { name: 'Overhead Press', muscleGroup: 'Shoulders', defaultSets: 4, repRange: '5–8', notes: 'Brace core hard — no excessive lumbar arch' },
      { name: 'Incline DB Press', muscleGroup: 'Upper Chest', defaultSets: 3, repRange: '8–12' },
      { name: 'Lateral Raises', muscleGroup: 'Shoulders', defaultSets: 4, repRange: '12–15', notes: 'Control descent — 3s down' },
      { name: 'Tricep Dips', muscleGroup: 'Triceps', defaultSets: 3, repRange: '8–12' },
      { name: 'Cable Tricep Pushdown', muscleGroup: 'Triceps', defaultSets: 3, repRange: '12–15' },
    ],
    sprintWork: '4 × 30m sprints — full recovery between sets',
  },
  pull: {
    powerPrimers: [
      { name: 'Explosive Pull-up', muscleGroup: 'Back', defaultSets: 3, repRange: '5', notes: 'Accelerate upward fast — control descent', isPowerPrimer: true },
      { name: 'Band Pull-Apart', muscleGroup: 'Rear Delts', defaultSets: 3, repRange: '15', isPowerPrimer: true },
    ],
    mainLifts: [
      { name: 'Deadlift', muscleGroup: 'Back', defaultSets: 4, repRange: '3–5', notes: 'Hinge at hips — drive the floor away' },
      { name: 'Pull-ups', muscleGroup: 'Back', defaultSets: 4, repRange: '6–10', notes: 'Full ROM — dead hang to chin over bar' },
      { name: 'Pendlay Row', muscleGroup: 'Mid Back', defaultSets: 4, repRange: '5–8' },
      { name: 'Face Pulls', muscleGroup: 'Rear Delts', defaultSets: 3, repRange: '15–20', notes: 'Pull to ears — external rotation at end' },
      { name: 'Hammer Curls', muscleGroup: 'Biceps', defaultSets: 3, repRange: '10–12' },
      { name: 'Incline DB Curl', muscleGroup: 'Biceps', defaultSets: 3, repRange: '10–12', notes: 'Full stretch at bottom — supinate at top' },
    ],
    sprintWork: '6 × 40m hill sprints — walk back recovery',
  },
  legs: {
    powerPrimers: [
      { name: 'Box Jumps', muscleGroup: 'Full Lower Body', defaultSets: 4, repRange: '5', notes: 'Land softly — step down after each rep', isPowerPrimer: true },
      { name: 'Broad Jumps', muscleGroup: 'Glutes / Quads', defaultSets: 3, repRange: '5', notes: 'Max horizontal distance — stick the landing', isPowerPrimer: true },
    ],
    mainLifts: [
      { name: 'Back Squat', muscleGroup: 'Quads / Glutes', defaultSets: 5, repRange: '3–5', notes: 'Brace hard — knees out — full depth' },
      { name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', defaultSets: 4, repRange: '6–8', notes: 'Hinge until hamstring tension — stop before lower back rounds' },
      { name: 'Leg Press', muscleGroup: 'Quads', defaultSets: 3, repRange: '10–15' },
      { name: 'Walking Lunges', muscleGroup: 'Quads / Glutes', defaultSets: 3, repRange: '12/leg' },
      { name: 'Leg Curl', muscleGroup: 'Hamstrings', defaultSets: 3, repRange: '10–15' },
      { name: 'Calf Raises', muscleGroup: 'Calves', defaultSets: 4, repRange: '15–20', notes: 'Pause 1s at top — full stretch at bottom' },
    ],
    sprintWork: '6 × 40m flat sprints — full recovery between sets',
  },
};

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') as T[]; }
  catch { return []; }
}
function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
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

const TABS: { id: Tab; label: string; icon: typeof Dumbbell; color: string }[] = [
  { id: 'gym', label: 'Gym', icon: Dumbbell, color: 'text-orange-400' },
  { id: 'combat', label: 'Combat', icon: Shield, color: 'text-red-400' },
  { id: 'football', label: 'Football', icon: Users, color: 'text-green-400' },
  { id: 'conditioning', label: 'Cond.', icon: Zap, color: 'text-blue-400' },
];

export default function TrainingLog() {
  const [tab, setTab] = useState<Tab>('gym');

  // Gym
  const [gymSessions, setGymSessions] = useState<GymSession[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [expandedEx, setExpandedEx] = useState<number | null>(null);

  // Combat
  const [combatSessions, setCombatSessions] = useState<CombatSession[]>([]);
  const [loggingCombat, setLoggingCombat] = useState(false);
  const [combatForm, setCombatForm] = useState({ rounds: 5, sparringPartner: '', techniquesFocus: '', recovery: '', notes: '' });
  const [combatTemplate, setCombatTemplate] = useState<CombatTemplate | null>(null);
  const [expandedMuscle, setExpandedMuscle] = useState<string | null>(null);
  const [showMuscleGuide, setShowMuscleGuide] = useState(false);

  // Football
  const [footballSessions, setFootballSessions] = useState<FootballSession[]>([]);
  const [loggingFootball, setLoggingFootball] = useState(false);
  const [footballForm, setFootballForm] = useState({ sessionType: 'Training', positionDrills: '', notes: '' });

  // Conditioning
  const [condEntries, setCondEntries] = useState<ConditioningEntry[]>([]);
  const [loggingCond, setLoggingCond] = useState(false);
  const [condForm, setCondForm] = useState({ sprintTimes: '', roundEndurance: '', recoveryTime: '', notes: '' });

  useEffect(() => {
    setGymSessions(load<GymSession>('gymforge_gym_sessions'));
    setCombatSessions(load<CombatSession>('gymforge_combat_sessions'));
    setFootballSessions(load<FootballSession>('gymforge_football_sessions'));
    setCondEntries(load<ConditioningEntry>('gymforge_conditioning'));
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // --- GYM HELPERS ---
  const startGymSession = (split: Split) => {
    const t = TPL[split];
    const exercises: ActiveExercise[] = [
      ...t.powerPrimers.map(e => ({
        name: e.name, muscleGroup: e.muscleGroup, notes: e.notes ?? '',
        isPowerPrimer: true,
        sets: Array.from({ length: e.defaultSets }, () => ({ reps: e.repRange, weight: '' })),
      })),
      ...t.mainLifts.map(e => ({
        name: e.name, muscleGroup: e.muscleGroup, notes: e.notes ?? '',
        isPowerPrimer: false,
        sets: Array.from({ length: e.defaultSets }, () => ({ reps: '', weight: '' })),
      })),
    ];
    setActiveSession({ split, exercises, sprintWork: t.sprintWork, sprintCompleted: false, notes: '' });
    setExpandedEx(null);
  };

  const updateSet = (exIdx: number, setIdx: number, field: 'reps' | 'weight', val: string) => {
    if (!activeSession) return;
    const exercises = activeSession.exercises.map((ex, ei) =>
      ei !== exIdx ? ex : {
        ...ex,
        sets: ex.sets.map((s, si) => si !== setIdx ? s : { ...s, [field]: val }),
      }
    );
    setActiveSession({ ...activeSession, exercises });
  };

  const addSet = (exIdx: number) => {
    if (!activeSession) return;
    const exercises = activeSession.exercises.map((ex, ei) =>
      ei !== exIdx ? ex : { ...ex, sets: [...ex.sets, { reps: '', weight: '' }] }
    );
    setActiveSession({ ...activeSession, exercises });
  };

  const removeSet = (exIdx: number) => {
    if (!activeSession) return;
    const exercises = activeSession.exercises.map((ex, ei) =>
      ei !== exIdx || ex.sets.length <= 1 ? ex : { ...ex, sets: ex.sets.slice(0, -1) }
    );
    setActiveSession({ ...activeSession, exercises });
  };

  const saveGymSession = () => {
    if (!activeSession) return;
    const session: GymSession = {
      id: Date.now().toString(),
      date: todayStr,
      split: activeSession.split,
      exercises: activeSession.exercises.map(e => ({
        name: e.name, muscleGroup: e.muscleGroup,
        notes: e.notes || undefined, isPowerPrimer: e.isPowerPrimer,
        sets: e.sets.filter(s => s.reps || s.weight),
      })),
      sprintCompleted: activeSession.sprintCompleted,
      sprintWork: activeSession.sprintWork,
      notes: activeSession.notes || undefined,
    };
    const updated = [session, ...gymSessions];
    setGymSessions(updated);
    save('gymforge_gym_sessions', updated);
    setActiveSession(null);
  };

  const deleteGym = (id: string) => {
    const updated = gymSessions.filter(s => s.id !== id);
    setGymSessions(updated);
    save('gymforge_gym_sessions', updated);
  };

  // --- COMBAT HELPERS ---
  const saveCombat = () => {
    const s: CombatSession = {
      id: Date.now().toString(), date: todayStr,
      rounds: combatForm.rounds, sparringPartner: combatForm.sparringPartner,
      techniquesFocus: combatForm.techniquesFocus, recovery: combatForm.recovery, notes: combatForm.notes,
    };
    const updated = [s, ...combatSessions];
    setCombatSessions(updated);
    save('gymforge_combat_sessions', updated);
    setLoggingCombat(false);
    setCombatForm({ rounds: 5, sparringPartner: '', techniquesFocus: '', recovery: '', notes: '' });
  };

  const deleteCombat = (id: string) => {
    const updated = combatSessions.filter(s => s.id !== id);
    setCombatSessions(updated);
    save('gymforge_combat_sessions', updated);
  };

  // --- FOOTBALL HELPERS ---
  const saveFootball = () => {
    const s: FootballSession = {
      id: Date.now().toString(), date: todayStr,
      sessionType: footballForm.sessionType, positionDrills: footballForm.positionDrills, notes: footballForm.notes,
    };
    const updated = [s, ...footballSessions];
    setFootballSessions(updated);
    save('gymforge_football_sessions', updated);
    setLoggingFootball(false);
    setFootballForm({ sessionType: 'Training', positionDrills: '', notes: '' });
  };

  const deleteFootball = (id: string) => {
    const updated = footballSessions.filter(s => s.id !== id);
    setFootballSessions(updated);
    save('gymforge_football_sessions', updated);
  };

  // --- CONDITIONING HELPERS ---
  const saveCond = () => {
    const e: ConditioningEntry = {
      id: Date.now().toString(), date: todayStr,
      sprintTimes: condForm.sprintTimes, roundEndurance: condForm.roundEndurance,
      recoveryTime: condForm.recoveryTime, notes: condForm.notes || undefined,
    };
    const updated = [e, ...condEntries];
    setCondEntries(updated);
    save('gymforge_conditioning', updated);
    setLoggingCond(false);
    setCondForm({ sprintTimes: '', roundEndurance: '', recoveryTime: '', notes: '' });
  };

  const deleteCond = (id: string) => {
    const updated = condEntries.filter(e => e.id !== id);
    setCondEntries(updated);
    save('gymforge_conditioning', updated);
  };

  const splitColors: Record<Split, string> = {
    push: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    pull: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    legs: 'text-green-400 bg-green-500/10 border-green-500/30',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="px-4 pt-12 pb-4 bg-gradient-to-b from-orange-950/30 to-transparent">
        <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={15} className="mr-1" /> Dashboard
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Training Log</h1>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 bg-[#111] border border-white/10 rounded-2xl p-1">
          {TABS.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === id ? `bg-white/10 ${color}` : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4">

        {/* ===== GYM TAB ===== */}
        {tab === 'gym' && (
          <>
            {!activeSession ? (
              <>
                <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
                  <h2 className="font-bold text-base mb-3">Log New Gym Session</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {(['push', 'pull', 'legs'] as Split[]).map(split => (
                      <button
                        key={split}
                        onClick={() => startGymSession(split)}
                        className={`py-3 rounded-xl border font-bold text-sm capitalize transition-all hover:scale-105 ${splitColors[split]}`}
                      >
                        {split}
                      </button>
                    ))}
                  </div>
                </div>

                {gymSessions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-400 text-sm px-1">Recent Sessions</h3>
                    {gymSessions.slice(0, 5).map(s => (
                      <div key={s.id} className="bg-[#111] rounded-2xl border border-white/10 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${splitColors[s.split]}`}>{s.split}</span>
                            <span className="text-gray-500 text-xs">{fmtDate(s.date)}</span>
                          </div>
                          <button onClick={() => deleteGym(s.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {s.exercises.filter(e => !e.isPowerPrimer && e.sets.length > 0).slice(0, 3).map((e, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">{e.name}</span>
                              <span className="text-gray-500">{e.sets.length} sets{e.sets[0]?.weight ? ` × ${e.sets[0].weight}kg` : ''}</span>
                            </div>
                          ))}
                          {s.sprintCompleted && <p className="text-blue-400 text-xs mt-1">+ Sprint work ✓</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Personal Bests */}
                {gymSessions.length > 0 && (() => {
                  const pbMap: Record<string, number> = {};
                  gymSessions.forEach(s => {
                    s.exercises.forEach(ex => {
                      ex.sets.forEach(set => {
                        const w = parseFloat(set.weight || '0');
                        if (w > 0 && (!pbMap[ex.name] || w > pbMap[ex.name])) {
                          pbMap[ex.name] = w;
                        }
                      });
                    });
                  });
                  const pbs = Object.entries(pbMap).sort((a, b) => b[1] - a[1]);
                  if (pbs.length === 0) return null;
                  return (
                    <div className="bg-[#111] border border-yellow-500/20 rounded-2xl p-4">
                      <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                        <span className="text-yellow-400">Personal Bests</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {pbs.slice(0, 8).map(([name, weight]) => (
                          <div key={name} className="bg-white/5 rounded-xl px-3 py-2.5">
                            <p className="text-gray-400 text-xs truncate">{name}</p>
                            <p className="text-yellow-400 font-black text-lg">{weight}<span className="text-gray-500 text-xs ml-0.5">kg</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Muscle Reference Guide */}
                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setShowMuscleGuide(!showMuscleGuide)}
                    className="w-full flex items-center justify-between px-4 py-3.5"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen size={15} className="text-orange-400" />
                      <span className="font-bold text-sm">Muscle Reference Guide</span>
                    </div>
                    {showMuscleGuide ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                  </button>
                  {showMuscleGuide && (
                    <div className="border-t border-white/5 p-3 space-y-2">
                      {MUSCLE_GUIDE.map(m => (
                        <div key={m.muscle} className="bg-white/5 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedMuscle(expandedMuscle === m.muscle ? null : m.muscle)}
                            className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{m.muscle}</span>
                              <span className="text-gray-600 text-xs">{m.weeklyVolume}</span>
                            </div>
                            {expandedMuscle === m.muscle ? <ChevronUp size={13} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={13} className="text-gray-500 flex-shrink-0" />}
                          </button>
                          {expandedMuscle === m.muscle && (
                            <div className="px-3 pb-3 space-y-2 border-t border-white/5">
                              <div className="grid grid-cols-3 gap-1.5 mt-2">
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                                  <p className="text-[10px] text-red-400 font-bold mb-0.5">STRENGTH</p>
                                  <p className="text-xs text-gray-300">{m.strengthReps}</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
                                  <p className="text-[10px] text-blue-400 font-bold mb-0.5">HYPERTROPHY</p>
                                  <p className="text-xs text-gray-300">{m.hypertrophyReps}</p>
                                </div>
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                                  <p className="text-[10px] text-green-400 font-bold mb-0.5">PUMP</p>
                                  <p className="text-xs text-gray-300">{m.pumpReps}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Top Exercises</p>
                                <div className="flex flex-wrap gap-1">
                                  {m.topExercises.map(ex => (
                                    <span key={ex} className="bg-white/10 text-gray-300 text-xs px-2 py-0.5 rounded-full">{ex}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2">
                                <p className="text-[10px] text-yellow-400 font-bold mb-0.5">POWER TIP</p>
                                <p className="text-xs text-gray-300 leading-relaxed">{m.powerTip}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Active session */}
                <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Active Session</p>
                      <h2 className={`text-xl font-black capitalize ${splitColors[activeSession.split].split(' ')[0]}`}>
                        {activeSession.split} Day
                      </h2>
                    </div>
                    <button onClick={() => setActiveSession(null)} className="text-gray-500 hover:text-red-400 transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeSession.exercises.map((ex, ei) => (
                      <div key={ei} className={`rounded-xl border overflow-hidden ${
                        ex.isPowerPrimer ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-white/10 bg-white/5'
                      }`}>
                        <button
                          onClick={() => setExpandedEx(expandedEx === ei ? null : ei)}
                          className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                        >
                          <div>
                            {ex.isPowerPrimer && <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider block">Power Primer</span>}
                            <p className="font-semibold text-sm">{ex.name}</p>
                            <p className="text-gray-500 text-xs">{ex.muscleGroup} · {ex.sets.length} sets</p>
                          </div>
                          {expandedEx === ei ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                        </button>

                        {expandedEx === ei && (
                          <div className="px-3 pb-3">
                            {ex.notes && <p className="text-gray-500 text-xs mb-2 italic">{ex.notes}</p>}
                            <div className="space-y-1.5 mb-2">
                              {ex.sets.map((s, si) => (
                                <div key={si} className="flex items-center gap-2">
                                  <span className="text-gray-600 text-xs w-5">{si + 1}</span>
                                  <input
                                    type="text"
                                    placeholder="Reps"
                                    value={s.reps}
                                    onChange={e => updateSet(ei, si, 'reps', e.target.value)}
                                    className="flex-1 bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-center text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                                  />
                                  <input
                                    type="text"
                                    placeholder="kg"
                                    value={s.weight}
                                    onChange={e => updateSet(ei, si, 'weight', e.target.value)}
                                    className="flex-1 bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-center text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => addSet(ei)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-1.5 text-xs text-gray-400 flex items-center justify-center gap-1 transition-colors">
                                <Plus size={12} /> Set
                              </button>
                              <button onClick={() => removeSet(ei)} className="flex-1 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-lg py-1.5 text-xs text-gray-400 hover:text-red-400 flex items-center justify-center gap-1 transition-colors">
                                <X size={12} /> Set
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Sprint work */}
                  <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-400 font-semibold text-sm">Sprint Work</p>
                        <p className="text-gray-500 text-xs mt-0.5">{activeSession.sprintWork}</p>
                      </div>
                      <button
                        onClick={() => setActiveSession({ ...activeSession, sprintCompleted: !activeSession.sprintCompleted })}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          activeSession.sprintCompleted ? 'bg-blue-500 border-blue-500' : 'border-white/30'
                        }`}
                      >
                        {activeSession.sprintCompleted && <Check size={14} />}
                      </button>
                    </div>
                  </div>

                  <textarea
                    placeholder="Session notes (optional)"
                    value={activeSession.notes}
                    onChange={e => setActiveSession({ ...activeSession, notes: e.target.value })}
                    className="mt-3 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm resize-none h-16 focus:outline-none focus:border-orange-500/30"
                  />

                  <button
                    onClick={saveGymSession}
                    className="mt-3 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Save size={16} /> Save Session
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ===== COMBAT TAB ===== */}
        {tab === 'combat' && (
          <>
            {!loggingCombat ? (
              <>
                {/* Template selector */}
                <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
                  <h2 className="font-bold text-base mb-3">Session Templates</h2>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {(Object.entries(COMBAT_TEMPLATES) as [string, CombatTemplate][]).map(([key, tpl]) => (
                      <button
                        key={key}
                        onClick={() => setCombatTemplate(combatTemplate?.label === tpl.label ? null : tpl)}
                        className={`flex-shrink-0 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          combatTemplate?.label === tpl.label
                            ? 'bg-red-500/20 border-red-500/50 text-red-300'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template breakdown */}
                {combatTemplate && (
                  <div className="bg-[#111] border border-red-500/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-base text-red-400">{combatTemplate.label}</h2>
                      <button onClick={() => setCombatTemplate(null)} className="text-gray-500 hover:text-red-400 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                    {(combatTemplate.rounds > 0 || combatTemplate.roundLength) && (
                      <div className="flex gap-3 mb-3">
                        {combatTemplate.rounds > 0 && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-center">
                            <p className="text-red-400 font-black text-lg">{combatTemplate.rounds}</p>
                            <p className="text-gray-500 text-xs">rounds</p>
                          </div>
                        )}
                        {combatTemplate.roundLength && (
                          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center">
                            <p className="text-white font-black text-lg">{combatTemplate.roundLength}</p>
                            <p className="text-gray-500 text-xs">round length</p>
                          </div>
                        )}
                        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center flex-1">
                          <p className="text-white font-bold text-sm">{combatTemplate.rest}</p>
                          <p className="text-gray-500 text-xs">rest</p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-3">
                      {combatTemplate.structure.map((block, bi) => (
                        <div key={bi} className="bg-white/5 rounded-xl p-3">
                          <p className="font-bold text-sm text-red-300 mb-2">{block.phase}</p>
                          <div className="space-y-1">
                            {block.drills.map((drill, di) => (
                              <p key={di} className="text-gray-300 text-xs leading-relaxed">· {drill}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        if (combatTemplate.rounds > 0) setCombatForm(p => ({ ...p, rounds: combatTemplate.rounds, techniquesFocus: combatTemplate.label }));
                        setLoggingCombat(true);
                      }}
                      className="mt-3 w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl py-2.5 text-red-400 font-bold text-sm transition-colors"
                    >
                      Log This Session
                    </button>
                  </div>
                )}

                <button onClick={() => setLoggingCombat(true)} className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-2xl py-3 text-red-400 font-bold flex items-center justify-center gap-2 transition-colors">
                  <Plus size={16} /> Log Combat Session
                </button>
                {combatSessions.slice(0, 5).map(s => (
                  <div key={s.id} className="bg-[#111] rounded-2xl border border-white/10 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-xs">{s.date}</p>
                        <p className="font-bold text-red-400 text-lg">{s.rounds} rounds</p>
                        {s.sparringPartner && <p className="text-gray-400 text-sm">vs {s.sparringPartner}</p>}
                      </div>
                      <button onClick={() => deleteCombat(s.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    {s.techniquesFocus && <p className="text-gray-300 text-sm mt-2"><span className="text-gray-500">Focus: </span>{s.techniquesFocus}</p>}
                    {s.recovery && <p className="text-gray-400 text-xs mt-1">Recovery: {s.recovery}</p>}
                    {s.notes && <p className="text-gray-500 text-xs mt-1 italic">{s.notes}</p>}
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-[#111] rounded-2xl border border-red-500/20 p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-bold text-lg">Log Combat Session</h2>
                  <button onClick={() => setLoggingCombat(false)} className="text-gray-500 hover:text-red-400 transition-colors"><X size={18} /></button>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Rounds completed</label>
                  <input type="number" min={1} max={20} value={combatForm.rounds}
                    onChange={e => setCombatForm(p => ({ ...p, rounds: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-lg font-bold focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Sparring partner (optional)</label>
                  <input type="text" placeholder="Name" value={combatForm.sparringPartner}
                    onChange={e => setCombatForm(p => ({ ...p, sparringPartner: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Technique focus</label>
                  <input type="text" placeholder="e.g. Jab combinations, head movement, clinch work"
                    value={combatForm.techniquesFocus}
                    onChange={e => setCombatForm(p => ({ ...p, techniquesFocus: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Recovery between rounds</label>
                  <input type="text" placeholder="e.g. 60s, felt sharp / gassed after round 3"
                    value={combatForm.recovery}
                    onChange={e => setCombatForm(p => ({ ...p, recovery: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                  <textarea placeholder="How did it go?" value={combatForm.notes}
                    onChange={e => setCombatForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm resize-none h-16 focus:outline-none focus:border-red-500/50" />
                </div>
                <button onClick={saveCombat} className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-all">
                  <Save size={16} /> Save Session
                </button>
              </div>
            )}
          </>
        )}

        {/* ===== FOOTBALL TAB ===== */}
        {tab === 'football' && (
          <>
            {!loggingFootball ? (
              <>
                <button onClick={() => setLoggingFootball(true)} className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-2xl py-3 text-green-400 font-bold flex items-center justify-center gap-2 transition-colors">
                  <Plus size={16} /> Log Football Session
                </button>
                {footballSessions.slice(0, 5).map(s => (
                  <div key={s.id} className="bg-[#111] rounded-2xl border border-white/10 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-xs">{s.date}</p>
                        <p className="font-bold text-green-400">{s.sessionType}</p>
                      </div>
                      <button onClick={() => deleteFootball(s.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    </div>
                    {s.positionDrills && <p className="text-gray-300 text-sm mt-1"><span className="text-gray-500">Drills: </span>{s.positionDrills}</p>}
                    {s.notes && <p className="text-gray-500 text-xs mt-1 italic">{s.notes}</p>}
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-[#111] rounded-2xl border border-green-500/20 p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-bold text-lg">Log Football Session</h2>
                  <button onClick={() => setLoggingFootball(false)} className="text-gray-500 hover:text-red-400 transition-colors"><X size={18} /></button>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Session type</label>
                  <select value={footballForm.sessionType}
                    onChange={e => setFootballForm(p => ({ ...p, sessionType: e.target.value }))}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500/50">
                    <option>Training</option><option>Match</option><option>Pre-season</option><option>Recovery</option><option>Skills work</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Position-specific drills</label>
                  <input type="text" placeholder="e.g. Wide receiver routes, receiving under pressure"
                    value={footballForm.positionDrills}
                    onChange={e => setFootballForm(p => ({ ...p, positionDrills: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                  <textarea placeholder="How did it go?" value={footballForm.notes}
                    onChange={e => setFootballForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm resize-none h-16 focus:outline-none focus:border-green-500/50" />
                </div>
                <button onClick={saveFootball} className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-all">
                  <Save size={16} /> Save Session
                </button>
              </div>
            )}
          </>
        )}

        {/* ===== CONDITIONING TAB ===== */}
        {tab === 'conditioning' && (
          <>
            {!loggingCond ? (
              <>
                <button onClick={() => setLoggingCond(true)} className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-2xl py-3 text-blue-400 font-bold flex items-center justify-center gap-2 transition-colors">
                  <Plus size={16} /> Log Conditioning
                </button>
                {condEntries.slice(0, 5).map(e => (
                  <div key={e.id} className="bg-[#111] rounded-2xl border border-white/10 p-4">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-500 text-xs">{fmtDate(e.date)}</p>
                      <button onClick={() => deleteCond(e.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    </div>
                    {e.sprintTimes && <p className="text-blue-400 font-bold mt-1">{e.sprintTimes}</p>}
                    {e.roundEndurance && <p className="text-gray-300 text-sm"><span className="text-gray-500">Rounds: </span>{e.roundEndurance}</p>}
                    {e.recoveryTime && <p className="text-gray-400 text-xs">Recovery: {e.recoveryTime}</p>}
                    {e.notes && <p className="text-gray-500 text-xs mt-1 italic">{e.notes}</p>}
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-[#111] rounded-2xl border border-blue-500/20 p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-bold text-lg">Log Conditioning</h2>
                  <button onClick={() => setLoggingCond(false)} className="text-gray-500 hover:text-red-400 transition-colors"><X size={18} /></button>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Sprint times</label>
                  <input type="text" placeholder="e.g. 4.3s, 4.4s, 4.5s, 4.4s (30m)"
                    value={condForm.sprintTimes}
                    onChange={e => setCondForm(p => ({ ...p, sprintTimes: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Round endurance</label>
                  <input type="text" placeholder="e.g. Completed 8 × 3min rounds, last 2 tough"
                    value={condForm.roundEndurance}
                    onChange={e => setCondForm(p => ({ ...p, roundEndurance: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Recovery between efforts</label>
                  <input type="text" placeholder="e.g. Full 3min rest, HR back to ~130 before next"
                    value={condForm.recoveryTime}
                    onChange={e => setCondForm(p => ({ ...p, recoveryTime: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                  <textarea placeholder="How did it feel?" value={condForm.notes}
                    onChange={e => setCondForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm resize-none h-16 focus:outline-none focus:border-blue-500/50" />
                </div>
                <button onClick={saveCond} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-all">
                  <Save size={16} /> Save Entry
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
