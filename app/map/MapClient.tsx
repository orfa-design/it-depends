'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MAP_PATH,
  getSteps,
  CATEGORY_LABEL,
  EFFORT_LABEL,
  type Step,
  type BuildStage,
} from '@/lib/steps-v2'
import { getProgress, type StepStatus } from '@/lib/progress-v2'
import Chrome from '@/components/Chrome'
import {
  ArrowRightIcon,
  BulbIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  SparkIcon,
  TargetIcon,
} from '@/components/icons'
import '../step/styles.css'
import '../../styles/v2.css'

export default function MapClient() {
  const router = useRouter()
  const steps = useMemo<Step[]>(() => getSteps(MAP_PATH), [])
  const [statuses, setStatuses] = useState<Record<string, StepStatus>>({})
  const [selectedId, setSelectedId] = useState<string>(steps[0]?.id ?? '')
  const [task, setTask] = useState('')
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([0]))
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    const map: Record<string, StepStatus> = {}
    for (const s of steps) map[s.id] = getProgress(s.id).status
    setStatuses(map)
    // land on the first not-done step
    const firstOpen = steps.find((s) => (map[s.id] ?? 'available') !== 'done')
    setSelectedId(firstOpen?.id ?? steps[0]?.id ?? '')
  }, [steps])

  const step = steps.find((s) => s.id === selectedId)

  useEffect(() => {
    if (step) setTask(step.taskDefault)
    setOpenPhases(new Set([0]))
    setCopiedKey(null)
  }, [selectedId, step])

  const fillTask = (text: string) =>
    text.replace(/\{task\}/g, task.trim() || step?.taskDefault || '')

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(fillTask(text))
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1800)
    } catch {}
  }

  const togglePhase = (i: number) =>
    setOpenPhases((prev) => {
      const n = new Set(prev)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })

  return (
    <div className="v2-app map2-page">
      <Chrome view="map" />
      <div className="map2-shell">
        {/* ── rail ── */}
        <aside className="map2-rail">
          <div className="map2-rail-head">
            <h1 className="v2-title" style={{ fontSize: 24 }}>Твій маршрут</h1>
            <p className="v2-sub" style={{ fontSize: 13 }}>
              {steps.length} кроків · обери будь-який
            </p>
          </div>

          <div className="map2-path">
            {steps.map((s) => {
              const status = statuses[s.id] ?? 'available'
              return (
                <button
                  key={s.id}
                  className={`map2-node${s.id === selectedId ? ' selected' : ''}`}
                  data-status={status}
                  onClick={() => setSelectedId(s.id)}
                >
                  <span className="map2-circle">
                    {status === 'done' ? <CheckIcon size={13} /> : null}
                  </span>
                  <span className="map2-node-body">
                    <span className="map2-node-cat">
                      {CATEGORY_LABEL[s.category]}
                      {s.kind === 'build' && ' · збірка'}
                    </span>
                    <span className="map2-node-title">{s.title}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="map2-end">
            <span>🔒</span> Скоро тут зʼявляться нові кроки.
          </div>
        </aside>

        {/* ── detail ── */}
        {step && (
          <section className="sp-main map2-detail" key={step.id}>
            <div className="sp-core">
              <div className="sp-tags">
                <span className="sp-tag sp-tag-cat">{CATEGORY_LABEL[step.category]}</span>
                {step.kind === 'build' && (
                  <span className="sp-tag sp-tag-build">збірка · {step.stages?.length} фази</span>
                )}
                <span className="sp-effort" data-level={step.effort}>{EFFORT_LABEL[step.effort]}</span>
              </div>
              <h2 className="sp-title">{step.title}</h2>
              <p className="sp-subtitle">{step.subtitle}</p>
            </div>

            <div className="sp-pitch">
              <p className="sp-promise"><TargetIcon size={18} />{step.promise}</p>
              <div className="sp-usedwhen">
                <span className="sp-label">Практичне використання</span>
                <span className="sp-usedwhen-text">{step.usedWhen}</span>
              </div>
              {step.tool && (
                <div className="sp-pitch-meta">
                  <span className="sp-tool-chip"><SparkIcon size={13} /> {step.tool}</span>
                </div>
              )}
            </div>

            <div className="sp-guide">
              <div className="sp-guide-head">
                <span className="sp-guide-title">Гайд</span>
                {step.kind === 'build' && (
                  <span className="sp-guide-phases-count">{step.stages?.length} фази</span>
                )}
              </div>

              <div className="sp-task">
                <label className="sp-task-label"><SparkIcon size={12} /> Моя задача</label>
                <textarea
                  className="sp-task-input"
                  rows={2}
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
              </div>

              {step.kind === 'simple' ? (
                <>
                  {step.instructions && step.instructions.length > 0 && (
                    <div className="sp-instructions-block">
                      <span className="sp-label">Як це піде</span>
                      <ol className="sp-instructions">
                        {step.instructions.map((line, i) => (
                          <li key={i} className="sp-instruction">
                            <span className="sp-instruction-num">{i + 1}</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {step.promptText && (
                    <PromptBlock
                      text={step.promptText}
                      copyKey="main"
                      copiedKey={copiedKey}
                      onCopy={copy}
                    />
                  )}
                  {step.checkpoint && (
                    <div className="sp-checkpoint"><CheckIcon size={15} />{step.checkpoint}</div>
                  )}
                </>
              ) : (
                <div className="sp-phases">
                  {step.stages?.map((stage, i) => (
                    <PhaseCard
                      key={i}
                      stage={stage}
                      index={i}
                      open={openPhases.has(i)}
                      onToggle={() => togglePhase(i)}
                      copiedKey={copiedKey}
                      onCopy={copy}
                    />
                  ))}
                </div>
              )}
            </div>

            {step.processNotes && step.processNotes.length > 0 && (
              <div className="map2-notes">
                <span className="sp-side-label"><BulbIcon size={12} /> Коли підете далі</span>
                <ul className="sp-notes">
                  {step.processNotes.map((n, i) => <li key={i} className="sp-note">{n}</li>)}
                </ul>
              </div>
            )}

            <div className="map2-detail-foot">
              <button className="v2-btn v2-btn-primary" style={{ width: 'auto' }} onClick={() => router.push(`/step/${step.id}`)}>
                Відкрити крок <ArrowRightIcon size={15} />
              </button>
              <button className="v2-link-btn" onClick={() => router.push('/gallery')}>
                Усі кроки →
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function PromptBlock({
  text, copyKey, copiedKey, onCopy,
}: { text: string; copyKey: string; copiedKey: string | null; onCopy: (t: string, k: string) => void }) {
  const isCopied = copiedKey === copyKey
  const parts = text.split(/(\{task\})/g)
  return (
    <div className="sp-prompt">
      <div className="sp-prompt-bar">
        <span className="sp-prompt-bar-label"><SparkIcon size={13} /> Промпт</span>
        <button className={`sp-copy${isCopied ? ' copied' : ''}`} onClick={() => onCopy(text, copyKey)}>
          {isCopied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
          {isCopied ? 'Скопійовано' : 'Копіювати'}
        </button>
      </div>
      <pre className="sp-prompt-body">
        {parts.map((p, i) =>
          p === '{task}' ? <span key={i} className="sp-prompt-slot">{'{твоя задача}'}</span> : <span key={i}>{p}</span>
        )}
      </pre>
    </div>
  )
}

function PhaseCard({
  stage, index, open, onToggle, copiedKey, onCopy,
}: {
  stage: BuildStage; index: number; open: boolean; onToggle: () => void
  copiedKey: string | null; onCopy: (t: string, k: string) => void
}) {
  return (
    <div className="sp-phase" data-open={open ? 'true' : undefined}>
      <button className="sp-phase-head" onClick={onToggle} aria-expanded={open}>
        <span className="sp-phase-num">{index + 1}</span>
        <span className="sp-phase-info">
          <span className="sp-phase-title">{stage.title}</span>
          <span className="sp-phase-tool">{stage.tool}</span>
        </span>
        <ChevronDownIcon size={16} className={`sp-phase-chev${open ? ' open' : ''}`} />
      </button>
      {open && (
        <div className="sp-phase-body">
          <p className="sp-phase-action">{stage.action}</p>
          <PromptBlock text={stage.prompt} copyKey={`phase-${index}`} copiedKey={copiedKey} onCopy={onCopy} />
          {stage.checkpoint && (
            <div className="sp-checkpoint"><CheckIcon size={15} />{stage.checkpoint}</div>
          )}
        </div>
      )}
    </div>
  )
}
