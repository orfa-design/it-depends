import { notFound } from 'next/navigation'
import { getStep, getSteps } from '@/lib/steps-v2'
import StepClient from './StepClient'

export default async function StepPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const step = getStep(id)
  if (!step) notFound()

  const related = getSteps(step.relatedSteps).map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    category: s.category,
  }))

  return <StepClient step={step} related={related} />
}
