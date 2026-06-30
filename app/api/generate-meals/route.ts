import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { quizData: q, macros, excludedMeals } = await req.json();

    const restrictions = q.dietaryRestrictions?.length
      ? q.dietaryRestrictions.join(', ')
      : 'None';
    const excluded = excludedMeals?.length
      ? `\nDo NOT suggest any of these meals: ${excludedMeals.join(', ')}`
      : '';

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 6000,
      messages: [{
        role: 'user',
        content: `You are a sports nutritionist. Create a practical, tasty ${q.mealsPerDay}-meal daily plan.

CLIENT:
- Goal: ${q.primaryGoal}
- Daily targets: ${macros.calories} kcal | ${macros.protein}g protein | ${macros.carbs}g carbs | ${macros.fat}g fat
- Dietary restrictions: ${restrictions}${excluded}

Make meals realistic, easy to prepare, and genuinely varied. Spread the macros sensibly across the day (more carbs around training, more protein at every meal). Each meal must include 2 alternatives that are meaningfully different.

Return ONLY valid JSON with no markdown fences:
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
      "ingredients": ["80g oats", "2 whole eggs", "1 banana", "250ml whole milk"],
      "instructions": "Mix oats with milk the night before and refrigerate. In the morning scramble the eggs. Serve with sliced banana.",
      "alternatives": [
        {
          "id": "alt_1_1",
          "name": "Greek Yoghurt & Protein Smoothie",
          "calories": 590,
          "protein": 46,
          "carbs": 55,
          "fat": 16,
          "prepTime": "5 min",
          "ingredients": ["200g Greek yoghurt", "1 scoop whey protein", "1 cup berries", "1 tbsp honey"],
          "instructions": "Blend yoghurt, protein powder, berries, and honey until smooth. Drink straight away."
        },
        {
          "id": "alt_1_2",
          "name": "Smoked Salmon & Egg Scramble",
          "calories": 610,
          "protein": 48,
          "carbs": 30,
          "fat": 28,
          "prepTime": "10 min",
          "ingredients": ["3 eggs", "80g smoked salmon", "2 slices sourdough", "1 tsp butter"],
          "instructions": "Scramble eggs in butter over low heat. Serve on toasted sourdough topped with smoked salmon."
        }
      ]
    }
  ]
}`,
      }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return NextResponse.json(JSON.parse(clean));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
