'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useClipboard } from '@/lib/useClipboard'

const TOOL_NAME: Record<string, string> = {
  claude: 'Claude',
  'claude-pro': 'Claude Pro',
  'claude-code': 'Claude Code',
  lovable: 'Lovable',
  'figma-make': 'Figma Make',
  cursor: 'Cursor',
}

const LEVEL_CARDS: Record<string, { card: string; title: string }[]> = {
  chat: [
    { card: 'template',      title: 'Шаблон для підсумків зустрічей' },
    { card: 'prompt-library', title: 'Набір промптів для UX-ресерчу' },
    { card: 'checklist',     title: 'Чеклист для дизайн-ревʼю' },
  ],
  analyze: [
    { card: 'assistant',  title: 'AI-асистент для аналізу брифів' },
    { card: 'transcript', title: 'Промпт для аналізу транскриптів' },
    { card: 'framework',  title: 'Фреймворк для порівняння дизайн-рішень' },
  ],
  build: [
    { card: 'plugin',     title: 'Figma плагін для перевірки стилів' },
    { card: 'script',     title: 'Скрипт для документації компонентів' },
    { card: 'automation', title: 'Аудит дизайн-токенів по всьому файлу' },
  ],
}

const channelBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px 8px',
  borderRadius: 8,
  border: '1px solid #2a2a2a',
  background: 'transparent',
  color: '#888',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  outline: 'none',
}

function dec(s: string | null) {
  if (!s) return ''
  try { return decodeURIComponent(s) } catch { return s }
}

function DoneContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const title    = dec(searchParams.get('title')) || 'Перший крок'
  const artifact = dec(searchParams.get('artifact'))
  const tool     = searchParams.get('tool') ?? 'claude'
  const level    = searchParams.get('level') ?? 'chat'
  const card     = dec(searchParams.get('card'))
  const toolName = TOOL_NAME[tool] ?? tool

  const siteUrl = (typeof window !== 'undefined' ? window.location.origin : '') + '/start'

  const { copied, copy } = useClipboard()
  const [shareText, setShareText] = useState(
    () => `Зробила ${artifact || title} з ${toolName}. Буду вдячна якщо поділитесь думками чи досвідом 🙂 ${siteUrl}`
  )
  const [saved, setSaved] = useState(false)

  function saveShareText() {
    try {
      const builds = JSON.parse(localStorage.getItem('itdepends_builds') ?? '[]')
      const idx = [...builds].reverse().findIndex((b: { card: string; tool: string }) => b.card === card && b.tool === tool)
      if (idx >= 0) {
        builds[builds.length - 1 - idx].shareText = shareText
        localStorage.setItem('itdepends_builds', JSON.stringify(builds))
      }
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const channels = [
    {
      label: 'WhatsApp',
      open: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank'),
    },
    {
      label: 'Telegram',
      open: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`, '_blank'),
    },
    {
      label: 'LinkedIn',
      open: () => {
        copy(shareText)
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`, '_blank')
      },
    },
  ]

  const nextSteps = (LEVEL_CARDS[level] ?? []).filter(c => c.card !== card).slice(0, 2)

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      background: '#111',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        <p style={{ fontSize: 13, color: '#666', letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 48 }}>
          It Depends
        </p>

        <div style={{ fontSize: 36, color: '#fff', marginBottom: 16 }}>✦</div>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 32, lineHeight: 1.2 }}>
          Зроблено
        </h1>

        {/* Achievement card */}
        <div style={{ background: '#1c1c1c', border: '1px solid #333', borderRadius: 16, padding: '24px', marginBottom: 32 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#888', background: '#2a2a2a',
            borderRadius: 5, padding: '3px 8px', letterSpacing: 0.3, display: 'inline-block', marginBottom: 14,
          }}>
            {toolName}
          </span>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 8 }}>
            {title}
          </div>
          {artifact && (
            <div style={{ fontSize: 14, color: '#888' }}>{artifact}</div>
          )}
        </div>

        {/* Share block */}
        <div style={{ background: '#1c1c1c', border: '1px solid #333', borderRadius: 16, padding: '20px', marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: '#666', letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 12 }}>
            Поділитись
          </p>

          <textarea
            value={shareText}
            onChange={e => setShareText(e.target.value)}
            rows={4}
            style={{
              width: '100%', background: '#111', border: '1px solid #2a2a2a',
              borderRadius: 10, padding: '12px', color: '#ccc', fontSize: 14,
              lineHeight: 1.6, resize: 'vertical', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12,
            }}
          />

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {channels.map(({ label, open }) => (
              <button key={label} onClick={open} style={channelBtnStyle}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => copy(shareText)}
              style={{
                flex: 1, padding: '12px', borderRadius: 8,
                border: '1px solid #333', background: copied ? '#1a2a1a' : 'transparent',
                color: copied ? '#4caf50' : '#fff', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', outline: 'none', transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Скопійовано' : 'Скопіювати текст'}
            </button>
            <button
              onClick={saveShareText}
              style={{
                padding: '12px 16px', borderRadius: 8,
                border: '1px solid #333', background: saved ? '#1a2a1a' : 'transparent',
                color: saved ? '#4caf50' : '#555', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', outline: 'none', transition: 'all 0.2s',
              }}
            >
              {saved ? '✓' : '↓ Зберегти'}
            </button>
          </div>

          <p style={{ fontSize: 11, color: '#444', marginTop: 8, textAlign: 'center' }}>
            LinkedIn: текст скопіюється автоматично — вставте в пост
          </p>
        </div>

        {/* Next steps */}
        {nextSteps.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: '#666', letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 12 }}>
              Що далі
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {nextSteps.map(step => (
                <button
                  key={step.card}
                  onClick={() => router.push(`/start/suggest?stage=${level}&task=${step.card}`)}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 12,
                    border: '1px solid #2a2a2a', background: 'transparent',
                    color: '#ccc', fontSize: 14, fontWeight: 500,
                    cursor: 'pointer', outline: 'none', textAlign: 'left',
                  }}
                >
                  {step.title} →
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => router.push('/start')}
          style={{
            width: '100%', padding: '14px 24px', borderRadius: 12,
            border: '1px solid #444', background: 'transparent',
            color: '#888', fontSize: 14, fontWeight: 500,
            cursor: 'pointer', outline: 'none',
          }}
        >
          ← Повернутися на карту
        </button>

      </div>
    </div>
  )
}

export default function DonePage() {
  return (
    <Suspense>
      <DoneContent />
    </Suspense>
  )
}
