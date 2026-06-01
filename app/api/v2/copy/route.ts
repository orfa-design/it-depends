import { NextRequest, NextResponse } from 'next/server';
import { getCopy, saveCopy } from '@/lib/kv';

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
    const copy = await getCopy();
    return NextResponse.json(copy);
  } catch (err) {
    console.error('API Error (GET copy):', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminSession(req);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden: CMS copy edits require administrative privileges.' }, { status: 403 });
    }

    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload: copy must be a valid JSON object.' }, { status: 400 });
    }

    const success = await saveCopy(body);
    if (success) {
      return NextResponse.json({ message: 'Copy updated successfully' });
    }
    return NextResponse.json({ error: 'Failed to write data to database' }, { status: 500 });
  } catch (err) {
    console.error('API Error (POST copy):', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
