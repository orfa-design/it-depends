import { kv } from '@vercel/kv'
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
  none: 'Немає бажання / вже використовую',
  other: 'Інше',
}

const ONE_STEP_LABELS: Record<string, string> = {
  yes: 'Так, одразу',
  maybe: 'Мабуть',
  no: 'Ні, потрібно більше розуміння',
  other: 'Інше',
}

export default async function SurveyResultsPage() {
  const responses = (await kv.get<SurveyResponse[]>('survey-responses')) ?? []

  if (responses.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Survey Results</h1>
        <p style={{ color: '#999' }}>Відповідей ще немає.</p>
      </div>
    )
  }

  // Q2 distribution
  const paralysisCount: Record<string, number> = {}
  const oneStepCount: Record<string, number> = {}
  const triggerCount: Record<string, number> = {}

  for (const r of responses) {
    paralysisCount[r.paralysis] = (paralysisCount[r.paralysis] ?? 0) + 1
    oneStepCount[r.oneStep] = (oneStepCount[r.oneStep] ?? 0) + 1
    for (const t of r.triggers) {
      triggerCount[t] = (triggerCount[t] ?? 0) + 1
    }
  }

  const metaCount = (paralysisCount['which-tool'] ?? 0) + (paralysisCount['which-task'] ?? 0)
  const toolCount = (paralysisCount['how-to-use'] ?? 0) + (paralysisCount['disappointing'] ?? 0)

  const cell: React.CSSProperties = {
    padding: '10px 14px', borderBottom: '1px solid #f0f0f0', fontSize: 14,
  }
  const th: React.CSSProperties = {
    ...cell, fontWeight: 600, background: '#f9f9f9', textAlign: 'left',
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Survey Results</h1>
      <p style={{ color: '#999', fontSize: 14, marginBottom: 40 }}>
        {responses.length} відповід{responses.length === 1 ? 'ь' : responses.length < 5 ? 'і' : 'ей'}
      </p>

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
        </div>
      </div>

      {/* Q2 — Paralysis breakdown */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Q2 — Що зупиняє</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32, background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={th}>Варіант</th>
            <th style={{ ...th, width: 60, textAlign: 'right' }}>%</th>
            <th style={{ ...th, width: 40, textAlign: 'right' }}>n</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(PARALYSIS_LABELS).map(([key, label]) => {
            const n = paralysisCount[key] ?? 0
            const pct = responses.length > 0 ? Math.round(n / responses.length * 100) : 0
            return (
              <tr key={key}>
                <td style={cell}>{label}</td>
                <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{pct}%</td>
                <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{n}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Q1 — Triggers */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Q1 — Тригери</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32, background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={th}>Тригер</th>
            <th style={{ ...th, width: 40, textAlign: 'right' }}>n</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(TRIGGER_LABELS).map(([key, label]) => (
            <tr key={key}>
              <td style={cell}>{label}</td>
              <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{triggerCount[key] ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Q4 — One step */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Q4 — Один крок</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32, background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={th}>Відповідь</th>
            <th style={{ ...th, width: 60, textAlign: 'right' }}>%</th>
            <th style={{ ...th, width: 40, textAlign: 'right' }}>n</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(ONE_STEP_LABELS).map(([key, label]) => {
            const n = oneStepCount[key] ?? 0
            const pct = responses.length > 0 ? Math.round(n / responses.length * 100) : 0
            return (
              <tr key={key}>
                <td style={cell}>{label}</td>
                <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{pct}%</td>
                <td style={{ ...cell, textAlign: 'right', color: '#888' }}>{n}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Q3 — Open answers */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Q3 — Що робиш руками (H4)</h2>
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', marginBottom: 32 }}>
        {responses.filter(r => r.workIdea.trim()).map((r, i) => (
          <div key={r.id} style={{
            padding: '12px 16px',
            borderTop: i > 0 ? '1px solid #f0f0f0' : 'none',
            fontSize: 14, lineHeight: 1.5,
          }}>
            "{r.workIdea}"
          </div>
        ))}
        {responses.every(r => !r.workIdea.trim()) && (
          <div style={{ padding: '12px 16px', color: '#999', fontSize: 14 }}>
            Відкритих відповідей ще немає
          </div>
        )}
      </div>

      {/* Other answers */}
      {responses.some(r => r.triggersOther || r.paralysisOther || r.oneStepOther) && (
        <>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Відповіді "Інше"</h2>
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', marginBottom: 32 }}>
            {responses.filter(r => r.triggersOther || r.paralysisOther || r.oneStepOther).map((r, i) => (
              <div key={r.id} style={{ padding: '12px 16px', borderTop: i > 0 ? '1px solid #f0f0f0' : 'none', fontSize: 13 }}>
                {r.triggersOther && <div><span style={{ color: '#999' }}>Q1:</span> {r.triggersOther}</div>}
                {r.paralysisOther && <div style={{ marginTop: r.triggersOther ? 4 : 0 }}><span style={{ color: '#999' }}>Q2:</span> {r.paralysisOther}</div>}
                {r.oneStepOther && <div style={{ marginTop: (r.triggersOther || r.paralysisOther) ? 4 : 0 }}><span style={{ color: '#999' }}>Q4:</span> {r.oneStepOther}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      <p style={{ fontSize: 12, color: '#ccc', textAlign: 'center' }}>
        it-depends.vercel.app/survey/results · оновлюється при перезавантаженні
      </p>
    </div>
  )
}
