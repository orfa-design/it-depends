'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  type Step,
  type BuildStage,
  CATEGORY_LABEL,
  EFFORT_LABEL,
  EFFORT_NOTE,
} from '@/lib/steps-v2'
import {
  getProgress,
  setProgress,
  countInProgress,
  type StepStatus,
} from '@/lib/progress-v2'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BulbIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  CopyIcon,
  EyeOffIcon,
  MoonIcon,
  PencilIcon,
  SparkIcon,
  SunIcon,
  TargetIcon,
} from '@/components/icons'
import '../styles.css'

type RelatedLite = { id: string; title: string; subtitle: string; category: string }

export default function StepClient({
  step,
  related,
}: {
  step: Step
  related: RelatedLite[]
}) {
  const router = useRouter()

  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [status, setStatus] = useState<StepStatus>('available')
  const [task, setTask] = useState(step.taskDefault)
  const [resultUrl, setResultUrl] = useState('')
  const [notInterested, setNotInterested] = useState(false)
  const [pitchOpen, setPitchOpen] = useState(true)
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([0]))
  const [donePhases, setDonePhases] = useState<Set<number>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [saveOpen, setSaveOpen] = useState(false)
  const [activeCount, setActiveCount] = useState(0)
  const [editNote, setEditNote] = useState(false)

  // theme
  useEffect(() => {
    try {
      const saved = localStorage.getItem('itdepends_theme')
      if (saved === 'light') setTheme('light')
    } catch {}
  }, [])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('itdepends_theme', theme) } catch {}
    return () => document.documentElement.removeAttribute('data-theme')
  }, [theme])

  // hydrate progress
  useEffect(() => {
    const p = getProgress(step.id)
    setStatus(p.status)
    if (p.task) setTask(p.task)
    if (p.resultUrl) setResultUrl(p.resultUrl)
    setNotInterested(Boolean(p.notInterested))
    // adaptive pitch: expanded only when available
    setPitchOpen(p.status === 'available')
    setActiveCount(countInProgress())
  }, [step.id])

  const persist = useCallback(
    (patch: Parameters<typeof setProgress>[1]) => {
      setProgress(step.id, patch)
      setActiveCount(countInProgress())
    },
    [step.id]
  )

  // ── actions ──────────────────────────────────────────────────────────────
  const handleTake = () => {
    setStatus('in_progress')
    setPitchOpen(false)
    persist({ status: 'in_progress', task })
  }

  const handleTaskChange = (v: string) => {
    setTask(v)
    if (status !== 'done') persist({ task: v })
  }

  const handleSave = () => {
    persist({ status: 'done', task, resultUrl: resultUrl.trim() || undefined })
    setSaveOpen(false)
    router.push(`/step/${step.id}/done`)
  }

  const toggleNotInterested = () => {
    const next = !notInterested
    setNotInterested(next)
    persist({ notInterested: next })
  }

  const togglePhase = (i: number) =>
    setOpenPhases((prev) => {
      const n = new Set(prev)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })

  const toggleDonePhase = (i: number) =>
    setDonePhases((prev) => {
      const n = new Set(prev)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })

  const fillTask = (text: string) =>
    text.replace(/\{task\}/g, task.trim() || step.taskDefault)

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(fillTask(text))
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1800)
    } catch {}
  }

  const canEditTask = status !== 'done'

  return (
    <div className="sp-app">
      <header className="sp-chrome">
        <button className="sp-brand" onClick={() => router.push('/gallery')}>
          <span className="sp-brand-dot" />
          It Depends
        </button>
        <div className="sp-chrome-right">
          <button className="sp-chrome-link" onClick={() => router.push('/progress')}>
            Активні задачі
            {activeCount > 0 && <span className="sp-chrome-badge">{activeCount}</span>}
          </button>
          <button
            className="sp-theme-toggle"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label="theme"
          >
            {theme === 'dark' ? <SunIcon size={15} /> : <MoonIcon size={15} />}
          </button>
        </div>
      </header>

      <div className="sp-shell">
        {/* ── main ── */}
        <main className="sp-main">
          <button className="sp-back" onClick={() => router.back()}>
            <ArrowLeftIcon size={15} /> Назад
          </button>

          {/* core */}
          <div className="sp-core">
            <div className="sp-tags">
              <span className="sp-tag sp-tag-cat">{CATEGORY_LABEL[step.category]}</span>
              {step.kind === 'build' && (
                <span className="sp-tag sp-tag-build">
                  збірка · {step.stages?.length} фази
                </span>
              )}
              <span className="sp-effort" data-level={step.effort} title={EFFORT_NOTE[step.effort]}>
                {EFFORT_LABEL[step.effort]}
              </span>
            </div>
            <h1 className="sp-title">{step.title}</h1>
            <p className="sp-subtitle">{step.subtitle}</p>
          </div>

          {/* pitch — adaptive */}
          {pitchOpen ? (
            <section className="sp-pitch">
              <p className="sp-promise">
                <TargetIcon size={18} />
                {step.promise}
              </p>
              <div className="sp-usedwhen">
                <span className="sp-label">Практичне використання</span>
                <span className="sp-usedwhen-text">{step.usedWhen}</span>
              </div>
              {(step.tool || step.authorExample) && (
                <div className="sp-pitch-meta">
                  {step.tool && (
                    <span className="sp-tool-chip">
                      <SparkIcon size={13} /> {step.tool}
                    </span>
                  )}
                  {step.authorExample && (
                    <a
                      className="sp-author"
                      href={step.authorExample.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {step.authorExample.label ?? 'Приклад автора'} ↗
                    </a>
                  )}
                </div>
              )}
            </section>
          ) : (
            <button
              className="sp-pitch-collapsed"
              data-open="false"
              onClick={() => setPitchOpen(true)}
            >
              <ChevronDownIcon size={14} /> Навіщо це
            </button>
          )}

          {/* guide */}
          <section className="sp-guide">
            <div className="sp-guide-head">
              <span className="sp-guide-title">Гайд</span>
              {step.kind === 'build' && (
                <span className="sp-guide-phases-count">{step.stages?.length} фази</span>
              )}
            </div>

            <div className="sp-task">
              <label className="sp-task-label" htmlFor="sp-task">
                <SparkIcon size={12} /> Моя задача
              </label>
              <textarea
                id="sp-task"
                className="sp-task-input"
                rows={2}
                value={task}
                disabled={!canEditTask}
                onChange={(e) => handleTaskChange(e.target.value)}
              />
              {canEditTask && (
                <span className="sp-task-hint">
                  Підставляється замість {'{task}'} у промпт при копіюванні.
                </span>
              )}
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
                    filled={fillTask(step.promptText)}
                    copyKey="main"
                    copiedKey={copiedKey}
                    onCopy={copy}
                  />
                )}
                {step.checkpoint && (
                  <div className="sp-checkpoint">
                    <CheckIcon size={15} />
                    {step.checkpoint}
                  </div>
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
                    done={donePhases.has(i)}
                    onToggle={() => togglePhase(i)}
                    onFinish={() => toggleDonePhase(i)}
                    filled={fillTask(stage.prompt)}
                    copiedKey={copiedKey}
                    onCopy={copy}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        {/* ── sidebar ── */}
        <aside className="sp-side">
          <div className="sp-window">
          <div className="sp-actions">
            {status === 'done' ? (
              <>
                <span className="sp-done-badge">
                  <CheckIcon size={15} /> Виконано
                </span>
                {resultUrl && (
                  <a className="sp-result-link" href={resultUrl} target="_blank" rel="noreferrer">
                    {resultUrl} ↗
                  </a>
                )}
                <button className="sp-btn sp-btn-secondary" onClick={handleTake}>
                  Взяти в роботу знову
                </button>
              </>
            ) : status === 'in_progress' ? (
              <button className="sp-btn sp-btn-primary" onClick={() => setSaveOpen(true)}>
                Я зробила — далі <ArrowRightIcon size={15} />
              </button>
            ) : (
              <>
                <button className="sp-btn sp-btn-primary" onClick={handleTake}>
                  Взяти в роботу
                </button>
                <button className="sp-btn sp-btn-secondary" onClick={() => setSaveOpen(true)}>
                  Я зробила — далі
                </button>
              </>
            )}
          </div>

          <div className="sp-side-utils">
            <button
              className={`sp-util${notInterested ? ' active' : ''}`}
              onClick={toggleNotInterested}
            >
              <EyeOffIcon size={14} />
              {notInterested ? 'Повернути в маршрут' : 'Не цікаво'}
            </button>
            <button className="sp-util" onClick={() => setEditNote((v) => !v)} aria-label="edit">
              <PencilIcon size={14} />
            </button>
          </div>
          {editNote && (
            <span className="sp-task-hint">Редагування кроку зʼявиться в CMS-фазі.</span>
          )}
          </div>

          {/* phases overview (build) */}
          {step.kind === 'build' && step.stages && step.stages.length > 0 && (
            <div className="sp-window">
              <span className="sp-side-label">{step.stages.length} фази</span>
              <ul className="sp-overview">
                {step.stages.map((s, i) => (
                  <li key={i} className="sp-overview-item">
                    <span className="sp-overview-num">{i + 1}</span>
                    <span className="sp-overview-title">{s.title}</span>
                    <span className="sp-overview-tool">{s.tool}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div className="sp-window">
              <span className="sp-side-label">Також спробуй</span>
              <div className="sp-related">
                {related.map((r) => (
                  <button
                    key={r.id}
                    className="sp-related-item"
                    onClick={() => router.push(`/step/${r.id}`)}
                  >
                    <span>
                      <span className="sp-related-title">{r.title}</span>
                      <span className="sp-related-sub">{CATEGORY_LABEL[r.category as keyof typeof CATEGORY_LABEL] ?? r.category}</span>
                    </span>
                    <ArrowRightIcon size={15} className="sp-related-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step.processNotes && step.processNotes.length > 0 && (
            <div className="sp-window">
              <span className="sp-side-label">
                <BulbIcon size={12} /> Коли підете далі
              </span>
              <ul className="sp-notes">
                {step.processNotes.map((n, i) => (
                  <li key={i} className="sp-note">{n}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* save modal */}
      {saveOpen && (
        <div className="sp-modal-scrim" onClick={() => setSaveOpen(false)}>
          <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-head">
              <span className="sp-modal-title">Готово!</span>
              <button className="sp-modal-close" onClick={() => setSaveOpen(false)}>
                <CloseIcon size={16} />
              </button>
            </div>
            <div className="sp-modal-field">
              <label className="sp-task-label" htmlFor="sp-url">
                URL результату (опційно)
              </label>
              <input
                id="sp-url"
                className="sp-modal-input"
                placeholder="https://..."
                value={resultUrl}
                onChange={(e) => setResultUrl(e.target.value)}
              />
            </div>
            <div className="sp-modal-actions">
              <button className="sp-btn sp-btn-secondary" onClick={() => setSaveOpen(false)}>
                Скасувати
              </button>
              <button className="sp-btn sp-btn-primary" onClick={handleSave}>
                Зберегти <CheckIcon size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── sub-components ───────────────────────────────────────────────────────────

function PromptBlock({
  text,
  filled,
  copyKey,
  copiedKey,
  onCopy,
}: {
  text: string
  filled: string
  copyKey: string
  copiedKey: string | null
  onCopy: (text: string, key: string) => void
}) {
  const isCopied = copiedKey === copyKey
  // render with {task} highlighted (use raw text so the slot is visible)
  const parts = text.split(/(\{task\})/g)
  return (
    <div className="sp-prompt">
      <div className="sp-prompt-bar">
        <span className="sp-prompt-bar-label">
          <SparkIcon size={13} /> Промпт
        </span>
        <button
          className={`sp-copy${isCopied ? ' copied' : ''}`}
          onClick={() => onCopy(text, copyKey)}
        >
          {isCopied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
          {isCopied ? 'Скопійовано' : 'Копіювати'}
        </button>
      </div>
      <pre className="sp-prompt-body">
        {parts.map((p, i) =>
          p === '{task}' ? (
            <span key={i} className="sp-prompt-slot">
              {filled === text ? p : '{твоя задача}'}
            </span>
          ) : (
            <span key={i}>{p}</span>
          )
        )}
      </pre>
    </div>
  )
}

function PhaseCard({
  stage,
  index,
  open,
  done,
  onToggle,
  onFinish,
  filled,
  copiedKey,
  onCopy,
}: {
  stage: BuildStage
  index: number
  open: boolean
  done: boolean
  onToggle: () => void
  onFinish: () => void
  filled: string
  copiedKey: string | null
  onCopy: (text: string, key: string) => void
}) {
  return (
    <div className="sp-phase" data-open={open ? 'true' : undefined} data-done={done ? 'true' : undefined}>
      <button className="sp-phase-head" onClick={onToggle} aria-expanded={open}>
        <span className="sp-phase-num">{done ? <CheckIcon size={13} /> : index + 1}</span>
        <span className="sp-phase-info">
          <span className="sp-phase-title">{stage.title}</span>
          <span className="sp-phase-tool">{stage.tool}</span>
        </span>
        <ChevronDownIcon size={16} className={`sp-phase-chev${open ? ' open' : ''}`} />
      </button>
      {open && (
        <div className="sp-phase-body">
          <p className="sp-phase-action">{stage.action}</p>
          <PromptBlock
            text={stage.prompt}
            filled={filled}
            copyKey={`phase-${index}`}
            copiedKey={copiedKey}
            onCopy={onCopy}
          />
          {stage.checkpoint && (
            <div className="sp-checkpoint">
              <CheckIcon size={15} />
              {stage.checkpoint}
            </div>
          )}
          <button className={`sp-phase-finish${done ? ' done' : ''}`} onClick={onFinish}>
            {done ? <CheckIcon size={13} /> : null}
            {done ? 'Фазу закінчено' : 'Закінчити фазу'}
          </button>
        </div>
      )}
    </div>
  )
}
