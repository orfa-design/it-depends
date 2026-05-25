'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Card = {
  promptKey: string
  title: string
  description: string
  tool: 'claude' | 'claude-code'
}

// Proposals by level — pain used in heading for personalization feel
const CARDS: Record<string, Card[]> = {
  chat: [
    {
      promptKey: 'chat/template',
      title: 'Шаблон для підсумків зустрічей',
      description: 'Одного разу робиш — потім просто заповнюєш після кожного дзвінку.',
      tool: 'claude',
    },
    {
      promptKey: 'chat/prompt-library',
      title: 'Набір промптів для UX-ресерчу',
      description: 'Синтез, гіпотези, питання для інтервʼю — все готове, просто копіюй.',
      tool: 'claude',
    },
    {
      promptKey: 'chat/checklist',
      title: 'Чеклист для дизайн-ревʼю',
      description: 'UX, UI, accessibility — один файл в Notion, використовуєш на кожному проекті.',
      tool: 'claude',
    },
  ],
  analyze: [
    {
      promptKey: 'analyze/assistant',
      title: 'AI-асистент для аналізу брифів',
      description: 'Налаштовуєш Claude Project один раз — далі він сам знає що шукати в брифі.',
      tool: 'claude',
    },
    {
      promptKey: 'analyze/transcript',
      title: 'Промпт для аналізу транскриптів',
      description: 'Вставляєш текст будь-якого дзвінку — виходить структурований інсайт.',
      tool: 'claude',
    },
    {
      promptKey: 'analyze/framework',
      title: 'Фреймворк для порівняння рішень',
      description: 'Таблиця в Notion — заповнюєш коли треба вибрати між двома підходами.',
      tool: 'claude',
    },
  ],
  build: [
    {
      promptKey: 'build/plugin',
      title: 'Figma плагін для перевірки стилів',
      description: 'Повний код — запускаєш локально в Figma Desktop за 5 хвилин.',
      tool: 'claude-code',
    },
    {
      promptKey: 'build/script',
      title: 'Скрипт для документації компонентів',
      description: 'JS який генерує Markdown-доку прямо з Figma — один раз, реюзаєш завжди.',
      tool: 'claude-code',
    },
    {
      promptKey: 'build/automation',
      title: 'Аудит дизайн-токенів',
      description: 'Плагін сканує весь файл і показує де хардкод замість токенів.',
      tool: 'claude-code',
    },
  ],
}

const PAIN_LABELS: Record<string, string> = {
  briefs: 'брифи і дзвінки',
  'design-system': 'дизайн-систему',
  presentations: 'презентації',
  other: 'роботу',
}

function StepsContent() {
  const [index, setIndex] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  const level  = searchParams.get('level')  ?? 'chat'
  const pain   = searchParams.get('pain')   ?? 'other'
  const access = searchParams.get('access') ?? 'free'

  const cards = CARDS[level] ?? CARDS.chat
  const card  = cards[index]
  const isLast = index === cards.length - 1

  function handleSkip() {
    if (!isLast) setIndex(i => i + 1)
  }

  function handleSelect() {
    router.push(`/start/suggest?level=${level}&task=${card.promptKey}&access=${access}`)
  }

  const painLabel = PAIN_LABELS[pain] ?? 'роботу'

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      background: '#fafafa',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: '#aaa', letterSpacing: 0.3, textTransform: 'uppercase', margin: 0 }}>
            It Depends
          </p>
          {/* Card counter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {cards.map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i === index ? '#111' : '#ddd',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>
          Під твій рівень і <span style={{ color: '#555', fontWeight: 600 }}>{painLabel}</span> —
        </p>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#111',
          marginBottom: 32,
          lineHeight: 1.3,
        }}>
          Ось що спробуй першим
        </h1>

        {/* Card */}
        <div style={{
          background: '#fff',
          border: '1.5px solid #e5e5e5',
          borderRadius: 18,
          padding: '28px 24px',
          marginBottom: 16,
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: card.tool === 'claude-code' ? '#fff' : '#555',
              background: card.tool === 'claude-code' ? '#111' : '#f0f0f0',
              borderRadius: 5,
              padding: '3px 8px',
              letterSpacing: 0.3,
              display: 'inline-block',
              marginBottom: 14,
            }}>
              {card.tool === 'claude-code' ? 'Claude Code' : 'Claude'}
            </span>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: '#111', marginBottom: 10, lineHeight: 1.3 }}>
              {card.title}
            </h2>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
              {card.description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={handleSelect}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: 12,
            border: 'none',
            background: '#111',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
            marginBottom: 10,
            letterSpacing: 0.2,
          }}
        >
          Спробую це →
        </button>

        {!isLast && (
          <button
            onClick={handleSkip}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 12,
              border: '1.5px solid #e5e5e5',
              background: '#fff',
              color: '#999',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            Не моє — покажи інше
          </button>
        )}

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
