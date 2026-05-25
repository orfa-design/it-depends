'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const LEVEL_LABEL: Record<string, string> = {
  chat: 'Чат з AI',
  analyze: 'Аналіз документів',
  build: 'Будую за межами чату',
}

const TOOL_LABEL: Record<string, string> = {
  claude: 'Claude.ai Free',
  'claude-pro': 'Claude Pro або Team',
  'claude-code': 'Claude Code',
  lovable: 'Lovable',
  'figma-make': 'Figma Make',
  cursor: 'Cursor',
}

type Profile = { level: string; access: string[] }
type Build   = { card: string; title: string; tool: string; date: string }

function relativeDate(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'сьогодні'
    if (days === 1) return 'вчора'
    return `${days} дн. тому`
  } catch {
    return ''
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [builds, setBuilds]   = useState<Build[]>([])
  const router = useRouter()

  useEffect(() => {
    try {
      const prof: Profile | null = JSON.parse(localStorage.getItem('itdepends_profile') ?? 'null')
      const b: Build[] = JSON.parse(localStorage.getItem('itdepends_builds') ?? '[]')
      setProfile(prof)
      setBuilds([...b].reverse())
    } catch {}
  }, [])

  function handleReset() {
    try {
      localStorage.removeItem('itdepends_profile')
      localStorage.removeItem('itdepends_builds')
    } catch {}
    router.push('/start')
  }

  const accessLabels = Array.isArray(profile?.access)
    ? profile.access.map(a => TOOL_LABEL[a] ?? a).join(', ')
    : ''

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      background: '#fafafa',
    }}>
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40, paddingTop: 16 }}>
          <button
            onClick={() => router.back()}
            style={{ fontSize: 15, color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: 16 }}
          >
            ← Назад
          </button>
          <p style={{ fontSize: 13, color: '#aaa', letterSpacing: 0.3, textTransform: 'uppercase', margin: 0 }}>
            Мій профіль
          </p>
        </div>

        {profile ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Мій рівень
              </p>
              <p style={{ fontSize: 16, color: '#111', fontWeight: 500 }}>
                {LEVEL_LABEL[profile.level] ?? profile.level}
              </p>
            </div>

            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Мій доступ
              </p>
              <p style={{ fontSize: 15, color: '#333', lineHeight: 1.6 }}>
                {accessLabels || '—'}
              </p>
            </div>

            <div style={{ height: 1, background: '#e8e8e8', marginBottom: 28 }} />
          </>
        ) : (
          <p style={{ fontSize: 15, color: '#999', marginBottom: 32 }}>
            Профіль ще не заповнений.
          </p>
        )}

        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>
            Що я вже зробила
          </p>

          {builds.length === 0 ? (
            <p style={{ fontSize: 15, color: '#bbb' }}>
              Ще нічого — спробуй перший крок
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {builds.map((b, i) => (
                <div key={i} style={{
                  padding: '16px 20px',
                  background: '#fff',
                  border: '1.5px solid #e5e5e5',
                  borderRadius: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 12,
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 4 }}>
                      {b.title}
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: b.tool === 'claude-code' ? '#fff' : '#555',
                      background: b.tool === 'claude-code' ? '#111' : '#f0f0f0',
                      borderRadius: 4,
                      padding: '2px 7px',
                    }}>
                      {TOOL_LABEL[b.tool] ?? b.tool}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: '#bbb', whiteSpace: 'nowrap', paddingTop: 2 }}>
                    {relativeDate(b.date)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleReset}
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: 12,
            border: '1.5px solid #e5e5e5',
            background: '#fff',
            color: '#999',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          Почати знову
        </button>

      </div>
    </div>
  )
}
