'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  STORIES, REACTIONS, STEPS, STEPS_EXTRA, CUR_IDX, getStatus, isDone,
  type Story, type StepExtra, type Tool,
} from '@/lib/data'
import { saveCalibration } from '@/lib/storage'
import './styles.css'

type Phase = 'intro' | 'story' | 'analysis' | 'map' | 'complete'
type MapStyle = 'vertical' | 'typographic'

// ── Helpers ─────────────────────────────────────────────────────────────────

function parseTime(s: string) {
  const m = String(s).match(/^(\d+)\s*(.+)$/)
  if (m) return { num: m[1], unit: m[2], word: undefined }
  return { num: undefined, unit: undefined, word: s }
}

// ── Chrome ──────────────────────────────────────────────────────────────────

function Chrome({
  phase, storyIdx, onLogoClick, onMapClick,
}: {
  phase: Phase
  storyIdx: number
  onLogoClick: () => void
  onMapClick: () => void
}) {
  return (
    <header className="chrome">
      <div className="wordmark">
        <span className="dot" />
        <button className="wordmark-btn" onClick={onLogoClick}>It Depends</button>
        <button className="wordmark-btn" onClick={onMapClick}>· ai skills map</button>
      </div>
      {phase === 'story' && (
        <div className="counter">{storyIdx + 1} / {STORIES.length}</div>
      )}
    </header>
  )
}

// ── IntroScreen ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (/^(INPUT|TEXTAREA)$/.test(t.tagName)) return
      if (e.key === ' ') { e.preventDefault(); onStart(); return }
      if (e.key === 'Enter') onStart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onStart])

  return (
    <div className="intro-stage">
      <div className="intro-bg" />
      <div className="intro-inner">
        <div className="intro-eyebrow anim-in delay-0">
          <span className="dot" />4 кейси · ≈2 хвилини
        </div>
        <h1 className="intro-display anim-in delay-1">
          Подивимось,<br />
          <span className="intro-dim">де ти зараз.</span>
        </h1>
        <p className="intro-body anim-in delay-2">
          Чотири реальні ситуації з практики дизайнерок.<br />
          Реагуй чесно — і отримаєш свою карту.
        </p>
        <div className="intro-foot anim-in delay-3">
          <button className="btn btn-primary intro-cta" onClick={onStart}>
            почати →
          </button>
          <span className="intro-hint">або Enter</span>
        </div>
      </div>
    </div>
  )
}

// ── StoryScreen ─────────────────────────────────────────────────────────────

function StoryScreen({ idx, onPick }: { idx: number; onPick: (v: string) => void }) {
  const story = STORIES[idx]
  const time = parseTime(story.time)
  const [picking, setPicking] = useState<string | null>(null)

  function handlePick(v: string) {
    if (picking) return
    setPicking(v)
    setTimeout(() => { setPicking(null); onPick(v) }, 150)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (/^(INPUT|TEXTAREA)$/.test(t.tagName)) return
      const i = ['1', '2', '3'].indexOf(e.key)
      if (i >= 0) handlePick(REACTIONS[i].v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onPick])

  return (
    <div className="story-stage" data-i={idx} key={idx}>
      <div className="story-frame">
        <div className="story-top anim-in delay-0">
          <div className="eyebrow">що інші роблять із claude</div>
        </div>

        <div className="story-main">
          <div className="story-lhs">
            <div className="anim-in delay-1">
              <h1 className="story-name-hero">{story.name}</h1>
              <div className="story-role">{story.role}</div>
            </div>
            <div className="story-moments anim-in delay-2">
              <div className="moment">
                <div className="moment-tag">було</div>
                <div className="moment-text">{story.pain}</div>
              </div>
              <div className="moment moment-hero">
                <div className="moment-tag">що зробила</div>
                <div className="moment-text">{story.move}</div>
              </div>
              <div className="moment">
                <div className="moment-tag">стало</div>
                <div className="moment-text">{story.out}</div>
              </div>
            </div>
          </div>

          <div className="story-stat anim-in delay-0">
            {time.num != null ? (
              <>
                <div className="stat-num">{time.num}</div>
                <div className="stat-unit">{time.unit}</div>
              </>
            ) : (
              <div className="stat-word">{time.word}</div>
            )}
            <div className="stat-foot">фактичний час</div>
          </div>
        </div>

        <div className="story-bottom anim-in delay-3">
          <div className="react-label">
            <span>як це для тебе?</span>
            <span className="kbd-hint">натисни 1 · 2 · 3</span>
          </div>
          <div className="react-row">
            {REACTIONS.map((r, i) => (
              <button key={r.v} className={`react-card${picking === r.v ? ' picking' : ''}`} onClick={() => handlePick(r.v)}>
                <span className="react-num">0{i + 1}</span>
                <span className="react-text">{r.label}</span>
                <span className="react-ic">{r.ic} →</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── AnalysisScreen ───────────────────────────────────────────────────────────

function AnalysisScreen({ reactions, onDone }: { reactions: string[]; onDone: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 900)
    const t2 = setTimeout(() => setStep(2), 2200)
    return () => [t1, t2].forEach(clearTimeout)
  }, [onDone])

  const labels: Record<string, string> = { wow: 'нова територія', heard: 'на радарі', have: 'у мене є' }
  const statusText = ['збираю відповіді…', 'будую карту…', 'карта готова']

  return (
    <div className="analysis-stage">
      <div className="analysis-inner">
        <div className="analysis-chips">
          {reactions.map((r, i) => (
            <div key={i} className="analysis-chip anim-in" style={{ animationDelay: `${i * 110}ms` }}>
              <span className="analysis-chip-n">0{i + 1}</span>
              <span className="analysis-chip-v">{labels[r] ?? r}</span>
            </div>
          ))}
        </div>

        <div className={`analysis-display anim-in delay-2${step === 2 ? ' analysis-display-done' : ''}`}>
          {step < 2 ? 'аналізую.' : 'готово.'}
        </div>

        <div className="analysis-foot anim-in delay-3">
          <div className="analysis-bar">
            <div className={`analysis-fill step-${step}`} />
          </div>
          <div className="analysis-status eyebrow">{statusText[step]}</div>
        </div>
        {step === 2 && (
          <button className="btn btn-primary anim-in" onClick={onDone}>
            подивитися карту →
          </button>
        )}
      </div>
    </div>
  )
}

// ── StepInfo ────────────────────────────────────────────────────────────────

function StepInfo({
  stepIdx, onStart, onSelect,
}: {
  stepIdx: number
  onStart: (idx: number) => void
  onSelect: (idx: number) => void
}) {
  const step = STEPS[stepIdx]
  const st   = getStatus(stepIdx)

  if (st === 'done-no-link') {
    return (
      <div className="step-info step-info-done anim-in">
        <div className="done-badge done-badge-plain">виконано</div>
        <h2 className="step-info-title">{step.title}</h2>
        <p className="step-info-note">
          ти вже це вмієш. наступний крок —{' '}
          <button className="inline-link" onClick={() => onSelect(CUR_IDX)}>
            {STEPS[CUR_IDX].title.toLowerCase()}
          </button>
        </p>
        <div className="step-info-foot">
          <button className="btn" onClick={() => onStart(stepIdx)}>спробувати ще раз →</button>
        </div>
      </div>
    )
  }

  if (st === 'done-link') {
    return (
      <div className="step-info step-info-done anim-in">
        <div className="done-badge done-badge-link">виконано · є результат</div>
        <h2 className="step-info-title">{step.title}</h2>
        <p className="step-info-note">
          ти вже це вмієш. наступний крок —{' '}
          <button className="inline-link" onClick={() => onSelect(CUR_IDX)}>
            {STEPS[CUR_IDX].title.toLowerCase()}
          </button>
        </p>
        <div className="step-info-foot">
          {step.result && (
            <a href={step.result} target="_blank" rel="noopener noreferrer" className="result-btn">
              <span className="result-btn-label">{step.resultLabel ?? 'переглянути результат'}</span>
              <span className="result-btn-arrow">↗</span>
            </a>
          )}
          <button className="btn" onClick={() => onStart(stepIdx)}>спробувати ще раз →</button>
        </div>
      </div>
    )
  }

  if (st === 'future') {
    const extra: StepExtra | undefined = STEPS_EXTRA[step.id]
    return (
      <div className="step-info step-info-future anim-in">
        <div className="future-badge">складніше</div>
        <h2 className="step-info-title">{step.title}</h2>
        {extra ? (
          <>
            <div className="step-info-grid">
              <div className="step-info-block">
                <div className="label">що ти зможеш</div>
                <div className="value">{extra.doable}</div>
              </div>
              <div className="step-info-block">
                <div className="label">що вивчиш технічно</div>
                <div className="value">{extra.technical}</div>
              </div>
            </div>
            <div className="step-info-foot">
              <div className="detail-time">
                {extra.time} · легше після{' '}
                <button className="inline-link" onClick={() => onSelect(CUR_IDX)}>кроку 04</button>
              </div>
              <button className="btn btn-primary" onClick={() => onStart(stepIdx)}>
                отримати промпт →
              </button>
            </div>
          </>
        ) : (
          <p className="step-info-note">
            Легше дасться після{' '}
            <button className="inline-link" onClick={() => onSelect(CUR_IDX)}>
              {STEPS[CUR_IDX].title.toLowerCase()}
            </button>
            {' '}— але нічого не зупиняє розібратись зараз.
          </p>
        )}
      </div>
    )
  }

  // current
  const extra = STEPS_EXTRA['prototype'] ?? STEPS_EXTRA[step.id]
  return (
    <div className="step-info step-info-cur anim-in">
      <div className="eyebrow eyebrow-accent" style={{ marginBottom: 20 }}>
        <span className="dot" /> наступний крок · {String(stepIdx + 1).padStart(2, '0')} з {STEPS.length}
      </div>
      <h2 className="step-info-title">{step.title}</h2>
      <div className="step-info-grid">
        <div className="step-info-block">
          <div className="label">що ти зможеш</div>
          <div className="value">Зробити живий прототип, який клікається. Поділитись лінком замість скріншоту.</div>
        </div>
        <div className="step-info-block">
          <div className="label">що дізнаєшся технічно</div>
          <div className="value">HTML структура, CSS змінні, vanilla JS для взаємодії. Claude як пара-програміст.</div>
        </div>
      </div>
      <div className="step-info-foot">
        <div className="detail-time">≈45 хв · тільки браузер і Claude</div>
        <button className="btn btn-primary" onClick={() => onStart(stepIdx)}>
          отримати промпт →
        </button>
      </div>
    </div>
  )
}

// ── MapVertical ──────────────────────────────────────────────────────────────

function MapVertical({ selectedIdx, onSelect }: { selectedIdx: number; onSelect: (i: number) => void }) {
  return (
    <div className="path">
      {STEPS.map((s, i) => {
        const st  = getStatus(i)
        const sel = i === selectedIdx
        return (
          <div key={s.id}>
            <div
              className={`node ${st}${sel ? ' selected' : ''}`}
              onClick={() => onSelect(i)}
            >
              <div className="marker" />
              <div className="node-text">
                <div className="node-title">{s.title}</div>
                {s.subtitle && <div className="node-subtitle">{s.subtitle}</div>}
                {st === 'done-link' && <div className="node-meta node-meta-link">результат ↗</div>}
                {st === 'cur'       && <div className="node-meta">рекомендований крок · ≈45 хв</div>}
              </div>
              {sel && st === 'cur' && <div className="node-cta">→</div>}
            </div>
          </div>
        )
      })}
      <div className="path-end">шлях продовжується</div>
    </div>
  )
}

// ── MapTypographic ───────────────────────────────────────────────────────────

function MapTypographic({ selectedIdx, onSelect }: { selectedIdx: number; onSelect: (i: number) => void }) {
  return (
    <div>
      <div className="typo-list">
        {STEPS.map((s, i) => {
          const st  = getStatus(i)
          const sel = i === selectedIdx
          return (
            <div key={s.id}>
              <div
                className={`typo-row ${st}${sel ? ' selected' : ''}`}
                onClick={() => onSelect(i)}
              >
                <div className="typo-num">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div className="typo-title">{s.title}</div>
                  {s.subtitle && <div className="typo-subtitle">{s.subtitle}</div>}
                </div>
                <div className="typo-meta">
                  {st === 'done-no-link' ? 'пройдено' : st === 'done-link' ? '↗' : st === 'cur' ? '≈45 хв' : ''}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="typo-end">шлях продовжується</div>
    </div>
  )
}

// ── MapScreen ────────────────────────────────────────────────────────────────

function MapScreen({ mapStyle, onStartPrompt }: { mapStyle: MapStyle; onStartPrompt: (idx: number) => void }) {
  const [selectedIdx, setSelectedIdx] = useState(CUR_IDX)

  return (
    <div className="map-layout">
      <div className="map-nav-col">
        <div className="map-header">
          <div className="eyebrow">your map</div>
          <div className="map-title">Ось де ти зараз.</div>
          <div className="map-sub">10 кроків. Карта росте, поки ти йдеш.</div>
        </div>
        {mapStyle === 'vertical'    && <MapVertical    selectedIdx={selectedIdx} onSelect={setSelectedIdx} />}
        {mapStyle === 'typographic' && <MapTypographic selectedIdx={selectedIdx} onSelect={setSelectedIdx} />}
      </div>
      <div className="map-info-col">
        <StepInfo key={selectedIdx} stepIdx={selectedIdx} onStart={onStartPrompt} onSelect={setSelectedIdx} />
      </div>
    </div>
  )
}

// ── PromptScreen (inside modal) ──────────────────────────────────────────────

const TASK_DEFAULT = `Допоможи мені зробити інтерактивний HTML-прототип за один вечір.`

const TOOLS: Record<Tool, { label: string; instruction: string }> = {
  'claude-ai':         { label: 'Claude.ai',       instruction: 'Відкрий claude.ai, встав промпт, дай чату попрацювати.' },
  'claude-code':       { label: 'Claude Code',     instruction: 'Відкрий термінал, введи `claude`, встав промпт.' },
  'figma-make':        { label: 'Figma Make',      instruction: 'Відкрий Figma Make, встав промпт у чат.' },
  'google-ai-studio':  { label: 'AI Studio',       instruction: 'Відкрий Google AI Studio, встав промпт.' },
}

const PROMPT_TEXT_DEFAULT = `Ти senior frontend дев, який пише прототипи для дизайн-рев'ю.

Я дизайнер без досвіду кодингу. {task}

Правила:
— один .html файл, нульові залежності
— Tailwind CDN, vanilla JS
— темна тема, шрифт Geist
— кожну нову фічу показуй у браузері перш ніж іти далі

Якщо я напишу «застрягла» — запропонуй три варіанти виходу: спростити, пропустити, або пояснити інакше.

Спочатку постав мені 2-3 запитання про що саме я хочу прототипувати. Тільки потім код.`

function PromptScreen({
  stepIdx, onDone, onBack,
}: {
  stepIdx: number
  onDone: () => void
  onBack: () => void
}) {
  const step        = STEPS[stepIdx]
  const extra       = STEPS_EXTRA[step.id]
  const isCur       = stepIdx === CUR_IDX
  const template    = extra?.promptText ?? PROMPT_TEXT_DEFAULT
  const taskDefault = extra?.taskDefault ?? TASK_DEFAULT
  const stepNum     = String(stepIdx + 1).padStart(2, '0')

  const recommended         = extra?.recommendedTool ?? 'claude-ai'
  const [tool, setTool]     = useState<Tool>(recommended)
  const [task, setTask]     = useState(taskDefault)
  const [copied, setCopied] = useState(false)

  const prompt = template.replace('{task}', task.trim() || taskDefault)

  async function copy() {
    try { await navigator.clipboard.writeText(prompt) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="prompt-inner anim-in">
      <div className="prompt-head">
        <div>
          <div className="eyebrow">крок {stepNum} · промпт</div>
          <div className="prompt-title">Скопіюй це в Claude.</div>
          <div className="prompt-sub">
            {TOOLS[tool].instruction}
            {isCur && ' Повернись сюди, коли матимеш Vercel-лінк.'}
          </div>
        </div>
        <button className="btn-ghost" onClick={onBack}>← закрити</button>
      </div>

      <div className="tool-selector">
        {(Object.keys(TOOLS) as Tool[]).map(t => (
          <button
            key={t}
            className={`tool-btn${tool === t ? ' active' : ''}`}
            onClick={() => setTool(t)}
          >
            {TOOLS[t].label}
            {t === recommended && <span className="tool-rec">рек</span>}
          </button>
        ))}
      </div>

      <div className={`prompt-box${tool === 'claude-code' ? ' terminal' : ''}`}>
        <div className="prompt-bar">
          {tool === 'claude-code' ? (
            <div className="prompt-bar-left">
              <span className="term-dots">
                <span className="dot-r" /><span className="dot-y" /><span className="dot-g" />
              </span>
              <span>claude-prompt.txt</span>
            </div>
          ) : (
            <div className="prompt-bar-left">
              <span className="ic" />
              <span>prompt-{stepNum}-{step.id}.txt</span>
              <span className="sep">·</span>
              <span style={{ color: 'var(--text-faint)' }}>{prompt.length} символів</span>
            </div>
          )}
          <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={copy}>
            {copied ? 'скопійовано' : 'copy'}
          </button>
        </div>
        <div className="prompt-body">{prompt}</div>
      </div>
      <div className="prompt-task">
        <label className="prompt-task-label eyebrow">моя задача</label>
        <textarea
          className="prompt-task-input"
          value={task}
          onChange={e => setTask(e.target.value)}
          onBlur={e => { if (!e.target.value.trim()) setTask(taskDefault) }}
          rows={3}
          spellCheck={false}
        />
      </div>
      <div className="prompt-foot">
        <div className="meta">
          {isCur ? 'коли матимеш робочий прототип — повернись сюди.' : 'зроби — і повернись позначити крок виконаним.'}
        </div>
        <button className="btn btn-primary" onClick={onDone}>я зробила — далі</button>
      </div>
    </div>
  )
}

// ── StepModal ────────────────────────────────────────────────────────────────

function StepModal({
  stepIdx, onClose, onDone,
}: {
  stepIdx: number
  onClose: () => void
  onDone: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal-card" role="dialog" aria-modal="true">
        <div className="modal-topbar">
          <div className="modal-handle" />
          <button className="modal-close" onClick={onClose} aria-label="Закрити">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <PromptScreen stepIdx={stepIdx} onDone={onDone} onBack={onClose} />
        </div>
      </div>
    </>
  )
}

// ── CompleteScreen ────────────────────────────────────────────────────────────

function CompleteScreen({ onGoToMap }: { onGoToMap: () => void }) {
  const [url, setUrl] = useState('')
  const [committed, setCommitted] = useState('')
  const [shared, setShared] = useState(false)

  const valid =
    /^https?:\/\/.+/.test(url) ||
    /\.vercel\.app/.test(url) ||
    /\.(com|app|io|dev|me|design)(\/|$)/.test(url)

  function commit() {
    if (!valid) return
    let v = url.trim()
    if (!/^https?:\/\//.test(v)) v = 'https://' + v
    setCommitted(v)
  }

  function share() {
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  const display = committed
    ? committed.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : ''
  const projectName = display ? display.split('.')[0].replace(/-/g, ' ') : ''

  return (
    <div className="stage anim-in">
      <div className="col-wide complete">
        <div>
          <div className="eyebrow eyebrow-accent anim-in delay-0" style={{ marginBottom: 28 }}>
            <span className="dot" /> shipped
          </div>
          <h1 className="complete-display anim-in delay-1">
            ти зробила свій<br />
            <span className="accent">перший прототип.</span>
          </h1>
          <div className="complete-sub anim-in delay-2">
            ≈45 хвилин тому ти не знала, що це можливо.<br />
            тепер є лінк, який можна показати.
          </div>
        </div>

        <div className="share-form anim-in delay-3">
          <div className="eyebrow">встав посилання</div>
          <div className="share-input-row">
            <input
              autoFocus
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && commit()}
              placeholder="my-prototype.vercel.app"
              spellCheck={false}
            />
            <button disabled={!valid} onClick={commit}>preview ↵</button>
          </div>
        </div>

        {committed && (
          <div className="preview anim-in">
            <div className="og">
              <div className="og-meta">
                <span>{projectName || 'prototype'}</span>
                <span className="live">live</span>
              </div>
              <div className="og-title">Прототип, який клікається.</div>
            </div>
            <div className="preview-meta">
              <span className="url">{display}</span>
              <span className="site">vercel</span>
            </div>
          </div>
        )}

        <div className="complete-foot anim-in">
          <div style={{ display: 'flex', gap: 10 }}>
            {committed && (
              <button className="btn btn-primary" onClick={share}>
                {shared ? 'скопійовано' : 'share →'}
              </button>
            )}
            <button className="btn" onClick={onGoToMap}>зробити ще один</button>
          </div>
          {committed && <div className="meta">шерить твою роботу, не цей продукт.</div>}
        </div>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function CalibratePage() {
  const [phase, setPhase]         = useState<Phase>('intro')
  const [storyIdx, setStoryIdx]   = useState(0)
  const [reactions, setReactions] = useState<string[]>([])
  const [modal, setModal]         = useState<number | null>(null) // null or stepIdx
  const [mapStyle]                = useState<MapStyle>('vertical')

  const pickReaction = useCallback((v: string) => {
    const next = [...reactions, v]
    setReactions(next)
    if (storyIdx + 1 < STORIES.length) {
      setStoryIdx(storyIdx + 1)
    } else {
      setPhase('analysis')
      setModal(null)
    }
  }, [reactions, storyIdx])

  function handleAnalysisDone() {
    saveCalibration(reactions)
    setPhase('map')
  }

  function reset() {
    setReactions([])
    setStoryIdx(0)
    setPhase('intro')
    setModal(null)
  }

  return (
    <div className="app">
      <Chrome
        phase={phase}
        storyIdx={storyIdx}
        onLogoClick={() => setPhase('intro')}
        onMapClick={() => setPhase('map')}
      />

      {phase === 'intro'    && <IntroScreen onStart={() => setPhase('story')} />}
      {phase === 'story'    && <StoryScreen idx={storyIdx} onPick={pickReaction} />}
      {phase === 'analysis' && <AnalysisScreen reactions={reactions} onDone={handleAnalysisDone} />}

      {phase === 'map' && (
        <>
          <MapScreen
            mapStyle={mapStyle}
            onStartPrompt={(idx) => setModal(idx)}
          />
          {modal !== null && (
            <StepModal
              stepIdx={modal}
              onClose={() => setModal(null)}
              onDone={() => { setModal(null); setPhase('complete') }}
            />
          )}
        </>
      )}

      {phase === 'complete' && <CompleteScreen onGoToMap={() => setPhase('map')} />}
    </div>
  )
}
