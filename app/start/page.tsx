'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const OPTIONS = [
  {
    value: 'chat',
    label: 'Питала питання в чаті',
    sub: 'ChatGPT, Claude, Gemini...',
  },
  {
    value: 'analyze',
    label: 'Аналізувала документи або зображення',
    sub: 'Брифи, транскрипти, скріншоти...',
  },
  {
    value: 'build',
    label: 'Будувала щось за межами чату',
    sub: 'Плагін, скіл, автоматизація...',
  },
]

export default function StartPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()

  function handleSelect(value: string) {
    setSelected(value)
    setTimeout(() => {
      router.push(`/start/pain?level=${value}`)
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
                background: i === 1 ? '#111' : '#ddd',
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
          Що з AI робила за останній місяць?
        </h1>

        <p style={{
          fontSize: 15,
          color: '#888',
          marginBottom: 40,
        }}>
          Вибери одне — це визначить з чого почати.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                width: '100%',
                padding: '20px 24px',
                borderRadius: 14,
                border: `2px solid ${selected === opt.value ? '#111' : '#e5e5e5'}`,
                background: selected === opt.value ? '#111' : '#fff',
                color: selected === opt.value ? '#fff' : '#111',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                {opt.label}
              </div>
              <div style={{
                fontSize: 13,
                color: selected === opt.value ? 'rgba(255,255,255,0.6)' : '#999',
              }}>
                {opt.sub}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
