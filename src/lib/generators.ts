import Anthropic from '@anthropic-ai/sdk';
import { getApiKey } from './anthropic';
import type { WorkoutPlan, Meal, Macros, FoodAnalysis } from './types';

export function makeClient(): Anthropic {
  const key = getApiKey();
  if (!key) throw new Error('No API key');
  // dangerouslyAllowBrowser is intentional: this is a personal client-side app
  return new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
}

function parse(text: string): unknown {
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const match = clean.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : clean);
}

export async function generateWorkoutPlan(
  q: Record<string, unknown>
): Promise<WorkoutPlan> {
  const client = makeClient();
  const h = q.unit === 'metric' ? `${q.heightCm} cm` : `${q.heightFt}ft ${q.heightIn}in`;
  const w = q.unit === 'metric' ? `${q.weightKg} kg` : `${q.weightLbs} lbs`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `You are an elite personal trainer. Create a highly personalised workout program.

PROFILE:
- Age: ${q.age}  Gender: ${q.gender}
- Height: ${h}  Weight: ${w}
- Experience: ${q.experience}
- Primary goal: ${q.primaryGoal}
- Specific goal: ${q.secondaryGoal}
- Days per week: ${q.daysPerWeek}
- Session length: ${q.sessionLength} minutes
- Notes: ${q.extraNotes || 'None'}

Design the most optimal training split for their goal. Select exercises that directly serve it (combat = rotational power, plyometrics; powerlifting = main lifts; aesthetic = hypertrophy). Fit each session into the time limit.

Return ONLY valid JSON, no markdown fences:
{
  "split": "Split name",
  "summary": "2-3 sentences on why this plan suits their goal",
  "progressionScheme": "How to progress week to week",
  "weeklyNotes": "Key weekly tip",
  "days": [
    {
      "day": "Day 1",
      "focus": "Push — Chest, Shoulders, Triceps",
      "warmup": ["5 min bike"],
      "exercises": [
        { "name": "Bench Press", "sets": 4, "reps": "4-6", "rest": "3 min", "muscleGroup": "Chest", "notes": "Keep shoulder blades pinched" }
      ],
      "cooldown": ["Chest doorway stretch 30s"]
    }
  ]
}`,
    }],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  return parse(text) as WorkoutPlan;
}

export async function generateMeals(
  q: Record<string, unknown>,
  macros: Macros,
  excludedMeals: string[] = []
): Promise<Meal[]> {
  const client = makeClient();
  const restrictions = (q.dietaryRestrictions as string[])?.length
    ? (q.dietaryRestrictions as string[]).join(', ')
    : 'None';
  const excluded = excludedMeals.length
    ? `\nDo NOT include: ${excludedMeals.join(', ')}`
    : '';

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 6000,
    messages: [{
      role: 'user',
      content: `You are a sports nutritionist. Create a practical ${q.mealsPerDay}-meal daily plan.

CLIENT:
- Goal: ${q.primaryGoal}
- Daily targets: ${macros.calories} kcal | ${macros.protein}g protein | ${macros.carbs}g carbs | ${macros.fat}g fat
- Dietary restrictions: ${restrictions}${excluded}

Make meals realistic and easy to prepare. Spread macros sensibly. Each meal needs 2 distinct alternatives.

Return ONLY valid JSON, no markdown fences:
{
  "meals": [
    {
      "id": "meal_1",
      "name": "Overnight Oats & Eggs",
      "mealType": "breakfast",
      "calories": 620,
      "protein": 45,
      "carbs": 65,
      "fat": 18,
      "prepTime": "5 min",
      "ingredients": ["80g oats", "2 eggs", "250ml milk"],
      "instructions": "Soak oats in milk overnight. Scramble eggs in morning and serve.",
      "alternatives": [
        { "id": "alt_1_1", "name": "Protein Smoothie Bowl", "calories": 590, "protein": 46, "carbs": 55, "fat": 16, "prepTime": "5 min", "ingredients": ["200g Greek yoghurt", "1 scoop whey", "berries"], "instructions": "Blend and top with berries." },
        { "id": "alt_1_2", "name": "Smoked Salmon Scramble", "calories": 610, "protein": 48, "carbs": 30, "fat": 28, "prepTime": "10 min", "ingredients": ["3 eggs", "80g smoked salmon", "sourdough"], "instructions": "Scramble eggs, serve on toast with salmon." }
      ]
    }
  ]
}`,
    }],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  const data = parse(text) as { meals: Meal[] };
  return data.meals || [];
}

export async function runVoiceCommand(
  command: string,
  currentPlan: WorkoutPlan | null,
  quizData: Record<string, unknown>
): Promise<{ message: string; updatedPlan: WorkoutPlan | null }> {
  const client = makeClient();
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Fitness coach assistant. The user said: "${command}"

Current plan: ${JSON.stringify(currentPlan, null, 2)}
Profile: goal=${quizData?.primaryGoal}, experience=${quizData?.experience}

Understand what they want (swap exercise, change split, ask a question, etc.) and respond helpfully.

Return ONLY valid JSON, no markdown:
{ "action": "modify_exercise|change_split|general_advice|unclear", "message": "Friendly 1-2 sentence response", "updatedPlan": null }

If you changed the plan, include the full updated plan object in updatedPlan. Otherwise null.`,
    }],
  });
  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  return parse(text) as { message: string; updatedPlan: WorkoutPlan | null };
}

export async function reviewPhoto(
  currentDataUrl: string,
  previousDataUrl: string | null,
  type: 'physique' | 'skin'
): Promise<string> {
  const client = makeClient();
  const toBase64 = (url: string) => url.split(',')[1];
  const toMediaType = (url: string): 'image/jpeg' | 'image/png' | 'image/webp' =>
    url.startsWith('data:image/png') ? 'image/png' : url.startsWith('data:image/webp') ? 'image/webp' : 'image/jpeg';

  type ContentBlock = Anthropic.ImageBlockParam | Anthropic.TextBlockParam;
  const content: ContentBlock[] = [];

  if (previousDataUrl) {
    content.push({ type: 'text', text: 'PREVIOUS photo (before):' });
    content.push({ type: 'image', source: { type: 'base64', media_type: toMediaType(previousDataUrl), data: toBase64(previousDataUrl) } });
    content.push({ type: 'text', text: 'CURRENT photo (after / most recent):' });
  } else {
    content.push({ type: 'text', text: 'Analyse this single photo (no previous for comparison):' });
  }
  content.push({ type: 'image', source: { type: 'base64', media_type: toMediaType(currentDataUrl), data: toBase64(currentDataUrl) } });

  const systemPrompt = type === 'physique'
    ? `You are an elite physique coach. Analyse the physique photo(s) provided. If two photos are given, compare them and note specific changes in muscle definition, body composition, V-taper, shoulder width vs waist, arm size, and overall conditioning. Be specific and honest — mention both improvements and areas to focus on. Keep the tone motivating. Format as clear sections with headings.`
    : `You are an expert dermatologist and aesthetician. Analyse the skin photo(s). If two photos are given, compare them and note changes in clarity, texture, pore appearance, pigmentation, brightness, and overall skin health. Flag any concerns. Be specific and practical. Format as clear sections with headings.`;

  content.push({ type: 'text', text: systemPrompt });

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content }],
  });
  return msg.content[0].type === 'text' ? msg.content[0].text : 'Analysis unavailable.';
}

export async function analyzeFoodLog(
  foodText: string,
  targets: Macros
): Promise<FoodAnalysis> {
  const client = makeClient();
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Sports nutritionist. Analyse this food intake with precision.

FOOD EATEN: "${foodText}"

DAILY TARGETS: ${targets.calories} kcal | ${targets.protein}g protein | ${targets.carbs}g carbs | ${targets.fat}g fat

Break every food item down individually with accurate macro estimates. Then calculate totals, state exactly what's missing vs targets, and give 2-3 specific tips to hit remaining targets today.

Return ONLY valid JSON, no markdown:
{
  "items": [
    { "name": "Chicken breast", "quantity": "200g grilled", "calories": 330, "protein": 62, "carbs": 0, "fat": 7 }
  ],
  "totals": { "calories": 330, "protein": 62, "carbs": 0, "fat": 7 },
  "missing": ["78g protein still needed — add whey shake + cottage cheese", "450 kcal short — rice or oats would fill this cleanly"],
  "tips": ["40g whey in 350ml whole milk = ~60g protein, 380 kcal", "250g cooked basmati rice adds 215 kcal with minimal fat"]
}`,
    }],
  });
  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  return parse(text) as FoodAnalysis;
}

export interface FaceAnalysisResult {
  faceShape: string;
  faceShapeReasoning: string;
  haircuts: { name: string; why: string }[];
  facialHair: { style: string; why: string }[];
  eyebrows: string;
  eyes: string;
  lips: string;
  skinObservations: string;
  tips: string[];
}

export async function analyseFace(photoDataUrl: string): Promise<FaceAnalysisResult> {
  const client = makeClient();
  const base64 = photoDataUrl.split(',')[1];
  const mediaType = photoDataUrl.startsWith('data:image/png') ? 'image/png' as const : 'image/jpeg' as const;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        },
        {
          type: 'text',
          text: `You are an expert aesthetic consultant, master barber, and image analyst. Analyse this face photo in detail.

Return ONLY valid JSON (no markdown fences):
{
  "faceShape": "oval|round|square|heart|diamond|oblong|triangle",
  "faceShapeReasoning": "1-2 sentence explanation of what facial proportions led to this conclusion",
  "haircuts": [
    { "name": "Haircut name (e.g. Textured Crop)", "why": "Why this suits the face shape and features — be specific" },
    { "name": "Second option", "why": "..." },
    { "name": "Third option", "why": "..." }
  ],
  "facialHair": [
    { "style": "Style name (e.g. Clean shaven / Short stubble / Goatee)", "why": "Why this suits the face shape" },
    { "style": "Alternative", "why": "..." }
  ],
  "eyebrows": "Specific eyebrow shape recommendation (arch position, thickness, tail length) that would best frame this face",
  "eyes": "Observations on the eye area and how to enhance them (lash density, contrast, reducing dark circles if visible, etc.)",
  "lips": "Observations about lip proportions and any care/enhancement tips",
  "skinObservations": "Brief, kind observations about skin clarity, tone, and suggestions",
  "tips": [
    "Specific actionable tip 1 — be concrete and personal to what you see",
    "Specific actionable tip 2",
    "Specific actionable tip 3",
    "Specific actionable tip 4",
    "Specific actionable tip 5"
  ]
}`,
        },
      ],
    }],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const match = clean.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : clean) as FaceAnalysisResult;
}
