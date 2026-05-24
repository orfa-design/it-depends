import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function DELETE() {
  await kv.set('survey-responses', [])
  return NextResponse.json({ ok: true })
}
