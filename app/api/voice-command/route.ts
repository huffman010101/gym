import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { command, currentPlan, quizData } = await req.json();

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are a friendly, knowledgeable fitness coach assistant. The user has just spoken this command:

"${command}"

Current workout plan:
${JSON.stringify(currentPlan, null, 2)}

User profile: goal=${quizData?.primaryGoal}, experience=${quizData?.experience}, days/week=${quizData?.daysPerWeek}

Understand what the user wants. Common requests:
- Swap an exercise ("replace bench press with dumbbell press")
- Change rep/set scheme ("make it higher reps for hypertrophy")
- Modify training split ("switch to upper lower")
- Add/remove an exercise
- Ask for advice ("should I train fasted?")

Return ONLY valid JSON with no markdown fences:
{
  "action": "modify_exercise | change_split | general_advice | unclear",
  "message": "1-2 sentence friendly coach response explaining what changed or answering the question",
  "updatedPlan": null
}

If you modified the plan, include the full updated plan object as updatedPlan. Otherwise null.`,
      }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return NextResponse.json(JSON.parse(clean));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
