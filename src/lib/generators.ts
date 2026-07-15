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
    : `You are an expert dermatologist and aesthetician. Analyse the skin photo(s). If two photos are given, compare them and note changes in clarity, texture, pore appearance, pigmentation, brightness, and overall skin health.

Then build a PERSONALISED skincare routine for exactly what you see, formatted as clear sections with headings:
1. WHAT I SEE — skin type (oily/dry/combination), specific observations (congestion, texture, dark circles, redness, etc.)
2. YOUR MORNING ROUTINE — steps with product TYPES and key ingredients (e.g. "gentle gel cleanser", "niacinamide serum", "SPF 50")
3. YOUR EVENING ROUTINE — same format, including actives (retinol/BHA/AHA) matched to what you see, with frequency and how to introduce them safely
4. LIFESTYLE FLAGS — anything visible that suggests sleep/diet/hydration/sun issues
5. THE ONE CHANGE — the single highest-impact fix for this skin
Be specific and practical, kind but honest.`;

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

export interface LayeringCombo {
  name: string;
  base: string;
  top: string;
  ratio: string;
  vibe: string;
  when: string;
}

export interface LayeringResult {
  combos: LayeringCombo[];
  soloAdvice: string;
  shoppingTip: string;
}

export interface LayeringOptions {
  season?: string;
  occasion?: string;
  avoid?: string[];
}

export async function suggestLayering(fragrances: string, opts: LayeringOptions = {}): Promise<LayeringResult> {
  const client = makeClient();
  const constraints = [
    opts.season && opts.season !== 'any' ? `SEASON FILTER: every combo must suit ${opts.season}.` : '',
    opts.occasion && opts.occasion !== 'any' ? `OCCASION FILTER: every combo must suit ${opts.occasion} wear.` : '',
    opts.avoid?.length ? `DO NOT repeat these previous combos — give genuinely different pairings/ratios: ${opts.avoid.join('; ')}` : '',
  ].filter(Boolean).join('\n');

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{
      role: 'user',
      content: `You are a master perfumer and fragrance layering expert. The user owns these fragrances:

"${fragrances}"

Identify each fragrance's note profile from your knowledge, then design the BEST layering combinations from their collection.
IMPORTANT: EVERY fragrance the user listed must appear in at least one combo — give the single best pairing for each one (fragrances can repeat across combos). If a fragrance genuinely layers badly with everything they own, still include it in a combo but say so honestly in the vibe field and note it shines solo.
${constraints}
Rules of good layering: shared note bridges, one dominant + one accent (not two loud gourmands fighting), fresh over sweet for day, amber/vanilla bases under fresh tops for night.

Return ONLY valid JSON, no markdown fences:
{
  "combos": [
    {
      "name": "Catchy combo name",
      "base": "Fragrance to spray first (skin/clothes, how many sprays)",
      "top": "Fragrance to spray over it (where, how many sprays)",
      "ratio": "e.g. 3 sprays base : 2 sprays top",
      "vibe": "What the combination smells like and why it works (note bridge)",
      "when": "Best occasion/season"
    }
  ],
  "soloAdvice": "Which of their fragrances is best worn alone and why",
  "shoppingTip": "One fragrance to add that would unlock the most new combos with this collection"
}

Give one combo per fragrance minimum (more if the collection allows great extras). If a fragrance name is unrecognisable, make a sensible assumption and note it.`,
    }],
  });
  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  return parse(text) as LayeringResult;
}

export async function planAdvice(tasks: string[], notes: string): Promise<string[]> {
  const client = makeClient();
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `A user planning tomorrow has set these tasks:
${tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}
${notes ? `Their notes about the day: "${notes}"` : ''}

For EACH task, give one sharp coaching tip (max 25 words each) that makes it more likely to actually happen — timing, sequencing, a pitfall to avoid, or a concrete way to do it better.

Return ONLY a JSON array of strings, one tip per task, same order, no markdown:
["tip for task 1", "tip for task 2", ...]`,
    }],
  });
  const text = msg.content[0].type === 'text' ? msg.content[0].text : '[]';
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const match = clean.match(/\[[\s\S]*\]/);
  return JSON.parse(match ? match[0] : clean) as string[];
}

export async function askAdvisor(question: string, phaseContext: string): Promise<string> {
  const client = makeClient();
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    messages: [{
      role: 'user',
      content: `You are the personal advisor inside GymForge — a self-improvement app covering: training & nutrition, combat sports, looksmaxing (skin, hair, style, fragrance), mindset/charisma, football, money/business/investing, university study, and sleep.

${phaseContext ? `The user is currently working on: ${phaseContext}` : ''}

USER'S QUESTION: "${question}"

Answer as a sharp, honest, motivating coach. Be specific and actionable — concrete numbers, protocols and next steps, not platitudes. If the question touches health, keep advice sensible and flag anything that needs a professional. Keep it under 250 words. Plain text with short paragraphs or dashes (no markdown headers).`,
    }],
  });
  return msg.content[0].type === 'text' ? msg.content[0].text : 'No answer available.';
}

export async function dailyCheckIn(summary: string): Promise<string> {
  const client = makeClient();
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `You are an accountability coach inside a self-improvement app. Here's the user's recent activity:

${summary}

Write a short, direct daily check-in message (max 45 words) — like a coach who actually looks at your numbers. Call out what's slipping, credit what's working, and push them to act today. No fluff, no generic hype, be specific using the numbers given. Plain text, no markdown.`,
    }],
  });
  return msg.content[0].type === 'text' ? msg.content[0].text.trim() : "Show up today. That's the whole job.";
}

export interface StudyPack {
  timetable: { day: string; focus: string; tasks: string[] }[];
  prioritySheet: string[];
  summarySheet: { topic: string; keyPoints: string[] }[];
  equationSheet: { name: string; formula: string; whenToUse: string }[];
  denseNotes: string;
  examTips: string[];
}

export async function generateStudyPack(
  course: string,
  modules: string,
  examInfo: string,
  materials: string
): Promise<StudyPack> {
  const client = makeClient();
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: `You are an elite academic coach who has taken hundreds of students to first-class degrees. Build a complete revision pack.

COURSE: ${course}
MODULES/TOPICS: ${modules}
EXAM DATES & FORMAT: ${examInfo || 'Not specified — assume exams in ~4 weeks'}
PASTED LECTURE MATERIAL (slides text, notes — may be partial):
"""
${materials.slice(0, 12000)}
"""

Build from the material provided; where material is thin, use your knowledge of what this course/module standardly covers at university level.

Return ONLY valid JSON, no markdown fences:
{
  "timetable": [
    { "day": "Day 1 (Mon)", "focus": "Module/topic name", "tasks": ["45min: active recall on X — write everything you know, then check", "30min: past paper Qs on Y", "15min: flashcard review"] }
  ],
  "prioritySheet": ["The 20% of topics most likely to dominate the exam and why", "..."],
  "summarySheet": [
    { "topic": "Topic name", "keyPoints": ["The 3-6 things you MUST know about this topic, stated concretely"] }
  ],
  "equationSheet": [
    { "name": "Equation/formula/framework name", "formula": "The equation or framework stated precisely", "whenToUse": "Trigger words in a question that mean you use this" }
  ],
  "denseNotes": "A single dense revision document in markdown covering the material — definitions, mechanisms, examples, common exam traps. Aim for the highest information density per line. Use ## headings per topic.",
  "examTips": ["Specific technique tips for THIS exam format", "..."]
}

Timetable: 7-14 days, realistic 2-4h/day, built on active recall + spaced repetition + past papers (never passive rereading). If no equations apply to this course, use equationSheet for key frameworks/definitions instead.`,
    }],
  });
  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  return parse(text) as StudyPack;
}

export interface FaceAnalysisResult {
  faceShape: string;
  faceShapeReasoning: string;
  haircuts: { name: string; why: string }[];
  facialHair: { style: string; why: string }[];
  glasses?: string;
  eyebrows: string;
  eyes: string;
  lips: string;
  skinObservations: string;
  skincareRoutine?: { morning: string[]; evening: string[]; weekly: string[] };
  tips: string[];
}

export async function analyseFace(photoDataUrl: string): Promise<FaceAnalysisResult> {
  const client = makeClient();
  const base64 = photoDataUrl.split(',')[1];
  const mediaType = photoDataUrl.startsWith('data:image/png') ? 'image/png' as const : 'image/jpeg' as const;

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2500,
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
  "glasses": "Which glasses/sunglasses frame shapes suit this face shape and why (e.g. squared frames for round faces, browline, aviators, wayfarers) — 1-2 sentences",
  "eyebrows": "Specific eyebrow shape recommendation (arch position, thickness, tail length) that would best frame this face",
  "eyes": "Observations on the eye area and how to enhance them (lash density, contrast, reducing dark circles if visible, etc.)",
  "lips": "Observations about lip proportions and any care/enhancement tips",
  "skinObservations": "Brief, kind observations about skin clarity, tone, and suggestions",
  "skincareRoutine": {
    "morning": ["Step-by-step AM routine personalised to the skin you see — product TYPE + key ingredient per step, e.g. 'Gentle gel cleanser (if skin looks oily) or splash of water'", "..."],
    "evening": ["Step-by-step PM routine personalised to what you see, including which active (retinol/BHA/AHA/azelaic) suits this skin and how to introduce it", "..."],
    "weekly": ["1-3 weekly treatments matched to this skin (e.g. clay mask for visible congestion, gentle exfoliation)"]
  },
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
