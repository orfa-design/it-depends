'use client'

import { useState } from 'react'
import type { SurveyResponse } from '../../api/survey/submit/route'

const PARALYSIS_LABELS: Record<string, string> = {
  'where-to-start': 'Не знаю, з чого почати',
  'no-clear-use-case': 'Поки не бачу, як AI може допомогти саме мені',
  'weak-results': 'Результати були слабкими або дивними',
  'no-time': 'Не вистачає часу розібратися',
  'too-many-tools': 'Занадто багато інструментів — важко зрозуміти, що обрати',
  'no-trust': 'Не дуже довіряю результатам',
  'not-a-problem': 'Мені вже комфортно користуватись AI',
  'other': 'Інше',
}

const TRIGGER_LABELS: Record<string, string> = {
  colleague: 'Побачив(ла), як AI використовують колеги',
  task: 'З\'явилась конкретна задача на роботі',
  media: 'Стаття, відео або інший контент про AI',
  team: 'Ініціативи або очікування всередині команди',
  curiosity: 'Власна цікавість / бажання поекспериментувати',
  'nothing-yet': 'Поки нічого особливо не вплинуло',
  other: 'Інше',
}

const AI_LEVEL_LABELS: Record<string, string> = {
  'chat': 'Питала питання в чаті',
  'analyze': 'Аналізувала документи або зображення',
  'build': 'Будувала щось за межами чату',
  'not-tried': 'Ще не пробувала',
}

const WORKSHOP_EFFECT_LABELS: Record<string, string> = {
  'workshop-effect-yes': 'Так — дало поштовх, використовую регулярніше',
  'workshop-effect-relapse': 'Так — дало поштовх, але знову застрягла',
  'workshop-no-effect': 'Так — особливого ефекту не було',
  'no-workshop': 'Ні, не була',
}

const PROMPT_REACTION_LABELS: Record<string, string> = {
  'yes-immediately': 'Так, одразу б використала',
  'maybe': 'Можливо, залежить від задачі',
  'no-needs-context': 'Ні, потрібно більше контексту спочатку',
}

const cell: React.CSSProperties = {
  padding: '10px 14px', borderBottom: '1px solid #f0f0f0', fontSize: 14,
}
const th: React.CSSProperties = {
  ...cell, fontWeight: 600, background: '#f9f9f9', textAlign: 'left',
}

export function ResultsClient({ initialResponses }: { initialResponses: SurveyResponse[] }) {
  const [responses, setResponses] = useState(initialResponses)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)

  async function deleteResponse(id: string) {
    if (!confirm('Видалити цю відповідь?')) return
    setDeleting(id)
    await fetch('/api/survey/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setResponses(prev => prev.filter(r => r.id !== id))
    setDeleting(null)
  }

  async function clearAll() {
    if (!confirm(`Видалити всі ${responses.length} відповіді? Це незворотньо.`)) return
    setClearing(true)
    await fetch('/api/survey/clear', { method: 'DELETE' })
    setResponses([])
    setClearing(false)
  }

  if (responses.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Survey Results</h1>
        <p style={{ color: '#999' }}>Відповідей ще немає.</p>
      </div>
    )
  }

  const paralysisCount: Record<string, number> = {}
  const promptReactionCount: Record<string, number> = {}
  const triggerCount: Record<string, number> = {}
  const aiLevelCount: Record<string, number> = {}
  const workshopEffectCount: Record<string, number> = {}

  const paralysisOtherTexts = responses.filter(r => r.paralysis === 'other' && r.paralysisOther?.trim()).map(r => r.paralysisOther)
  const triggersOtherTexts = responses.filter(r => r.triggers.includes('other') && r.triggersOther?.trim()).map(r => r.triggersOther)

  for (const r of responses) {
    paralysisCount[r.paralysis] = (paralysisCount[r.paralysis] ?? 0) + 1
    if (r.promptReaction) promptReactionCount[r.promptReaction] = (promptReactionCount[r.promptReaction] ?? 0) + 1
    if (r.aiLevel) aiLevelCount[r.aiLevel] = (aiLevelCount[r.aiLevel] ?? 0) + 1
    if (r.workshopEffect) workshopEffectCount[r.workshopEffect] = (workshopEffectCount[r.workshopEffect] ?? 0) + 1
    for (const t of r.triggers) {
      triggerCount[t] = (triggerCount[t] ?? 0) + 1
    }
  }

  // H2 — casual users (not power users): chat + analyze + not-tried
  const casualUsers = responses.filter(r => r.aiLevel !== 'build')
  const casualParalysis: Record<string, number> = {}
  for (const r of casualUsers) {
    casualParalysis[r.paralysis] = (casualParalysis[r.paralysis] ?? 0) + 1
  }
  const metaCount = (casualParalysis['where-to-start'] ?? 0) + (casualParalysis['no-clear-use-case'] ?? 0) + (casualParalysis['too-many-tools'] ?? 0)
  const toolCount = (casualParalysis['weak-results'] ?? 0) + (casualParalysis['no-trust'] ?? 0)

  // Workshop segment — those who attended
  const workshopAttendees = responses.filter(r => r.workshopEffect && r.workshopEffect !== 'no-workshop')
  const workshopRelapseCount = workshopEffectCount['workshop-effect-relapse'] ?? 0
  const workshopEffectYesCount = workshopEffectCount['workshop-effect-yes'] ?? 0
  const workshopNoEffectCount = workshopEffectCount['workshop-no-effect'] ?? 0

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Survey Results</h1>
        <button
          onClick={clearAll}
          disabled={clearing}
          style={{
            border: '1px solid #fca5a5', background: 'none', cursor: 'pointer',
            color: '#f87171', fontSize: 12, padding: '4px 10px', borderRadius: 6,
            opacity: clearing ? 0.5 : 1,
          }}
        >
          {clearing ? 'Очищаємо...' : 'Очистити все'}
        </button>
      </div>
      <p style={{ color: '#999', fontSize: 14, marginBottom: 40 }}>
        {responses.length} відповід{responses.length === 1 ? 'ь' : responses.length < 5 ? 'і' : 'ей'}
      </p>

      {/* AI level segment */}
      {Object.keys(aiLevelCount).length > 0 && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 20px', marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: '#334155' }}>Де люди зараз з AI</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {Object.entries(AI_LEVEL_LABELS).map(([key, label]) => (
              <div key={key} style={{ fontSize: 13 }}>
                <span style={{ color: '#94a3b8' }}>{label}:</span>{' '}
                <strong>{aiLevelCount[key] ?? 0}</strong>
              </div>
            ))}
          </div>
          {casualUsers.length < responses.length && (
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
              H2 рахується по casual users — всі крім 'build' ({casualUsers.length} з {responses.length})
            </div>
          )}
        </div>
      )}

      {/* H2 verdict */}
      <div style={{
        background: metaCount > toolCount ? '#f0fdf4' : '#fef2f2',
        border: `1px solid ${metaCount > toolCount ? '#86efac' : '#fca5a5'}`,
        borderRadius: 10, padding: '16px 20px', marginBottom: 32,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>
          H2 — Casual→Power user paralysis: {metaCount > toolCount ? '✅ підтверджується' : '❌ поки не підтверджується'}
        </div>
        <div style={{ fontSize: 13, color: '#555' }}>
          Meta (не знаю з чого / який): <strong>{metaCount}</strong> ·
          Tool-level (результат / довіра): <strong>{toolCount}</strong>
          {casualUsers.length < responses.length && <span style={{ color: '#94a3b8' }}> · по {casualUsers.length} casual users</span>}
        </div>
      </div>

      {/* Workshop segment */}
      {workshopAttendees.length > 0 && (
        <div style={{
          background: '#fafafa', border: '1px solid #e5e7eb',
          borderRadius: 10, padding: '16px 20px', marginBottom: 32,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
            🎓 Воркшоп — {workshopAttendees.length} з {responses.length} були присутні
          </div>
          <div style={{ fontSize: 13, color: '#555', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span>Дало тривалий поштовх: <strong>{workshopEffectYesCount}</strong></span>
            <span>Дало, але знову застрягли: <strong>{workshopRelapseCount}</strong></span>
            <span>Без ефекту: <strong>{workshopNoEffectCount}</strong></span>
          </div>
          {workshopRelapseCount > 0 && (
            <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
              {workshopRelapseCount} з {workshopAttendees.length} людей ({Math.round(workshopRelapseCount / workshopAttendees.length * 100)}%) після воркшопу знову застрягли → валідує потребу в продукті
            </div>
          )}
        </div>
      )}

      {/* Q3 — Barrier */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Що зараз найбільше стримує тебе від активнішого використання AI?</h2>
      <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>Q3 · один варіант</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32, background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
        <thead><tr>
          <th style={th}>Варіант</th>
          <th style={{ ...th, width: 60, textAlign: 'right' }}>%</th>
          <th style={{ ...th, width: 40, textAlign: 'right' }}>n</th>
        </tr></thead>
        <tbody>
          {Object.entries(PARALYSIS_LABELS)
            .filter(([key]) => key !== 'other')
            .sort(([a], [b]) => (paralysisCount[b] ?? 0) - (paralysisCount[a] ?? 0))
            .map(([key, label]) => {
              const n = paralysisCount[key] ?? 0
              const pct = Math.round(n / responses.length * 100)
              return <tr key={key}>
                <td style={cell}>{label}</td>
                <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{pct}%</td>
                <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{n}</td>
              </tr>
            })}
          {paralysisOtherTexts.map((text, i) => {
            const pct = Math.round(1 / responses.length * 100)
            return <tr key={`other-${i}`}>
              <td style={{ ...cell, background: '#fafafa' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', marginRight: 6, fontWeight: 500 }}>Інше</span>
                <span style={{ fontStyle: 'italic' }}>{text}</span>
              </td>
              <td style={{ ...cell, background: '#fafafa', textAlign: 'right', color: '#888' }}>{pct}%</td>
              <td style={{ ...cell, background: '#fafafa', textAlign: 'right', color: '#888' }}>1</td>
            </tr>
          })}
        </tbody>
      </table>

      {/* Q2 — Triggers */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Що найбільше вплинуло на твій інтерес до AI?</h2>
      <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>Q2 · можна кілька</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32, background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
        <thead><tr>
          <th style={th}>Тригер</th>
          <th style={{ ...th, width: 40, textAlign: 'right' }}>n</th>
        </tr></thead>
        <tbody>
          {Object.entries(TRIGGER_LABELS)
            .filter(([key]) => key !== 'other')
            .sort(([a], [b]) => (triggerCount[b] ?? 0) - (triggerCount[a] ?? 0))
            .map(([key, label]) => (
              <tr key={key}>
                <td style={cell}>{label}</td>
                <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{triggerCount[key] ?? 0}</td>
              </tr>
            ))}
          {triggersOtherTexts.map((text, i) => (
            <tr key={`other-${i}`}>
              <td style={{ ...cell, background: '#fafafa' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', marginRight: 6, fontWeight: 500 }}>Інше</span>
                <span style={{ fontStyle: 'italic' }}>{text}</span>
              </td>
              <td style={{ ...cell, background: '#fafafa', textAlign: 'right', color: '#888' }}>1</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Q5 — Prompt reaction */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Якби продукт дав тобі готовий промпт під твою конкретну робочу задачу — ти б спробувала?</h2>
      <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>Q5 · один варіант · валідація ключової фічі</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32, background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
        <thead><tr>
          <th style={th}>Відповідь</th>
          <th style={{ ...th, width: 60, textAlign: 'right' }}>%</th>
          <th style={{ ...th, width: 40, textAlign: 'right' }}>n</th>
        </tr></thead>
        <tbody>
          {Object.entries(PROMPT_REACTION_LABELS)
            .sort(([a], [b]) => (promptReactionCount[b] ?? 0) - (promptReactionCount[a] ?? 0))
            .map(([key, label]) => {
              const n = promptReactionCount[key] ?? 0
              const pct = Math.round(n / responses.length * 100)
              return <tr key={key}>
                <td style={cell}>{label}</td>
                <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{pct}%</td>
                <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{n}</td>
              </tr>
            })}
        </tbody>
      </table>

      {/* Q4 — Work idea open */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Які повторювані або рутинні задачі тобі хотілося б спростити або автоматизувати?</h2>
      <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>Q4 · відкрита відповідь · контент для каталогу кроків</p>
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', marginBottom: 32 }}>
        {responses.filter(r => r.workIdea?.trim()).map((r, i) => (
          <div key={r.id} style={{ padding: '12px 16px', borderTop: i > 0 ? '1px solid #f0f0f0' : 'none', fontSize: 14 }}>
            {r.name && <span style={{ color: '#999', fontSize: 12, marginRight: 8 }}>{r.name}</span>}
            "{r.workIdea}"
          </div>
        ))}
        {responses.every(r => !r.workIdea?.trim()) && (
          <div style={{ padding: '12px 16px', color: '#999', fontSize: 14 }}>Відкритих відповідей ще немає</div>
        )}
      </div>

      {/* All responses with delete */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Всі відповіді</h2>
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', marginBottom: 32 }}>
        {responses.map((r, i) => (
          <div key={r.id} style={{
            padding: '14px 16px',
            borderTop: i > 0 ? '1px solid #f0f0f0' : 'none',
            opacity: deleting === r.id ? 0.4 : 1,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ fontSize: 13, lineHeight: 1.6, flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>
                {r.name || <span style={{ color: '#ccc' }}>Анонімно</span>}
                {r.workshopEffect && r.workshopEffect !== 'no-workshop' && (
                  <span style={{ fontSize: 11, color: '#6366f1', marginLeft: 6, fontWeight: 400 }}>🎓 воркшоп</span>
                )}
                <span style={{ fontWeight: 400, color: '#999', fontSize: 12, marginLeft: 8 }}>
                  {new Date(r.submittedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {r.aiLevel && <div><span style={{ color: '#999' }}>Рівень AI:</span> {AI_LEVEL_LABELS[r.aiLevel] ?? r.aiLevel}</div>}
              {r.workshopEffect && <div><span style={{ color: '#999' }}>Воркшоп:</span> {WORKSHOP_EFFECT_LABELS[r.workshopEffect] ?? r.workshopEffect}</div>}
              {r.triggers.length > 0 && (
                <div><span style={{ color: '#999' }}>Що підштовхнуло:</span> {r.triggers.map(t => TRIGGER_LABELS[t] ?? t).join(', ')}{r.triggersOther ? ` — ${r.triggersOther}` : ''}</div>
              )}
              <div><span style={{ color: '#999' }}>Бар'єр:</span> {PARALYSIS_LABELS[r.paralysis] ?? r.paralysis}{r.paralysisOther ? ` — ${r.paralysisOther}` : ''}</div>
              {r.workIdea && <div><span style={{ color: '#999' }}>Рутина:</span> {r.workIdea}</div>}
              {r.promptReaction && <div><span style={{ color: '#999' }}>Готовий промпт:</span> {PROMPT_REACTION_LABELS[r.promptReaction] ?? r.promptReaction}</div>}
            </div>
            <button
              onClick={() => deleteResponse(r.id)}
              disabled={deleting === r.id}
              style={{
                border: 'none', background: 'none', cursor: 'pointer',
                color: '#ddd', fontSize: 18, padding: '2px 4px', flexShrink: 0,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
              onMouseLeave={e => (e.currentTarget.style.color = '#ddd')}
              title="Видалити відповідь"
            >×</button>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: '#ccc', textAlign: 'center' }}>
        it-depends.vercel.app/survey/results · тільки для команди
      </p>
    </div>
  )
}
