'use client'

import { useState } from 'react'

type Item = { id: string; label: string }
type Section = { title: string; items: Item[] }

export function ChecklistClient({
  sections,
  initialState,
}: {
  sections: Section[]
  initialState: Record<string, boolean>
}) {
  const [state, setState] = useState<Record<string, boolean>>(initialState)
  const [saving, setSaving] = useState<string | null>(null)

  async function toggle(id: string) {
    const next = !state[id]
    setState((s) => ({ ...s, [id]: next }))
    setSaving(id)
    await fetch('/api/checklist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, checked: next }),
    })
    setSaving(null)
  }

  const total = sections.flatMap((s) => s.items).length
  const done = Object.values(state).filter(Boolean).length

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>It Depends — Checklist</h1>
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
          {done} / {total} виконано · оновлюється при перезавантаженні
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', margin: '0 0 12px' }}>
            {section.title}
          </h2>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', overflow: 'hidden' }}>
            {section.items.map((item, i) => (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  borderTop: i > 0 ? '1px solid #f0f0f0' : 'none',
                  cursor: 'pointer',
                  opacity: saving === item.id ? 0.5 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                <input
                  type="checkbox"
                  checked={!!state[item.id]}
                  onChange={() => toggle(item.id)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#000', flexShrink: 0 }}
                />
                <span style={{
                  fontSize: 15,
                  color: state[item.id] ? '#bbb' : '#111',
                  textDecoration: state[item.id] ? 'line-through' : 'none',
                  transition: 'color 0.15s',
                }}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
