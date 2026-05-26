'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PROMPTS, FALLBACK, type Suggestion } from '../lib/prompts'

type PathCard = {
  promptKey: string
  title: string
  description: string
  tool: 'claude' | 'claude-code'
  group: 'chat' | 'analyze' | 'build'
}

const PATH: PathCard[] = [
  { promptKey: 'chat/template',       title: 'Шаблон для підсумків зустрічей',      description: 'Одного разу робиш — потім просто заповнюєш після кожного дзвінку.',             tool: 'claude',      group: 'chat' },
  { promptKey: 'chat/checklist',      title: 'Чеклист для дизайн-ревʼю',            description: 'UX, UI, accessibility — один файл в Notion, використовуєш на кожному проекті.', tool: 'claude',      group: 'chat' },
  { promptKey: 'chat/prompt-library', title: 'Набір промптів для UX-ресерчу',       description: 'Синтез, гіпотези, питання для інтервʼю — все готове, просто копіюй.',         tool: 'claude',      group: 'chat' },
  { promptKey: 'analyze/transcript',  title: 'Промпт для аналізу транскриптів',     description: 'Вставляєш текст будь-якого дзвінку — виходить структурований інсайт.',           tool: 'claude',      group: 'analyze' },
  { promptKey: 'analyze/framework',   title: 'Фреймворк для порівняння рішень',     description: 'Таблиця в Notion — заповнюєш коли треба вибрати між двома підходами.',          tool: 'claude',      group: 'analyze' },
  { promptKey: 'analyze/assistant',   title: 'AI-асистент для аналізу брифів',      description: 'Налаштовуєш Claude Project один раз — далі він сам знає що шукати в брифі.',    tool: 'claude',      group: 'analyze' },
  { promptKey: 'build/automation',    title: 'Аудит дизайн-токенів',                description: 'Плагін сканує весь файл і показує де хардкод замість токенів.',                 tool: 'claude-code', group: 'build' },
  { promptKey: 'build/script',        title: 'Скрипт для документації компонентів', description: 'JS який генерує Markdown-доку прямо з Figma — один раз, реюзаєш завжди.',       tool: 'claude-code', group: 'build' },
  { promptKey: 'build/plugin',        title: 'Figma плагін для перевірки стилів',   description: 'Повний код — запускаєш локально в Figma Desktop за 5 хвилин.',                  tool: 'claude-code', group: 'build' },
]

const GROUP_LABEL: Record<string, string> = {
  chat:    'Чат з AI',
  analyze: 'Аналіз',
  build:   'Будую інструменти',
}

const STAGE_TO_GROUP: Record<string, string> = {
  experimenting: 'chat', tasks: 'chat', 'next-level': 'analyze', build: 'build',
  chat: 'chat', analyze: 'analyze',
}

const BLOCKER_OFFSET: Record<string, number> = {
  'no-idea': 0, 'weak-results': 0, 'no-time': 0, 'want-harder': 1, 'has-idea': 1,
  automate: 0, 'build-tool': 1, inspired: 1, examples: 0,
}

const TRAJECTORY_OFFSET: Record<string, number> = {
  routine: 0, analysis: 0, content: 1, flows: 2,
}

function getRecommendedIndex(stage: string, blocker: string, trajectory: string): number {
  const group = STAGE_TO_GROUP[stage] ?? 'chat'
  const baseIndex = PATH.findIndex(c => c.group === group)
  const offset = trajectory ? (TRAJECTORY_OFFSET[trajectory] ?? 0) : (BLOCKER_OFFSET[blocker] ?? 0)
  return Math.min(baseIndex + offset, PATH.length - 1)
}

function ToolBadge({ tool, inverted }: { tool: 'claude' | 'claude-code'; inverted?: boolean }) {
  const isCode = tool === 'claude-code'
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      color: inverted ? (isCode ? '#111' : '#555') : (isCode ? '#fff' : '#555'),
      background: inverted ? (isCode ? '#fff' : '#f0f0f0') : (isCode ? '#111' : '#f0f0f0'),
      borderRadius: 5,
      padding: '3px 8px',
      letterSpacing: 0.3,
      display: 'inline-block',
    }}>
      {isCode ? 'Claude Code' : 'Claude'}
    </span>
  )
}

function Modal({ card, suggestion, onClose, onDone }: {
  card: PathCard
  suggestion: Suggestion
  onClose: () => void
  onDone: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [done, setDone] = useState(false)
  const isCode = suggestion.cta === 'claude-code'

  function handleCopy() {
    navigator.clipboard.writeText(suggestion.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCodeCopy() {
    navigator.clipboard.writeText(suggestion.prompt)
    setCodeCopied(true)
  }

  function handleOpen() {
    const encoded = encodeURIComponent(suggestion.prompt)
    window.open(`https://claude.ai/new?q=${encoded}`, '_blank')
  }

  function handleDone() {
    setDone(true)
    onDone()
  }

  if (done) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100,
      }} onClick={onClose}>
        <div style={{
          background: '#111', borderRadius: '20px 20px 0 0', padding: '32px 24px 48px',
          width: '100%', maxWidth: 480,
        }} onClick={e => e.stopPropagation()}>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 8 }}>
            Ти вже не та що збиралася
          </p>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 32 }}>
            ти та що зробила
          </p>
          <button onClick={onClose} style={{
            width: '100%', padding: '14px', borderRadius: 10,
            border: '1.5px solid rgba(255,255,255,0.2)', background: 'transparent',
            color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}>
            Зробити ще один крок →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100,
    }} onClick={onClose}>
      <div style={{
        background: '#fafafa', borderRadius: '20px 20px 0 0',
        padding: '24px 24px 48px', width: '100%', maxWidth: 480,
        maxHeight: '90dvh', overflowY: 'auto',
      }} onClick={e => e.stopPropagation()}>

        {/* Handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 2, background: '#ddd',
          margin: '0 auto 20px',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <ToolBadge tool={card.tool} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '10px 0 4px', lineHeight: 1.3 }}>
              {suggestion.title}
            </h2>
            <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>
              Отримаєш: {suggestion.artifact}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 20, color: '#bbb',
            cursor: 'pointer', padding: '0 0 0 16px', lineHeight: 1,
          }}>×</button>
        </div>

        {/* Prompt box */}
        <div style={{
          background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 12,
          padding: '16px', marginBottom: 16, fontSize: 13, color: '#555',
          lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'inherit',
          maxHeight: 200, overflowY: 'auto',
        }}>
          {suggestion.prompt}
        </div>

        {/* CTAs */}
        {isCode ? (
          <>
            <button onClick={handleCodeCopy} style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              background: '#111', color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', marginBottom: 12,
            }}>
              {codeCopied ? 'Скопійовано ✓' : 'Скопіювати промпт'}
            </button>
            {codeCopied && (
              <div style={{
                background: '#111', borderRadius: 10, padding: '14px 16px',
                marginBottom: 12, fontSize: 13, color: '#fff',
              }}>
                <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Далі в терміналі:</p>
                <p style={{ margin: '0 0 4px', opacity: 0.7 }}>1. Відкрий термінал</p>
                <p style={{ margin: '0 0 4px', opacity: 0.7 }}>2. Введи команду:</p>
                <code style={{
                  display: 'block', background: '#222', borderRadius: 6,
                  padding: '8px 12px', fontSize: 13, color: '#7fff7f', marginTop: 6,
                }}>claude</code>
                <p style={{ margin: '8px 0 0', opacity: 0.7 }}>3. Вставте промпт і натисніть Enter</p>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <button onClick={handleCopy} style={{
              padding: '13px', borderRadius: 10,
              border: '1.5px solid #e5e5e5', background: '#fff',
              color: '#111', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              {copied ? 'Скопійовано ✓' : 'Скопіювати'}
            </button>
            <button onClick={handleOpen} style={{
              padding: '13px', borderRadius: 10, border: 'none',
              background: '#111', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>
              Відкрити в Claude →
            </button>
          </div>
        )}

        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 16 }}>
          <button onClick={handleDone} style={{
            width: '100%', padding: '14px', borderRadius: 10,
            border: '1.5px solid #e5e5e5', background: '#fff',
            color: '#111', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Я спробувала ✓
          </button>
        </div>

      </div>
    </div>
  )
}

function StepsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState<PathCard | null>(null)

  const stage      = searchParams.get('stage')      ?? searchParams.get('level')  ?? 'experimenting'
  const blocker    = searchParams.get('blocker')    ?? searchParams.get('pain')   ?? 'no-idea'
  const trajectory = searchParams.get('trajectory') ?? ''
  const mode       = searchParams.get('mode')       ?? 'guided'

  const recommendedIndex = getRecommendedIndex(stage, blocker, trajectory)

  useEffect(() => {
    if (!scrollRef.current) return
    const cards = scrollRef.current.querySelectorAll('[data-card]')
    const target = cards[recommendedIndex] as HTMLElement
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [recommendedIndex])

  function handleDone() {
    if (!activeCard) return
    try {
      const builds = JSON.parse(localStorage.getItem('itdepends_builds') ?? '[]')
      const s = PROMPTS[activeCard.promptKey] ?? FALLBACK
      builds.push({ card: activeCard.promptKey, title: s.title, tool: s.cta, stage, blocker, date: new Date().toISOString() })
      localStorage.setItem('itdepends_builds', JSON.stringify(builds))
    } catch {}
  }

  function handleCloseModal() {
    setActiveCard(null)
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fafafa' }}>

      {/* Header */}
      <div style={{ padding: '0 24px', marginBottom: 20 }}>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => router.back()}
            style={{ fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            ← Назад
          </button>
          <p style={{ fontSize: 13, color: '#aaa', letterSpacing: 0.3, textTransform: 'uppercase', margin: 0 }}>
            It Depends
          </p>
          <div style={{ width: 40 }} />
        </div>
      </div>

      <div style={{ padding: '0 24px', marginBottom: 16 }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>
            Твій шлях
          </h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
            Вибери будь-який крок — рекомендований виділений
          </p>
        </div>
      </div>

      {/* Path — horizontal scroll */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          padding: '16px 24px 20px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {PATH.map((card, i) => {
          const isRecommended = i === recommendedIndex
          const isPast = i < recommendedIndex
          return (
            <button
              key={card.promptKey}
              data-card={i}
              onClick={() => setActiveCard(card)}
              style={{
                flexShrink: 0,
                width: 180,
                padding: '14px',
                borderRadius: 14,
                border: isRecommended ? '2px solid #111' : '1.5px solid #e5e5e5',
                background: isRecommended ? '#111' : '#fff',
                textAlign: 'left',
                cursor: 'pointer',
                outline: 'none',
                scrollSnapAlign: 'center',
                opacity: isPast ? 0.35 : 1,
                transition: 'opacity 0.2s',
                position: 'relative',
              }}
            >
              {isRecommended && (
                <div style={{
                  position: 'absolute', top: -10, left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#111', color: '#fff',
                  fontSize: 9, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 20,
                  whiteSpace: 'nowrap', letterSpacing: 0.5,
                }}>
                  ★ ДЛЯ ТЕБЕ
                </div>
              )}
              <div style={{
                fontSize: 9, color: isRecommended ? 'rgba(255,255,255,0.4)' : '#bbb',
                fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {GROUP_LABEL[card.group]}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 600,
                color: isRecommended ? '#fff' : '#111',
                lineHeight: 1.3, marginBottom: 10,
              }}>
                {card.title}
              </div>
              <ToolBadge tool={card.tool} inverted={isRecommended} />
            </button>
          )
        })}
      </div>

      {/* Modal */}
      {activeCard && (
        <Modal
          card={activeCard}
          suggestion={PROMPTS[activeCard.promptKey] ?? FALLBACK}
          onClose={handleCloseModal}
          onDone={handleDone}
        />
      )}

    </div>
  )
}

export default function StepsPage() {
  return (
    <Suspense>
      <StepsContent />
    </Suspense>
  )
}
