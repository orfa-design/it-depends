import { NextRequest, NextResponse } from 'next/server';
import { getSteps, saveSteps } from '@/lib/kv';

const ALLOWED_ADMINS = ['mliudmyla', 'mvladyslav'];

function getAdminSession(req: NextRequest): string | null {
  const session = req.headers.get('x-user-session');
  if (session) {
    const norm = session.toLowerCase().trim();
    if (ALLOWED_ADMINS.includes(norm)) {
      return norm;
    }
  }
  return null;
}

export async function GET() {
  try {
    const steps = await getSteps();
    return NextResponse.json(steps);
  } catch (err) {
    console.error('API Error (GET steps):', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminSession(req);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden: CMS edits require administrative privileges.' }, { status: 403 });
    }

    const body = await req.json();
    if (!body || !Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid payload: steps must be a valid JSON array.' }, { status: 400 });
    }

    const success = await saveSteps(body);
    if (success) {
      return NextResponse.json({ message: 'Steps updated successfully' });
    }
    return NextResponse.json({ error: 'Failed to write data to database' }, { status: 500 });
  } catch (err) {
    console.error('API Error (POST steps):', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
