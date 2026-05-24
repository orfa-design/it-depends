import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export interface SurveyResponse {
  id: string
  submittedAt: string
  triggers: string[]
  triggersOther: string
  paralysis: string
  paralysisOther: string
  workIdea: string
  oneStep: string
  oneStepOther: string
}

export async function POST(request: Request) {
  const body = await request.json()
  const response: SurveyResponse = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    triggers: body.triggers ?? [],
    triggersOther: body.triggersOther ?? '',
    paralysis: body.paralysis ?? '',
    paralysisOther: body.paralysisOther ?? '',
    workIdea: body.workIdea ?? '',
    oneStep: body.oneStep ?? '',
    oneStepOther: body.oneStepOther ?? '',
  }
  const existing = (await kv.get<SurveyResponse[]>('survey-responses')) ?? []
  await kv.set('survey-responses', [...existing, response])
  return NextResponse.json({ ok: true })
}
