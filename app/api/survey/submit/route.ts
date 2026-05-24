import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export interface SurveyResponse {
  id: string
  submittedAt: string
  triggers: string[]
  paralysis: string
  workIdea: string
  oneStep: string
}

export async function POST(request: Request) {
  const body = await request.json()
  const response: SurveyResponse = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    triggers: body.triggers ?? [],
    paralysis: body.paralysis ?? '',
    workIdea: body.workIdea ?? '',
    oneStep: body.oneStep ?? '',
  }
  const existing = (await kv.get<SurveyResponse[]>('survey-responses')) ?? []
  await kv.set('survey-responses', [...existing, response])
  return NextResponse.json({ ok: true })
}
