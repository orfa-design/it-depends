'use client'

import { useMemo, useState } from 'react'
import {
  STEPS,
  RECOMMENDED,
  getSteps,
  CATEGORY_LABEL,
  EFFORT_LABEL,
  EFFORT_ORDER,
  type StepCategory,
  type StepEffort,
  type StepKind,
} from '@/lib/steps-v2'
import Chrome from '@/components/Chrome'
import StepCard from '@/components/StepCard'
import { SparkIcon } from '@/components/icons'
import '../../styles/v2.css'

const EFFORTS: StepEffort[] = ['quick', 'iterative', 'project']
const CATEGORIES: StepCategory[] = ['research', 'prototyping', 'code', 'planning', 'workflow']
const KINDS: StepKind[] = ['simple', 'build']
const KIND_LABEL: Record<StepKind, string> = { simple: 'простий', build: 'збірка' }

export default function GalleryPage() {
  const [effort, setEffort] = useState<StepEffort | null>(null)
  const [category, setCategory] = useState<StepCategory | null>(null)
  const [kind, setKind] = useState<StepKind | null>(null)

  const recommended = useMemo(() => getSteps(RECOMMENDED), [])

  const filtered = useMemo(
    () =>
      STEPS.filter(
        (s) =>
          (!effort || s.effort === effort) &&
          (!category || s.category === category) &&
          (!kind || s.kind === kind)
      ).sort((a, b) => EFFORT_ORDER[a.effort] - EFFORT_ORDER[b.effort]),
    [effort, category, kind]
  )

  return (
    <div className="v2-app">
      <Chrome view="gallery" />
      <div className="v2-shell">
        <div className="v2-head">
          <h1 className="v2-title">Всі кроки</h1>
          <p className="v2-sub">Обери що спробувати — жорсткого порядку немає.</p>
        </div>

        {recommended.length > 0 && (
          <section className="v2-recos">
            <div className="v2-recos-label">
              <SparkIcon size={13} /> Для тебе
            </div>
            <div className="v2-recos-row">
              {recommended.map((s) => (
                <StepCard key={s.id} step={s} recommended />
              ))}
            </div>
          </section>
        )}

        <div className="v2-filters">
          <div className="v2-filter-group">
            <span className="v2-filter-label">Зусилля</span>
            <div className="v2-filter-chips">
              {EFFORTS.map((e) => (
                <button
                  key={e}
                  className={`v2-filter-chip${effort === e ? ' active' : ''}`}
                  onClick={() => setEffort(effort === e ? null : e)}
                >
                  {EFFORT_LABEL[e]}
                </button>
              ))}
            </div>
          </div>
          <div className="v2-filter-group">
            <span className="v2-filter-label">Категорія</span>
            <div className="v2-filter-chips">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`v2-filter-chip${category === c ? ' active' : ''}`}
                  onClick={() => setCategory(category === c ? null : c)}
                >
                  {CATEGORY_LABEL[c]}
                </button>
              ))}
            </div>
          </div>
          <div className="v2-filter-group">
            <span className="v2-filter-label">Тип</span>
            <div className="v2-filter-chips">
              {KINDS.map((k) => (
                <button
                  key={k}
                  className={`v2-filter-chip${kind === k ? ' active' : ''}`}
                  onClick={() => setKind(kind === k ? null : k)}
                >
                  {KIND_LABEL[k]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="v2-grid">
          {filtered.map((s) => (
            <StepCard key={s.id} step={s} />
          ))}
        </div>
      </div>
    </div>
  )
}
