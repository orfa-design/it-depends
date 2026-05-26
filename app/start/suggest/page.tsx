'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PROMPTS, FALLBACK } from '../lib/prompts'

const LEVEL_CONTEXT: Record<string, string> = {
  chat: 'Чат з AI',
  analyze: 'Аналіз документів',
  build: 'Будую за межами чату',
}

const PAIN_CONTEXT: Record<string, string> = {
  'no-idea': 'не знаю з чого почати',
  'weak-results': 'результати не вражають',
  'no-time': 'не вистачає часу',
  'want-harder': 'хочу складніше',
  'has-idea': 'є конкретна ідея',
}

function SuggestContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const stage   = searchParams.get('stage')   ?? searchParams.get('level') ?? ''
  const blocker = searchParams.get('blocker') ?? searchParams.get('pain')  ?? ''
  const task    = searchParams.get('task')    ?? ''

  const STAGE_TO_LEVEL: Record<string, string> = {
    experimenting: 'chat', tasks: 'chat', 'next-level': 'analyze', build: 'build',
    chat: 'chat', analyze: 'analyze',
  }
  const level = STAGE_TO_LEVEL[stage] ?? stage
  const key   = `${level}/${task}`

  const s = PROMPTS[key] ?? FALLBACK
  const isCode = s.cta === 'claude-code'

  const [copied, setCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(s.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCodeCopy() {
    navigator.clipboard.writeText(s.prompt)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 3000)
  }

  function handleTry() {
    const encoded = encodeURIComponent(s.prompt)
    window.open(`https://claude.ai/new?q=${encoded}`, '_blank')
  }

  function handleDone() {
    try {
      const builds = JSON.parse(localStorage.getItem('itdepends_builds') ?? '[]')
      builds.push({ card: task, title: s.title, tool: s.cta, stage, blocker, date: new Date().toISOString() })
      localStorage.setItem('itdepends_builds', JSON.stringify(builds))
    } catch {}
    router.push(`/done?card=${encodeURIComponent(task)}&tool=${s.cta}&level=${level}&title=${encodeURIComponent(s.title)}`)
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
                background: i <= 3 ? '#111' : '#ddd',
                opacity: i < 3 ? 0.3 : 1,
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>

        {/* Artifact badge */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: isCode ? '#fff' : '#111',
            background: isCode ? '#111' : '#f0f0f0',
            borderRadius: 6,
            padding: '4px 10px',
            letterSpacing: 0.2,
          }}>
            {isCode ? 'Claude Code' : 'Claude'}
          </span>
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#666',
            background: '#f7f7f7',
            border: '1px solid #e8e8e8',
            borderRadius: 6,
            padding: '4px 10px',
          }}>
            {s.artifact}
          </span>
        </div>

        {LEVEL_CONTEXT[level] && PAIN_CONTEXT[blocker] && (
          <p style={{ fontSize: 13, color: '#aaa', marginBottom: 8 }}>
            {LEVEL_CONTEXT[level]} · {PAIN_CONTEXT[blocker]}
          </p>
        )}

        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#111',
          marginBottom: 24,
          lineHeight: 1.3,
        }}>
          {s.title}
        </h1>

        {/* Prompt block */}
        <div style={{
          background: '#fff',
          border: '1.5px solid #e5e5e5',
          borderRadius: 14,
          padding: '20px 24px',
          marginBottom: 12,
        }}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#bbb',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 10,
          }}>
            Промпт
          </p>
          <pre style={{
            fontSize: 13.5,
            color: '#222',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            margin: 0,
          }}>
            {s.prompt}
          </pre>
        </div>

        {isCode ? (
          <>
            {/* Claude Code flow: copy + terminal instructions */}
            <button
              onClick={handleCodeCopy}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: 12,
                border: 'none',
                background: codeCopied ? '#22a55b' : '#18181b',
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: 12,
                outline: 'none',
                letterSpacing: 0.2,
              }}
            >
              {codeCopied ? '✓ Промпт скопійовано' : 'Скопіювати промпт'}
            </button>

            {codeCopied && (
              <div style={{
                background: '#f8f8f8',
                border: '1.5px solid #e5e5e5',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 10,
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 10 }}>
                  Далі в терміналі:
                </p>
                {['1. Відкрий термінал', '2. Перейди в папку проекту', '3. Запусти:'].map((step, i) => (
                  <p key={i} style={{ fontSize: 13, color: '#555', marginBottom: i === 2 ? 6 : 4 }}>{step}</p>
                ))}
                <code style={{
                  display: 'block',
                  fontSize: 14,
                  fontFamily: 'monospace',
                  background: '#111',
                  color: '#7ee787',
                  padding: '10px 14px',
                  borderRadius: 8,
                  marginBottom: 10,
                }}>
                  claude
                </code>
                <p style={{ fontSize: 12, color: '#aaa' }}>
                  Вставте промпт — Claude Code прочитає контекст проекту і почне писати код.
                </p>
              </div>
            )}

            {!codeCopied && (
              <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center' }}>
                Claude Code — CLI інструмент, відкривається через термінал
              </p>
            )}
          </>
        ) : (
          <>
            {/* Claude.ai flow */}
            <button
              onClick={handleCopy}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: 12,
                border: '1.5px solid #e5e5e5',
                background: '#fff',
                color: copied ? '#22a55b' : '#555',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                marginBottom: 10,
                outline: 'none',
              }}
            >
              {copied ? '✓ Скопійовано' : 'Скопіювати промпт'}
            </button>

            <button
              onClick={handleTry}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: 12,
                border: 'none',
                background: '#111',
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none',
                letterSpacing: 0.2,
              }}
            >
              Відкрити в Claude →
            </button>
          </>
        )}

        {/* "Я спробувала" separator + button */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
            <span style={{ fontSize: 12, color: '#bbb', whiteSpace: 'nowrap' }}>
              вже спробувала?
            </span>
            <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
          </div>
          <button
            onClick={handleDone}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 12,
              border: '1.5px solid #e5e5e5',
              background: '#fff',
              color: '#111',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Я спробувала ✓
          </button>
        </div>

      </div>
    </div>
  )
}

export default function SuggestPage() {
  return (
    <Suspense>
      <SuggestContent />
    </Suspense>
  )
}
