'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const OPTIONS = [
  { value: 'no-idea',      label: 'Не знаю що саме пробувати',              sub: 'Хочу побачити що взагалі можливо' },
  { value: 'weak-results', label: 'Пробувала, але результати слабкі',       sub: 'Щось не так — не розумію де помилка' },
  { value: 'no-time',      label: 'Не вистачає часу розбиратись',           sub: 'Є задача — треба швидко і конкретно' },
  { value: 'want-harder',  label: 'Хочу перейти до складніших речей',       sub: 'Базове вже роблю, хочу наступний рівень' },
  { value: 'has-idea',     label: 'Маю ідею, але не знаю як реалізувати',   sub: 'Знаю що хочу — допоможіть почати' },
]

function PainContent() {
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const stage = searchParams.get('stage') ?? ''

  function handleSelect(value: string) {
    setSelected(value)
    setTimeout(() => {
      router.push(`/start/access?stage=${stage}&blocker=${value}`)
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
                background: i <= 2 ? '#111' : '#ddd',
                opacity: i === 1 ? 0.4 : 1,
              }} />
            ))}
          </div>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.3 }}>
          Що зараз найбільше заважає рухатись далі?
        </h1>

        <p style={{ fontSize: 15, color: '#888', marginBottom: 40 }}>
          Вибери одне — підберемо крок під твою ситуацію.
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

export default function PainPage() {
  return (
    <Suspense>
      <PainContent />
    </Suspense>
  )
}
