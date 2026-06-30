import type { Macros } from './types';

export function calcMacros(q: Record<string, unknown>): Macros {
  const weight = q.unit === 'metric' ? +(q.weightKg as string) : +(q.weightLbs as string) / 2.205;
  const height = q.unit === 'metric'
    ? +(q.heightCm as string)
    : (+(q.heightFt as string) * 30.48 + +(q.heightIn as string) * 2.54);
  const age = +(q.age as string);

  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += q.gender === 'male' ? 5 : -161;

  const mult: Record<number, number> = { 2: 1.2, 3: 1.375, 4: 1.55, 5: 1.55, 6: 1.725, 7: 1.9 };
  const days = Math.max(2, Math.min(7, +(q.daysPerWeek as string)));
  const tdee = bmr * (mult[days] ?? 1.55);

  let cal = tdee;
  let pMult = 2.2;
  switch (q.primaryGoal) {
    case 'weight_loss':  cal = tdee - 500; pMult = 2.4; break;
    case 'powerlifting': cal = tdee + 300; pMult = 2.0; break;
    case 'aesthetic':    cal = tdee + 200; pMult = 2.2; break;
    case 'endurance':    cal = tdee + 100; pMult = 1.8; break;
    default:             cal = tdee + 150; pMult = 2.0;
  }

  const protein = Math.round(weight * pMult);
  const fat     = Math.round((cal * 0.25) / 9);
  const carbs   = Math.round((cal - protein * 4 - fat * 9) / 4);

  return { calories: Math.round(cal), protein, carbs, fat };
}
