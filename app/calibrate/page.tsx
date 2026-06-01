'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  STORIES, REACTIONS, STEPS, STEPS_EXTRA, CUR_IDX, getStatus, isDone,
  type Story, type StepExtra, type Tool, type StepCategory, type Step, type Stage,
} from '@/lib/data'
import { saveCalibration, getInProgress, addInProgress, removeInProgress, getDraft, saveDraft, clearDraft, getCompletedSteps, markStepDone, type InProgressItem } from '@/lib/storage'
import './styles.css'
import GraphView from './graph-view'

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
  phase, storyIdx, onLogoClick, onMapClick, theme, onThemeToggle, inProgressCount,
}: {
  phase: Phase
  storyIdx: number
  onLogoClick: () => void
  onMapClick: () => void
  theme: 'dark' | 'light'
  onThemeToggle: () => void
  inProgressCount: number
}) {
  return (
    <header className="chrome">
      <div className="wordmark">
        <span className="dot" />
        <button className="wordmark-btn" onClick={onLogoClick}>It Depends</button>
        <button className="wordmark-btn" onClick={onMapClick}>· ai skills map</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {phase === 'story' && (
          <div className="counter">{storyIdx + 1} / {STORIES.length}</div>
        )}
        {inProgressCount > 0 && (
          <a href="/progress" className="chrome-active-link">
            Активні задачі
            <span className="chrome-active-badge">{inProgressCount}</span>
          </a>
        )}
        <button className="theme-toggle" onClick={onThemeToggle} aria-label="toggle theme">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  )
}

// ── IntroScreen ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
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
        <div className="intro-skip anim-in delay-3">
          <button className="intro-skip-btn" onClick={onSkip}>пропустити → одразу до галереї</button>
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
  stepIdx, onStart, onSelect, completedUrl,
}: {
  stepIdx: number
  onStart: (idx: number) => void
  onSelect: (idx: number) => void
  completedUrl?: string
}) {
  const step = STEPS[stepIdx]
  const st   = completedUrl !== undefined ? 'done-link' : getStatus(stepIdx)

  if (st === 'done-no-link' || st === 'done-link') {
    const extra: StepExtra | undefined = STEPS_EXTRA[step.id]
    const extraGrid = extra && (
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
    )
    return (
      <div className="step-info step-info-done anim-in">
        {st === 'done-link'
          ? <div className="done-badge done-badge-link">виконано · є результат</div>
          : <div className="done-badge done-badge-plain">виконано</div>
        }
        <h2 className="step-info-title">{step.title}</h2>
        {extraGrid}
        <p className="step-info-note">
          ти вже це вмієш. наступний крок —{' '}
          <button className="inline-link" onClick={() => onSelect(CUR_IDX)}>
            {STEPS[CUR_IDX].title.toLowerCase()}
          </button>
        </p>
        {st === 'done-link' && (
          <div className="results-list">
            <div className="results-list-label">результати</div>
            {completedUrl ? (
              <a href={completedUrl} target="_blank" rel="noopener noreferrer" className="result-row">
                <span className="result-row-arrow">↗</span>
                <span>твій результат</span>
              </a>
            ) : step.results?.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="result-row">
                <span className="result-row-arrow">↗</span>
                <span>{r.label}</span>
              </a>
            ))}
          </div>
        )}
        <div className="step-info-foot">
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
        {extra && (
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
        )}
        <div className="step-info-foot">
          {extra && (
            <div className="detail-time">
              {extra.time} · легше після{' '}
              <button className="inline-link" onClick={() => onSelect(CUR_IDX)}>кроку 04</button>
            </div>
          )}
          <button className="btn btn-primary" onClick={() => onStart(stepIdx)}>
            отримати промпт →
          </button>
        </div>
      </div>
    )
  }

  if (st === 'avail') {
    const extra: StepExtra | undefined = STEPS_EXTRA[step.id]
    if (extra) {
      return <StagedInstruction key={stepIdx} stepIdx={stepIdx} inline />
    }
    return (
      <div className="step-info step-info-future anim-in">
        <div className="future-badge avail-badge">можна почати</div>
        <h2 className="step-info-title">{step.title}</h2>
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

function MapVertical({ selectedIdx, onSelect, completedMap }: { selectedIdx: number; onSelect: (i: number) => void; completedMap: Map<string, string> }) {
  return (
    <div className="path">
      {STEPS.map((s, i) => {
        const userUrl = completedMap.get(s.id)
        const st = completedMap.has(s.id) ? (userUrl ? 'done-link' : 'done-no-link') : getStatus(i)
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
                {st === 'avail'     && <div className="node-meta node-meta-avail">{STEPS_EXTRA[s.id]?.time ?? ''}{STEPS_EXTRA[s.id]?.kind === 'build' && STEPS_EXTRA[s.id]?.stages?.length ? ` · ${STEPS_EXTRA[s.id]!.stages!.length} фаз` : ''}</div>}
              </div>
              {sel && (st === 'cur' || st === 'avail') && <div className="node-cta">→</div>}
            </div>
          </div>
        )
      })}
      <div className="path-end">шлях продовжується</div>
    </div>
  )
}

// ── MapTypographic ───────────────────────────────────────────────────────────

function MapTypographic({ selectedIdx, onSelect, completedMap }: { selectedIdx: number; onSelect: (i: number) => void; completedMap: Map<string, string> }) {
  return (
    <div>
      <div className="typo-list">
        {STEPS.map((s, i) => {
          const st  = completedMap.has(s.id) ? (completedMap.get(s.id) ? 'done-link' : 'done-no-link') : getStatus(i)
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

// ── Gallery ───────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<StepCategory | 'all', string> = {
  all: 'Всі', research: 'Дослідження', prototyping: 'Прототипування',
  code: 'Код', planning: 'Планування', workflow: 'Воркфлоу',
}

const TOOL_LABELS: Record<Tool | 'all', string> = {
  all: 'Всі', 'claude-ai': 'Claude.ai', 'claude-code': 'Claude Code',
  'figma-make': 'Figma Make', 'google-ai-studio': 'AI Studio',
}

const CAT_COLORS_MAP: Record<StepCategory, string> = {
  research: '#1D9E75', planning: '#7F77DD',
  prototyping: '#D85A30', code: '#378ADD', workflow: '#BA7517',
}

function GalleryCard({
  step, extra, status, stepIdx, onOpenPrompt, isInProgress, completedUrl,
}: {
  step: Step
  extra: StepExtra | undefined
  status: string
  stepIdx: number
  onOpenPrompt: (idx: number) => void
  isInProgress?: boolean
  completedUrl?: string
}) {
  const isCompleted = completedUrl !== undefined
  const done = isCompleted || isDone(status)
  const isCur = !isCompleted && status === 'cur'
  return (
    <div className={`gnode-card gnode-card-gallery${done ? ' done' : ''}${isCur ? ' cur' : ''}${isInProgress ? ' in-progress' : ''}`}>
      <div className="gnode-header">
        <span className="gnode-cat" style={{ color: CAT_COLORS_MAP[step.category] }}>
          {CATEGORY_LABELS[step.category]}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {extra && <span className="badge">{extra.time}</span>}
          {extra && <span className={`badge badge-tool badge-${extra.recommendedTool}`}>{TOOLS[extra.recommendedTool].label}</span>}
          {isCompleted && <span className="gnode-completed-badge">✓ виконано</span>}
          {isInProgress && !isCompleted && <span className="gnode-inprogress-badge">◑ в роботі</span>}
          {done && !isCompleted && <span className="gnode-status-dot done-dot" />}
          {isCur && <span className="gnode-status-dot cur-dot" />}
        </div>
      </div>
      <div className="gnode-title">{step.title}</div>
      <div className="gnode-sub">{step.subtitle}</div>
      {extra && <div className="gnode-doable">{extra.doable}</div>}
      <div className="gnode-layer">
        {[0,1,2,3,4].map(i => (
          <span key={i} className={`gnode-layer-dot${i <= step.layer ? ' filled' : ''}`} />
        ))}
      </div>
      <div className="gnode-footer">
        {isCompleted && completedUrl && (
          <a className="btn btn-ghost gallery-card-cta" href={completedUrl} target="_blank" rel="noopener noreferrer">↗ результат</a>
        )}
        {!isCompleted && status === 'done-link' && step.results?.map((r, i) => (
          <a key={i} className="btn btn-ghost gallery-card-cta" href={r.url} target="_blank" rel="noopener noreferrer">↗ {r.label}</a>
        ))}
        {extra
          ? <button className="btn btn-ghost gallery-card-cta" onClick={() => onOpenPrompt(stepIdx)}>отримати промпт →</button>
          : <span className="meta gallery-card-soon">скоро</span>
        }
      </div>
    </div>
  )
}

function GalleryScreen({ onOpenPrompt, inProgress, completedMap }: { onOpenPrompt: (idx: number) => void; inProgress: InProgressItem[]; completedMap: Map<string, string> }) {
  const [activeTool, setActiveTool]         = useState<Tool | 'all'>('all')
  const [activeCategory, setActiveCategory] = useState<StepCategory | 'all'>('all')
  const inProgressIds = new Set(inProgress.map(i => i.id))

  const filtered = STEPS
    .map((step, idx) => ({ step, idx }))
    .filter(({ step }) => {
      const extra = STEPS_EXTRA[step.id]
      if (activeCategory !== 'all' && step.category !== activeCategory) return false
      if (activeTool !== 'all' && extra?.recommendedTool !== activeTool) return false
      return true
    })

  return (
    <div className="gallery-layout">
      <div className="gallery-filters">
        <div className="filter-chips">
          {(Object.keys(CATEGORY_LABELS) as (StepCategory | 'all')[]).map(cat => (
            <button key={cat} className={`filter-chip${activeCategory === cat ? ' active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        <div className="filter-chips">
          {(Object.keys(TOOL_LABELS) as (Tool | 'all')[]).map(t => (
            <button key={t} className={`filter-chip${activeTool === t ? ' active' : ''}`} onClick={() => setActiveTool(t)}>
              {TOOL_LABELS[t]}
            </button>
          ))}
        </div>
      </div>
      <div className="gallery-grid">
        {filtered.map(({ step, idx }) => (
          <GalleryCard
            key={step.id}
            step={step}
            extra={STEPS_EXTRA[step.id]}
            status={getStatus(idx)}
            stepIdx={idx}
            onOpenPrompt={onOpenPrompt}
            isInProgress={inProgressIds.has(step.id)}
            completedUrl={completedMap.get(step.id)}
          />
        ))}
      </div>
    </div>
  )
}

// ── MapScreen ────────────────────────────────────────────────────────────────

function MapScreen({
  mapStyle, onStartPrompt, viewMode, onViewModeChange, inProgress, completedMap,
}: {
  mapStyle: MapStyle
  onStartPrompt: (idx: number) => void
  viewMode: 'map' | 'gallery' | 'graph'
  onViewModeChange: (v: 'map' | 'gallery' | 'graph') => void
  inProgress: InProgressItem[]
  completedMap: Map<string, string>
}) {
  const [selectedIdx, setSelectedIdx] = useState(0)

  const toggle = (
    <div className="view-toggle">
      <button className={viewMode === 'map' ? 'active' : ''} onClick={() => onViewModeChange('map')}>Шлях</button>
      <button className={viewMode === 'gallery' ? 'active' : ''} onClick={() => onViewModeChange('gallery')}>Галерея</button>
      <button className={viewMode === 'graph' ? 'active' : ''} onClick={() => onViewModeChange('graph')}>Зв'язки</button>
    </div>
  )

  if (viewMode === 'gallery') {
    return (
      <div className="gallery-page">
        <div className="gallery-page-header">{toggle}</div>
        <GalleryScreen onOpenPrompt={onStartPrompt} inProgress={inProgress} completedMap={completedMap} />
      </div>
    )
  }

  if (viewMode === 'graph') {
    return (
      <div className="gallery-page">
        <div className="gallery-page-header">{toggle}</div>
        <GraphView
          onOpenPrompt={onStartPrompt}
          inProgressIds={new Set(inProgress.map(i => i.id))}
          completedIds={new Set(completedMap.keys())}
          renderDetail={(idx) => (
            <StepInfo
              key={idx}
              stepIdx={idx}
              onStart={onStartPrompt}
              onSelect={() => {}}
              completedUrl={completedMap.get(STEPS[idx].id)}
            />
          )}
        />
      </div>
    )
  }

  return (
    <div className="map-layout">
      {inProgress.length > 0 && (
        <div className="active-plashka">
          <span className="active-plashka-label">◑ в роботі</span>
          {inProgress.map(item => (
            <button
              key={item.id}
              className="active-plashka-item"
              onClick={() => onStartPrompt(item.stepIdx)}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
      <div className="map-nav-col">
        <div className="map-header">
          {toggle}
          <div className="eyebrow">your map</div>
          <div className="map-title">Ось де ти зараз.</div>
          <div className="map-sub">{STEPS.length} кроків. Карта росте, поки ти йдеш.</div>
        </div>
        {mapStyle === 'vertical'    && <MapVertical    selectedIdx={selectedIdx} onSelect={setSelectedIdx} completedMap={completedMap} />}
        {mapStyle === 'typographic' && <MapTypographic selectedIdx={selectedIdx} onSelect={setSelectedIdx} completedMap={completedMap} />}
      </div>
      <div className="map-info-col">
        <StepInfo key={selectedIdx} stepIdx={selectedIdx} onStart={onStartPrompt} onSelect={setSelectedIdx} completedUrl={completedMap.get(STEPS[selectedIdx].id)} />
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

// ── StagedInstruction (accordions) ───────────────────────────────────────────

function StagedInstruction({
  stepIdx, onDone, onBack, inline = false,
}: {
  stepIdx: number
  onDone?: () => void
  onBack?: () => void
  inline?: boolean
}) {
  const step        = STEPS[stepIdx]
  const extra       = STEPS_EXTRA[step.id]!
  const phases: Stage[] = extra.stages ?? []
  const levelUp     = extra.levelUp ?? []
  const taskDefault = extra.taskDefault
  const expect      = extra.expect ?? []
  const isBuild     = extra.kind === 'build'
  const recommended = extra.recommendedTool
  const taskPhase   = phases.findIndex(s => s.prompt?.includes('{task}'))

  const [task, setTask]         = useState(taskDefault)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [openPhase, setOpenPhase] = useState(isBuild ? 0 : -1)
  const [showLevel, setShowLevel] = useState(false)

  const fill = (p?: string) => (p ?? '').replace('{task}', task.trim() || taskDefault)
  const mainPrompt = fill(extra.promptText)

  async function copy(key: string, text: string) {
    try { await navigator.clipboard.writeText(text) } catch {}
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(k => (k === key ? null : k)), 1600)
  }

  const TaskInput = (
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
  )

  const PromptBox = ({ label, text, ck }: { label: string; text: string; ck: string }) => (
    <div className="prompt-box guide-prompt-box">
      <div className="prompt-bar">
        <div className="prompt-bar-left">
          <span className="ic" />
          <span>{label}</span>
          <span className="sep">·</span>
          <span style={{ color: 'var(--text-faint)' }}>{text.length} символів</span>
        </div>
        <button className={`copy-btn${copiedKey === ck ? ' copied' : ''}`} onClick={e => { e.stopPropagation(); copy(ck, text) }}>
          {copiedKey === ck ? 'скопійовано' : 'copy'}
        </button>
      </div>
      <div className="prompt-body">{text}</div>
    </div>
  )

  return (
    <div className={`guide anim-in${inline ? ' guide-inline' : ''}`}>
      <div className="guide-head">
        <div>
          {inline
            ? <div className="future-badge avail-badge">можна почати</div>
            : <div className="eyebrow">покрокова інструкція</div>}
          <h2 className="guide-title">{step.title}</h2>
          <div className="guide-sub">{extra.doable}</div>
        </div>
        {!inline && onBack && <button className="btn-ghost" onClick={onBack}>← закрити</button>}
      </div>

      <div className="guide-metarow">
        <span className="badge">{extra.time}</span>
        <span className={`badge badge-tool badge-${recommended}`}>{TOOLS[recommended].label}</span>
        {isBuild && <span className="badge">{phases.length} фаз</span>}
      </div>

      {!isBuild && (
        <div className="guide-prompt">
          {TaskInput}
          <PromptBox label="промпт" text={mainPrompt} ck="main" />
        </div>
      )}

      {!isBuild && expect.length > 0 && (
        <div className="roadmap">
          <div className="roadmap-label eyebrow">як це піде</div>
          <ul className="expect-list">
            {expect.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      )}

      {isBuild && (
      <div className="roadmap">
        <div className="roadmap-label eyebrow">кроки збірки</div>
        <ol className="roadmap-list">
          {phases.map((s, i) => {
            const open      = openPhase === i
            const hasPrompt = isBuild && !!s.prompt
            return (
              <li className={`phase${hasPrompt ? ' has-prompt' : ''}${open ? ' open' : ''}`} key={i}>
                <div
                  className="phase-row"
                  onClick={hasPrompt ? () => setOpenPhase(open ? -1 : i) : undefined}
                  role={hasPrompt ? 'button' : undefined}
                >
                  <span className="phase-num">{i + 1}</span>
                  <div className="phase-main">
                    <div className="phase-title">
                      {s.title}
                      {s.tool && <span className={`badge badge-tool badge-${s.tool}`}>{TOOLS[s.tool].label}</span>}
                    </div>
                    <div className="phase-action">{s.action}</div>
                    <div className="phase-check"><span className="phase-check-tick">✓</span> {s.checkpoint}</div>
                  </div>
                  {hasPrompt && <span className="phase-chev">{open ? '−' : '+'}</span>}
                </div>
                {hasPrompt && open && (
                  <div className="phase-prompt">
                    {i === taskPhase && TaskInput}
                    <PromptBox label={`промпт фази ${i + 1}`} text={fill(s.prompt)} ck={`p${i}`} />
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
      )}

      {levelUp.length > 0 && (
        <div className="guide-levelup">
          <button className="guide-levelup-toggle" onClick={() => setShowLevel(v => !v)}>
            <span className="lvl-bolt">⚡</span>
            <span>Далі: потужніший шлях</span>
            <span className="lvl-chev">{showLevel ? '−' : '+'}</span>
          </button>
          {showLevel && (
            <ul className="levelup-list">
              {levelUp.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
          )}
        </div>
      )}

      {onDone && (
        <div className="prompt-foot">
          <div className="meta">зроби — і повернись позначити крок виконаним.</div>
          <button className="btn btn-primary" onClick={onDone}>я зробила — далі</button>
        </div>
      )}
    </div>
  )
}

// ── PromptScreen (inside modal) ──────────────────────────────────────────────

function PromptScreen({
  stepIdx, onDone, onBack, onInProgressChange,
}: {
  stepIdx: number
  onDone: () => void
  onBack: () => void
  onInProgressChange?: () => void
}) {
  const step        = STEPS[stepIdx]
  const extra       = STEPS_EXTRA[step.id]
  if (extra?.kind === 'build') {
    return <StagedInstruction stepIdx={stepIdx} onDone={onDone} onBack={onBack} />
  }
  const isCur       = stepIdx === CUR_IDX
  const template    = extra?.promptText ?? PROMPT_TEXT_DEFAULT
  const taskDefault = extra?.taskDefault ?? TASK_DEFAULT
  const stepNum     = String(stepIdx + 1).padStart(2, '0')

  const recommended           = extra?.recommendedTool ?? 'claude-ai'
  const [tool, setTool]       = useState<Tool>(recommended)
  const [task, setTask]       = useState(() => getDraft(step.id) ?? taskDefault)
  const [copied, setCopied]   = useState(false)
  const [tookOn, setTookOn]   = useState(() => getInProgress().some(i => i.id === step.id))

  const prompt = template.replace('{task}', task.trim() || taskDefault)

  function handleTaskChange(val: string) {
    setTask(val)
    saveDraft(step.id, val)
  }

  function takeOn() {
    addInProgress({ stepIdx, id: step.id, title: step.title, subtitle: step.subtitle, task, date: new Date().toISOString() })
    setTookOn(true)
    onInProgressChange?.()
  }

  function removeFromActive() {
    removeInProgress(step.id)
    clearDraft(step.id)
    setTookOn(false)
    onInProgressChange?.()
  }

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
          onChange={e => handleTaskChange(e.target.value)}
          onBlur={e => { if (!e.target.value.trim()) handleTaskChange(taskDefault) }}
          rows={3}
          spellCheck={false}
        />
      </div>
      {extra?.expect?.length ? (
        <div className="prompt-expect">
          <div className="roadmap-label eyebrow">як це піде</div>
          <ul className="expect-list">
            {extra.expect.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      ) : null}
      <div className="prompt-foot">
        <div className="meta">
          {isCur ? 'коли матимеш робочий прототип — повернись сюди.' : 'зроби — і повернись позначити крок виконаним.'}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!tookOn ? (
            <button className="btn" onClick={takeOn}>Взяла в роботу</button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="prompt-inprogress-badge">◑ в роботі</span>
              <button className="btn-ghost" style={{ fontSize: 12, color: 'var(--text-faint)' }} onClick={removeFromActive}>зняти</button>
            </div>
          )}
          <button className="btn btn-primary" onClick={onDone}>я зробила — далі</button>
        </div>
      </div>
    </div>
  )
}

// ── StepModal ────────────────────────────────────────────────────────────────

function StepModal({
  stepIdx, onClose, onDone, onInProgressChange,
}: {
  stepIdx: number
  onClose: () => void
  onDone: () => void
  onInProgressChange?: () => void
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
          <PromptScreen stepIdx={stepIdx} onDone={onDone} onBack={onClose} onInProgressChange={onInProgressChange} />
        </div>
      </div>
    </>
  )
}

// ── CompleteScreen ────────────────────────────────────────────────────────────

const SHARE_CHANNELS = [
  {
    label: 'WhatsApp',
    open: (text: string) => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'),
  },
  {
    label: 'Telegram',
    open: (text: string, url: string) => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank'),
  },
]

function CompleteScreen({ stepIdx, onGoToMap, onDone }: { stepIdx: number | null; onGoToMap: () => void; onDone?: () => void }) {
  const step = stepIdx !== null ? STEPS[stepIdx] : null
  const [url, setUrl] = useState('')
  const [committed, setCommitted] = useState('')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [elapsed, setElapsed] = useState('≈45 хвилин')
  const [shareMsg, setShareMsg] = useState('')
  const shareInitialized = useRef(false)

  useEffect(() => {
    try {
      const start = localStorage.getItem('itdepends_calibrate_start')
      if (start) {
        const mins = Math.round((Date.now() - new Date(start).getTime()) / 60000)
        if (mins >= 1 && mins < 300) setElapsed(`≈${mins} хвилин`)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (committed && !shareInitialized.current) {
      const what = step ? step.title : 'перший інтерактивний прототип'
      setShareMsg(`Зробила "${what}" з Claude. Буду вдячна якщо поділитесь думками чи досвідом 🙂`)
      shareInitialized.current = true
    }
  }, [committed, step])

  const fullShareText = `${shareMsg}\n${committed}`

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

  function copyShareText() {
    navigator.clipboard.writeText(fullShareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  function shareLinkedIn() {
    copyShareText()
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(committed)}`, '_blank')
  }

  function saveToHistory() {
    if (step) {
      markStepDone({ id: step.id, url: committed, shareText: fullShareText })
      removeInProgress(step.id)
      clearDraft(step.id)
    }
    try {
      localStorage.setItem('itdepends_prototype', JSON.stringify({ url: committed, shareText: fullShareText, date: new Date().toISOString() }))
    } catch {}
    setSaved(true)
    onDone?.()
    setTimeout(() => onGoToMap(), 1500)
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
          {step && (
            <div className="complete-step-context anim-in delay-0">
              <span className="complete-step-num">крок {(stepIdx ?? 0) + 1}</span>
              <span className="complete-step-title">{step.title}</span>
              {step.subtitle && <span className="complete-step-sub">{step.subtitle}</span>}
            </div>
          )}
          <h1 className="complete-display anim-in delay-1">
            ти зробила<br />
            <span className="accent">{step ? step.title.toLowerCase() + '.' : 'перший крок.'}</span>
          </h1>
          <div className="complete-sub anim-in delay-2">
            {elapsed} тому ти не знала, що це можливо.<br />
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
          <>
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

            <div className="share-text-block anim-in">
              <div className="eyebrow">текст для поста</div>
              <textarea
                className="share-textarea"
                value={shareMsg}
                onChange={e => setShareMsg(e.target.value)}
                rows={3}
                spellCheck={false}
              />
              <div className="share-url-chip">{display}</div>
              <div className="share-actions">
                {SHARE_CHANNELS.map(ch => (
                  <button key={ch.label} className="btn btn-ghost" onClick={() => ch.open(fullShareText, committed)}>
                    {ch.label}
                  </button>
                ))}
                <button className="btn btn-ghost" onClick={shareLinkedIn}>LinkedIn</button>
                <button
                  className={`btn btn-ghost${copied ? ' copied' : ''}`}
                  onClick={copyShareText}
                >
                  {copied ? 'скопійовано ✓' : 'копіювати'}
                </button>
              </div>
              <div className="meta">шерить твою роботу, не цей продукт.</div>
            </div>
          </>
        )}

        <div className="complete-foot anim-in">
          {committed && (
            <button
              className={`btn btn-primary${saved ? ' copied' : ''}`}
              onClick={saveToHistory}
            >
              {saved ? 'збережено ✓' : 'Зберегти посилання в задачу'}
            </button>
          )}
          <button className="btn" onClick={onGoToMap}>перейти до всіх проєктів</button>
        </div>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

function CalibratePageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [phase, setPhase]         = useState<Phase>('intro')
  const [storyIdx, setStoryIdx]   = useState(0)
  const [reactions, setReactions] = useState<string[]>([])
  const [modal, setModal]         = useState<number | null>(null)
  const [completedIdx, setCompletedIdx] = useState<number | null>(null)
  const [mapStyle]                = useState<MapStyle>('vertical')
  const [viewMode, setViewMode]   = useState<'map' | 'gallery' | 'graph'>('map')
  const [theme, setTheme]         = useState<'dark' | 'light'>('dark')
  const [inProgress, setInProgress] = useState<InProgressItem[]>([])
  const [completedMap, setCompletedMap] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    setInProgress(getInProgress())
    setCompletedMap(new Map(getCompletedSteps().map(s => [s.id, s.url ?? ''])))
  }, [])

  useEffect(() => {
    const raw = searchParams.get('openStep')
    if (raw === null) return
    const idx = Number(raw)
    if (!isNaN(idx) && idx >= 0 && idx < STEPS.length) {
      setPhase('map')
      setModal(idx)
    }
    router.replace('/calibrate')
  }, [searchParams, router])

  function refreshInProgress() { setInProgress(getInProgress()) }
  function refreshCompleted() { setCompletedMap(new Map(getCompletedSteps().map(s => [s.id, s.url ?? '']))) }

  useEffect(() => {
    try {
      const saved = localStorage.getItem('itdepends_theme')
      if (saved === 'light') setTheme('light')
    } catch {}
  }, [])

  useEffect(() => {
    if (phase === 'map') {
      try {
        if (!localStorage.getItem('itdepends_calibrate_start')) {
          localStorage.setItem('itdepends_calibrate_start', new Date().toISOString())
        }
      } catch {}
    }
  }, [phase])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('itdepends_theme', theme) } catch {}
    return () => { document.documentElement.removeAttribute('data-theme') }
  }, [theme])

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
    router.push('/map')
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
        theme={theme}
        onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        inProgressCount={inProgress.length}
      />

      {phase === 'intro'    && <IntroScreen onStart={() => setPhase('story')} onSkip={() => router.push('/gallery')} />}
      {phase === 'story'    && <StoryScreen idx={storyIdx} onPick={pickReaction} />}
      {phase === 'analysis' && <AnalysisScreen reactions={reactions} onDone={handleAnalysisDone} />}

      {phase === 'map' && (
        <>
          <MapScreen
            mapStyle={mapStyle}
            onStartPrompt={(idx) => setModal(idx)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            inProgress={inProgress}
            completedMap={completedMap}
          />
          {modal !== null && (
            <StepModal
              stepIdx={modal}
              onClose={() => setModal(null)}
              onDone={() => { setCompletedIdx(modal); setModal(null); setPhase('complete') }}
              onInProgressChange={refreshInProgress}
            />
          )}
        </>
      )}

      {phase === 'complete' && <CompleteScreen stepIdx={completedIdx} onGoToMap={() => setPhase('map')} onDone={() => { refreshCompleted(); refreshInProgress() }} />}
    </div>
  )
}

export default function CalibratePage() {
  return (
    <Suspense>
      <CalibratePageInner />
    </Suspense>
  )
}
