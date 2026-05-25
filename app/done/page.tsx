'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const TOOL_NAME: Record<string, string> = {
  claude: 'Claude',
  'claude-pro': 'Claude Pro',
  'claude-code': 'Claude Code',
  lovable: 'Lovable',
  'figma-make': 'Figma Make',
  cursor: 'Cursor',
}

function DoneContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const rawTitle = searchParams.get('title') ?? ''
  const title = (() => { try { return decodeURIComponent(rawTitle) } catch { return rawTitle } })() || 'Перший крок'
  const tool  = searchParams.get('tool') ?? 'claude'
  const toolName = TOOL_NAME[tool] ?? tool

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: `Зробила: ${title}`, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
  }

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

        <p style={{
          fontSize: 13,
          color: '#666',
          letterSpacing: 0.3,
          textTransform: 'uppercase',
          marginBottom: 48,
        }}>
          It Depends
        </p>

        <div style={{ fontSize: 36, color: '#fff', marginBottom: 16 }}>✦</div>

        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#fff',
          marginBottom: 32,
          lineHeight: 1.2,
        }}>
          Перший крок зроблено
        </h1>

        {/* Achievement card */}
        <div style={{
          background: '#1c1c1c',
          border: '1px solid #333',
          borderRadius: 16,
          padding: '24px',
          marginBottom: 24,
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#888',
            background: '#2a2a2a',
            borderRadius: 5,
            padding: '3px 8px',
            letterSpacing: 0.3,
            display: 'inline-block',
            marginBottom: 14,
          }}>
            {toolName}
          </span>
          <div style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.3,
            marginBottom: 8,
          }}>
            {title}
          </div>
          <div style={{ fontSize: 14, color: '#888' }}>
            за допомогою {toolName}
          </div>
        </div>

        <p style={{
          fontSize: 15,
          color: '#999',
          lineHeight: 1.6,
          marginBottom: 32,
        }}>
          Ти вже не та що збиралася —<br />ти та що зробила.
        </p>

        <button
          onClick={() => router.push('/start')}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: 12,
            border: 'none',
            background: '#fff',
            color: '#111',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
            marginBottom: 12,
            letterSpacing: 0.2,
          }}
        >
          Спробуй своє →
        </button>

        <button
          onClick={handleShare}
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: 12,
            border: '1px solid #333',
            background: 'transparent',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          ↑ Поділитись
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
