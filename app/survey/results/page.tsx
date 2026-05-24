import { kv } from '@vercel/kv'
import type { SurveyResponse } from '../../api/survey/submit/route'
import { ResultsClient } from './ResultsClient'

export default async function SurveyResultsPage() {
  const responses = (await kv.get<SurveyResponse[]>('survey-responses')) ?? []
  return <ResultsClient initialResponses={responses} />
}
