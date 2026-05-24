import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { id, assignee } = await request.json()
  const state = (await kv.get<Record<string, string>>('checklist-assignees')) ?? {}
  if (assignee === null) {
    delete state[id]
  } else {
    state[id] = assignee
  }
  await kv.set('checklist-assignees', state)
  return NextResponse.json({ ok: true })
}
