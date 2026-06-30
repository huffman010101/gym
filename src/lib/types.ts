export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  muscleGroup: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
}

export interface WorkoutPlan {
  split: string;
  summary: string;
  progressionScheme: string;
  weeklyNotes: string;
  days: WorkoutDay[];
}

export interface MealAlt {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: string;
  ingredients: string[];
  instructions: string;
}

export interface Meal {
  id: string;
  name: string;
  mealType: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: string;
  ingredients: string[];
  instructions: string;
  alternatives: MealAlt[];
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodAnalysis {
  items: FoodItem[];
  totals: Macros;
  missing: string[];
  tips: string[];
}

export interface GymSet {
  reps: string;
  weight: string;
}

export interface GymExercise {
  name: string;
  muscleGroup: string;
  notes?: string;
  isPowerPrimer?: boolean;
  sets: GymSet[];
}

export interface GymSession {
  id: string;
  date: string;
  split: 'push' | 'pull' | 'legs';
  exercises: GymExercise[];
  sprintCompleted: boolean;
  sprintWork: string;
  notes?: string;
}

export interface CombatSession {
  id: string;
  date: string;
  rounds: number;
  sparringPartner: string;
  techniquesFocus: string;
  recovery: string;
  notes: string;
}

export interface FootballSession {
  id: string;
  date: string;
  sessionType: string;
  positionDrills: string;
  notes: string;
}

export interface ConditioningEntry {
  id: string;
  date: string;
  sprintTimes: string;
  roundEndurance: string;
  recoveryTime: string;
  notes?: string;
}

export interface BodyMetric {
  id: string;
  date: string;
  weight: number;
  waist: number;
  shoulders: number;
  arms: number;
  notes?: string;
}

export interface SkinEntry {
  id: string;
  date: string;
  retinol: boolean;
  bha: boolean;
  aha: boolean;
  spf: boolean;
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  angle: 'front' | 'side' | 'back';
  dataUrl: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'sparring' | 'match' | 'competition' | 'other';
}
