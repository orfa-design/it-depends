'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const RETURN_OPTIONS = [
  { value: 'no-idea',      label: 'Не знаю що саме пробувати',              sub: 'Покажіть що взагалі можливо' },
  { value: 'want-harder',  label: 'Хочу перейти до складніших речей',        sub: 'Вже роблю базове, хочу більше' },
  { value: 'has-idea',     label: 'Маю ідею — допоможіть реалізувати',       sub: 'Знаю що хочу, не знаю як' },
  { value: 'no-time',      label: 'Хочу автоматизувати щось конкретне',      sub: 'Є рутина яка забирає час' },
]

const FIRST_VISIT_OPTIONS = [
  { value: 'experimenting', label: 'Я тільки починаю — пробую різне',         sub: 'Ще шукаю де AI справді допомагає' },
  { value: 'tasks',         label: 'Використовую для окремих задач',           sub: 'Чат, аналіз, підсумки — але хочу більше' },
  { value: 'next-level',    label: 'AI вже в моїй роботі — хочу наступний рівень', sub: 'Економлю час, тепер хочу будувати' },
  { value: 'build',         label: 'Хочу будувати власні інструменти',         sub: 'Плагіни, скрипти, автоматизація' },
]

type Profile = { stage: string; access: string[] }
type Build   = { card: string; title: string; tool: string; stage: string; blocker: string; date: string }

export default function StartPage() {
  const [isReturn, setIsReturn]   = useState(false)
  const [lastBuild, setLastBuild] = useState<Build | null>(null)
  const [profile, setProfile]     = useState<Profile | null>(null)
  const [selected, setSelected]   = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const builds: Build[]  = JSON.parse(localStorage.getItem('itdepends_builds')  ?? '[]')
      const prof: Profile | null = JSON.parse(localStorage.getItem('itdepends_profile') ?? 'null')
      if (builds.length > 0 && prof) {
        setIsReturn(true)
        setLastBuild(builds[builds.length - 1])
        setProfile(prof)
      }
    } catch {}
  }, [])

  function handleFirstVisit(value: string) {
    setSelected(value)
    setTimeout(() => router.push(`/start/pain?stage=${value}`), 300)
  }

  function handleReturn(blocker: string) {
    if (!profile) return
    setSelected(blocker)
    setTimeout(() => {
      router.push(`/start/steps?stage=${profile.stage}&blocker=${blocker}&trajectory=routine&mode=guided`)
    }, 300)
  }

  if (isReturn && profile) {
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
            <button
              onClick={() => router.push('/profile')}
              style={{ fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Мій профіль →
            </button>
          </div>

          {lastBuild && (
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 6 }}>Востаннє ти зробила:</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>{lastBuild.title} ✓</p>
            </div>
          )}

          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.3 }}>
            Що зараз найбільше заважає рухатись далі?
          </h1>
          <p style={{ fontSize: 15, color: '#888', marginBottom: 40 }}>
            Вибери одне — підберемо наступний крок.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RETURN_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleReturn(opt.value)}
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
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{opt.label}</div>
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
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i === 1 ? '#111' : '#ddd',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.3 }}>
          Як AI зараз виглядає у твоїй роботі?
        </h1>
        <p style={{ fontSize: 15, color: '#888', marginBottom: 40 }}>
          Вибери одне — це визначить з чого почати.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FIRST_VISIT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleFirstVisit(opt.value)}
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
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{opt.label}</div>
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
