'use client'

import { Suspense, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Card = {
  promptKey: string
  title: string
  description: string
  tool: 'claude' | 'claude-code'
  group: 'chat' | 'analyze' | 'build'
}

// Full path — all 9 unique steps ordered by complexity
const PATH: Card[] = [
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
  analyze: 'Аналіз і дослідження',
  build:   'Будую інструменти',
}

// Map new onboarding params → recommended card index
const STAGE_TO_GROUP: Record<string, string> = {
  experimenting: 'chat', tasks: 'chat', 'next-level': 'analyze', build: 'build',
  chat: 'chat', analyze: 'analyze',
}

const BLOCKER_OFFSET: Record<string, number> = {
  'no-idea': 0, 'weak-results': 0, 'no-time': 0,
  'want-harder': 1, 'has-idea': 1,
  automate: 0, 'build-tool': 1, inspired: 1, examples: 0,
}

const TRAJECTORY_OFFSET: Record<string, number> = {
  routine: 0, analysis: 0, content: 1, flows: 2,
}

function getRecommendedIndex(stage: string, blocker: string, trajectory: string): number {
  const group = STAGE_TO_GROUP[stage] ?? 'chat'
  const baseIndex = PATH.findIndex(c => c.group === group)
  const offset = trajectory
    ? (TRAJECTORY_OFFSET[trajectory] ?? 0)
    : (BLOCKER_OFFSET[blocker] ?? 0)
  return Math.min(baseIndex + offset, PATH.length - 1)
}

function ToolBadge({ tool }: { tool: 'claude' | 'claude-code' }) {
  const isCode = tool === 'claude-code'
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 600,
      color: isCode ? '#fff' : '#666',
      background: isCode ? '#111' : '#f0f0f0',
      borderRadius: 4,
      padding: '2px 6px',
      letterSpacing: 0.3,
      display: 'inline-block',
      whiteSpace: 'nowrap',
    }}>
      {isCode ? 'Claude Code' : 'Claude'}
    </span>
  )
}

function StepsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scrollRef = useRef<HTMLDivElement>(null)

  const stage      = searchParams.get('stage')      ?? searchParams.get('level')   ?? 'experimenting'
  const blocker    = searchParams.get('blocker')    ?? searchParams.get('pain')    ?? 'no-idea'
  const trajectory = searchParams.get('trajectory') ?? ''
  const mode       = searchParams.get('mode')       ?? 'guided'

  const recommendedIndex = getRecommendedIndex(stage, blocker, trajectory)
  const recommended = PATH[recommendedIndex]

  useEffect(() => {
    if (!scrollRef.current) return
    const cards = scrollRef.current.querySelectorAll('[data-card]')
    const target = cards[recommendedIndex] as HTMLElement
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [recommendedIndex])

  function navigate(card: Card) {
    const task = card.promptKey.split('/').slice(1).join('/') || card.promptKey
    router.push(`/start/suggest?stage=${stage}&blocker=${blocker}&trajectory=${trajectory}&mode=${mode}&task=${task}`)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: '#fafafa',
    }}>

      {/* Header */}
      <div style={{ padding: '0 24px', marginBottom: 24 }}>
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

      {/* Intro */}
      <div style={{ padding: '0 24px', marginBottom: 20 }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
            Ось весь шлях — вибери звідси будь-який крок
          </p>
        </div>
      </div>

      {/* Path — horizontal scroll */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          padding: '8px 24px 16px',
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
              onClick={() => navigate(card)}
              style={{
                flexShrink: 0,
                width: 200,
                padding: '16px',
                borderRadius: 14,
                border: isRecommended ? '2px solid #111' : '1.5px solid #e5e5e5',
                background: isRecommended ? '#111' : '#fff',
                textAlign: 'left',
                cursor: 'pointer',
                outline: 'none',
                scrollSnapAlign: 'center',
                opacity: isPast ? 0.4 : 1,
                transition: 'opacity 0.2s',
                position: 'relative',
              }}
            >
              {isRecommended && (
                <div style={{
                  position: 'absolute',
                  top: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#111',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 20,
                  whiteSpace: 'nowrap',
                  letterSpacing: 0.3,
                }}>
                  ★ для тебе
                </div>
              )}
              <div style={{ marginBottom: 8 }}>
                <span style={{
                  fontSize: 10,
                  color: isRecommended ? 'rgba(255,255,255,0.5)' : '#bbb',
                  fontWeight: 500,
                  letterSpacing: 0.3,
                  textTransform: 'uppercase',
                }}>
                  {GROUP_LABEL[card.group]}
                </span>
              </div>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: isRecommended ? '#fff' : '#111',
                lineHeight: 1.3,
                marginBottom: 10,
              }}>
                {card.title}
              </div>
              <ToolBadge tool={card.tool} />
            </button>
          )
        })}
      </div>

      {/* Selected card detail */}
      <div style={{ padding: '0 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{
            background: '#fff',
            border: '1.5px solid #e5e5e5',
            borderRadius: 18,
            padding: '24px',
          }}>
            <ToolBadge tool={recommended.tool} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '12px 0 8px', lineHeight: 1.3 }}>
              {recommended.title}
            </h2>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 20 }}>
              {recommended.description}
            </p>
            <button
              onClick={() => navigate(recommended)}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: 10,
                border: 'none',
                background: '#111',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Спробую це →
            </button>
          </div>
        </div>
      </div>

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
