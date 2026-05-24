'use client'

import { useState } from 'react'
import type { SurveyResponse } from '../../api/survey/submit/route'

const PARALYSIS_LABELS: Record<string, string> = {
  'which-tool': 'Не знаю який інструмент (meta)',
  'which-task': 'Не знаю з якої задачі (meta)',
  'how-to-use': 'Не розумів як користуватись (tool-level)',
  'disappointing': 'Результат розчарував (tool-level)',
  'no-problem': 'Не проблема',
  'other': 'Інше',
}

const TRIGGER_LABELS: Record<string, string> = {
  colleague: 'Колега з AI',
  media: 'Стаття / відео',
  task: 'Задача на роботі',
  team: 'Команда / менеджер',
  curiosity: 'Цікавість',
  'no-desire': 'Ще не маю бажання починати',
  'already-using': 'Вже активно використовую',
  other: 'Інше',
}

const AI_LEVEL_LABELS: Record<string, string> = {
  'not-started': 'Ще не починав/ла',
  'tried-stopped': 'Спробував/ла, не продовжую',
  'occasional': 'Використовую зрідка',
  'regular': 'Використовую регулярно',
}

const ONE_STEP_LABELS: Record<string, string> = {
  yes: 'Так, одразу',
  maybe: 'Мабуть',
  no: 'Ні, потрібно більше розуміння',
  other: 'Інше',
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
  const oneStepCount: Record<string, number> = {}
  const triggerCount: Record<string, number> = {}
  const aiLevelCount: Record<string, number> = {}

  const paralysisOtherTexts = responses.filter(r => r.paralysis === 'other' && r.paralysisOther?.trim()).map(r => r.paralysisOther)
  const triggersOtherTexts = responses.filter(r => r.triggers.includes('other') && r.triggersOther?.trim()).map(r => r.triggersOther)
  const oneStepOtherTexts = responses.filter(r => r.oneStep === 'other' && r.oneStepOther?.trim()).map(r => r.oneStepOther)

  for (const r of responses) {
    paralysisCount[r.paralysis] = (paralysisCount[r.paralysis] ?? 0) + 1
    oneStepCount[r.oneStep] = (oneStepCount[r.oneStep] ?? 0) + 1
    if (r.aiLevel) aiLevelCount[r.aiLevel] = (aiLevelCount[r.aiLevel] ?? 0) + 1
    for (const t of r.triggers) {
      triggerCount[t] = (triggerCount[t] ?? 0) + 1
    }
  }

  // H2 — тільки non-adopters (ще не почали або спробували і зупинились)
  const nonAdopters = responses.filter(r => r.aiLevel === 'not-started' || r.aiLevel === 'tried-stopped' || r.aiLevel === '')
  const nonAdopterParalysis: Record<string, number> = {}
  for (const r of nonAdopters) {
    nonAdopterParalysis[r.paralysis] = (nonAdopterParalysis[r.paralysis] ?? 0) + 1
  }

  const metaCount = (nonAdopterParalysis['which-tool'] ?? 0) + (nonAdopterParalysis['which-task'] ?? 0)
  const toolCount = (nonAdopterParalysis['how-to-use'] ?? 0) + (nonAdopterParalysis['disappointing'] ?? 0)

  const workshopAttendees = responses.filter(r => r.wasAtWorkshop)
  const workshopParalysisCount: Record<string, number> = {}
  for (const r of workshopAttendees) {
    workshopParalysisCount[r.paralysis] = (workshopParalysisCount[r.paralysis] ?? 0) + 1
  }
  const workshopMetaCount = (workshopParalysisCount['which-tool'] ?? 0) + (workshopParalysisCount['which-task'] ?? 0)
  const workshopToolCount = (workshopParalysisCount['how-to-use'] ?? 0) + (workshopParalysisCount['disappointing'] ?? 0)

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
          {nonAdopters.length < responses.length && (
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
              H2 рахується тільки по non-adopters ({nonAdopters.length} з {responses.length})
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
          H2 — Meta-level paralysis: {metaCount > toolCount ? '✅ підтверджується' : '❌ поки не підтверджується'}
        </div>
        <div style={{ fontSize: 13, color: '#555' }}>
          Meta (не знаю з чого/який): <strong>{metaCount}</strong> ·
          Tool-level (не зміг користуватись): <strong>{toolCount}</strong>
          {nonAdopters.length < responses.length && <span style={{ color: '#94a3b8' }}> · по {nonAdopters.length} non-adopters</span>}
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
          <div style={{ fontSize: 13, color: '#555' }}>
            Paralysis після воркшопу → Meta: <strong>{workshopMetaCount}</strong> · Tool-level: <strong>{workshopToolCount}</strong> · Немає проблеми: <strong>{workshopParalysisCount['no-problem'] ?? 0}</strong>
          </div>
          {workshopAttendees.length >= 2 && (
            <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
              {workshopParalysisCount['no-problem'] ?? 0} з {workshopAttendees.length} людей після воркшопу кажуть "вже не проблема" ({Math.round(((workshopParalysisCount['no-problem'] ?? 0) / workshopAttendees.length) * 100)}%)
            </div>
          )}
        </div>
      )}

      {/* Q2 */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Коли думаєш про те щоб почати з AI — що здається найскладнішим?</h2>
      <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>Q2 · один варіант</p>
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

      {/* Q1 */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Що підштовхнуло тебе до думки "треба нарешті з AI щось робити"?</h2>
      <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>Q1 · можна кілька</p>
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

      {/* Q4 */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Якби хтось сказав тобі "ось що зроби першим кроком з AI" — ти б спробував/ла?</h2>
      <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>Q4 · один варіант</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32, background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
        <thead><tr>
          <th style={th}>Відповідь</th>
          <th style={{ ...th, width: 60, textAlign: 'right' }}>%</th>
          <th style={{ ...th, width: 40, textAlign: 'right' }}>n</th>
        </tr></thead>
        <tbody>
          {Object.entries(ONE_STEP_LABELS)
            .filter(([key]) => key !== 'other')
            .sort(([a], [b]) => (oneStepCount[b] ?? 0) - (oneStepCount[a] ?? 0))
            .map(([key, label]) => {
              const n = oneStepCount[key] ?? 0
              const pct = Math.round(n / responses.length * 100)
              return <tr key={key}>
                <td style={cell}>{label}</td>
                <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{pct}%</td>
                <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{n}</td>
              </tr>
            })}
          {oneStepOtherTexts.map((text, i) => {
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

      {/* Q3 open */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Є в твоїй роботі щось що робиш руками і думаєш "це мало б бути простіше"?</h2>
      <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>Q3 · відкрита відповідь</p>
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
                {r.wasAtWorkshop && <span style={{ fontSize: 11, color: '#6366f1', marginLeft: 6, fontWeight: 400 }}>🎓 воркшоп</span>}
                <span style={{ fontWeight: 400, color: '#999', fontSize: 12, marginLeft: 8 }}>
                  {new Date(r.submittedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {r.aiLevel && <div><span style={{ color: '#999' }}>Де зараз з AI:</span> {AI_LEVEL_LABELS[r.aiLevel] ?? r.aiLevel}</div>}
              {r.triggers.length > 0 && (
                <div><span style={{ color: '#999' }}>Що підштовхнуло:</span> {r.triggers.map(t => TRIGGER_LABELS[t] ?? t).join(', ')}{r.triggersOther ? ` — ${r.triggersOther}` : ''}</div>
              )}
              <div><span style={{ color: '#999' }}>Що здається найскладнішим:</span> {PARALYSIS_LABELS[r.paralysis] ?? r.paralysis}{r.paralysisOther ? ` — ${r.paralysisOther}` : ''}</div>
              {r.workIdea && <div><span style={{ color: '#999' }}>Що робиш руками:</span> {r.workIdea}</div>}
              <div><span style={{ color: '#999' }}>Якби хтось сказав "перший крок":</span> {ONE_STEP_LABELS[r.oneStep] ?? r.oneStep}{r.oneStepOther ? ` — ${r.oneStepOther}` : ''}</div>
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
