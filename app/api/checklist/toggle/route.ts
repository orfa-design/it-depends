import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { id, checked } = await request.json()
  const state = (await kv.get<Record<string, boolean>>('checklist')) ?? {}
  state[id] = checked
  await kv.set('checklist', state)
  return NextResponse.json({ ok: true })
}
