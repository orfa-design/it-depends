'use client'

import { useRouter } from 'next/navigation'
import { type Step, CATEGORY_LABEL, EFFORT_LABEL } from '@/lib/steps-v2'
import { type StepStatus } from '@/lib/progress-v2'
import { ArrowRightIcon, CheckIcon } from './icons'

const STATUS_LABEL: Record<StepStatus, string> = {
  done: 'Виконано',
  in_progress: 'В роботі',
  available: '',
}

export default function StepCard({
  step,
  status,
  recommended,
}: {
  step: Step
  status?: StepStatus
  recommended?: boolean
}) {
  const router = useRouter()
  return (
    <button
      className={`v2-card${recommended ? ' v2-reco-card' : ''}`}
      onClick={() => router.push(`/step/${step.id}`)}
    >
      <div className="v2-card-tags">
        <span className="v2-chip v2-chip-cat">{CATEGORY_LABEL[step.category]}</span>
        {step.kind === 'build' && (
          <span className="v2-chip v2-chip-build">збірка · {step.stages?.length}</span>
        )}
        <span className="v2-chip v2-chip-effort" data-level={step.effort}>
          {EFFORT_LABEL[step.effort]}
        </span>
      </div>
      <span className="v2-card-title">{step.title}</span>
      <span className="v2-card-sub">{step.subtitle}</span>
      <div className="v2-card-foot">
        {status && status !== 'available' ? (
          <span className={`v2-card-status ${status}`}>
            {status === 'done' && <CheckIcon size={13} />}
            {STATUS_LABEL[status]}
          </span>
        ) : (
          <span className="v2-card-status available">Відкрити</span>
        )}
        <ArrowRightIcon size={15} className="v2-card-arrow" />
      </div>
    </button>
  )
}
