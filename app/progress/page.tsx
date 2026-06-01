'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { STEPS, type Step } from '@/lib/steps-v2'
import { getProgress } from '@/lib/progress-v2'
import Chrome from '@/components/Chrome'
import StepCard from '@/components/StepCard'
import '../../styles/v2.css'

export default function ProgressPage() {
  const router = useRouter()
  const [items, setItems] = useState<Step[]>([])

  useEffect(() => {
    setItems(STEPS.filter((s) => getProgress(s.id).status === 'in_progress'))
  }, [])

  return (
    <div className="v2-app">
      <Chrome />
      <div className="v2-shell">
        <div className="v2-head">
          <h1 className="v2-title">Активні задачі</h1>
          <p className="v2-sub">Кроки які ти взяла в роботу але ще не завершила.</p>
        </div>

        {items.length === 0 ? (
          <div className="v2-empty">
            <p className="v2-empty-text">Ти ще не взяла жодного кроку в роботу.</p>
            <button className="v2-btn v2-btn-ghost" onClick={() => router.push('/gallery')}>
              До галереї →
            </button>
          </div>
        ) : (
          <div className="v2-grid">
            {items.map((s) => (
              <StepCard key={s.id} step={s} status="in_progress" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
