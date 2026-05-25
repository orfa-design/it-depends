'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Task = { value: string; label: string; sub: string }

const TASKS: Record<string, Task[]> = {
  chat: [
    {
      value: 'template',
      label: 'Шаблон для підсумків зустрічей',
      sub: 'Готовий Markdown — вставиш у Notion і реюзатимеш',
    },
    {
      value: 'prompt-library',
      label: 'Набір промптів для UX-ресерчу',
      sub: '5 готових промптів: синтез, гіпотези, інтервʼю...',
    },
    {
      value: 'checklist',
      label: 'Чеклист для дизайн-ревʼю',
      sub: 'UX + UI + accessibility — один файл, назавжди',
    },
  ],
  analyze: [
    {
      value: 'assistant',
      label: 'AI-асистент для аналізу брифів',
      sub: 'System prompt для Claude Project — налаштовуєш раз',
    },
    {
      value: 'transcript',
      label: 'Промпт для аналізу транскриптів',
      sub: 'Вставляєш текст — виходить структурований інсайт',
    },
    {
      value: 'framework',
      label: 'Фреймворк для UX-рішень',
      sub: 'Notion-таблиця для порівняння дизайн-варіантів',
    },
  ],
  build: [
    {
      value: 'plugin',
      label: 'Figma плагін для перевірки стилів',
      sub: 'Повний код: manifest + логіка + UI — готовий до запуску',
    },
    {
      value: 'script',
      label: 'Скрипт для документації компонентів',
      sub: 'JS який генерує Markdown-доку прямо з Figma',
    },
    {
      value: 'automation',
      label: 'Аудит дизайн-токенів по всьому файлу',
      sub: 'Плагін що сканує файл і видає звіт по відхиленнях',
    },
  ],
}

const FALLBACK: Task[] = TASKS.chat

function TaskContent() {
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const level = searchParams.get('level') ?? 'chat'
  const tasks = TASKS[level] ?? FALLBACK

  function handleSelect(value: string) {
    setSelected(value)
    setTimeout(() => {
      router.push(`/start/suggest?level=${level}&task=${value}`)
    }, 300)
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
          <p style={{ fontSize: 13, color: '#aaa', letterSpacing: 0.3, textTransform: 'uppercase', margin: 0 }}>
            It Depends
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i === 2 ? '#111' : i === 1 ? '#111' : '#ddd',
                opacity: i === 1 ? 0.3 : 1,
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
        </div>

        <h1 style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#111',
          marginBottom: 8,
          lineHeight: 1.3,
        }}>
          Що зробимо прямо зараз?
        </h1>

        <p style={{
          fontSize: 15,
          color: '#888',
          marginBottom: 40,
        }}>
          Вийдеш з готовим артефактом — не просто відповіддю.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tasks.map(task => (
            <button
              key={task.value}
              onClick={() => handleSelect(task.value)}
              style={{
                width: '100%',
                padding: '20px 24px',
                borderRadius: 14,
                border: `2px solid ${selected === task.value ? '#111' : '#e5e5e5'}`,
                background: selected === task.value ? '#111' : '#fff',
                color: selected === task.value ? '#fff' : '#111',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                {task.label}
              </div>
              <div style={{
                fontSize: 13,
                color: selected === task.value ? 'rgba(255,255,255,0.6)' : '#999',
              }}>
                {task.sub}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default function TaskPage() {
  return (
    <Suspense>
      <TaskContent />
    </Suspense>
  )
}
