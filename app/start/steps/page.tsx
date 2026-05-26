'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Card = {
  promptKey: string
  title: string
  description: string
  tool: 'claude' | 'claude-code'
}

const CARDS: Record<string, Card[]> = {
  'chat/automate': [
    { promptKey: 'chat/template',      title: 'Шаблон для підсумків зустрічей',  description: 'Одного разу робиш — потім просто заповнюєш після кожного дзвінку.',             tool: 'claude' },
    { promptKey: 'chat/checklist',     title: 'Чеклист для дизайн-ревʼю',        description: 'UX, UI, accessibility — один файл в Notion, використовуєш на кожному проекті.', tool: 'claude' },
    { promptKey: 'chat/prompt-library',title: 'Набір промптів для UX-ресерчу',   description: 'Синтез, гіпотези, питання для інтервʼю — все готове, просто копіюй.',         tool: 'claude' },
  ],
  'chat/build-tool': [
    { promptKey: 'chat/prompt-library',title: 'Набір промптів для UX-ресерчу',   description: 'Синтез, гіпотези, питання для інтервʼю — все готове, просто копіюй.',         tool: 'claude' },
    { promptKey: 'chat/template',      title: 'Шаблон для підсумків зустрічей',  description: 'Одного разу робиш — потім просто заповнюєш після кожного дзвінку.',             tool: 'claude' },
    { promptKey: 'chat/checklist',     title: 'Чеклист для дизайн-ревʼю',        description: 'UX, UI, accessibility — один файл в Notion, використовуєш на кожному проекті.', tool: 'claude' },
  ],
  'chat/inspired': [
    { promptKey: 'chat/checklist',     title: 'Чеклист для дизайн-ревʼю',        description: 'UX, UI, accessibility — один файл в Notion, використовуєш на кожному проекті.', tool: 'claude' },
    { promptKey: 'chat/prompt-library',title: 'Набір промптів для UX-ресерчу',   description: 'Синтез, гіпотези, питання для інтервʼю — все готове, просто копіюй.',         tool: 'claude' },
    { promptKey: 'chat/template',      title: 'Шаблон для підсумків зустрічей',  description: 'Одного разу робиш — потім просто заповнюєш після кожного дзвінку.',             tool: 'claude' },
  ],
  'chat/examples': [
    { promptKey: 'chat/template',      title: 'Шаблон для підсумків зустрічей',  description: 'Одного разу робиш — потім просто заповнюєш після кожного дзвінку.',             tool: 'claude' },
    { promptKey: 'chat/prompt-library',title: 'Набір промптів для UX-ресерчу',   description: 'Синтез, гіпотези, питання для інтервʼю — все готове, просто копіюй.',         tool: 'claude' },
    { promptKey: 'chat/checklist',     title: 'Чеклист для дизайн-ревʼю',        description: 'UX, UI, accessibility — один файл в Notion, використовуєш на кожному проекті.', tool: 'claude' },
  ],

  'analyze/automate': [
    { promptKey: 'analyze/framework',  title: 'Фреймворк для порівняння рішень', description: 'Таблиця в Notion — заповнюєш коли треба вибрати між двома підходами.',          tool: 'claude' },
    { promptKey: 'analyze/transcript', title: 'Промпт для аналізу транскриптів', description: 'Вставляєш текст будь-якого дзвінку — виходить структурований інсайт.',           tool: 'claude' },
    { promptKey: 'analyze/assistant',  title: 'AI-асистент для аналізу брифів',  description: 'Налаштовуєш Claude Project один раз — далі він сам знає що шукати в брифі.',    tool: 'claude' },
  ],
  'analyze/build-tool': [
    { promptKey: 'analyze/assistant',  title: 'AI-асистент для аналізу брифів',  description: 'Налаштовуєш Claude Project один раз — далі він сам знає що шукати в брифі.',    tool: 'claude' },
    { promptKey: 'analyze/framework',  title: 'Фреймворк для порівняння рішень', description: 'Таблиця в Notion — заповнюєш коли треба вибрати між двома підходами.',          tool: 'claude' },
    { promptKey: 'analyze/transcript', title: 'Промпт для аналізу транскриптів', description: 'Вставляєш текст будь-якого дзвінку — виходить структурований інсайт.',           tool: 'claude' },
  ],
  'analyze/inspired': [
    { promptKey: 'analyze/transcript', title: 'Промпт для аналізу транскриптів', description: 'Вставляєш текст будь-якого дзвінку — виходить структурований інсайт.',           tool: 'claude' },
    { promptKey: 'analyze/assistant',  title: 'AI-асистент для аналізу брифів',  description: 'Налаштовуєш Claude Project один раз — далі він сам знає що шукати в брифі.',    tool: 'claude' },
    { promptKey: 'analyze/framework',  title: 'Фреймворк для порівняння рішень', description: 'Таблиця в Notion — заповнюєш коли треба вибрати між двома підходами.',          tool: 'claude' },
  ],
  'analyze/examples': [
    { promptKey: 'analyze/assistant',  title: 'AI-асистент для аналізу брифів',  description: 'Налаштовуєш Claude Project один раз — далі він сам знає що шукати в брифі.',    tool: 'claude' },
    { promptKey: 'analyze/transcript', title: 'Промпт для аналізу транскриптів', description: 'Вставляєш текст будь-якого дзвінку — виходить структурований інсайт.',           tool: 'claude' },
    { promptKey: 'analyze/framework',  title: 'Фреймворк для порівняння рішень', description: 'Таблиця в Notion — заповнюєш коли треба вибрати між двома підходами.',          tool: 'claude' },
  ],

  'build/automate': [
    { promptKey: 'build/automation',   title: 'Аудит дизайн-токенів',            description: 'Плагін сканує весь файл і показує де хардкод замість токенів.',                 tool: 'claude-code' },
    { promptKey: 'build/script',       title: 'Скрипт для документації компонентів', description: 'JS який генерує Markdown-доку прямо з Figma — один раз, реюзаєш завжди.',   tool: 'claude-code' },
    { promptKey: 'build/plugin',       title: 'Figma плагін для перевірки стилів',   description: 'Повний код — запускаєш локально в Figma Desktop за 5 хвилин.',              tool: 'claude-code' },
  ],
  'build/build-tool': [
    { promptKey: 'build/script',       title: 'Скрипт для документації компонентів', description: 'JS який генерує Markdown-доку прямо з Figma — один раз, реюзаєш завжди.',   tool: 'claude-code' },
    { promptKey: 'build/plugin',       title: 'Figma плагін для перевірки стилів',   description: 'Повний код — запускаєш локально в Figma Desktop за 5 хвилин.',              tool: 'claude-code' },
    { promptKey: 'build/automation',   title: 'Аудит дизайн-токенів',            description: 'Плагін сканує весь файл і показує де хардкод замість токенів.',                 tool: 'claude-code' },
  ],
  'build/inspired': [
    { promptKey: 'build/plugin',       title: 'Figma плагін для перевірки стилів',   description: 'Повний код — запускаєш локально в Figma Desktop за 5 хвилин.',              tool: 'claude-code' },
    { promptKey: 'build/automation',   title: 'Аудит дизайн-токенів',            description: 'Плагін сканує весь файл і показує де хардкод замість токенів.',                 tool: 'claude-code' },
    { promptKey: 'build/script',       title: 'Скрипт для документації компонентів', description: 'JS який генерує Markdown-доку прямо з Figma — один раз, реюзаєш завжди.',   tool: 'claude-code' },
  ],
  'build/examples': [
    { promptKey: 'build/plugin',       title: 'Figma плагін для перевірки стилів',   description: 'Повний код — запускаєш локально в Figma Desktop за 5 хвилин.',              tool: 'claude-code' },
    { promptKey: 'build/script',       title: 'Скрипт для документації компонентів', description: 'JS який генерує Markdown-доку прямо з Figma — один раз, реюзаєш завжди.',   tool: 'claude-code' },
    { promptKey: 'build/automation',   title: 'Аудит дизайн-токенів',            description: 'Плагін сканує весь файл і показує де хардкод замість токенів.',                 tool: 'claude-code' },
  ],
}

// Map new onboarding params to CARDS keys
const STAGE_TO_LEVEL: Record<string, string> = {
  experimenting: 'chat',
  tasks:         'chat',
  'next-level':  'analyze',
  build:         'build',
  // legacy support
  chat:          'chat',
  analyze:       'analyze',
}

const BLOCKER_TO_PAIN: Record<string, string> = {
  'no-idea':      'examples',
  'weak-results': 'examples',
  'no-time':      'automate',
  'want-harder':  'build-tool',
  'has-idea':     'inspired',
  // legacy support
  automate:       'automate',
  'build-tool':   'build-tool',
  inspired:       'inspired',
  examples:       'examples',
}

const TRAJECTORY_TO_PAIN: Record<string, string> = {
  routine:  'automate',
  analysis: 'examples',
  content:  'inspired',
  flows:    'build-tool',
}

function ToolBadge({ tool }: { tool: 'claude' | 'claude-code' }) {
  const isCode = tool === 'claude-code'
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      color: isCode ? '#fff' : '#555',
      background: isCode ? '#111' : '#f0f0f0',
      borderRadius: 5,
      padding: '3px 8px',
      letterSpacing: 0.3,
      display: 'inline-block',
    }}>
      {isCode ? 'Claude Code' : 'Claude'}
    </span>
  )
}

function StepsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const stage      = searchParams.get('stage')      ?? searchParams.get('level')   ?? 'experimenting'
  const blocker    = searchParams.get('blocker')    ?? searchParams.get('pain')    ?? 'examples'
  const trajectory = searchParams.get('trajectory') ?? ''
  const mode       = searchParams.get('mode')       ?? 'guided'

  const level = STAGE_TO_LEVEL[stage]   ?? 'chat'
  const pain  = trajectory
    ? (TRAJECTORY_TO_PAIN[trajectory] ?? BLOCKER_TO_PAIN[blocker] ?? 'examples')
    : (BLOCKER_TO_PAIN[blocker] ?? 'examples')

  const key      = `${level}/${pain}`
  const rawCards = CARDS[key] ?? CARDS[`${level}/examples`] ?? CARDS['chat/examples']

  // builder mode: put open-ended cards first
  const cards = mode === 'builder'
    ? [...rawCards].reverse()
    : rawCards

  const mainCard = cards[0]
  const altCards = cards.slice(1, 3)

  // Path neighbours: simpler = previous level, more advanced = next card
  const allKeys   = Object.keys(CARDS)
  const keyIndex  = allKeys.indexOf(key)
  const simplerKey   = allKeys[keyIndex - 1]
  const advancedKey  = allKeys[keyIndex + 1]
  const simplerCard  = simplerKey  ? CARDS[simplerKey]?.[0]  : null
  const advancedCard = advancedKey ? CARDS[advancedKey]?.[0] : null

  function navigate(promptKey: string) {
    const task = promptKey.split('/').slice(1).join('/') || promptKey
    router.push(`/start/suggest?stage=${stage}&blocker=${blocker}&trajectory=${trajectory}&mode=${mode}&task=${task}`)
  }

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <button
            onClick={() => router.back()}
            style={{ fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            ← Назад
          </button>
          <p style={{ fontSize: 13, color: '#aaa', letterSpacing: 0.3, textTransform: 'uppercase', margin: 0 }}>
            It Depends
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#111',
                opacity: 1,
              }} />
            ))}
          </div>
        </div>

        {/* Path context */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
          overflow: 'hidden',
        }}>
          {simplerCard && (
            <button
              onClick={() => navigate(simplerCard.promptKey)}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 10,
                border: '1.5px solid #e5e5e5',
                background: '#fff',
                textAlign: 'left',
                cursor: 'pointer',
                outline: 'none',
                opacity: 0.5,
              }}
            >
              <div style={{ fontSize: 10, color: '#aaa', marginBottom: 3 }}>← Простіше</div>
              <div style={{ fontSize: 12, color: '#666', fontWeight: 500, lineHeight: 1.3 }}>{simplerCard.title}</div>
            </button>
          )}
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#111', flexShrink: 0,
          }} />
          {advancedCard && (
            <button
              onClick={() => navigate(advancedCard.promptKey)}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 10,
                border: '1.5px solid #e5e5e5',
                background: '#fff',
                textAlign: 'right',
                cursor: 'pointer',
                outline: 'none',
                opacity: 0.5,
              }}
            >
              <div style={{ fontSize: 10, color: '#aaa', marginBottom: 3 }}>Складніше →</div>
              <div style={{ fontSize: 12, color: '#666', fontWeight: 500, lineHeight: 1.3 }}>{advancedCard.title}</div>
            </button>
          )}
        </div>

        <p style={{ fontSize: 13, color: '#888', marginBottom: 8, fontWeight: 500 }}>
          ★ Підібрано для тебе
        </p>

        {/* Main card */}
        <div style={{
          background: '#fff',
          border: '1.5px solid #e5e5e5',
          borderRadius: 18,
          padding: '28px 24px',
          marginBottom: 16,
        }}>
          <ToolBadge tool={mainCard.tool} />
          <h2 style={{ fontSize: 19, fontWeight: 700, color: '#111', margin: '14px 0 10px', lineHeight: 1.3 }}>
            {mainCard.title}
          </h2>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 20 }}>
            {mainCard.description}
          </p>
          <button
            onClick={() => navigate(mainCard.promptKey)}
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
              letterSpacing: 0.2,
            }}
          >
            Спробую це →
          </button>
        </div>

        {altCards.length > 0 && (
          <>
            <p style={{ fontSize: 12, color: '#aaa', marginBottom: 10, fontWeight: 500 }}>
              Інші варіанти:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {altCards.map(card => (
                <button
                  key={card.promptKey}
                  onClick={() => navigate(card.promptKey)}
                  style={{
                    padding: '16px',
                    borderRadius: 14,
                    border: '1.5px solid #e5e5e5',
                    background: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <ToolBadge tool={card.tool} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginTop: 10, lineHeight: 1.3 }}>
                    {card.title}
                  </div>
                </button>
              ))}
            </div>
          </>
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
