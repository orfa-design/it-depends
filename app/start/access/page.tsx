'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const ALL_OPTIONS = [
  { value: 'claude',      label: 'Claude.ai Free',         sub: 'claude.ai без підписки' },
  { value: 'claude-pro',  label: 'Claude Pro або Team',    sub: 'Більше контексту, пріоритет доступу' },
  { value: 'claude-code', label: 'Claude Code',            sub: 'CLI інструмент у терміналі' },
  { value: 'lovable',     label: 'Lovable',                sub: 'Генерує веб-додатки з промпту' },
  { value: 'figma-make',  label: 'Figma Make',             sub: 'AI прямо у Figma' },
  { value: 'cursor',      label: 'Cursor',                 sub: 'IDE з вбудованим AI' },
]

function orderedOptions(level: string) {
  if (level === 'build') {
    const priority = ['claude-code', 'cursor']
    return [
      ...ALL_OPTIONS.filter(o => priority.includes(o.value)),
      ...ALL_OPTIONS.filter(o => !priority.includes(o.value)),
    ]
  }
  const priority = ['claude', 'claude-pro']
  return [
    ...ALL_OPTIONS.filter(o => priority.includes(o.value)),
    ...ALL_OPTIONS.filter(o => !priority.includes(o.value)),
  ]
}

function AccessContent() {
  const [selected, setSelected] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const level = searchParams.get('level') ?? ''
  const pain  = searchParams.get('pain')  ?? ''

  const options = orderedOptions(level)

  function toggle(value: string) {
    setSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function handleConfirm() {
    try {
      localStorage.setItem('itdepends_profile', JSON.stringify({ level, access: selected }))
    } catch {}
    router.push(`/start/steps?level=${level}&pain=${pain}&access=${selected.join(',')}`)
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

        <h1 style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#111',
          marginBottom: 8,
          lineHeight: 1.3,
        }}>
          Що маєш під рукою?
        </h1>

        <p style={{
          fontSize: 15,
          color: '#888',
          marginBottom: 40,
        }}>
          Вибери все що є — підберемо крок під твої інструменти.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {options.map(opt => {
            const isSelected = selected.includes(opt.value)
            return (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  borderRadius: 14,
                  border: `2px solid ${isSelected ? '#111' : '#e5e5e5'}`,
                  background: isSelected ? '#111' : '#fff',
                  color: isSelected ? '#fff' : '#111',
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
                  color: isSelected ? 'rgba(255,255,255,0.6)' : '#999',
                }}>
                  {opt.sub}
                </div>
              </button>
            )
          })}
        </div>

        {selected.length > 0 && (
          <button
            onClick={handleConfirm}
            style={{
              width: '100%',
              marginTop: 20,
              padding: '16px 24px',
              borderRadius: 12,
              border: 'none',
              background: '#111',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              letterSpacing: 0.2,
              transition: 'opacity 0.15s ease',
            }}
          >
            Далі →
          </button>
        )}

      </div>
    </div>
  )
}

export default function AccessPage() {
  return (
    <Suspense>
      <AccessContent />
    </Suspense>
  )
}
