import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const q = await req.json();

    const h = q.unit === 'metric' ? `${q.heightCm} cm` : `${q.heightFt}ft ${q.heightIn}in`;
    const w = q.unit === 'metric' ? `${q.weightKg} kg` : `${q.weightLbs} lbs`;

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `You are an elite personal trainer and strength coach. Create a highly personalised, optimal training program.

CLIENT PROFILE:
- Age: ${q.age}  Gender: ${q.gender}
- Height: ${h}  Weight: ${w}
- Training experience: ${q.experience}
- Primary goal: ${q.primaryGoal}
- Specific goal: ${q.secondaryGoal}
- Days per week: ${q.daysPerWeek}
- Session length: ${q.sessionLength} minutes
- Notes / constraints: ${q.extraNotes || 'None'}

Design the most optimal split for their goal and frequency. Select exercises that directly serve the goal (e.g. combat sports = rotational power, plyometrics, grip; powerlifting = main lifts with accessories; aesthetic = hypertrophy rep ranges). Fit every workout into the session length.

Return ONLY valid JSON with no markdown fences:
{
  "split": "Split name",
  "summary": "2-3 sentences on why this plan suits their goal",
  "progressionScheme": "How to progress week to week",
  "weeklyNotes": "Key tip for the week",
  "days": [
    {
      "day": "Day 1",
      "focus": "e.g. Push — Chest, Shoulders, Triceps",
      "warmup": ["5 min bike", "Arm circles x 10"],
      "exercises": [
        {
          "name": "Barbell Bench Press",
          "sets": 4,
          "reps": "4-6",
          "rest": "3 min",
          "muscleGroup": "Chest",
          "notes": "Keep shoulder blades pinched together throughout the press"
        }
      ],
      "cooldown": ["Chest doorway stretch 30s each side"]
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
