import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'
import type { WorkflowState } from '../../../workflow/seed'

export async function POST(request: Request) {
  try {
    const body: WorkflowState = await request.json()
    if (!body || body.version !== 4) {
      return NextResponse.json({ ok: false, error: 'invalid version' }, { status: 400 })
    }
    const lastSaved = new Date().toISOString()
    await kv.set('workflow:vlad', { ...body, lastSaved })
    return NextResponse.json({ ok: true, lastSaved })
  } catch (err) {
    console.error('[workflow/update]', err)
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 })
  }
}
