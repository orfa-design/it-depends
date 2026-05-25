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

function rankByAccess(cards: Card[], accessList: string[]): Card[] {
  const compatible = (tool: string) =>
    tool === 'claude' ? accessList.some(a => a === 'claude' || a === 'claude-pro')
    : accessList.includes(tool)
  return [
    ...cards.filter(c => compatible(c.tool)),
    ...cards.filter(c => !compatible(c.tool)),
  ]
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

  const level  = searchParams.get('level')  ?? 'chat'
  const pain   = searchParams.get('pain')   ?? 'examples'
  const access = searchParams.get('access') ?? 'claude'
  const accessList = access ? access.split(',') : ['claude']

  const key = `${level}/${pain}`
  const rawCards = CARDS[key] ?? CARDS[`${level}/examples`] ?? CARDS['chat/examples']
  const cards = rankByAccess(rawCards, accessList)

  const mainCard = cards[0]
  const altCards = cards.slice(1, 3)

  function navigate(promptKey: string) {
    // suggest page builds key as `${level}/${task}` — pass only the suffix after level prefix
    const task = promptKey.split('/').slice(1).join('/') || promptKey
    router.push(`/start/suggest?level=${level}&pain=${pain}&access=${access}&task=${task}`)
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
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#111',
                opacity: i < 3 ? 0.3 : 1,
              }} />
            ))}
          </div>
        </div>

        {/* Main card label */}
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

        {/* Alternates label */}
        {altCards.length > 0 && (
          <>
            <p style={{ fontSize: 12, color: '#aaa', marginBottom: 10, fontWeight: 500 }}>
              Інші варіанти:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
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

        {/* Show more — MVP placeholder */}
        <button
          style={{
            width: '100%',
            padding: '12px 24px',
            borderRadius: 10,
            border: '1.5px solid #e5e5e5',
            background: 'transparent',
            color: '#bbb',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'default',
            outline: 'none',
          }}
        >
          ↓ Показати більше
        </button>

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
