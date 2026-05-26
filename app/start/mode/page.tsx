'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const OPTIONS = [
  {
    value: 'guided',
    label: 'Дайте мені готовий наступний крок',
    sub: 'Запропонуйте — я спробую',
  },
  {
    value: 'builder',
    label: 'Я хочу побудувати щось своє',
    sub: 'Маю ідею або хочу більше свободи',
  },
]

function ModeContent() {
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const stage      = searchParams.get('stage')      ?? ''
  const blocker    = searchParams.get('blocker')    ?? ''
  const trajectory = searchParams.get('trajectory') ?? ''

  function handleSelect(value: string) {
    setSelected(value)
    try {
      localStorage.setItem('itdepends_profile', JSON.stringify({ stage, trajectory, blocker }))
    } catch {}
    setTimeout(() => {
      router.push(`/start/steps?stage=${stage}&blocker=${blocker}&trajectory=${trajectory}&mode=${value}`)
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
                opacity: i < 4 ? 0.4 : 1,
              }} />
            ))}
          </div>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.3 }}>
          Як тобі зручніше?
        </h1>

        <p style={{ fontSize: 15, color: '#888', marginBottom: 40 }}>
          Останнє питання.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                width: '100%',
                padding: '24px',
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
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{opt.label}</div>
              <div style={{ fontSize: 13, color: selected === opt.value ? 'rgba(255,255,255,0.6)' : '#999' }}>
                {opt.sub}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default function ModePage() {
  return (
    <Suspense>
      <ModeContent />
    </Suspense>
  )
}
