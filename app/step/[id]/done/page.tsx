import { notFound } from 'next/navigation'
import { getStep, getSteps } from '@/lib/steps-v2'
import DoneClient from './DoneClient'

export default async function StepDonePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const step = getStep(id)
  if (!step) notFound()

  const related = getSteps(step.relatedSteps)
  return <DoneClient step={step} related={related} />
}
