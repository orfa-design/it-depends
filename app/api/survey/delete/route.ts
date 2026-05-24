import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'
import type { SurveyResponse } from '../submit/route'

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const existing = (await kv.get<SurveyResponse[]>('survey-responses')) ?? []
  await kv.set('survey-responses', existing.filter(r => r.id !== id))
  return NextResponse.json({ ok: true })
}
