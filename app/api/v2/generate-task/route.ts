import { NextRequest, NextResponse } from 'next/server';
import { getSteps } from '@/lib/kv';
import { genTask } from '@/lib/data-v2';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { stepId, currentTask } = body || {};

    if (!stepId) {
      return NextResponse.json({ error: 'Missing stepId parameter' }, { status: 400 });
    }

    const stepsList = await getSteps();
    const step = stepsList.find(s => s.id === stepId);

    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    // Try using Gemini API if a key is available in env
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (apiKey) {
      try {
        const promptText = `Ти — досвідчений дизайн-лідер в DataArt. Згенеруй ОДИН короткий, реалістичний приклад робочої задачі для DataArt дизайнера, який виконує наступну роботу:
Назва: "${step.title}"
Категорія: "${step.cat}"
Практичне використання: "${step.usedWhen}"
Обіцянка результату: "${step.promise}"
Дефолтний приклад: "${step.defaultTask}"

Правила для генерації:
1. Текст має бути сформульований строго від першої особи (наприклад: "Хочу...", "Треба...", "Маю...").
2. Текст має бути реалістичним, коротким (1-2 речення) і говорити мовою досвідченого дизайнера.
3. Не пиши жодних вступних слів, привітань, лапок або коментарів. Дай ТІЛЬКИ чистий приклад задачі.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: promptText }]
              }]
            })
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          let generated = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generated) {
            generated = generated.trim().replace(/^["'«“]/, '').replace(/["'»”]$/, '').trim();
            return NextResponse.json({ task: generated });
          }
        }
      } catch (err) {
        console.error('Failed to query Gemini API in task generation:', err);
      }
    }

    // Graceful fallback to randomized templates
    const fallbackTask = genTask(step, currentTask);
    return NextResponse.json({ task: fallbackTask });
  } catch (err) {
    console.error('API Error (POST generate-task):', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
