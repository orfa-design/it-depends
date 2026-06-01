import { NextRequest, NextResponse } from 'next/server';
import { getUserProgress, saveUserProgress } from '@/lib/kv';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Missing username parameter' }, { status: 400 });
    }

    const progress = await getUserProgress(username);
    return NextResponse.json(progress);
  } catch (err) {
    console.error('API Error (GET user progress):', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, progress } = body || {};

    if (!username || !progress) {
      return NextResponse.json({ error: 'Missing username or progress payload' }, { status: 400 });
    }

    const success = await saveUserProgress(username, progress);
    if (success) {
      return NextResponse.json({ message: 'User progress saved successfully' });
    }
    return NextResponse.json({ error: 'Failed to write progress to database' }, { status: 500 });
  } catch (err) {
    console.error('API Error (POST user progress):', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
