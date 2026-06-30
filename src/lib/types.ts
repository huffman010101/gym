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
