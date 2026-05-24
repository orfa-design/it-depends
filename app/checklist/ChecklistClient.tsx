'use client'

import { useState } from 'react'

type Assignee = 'liuda' | 'vlad'
// 'none' = explicitly unassigned (differs from undefined = show defaultAssignee)
type StoredAssignee = Assignee | 'none'
type Item = { id: string; label: string; quote?: string; defaultAssignee?: Assignee }
type Section = { title: string; items: Item[] }

const ASSIGNEE_CONFIG: Record<Assignee, { label: string; bg: string; color: string }> = {
  liuda: { label: 'L', bg: '#e8f0fe', color: '#1a56db' },
  vlad:  { label: 'V', bg: '#fde8f0', color: '#db1a6e' },
}

function AssigneeBadge({
  assignee,
  onClick,
}: {
  assignee: Assignee | null
  onClick: () => void
}) {
  if (!assignee) {
    return (
      <button
        onClick={(e) => { e.preventDefault(); onClick() }}
        title="Асайнити"
        style={{
          width: 24, height: 24, borderRadius: '50%',
          border: '1.5px dashed #ddd', background: 'transparent',
          cursor: 'pointer', flexShrink: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 11, color: '#ccc',
        }}
      >+</button>
    )
  }
  const cfg = ASSIGNEE_CONFIG[assignee]
  return (
    <button
      onClick={(e) => { e.preventDefault(); onClick() }}
      title={assignee === 'liuda' ? 'Liuda → Vlad → нікому' : 'Vlad → нікому'}
      style={{
        width: 24, height: 24, borderRadius: '50%',
        border: 'none', background: cfg.bg, color: cfg.color,
        cursor: 'pointer', flexShrink: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700,
      }}
    >{cfg.label}</button>
  )
}

type Tab = 'plan' | 'brief'

const PLAN_SECTION_TITLE = '🗓 Наш план — дослідження'

export function ChecklistClient({
  sections,
  initialState,
  initialAssignees,
}: {
  sections: Section[]
  initialState: Record<string, boolean>
  initialAssignees: Record<string, StoredAssignee>
}) {
  const [state, setState] = useState<Record<string, boolean>>(initialState)
  const [assignees, setAssignees] = useState<Record<string, StoredAssignee>>(initialAssignees)
  const [saving, setSaving] = useState<string | null>(null)
  const [showQuotes, setShowQuotes] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('plan')

  const visibleSections = sections.filter((s) =>
    activeTab === 'plan' ? s.title === PLAN_SECTION_TITLE : s.title !== PLAN_SECTION_TITLE
  )

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

  async function cycleAssignee(id: string) {
    const item = sections.flatMap((s) => s.items).find((i) => i.id === id)

    // What the user currently sees (stored 'none' → display null)
    const stored = assignees[id]
    const displayed: Assignee | null =
      stored === 'none' ? null :
      stored != null ? stored :
      item?.defaultAssignee ?? null

    // Next displayed value in cycle: null → liuda → vlad → null
    const nextDisplayed: Assignee | null =
      displayed === null ? 'liuda' :
      displayed === 'liuda' ? 'vlad' : null

    // For items with a defaultAssignee we must store 'none' explicitly —
    // otherwise deleting the key makes badge fall back to defaultAssignee again.
    const nextStored: StoredAssignee | null =
      nextDisplayed === null && item?.defaultAssignee ? 'none' : nextDisplayed

    setAssignees((s) => {
      const updated = { ...s }
      if (nextStored === null) delete updated[id]
      else updated[id] = nextStored
      return updated
    })

    await fetch('/api/checklist/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, assignee: nextStored }),
    })
  }

  const total = sections.flatMap((s) => s.items).length
  const done = Object.values(state).filter(Boolean).length

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>It Depends — Checklist</h1>
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
          {done} / {total} виконано · оновлюється при перезавантаженні
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, alignItems: 'center' }}>
        {(['plan', 'brief'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 18px',
              borderRadius: 20,
              border: activeTab === tab ? '1.5px solid #111' : '1.5px solid #e0e0e0',
              background: activeTab === tab ? '#111' : '#fff',
              color: activeTab === tab ? '#fff' : '#555',
              fontSize: 13,
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab === 'plan' ? '🗓 Наш план' : '📋 Бриф'}
          </button>
        ))}
        {activeTab === 'brief' && (
          <button
            onClick={() => setShowQuotes((v) => !v)}
            style={{
              marginLeft: 'auto',
              padding: '6px 14px', borderRadius: 8,
              border: '1px solid #ddd',
              background: showQuotes ? '#111' : '#fff',
              color: showQuotes ? '#fff' : '#444',
              fontSize: 13, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {showQuotes ? 'Сховати цитати' : 'Показати цитати'}
          </button>
        )}
      </div>

      {visibleSections.map((section) => (
        <div key={section.title} style={{ marginBottom: 36 }}>
          {activeTab !== 'plan' && (
            <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', margin: '0 0 12px' }}>
              {section.title}
            </h2>
          )}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', overflow: 'hidden' }}>
            {section.items.map((item, i) => (
              <div
                key={item.id}
                style={{
                  borderTop: i > 0 ? '1px solid #f0f0f0' : 'none',
                  opacity: saving === item.id ? 0.5 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={!!state[item.id]}
                    onChange={() => toggle(item.id)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#000', flexShrink: 0, marginTop: 2 }}
                  />
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: 15,
                      color: state[item.id] ? '#bbb' : '#111',
                      textDecoration: state[item.id] ? 'line-through' : 'none',
                      transition: 'color 0.15s',
                      display: 'block',
                    }}>
                      {item.label}
                    </span>
                    {showQuotes && item.quote && (
                      <span style={{
                        display: 'block', marginTop: 4,
                        fontSize: 12, color: '#999',
                        fontStyle: 'italic', lineHeight: 1.4,
                      }}>
                        "{item.quote}"
                      </span>
                    )}
                  </div>
                  <AssigneeBadge
                    assignee={
                      assignees[item.id] === 'none' ? null :
                      (assignees[item.id] as Assignee | undefined) ?? item.defaultAssignee ?? null
                    }
                    onClick={() => cycleAssignee(item.id)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p style={{ fontSize: 12, color: '#ccc', textAlign: 'center', marginTop: 8 }}>
        Клік на кружок = асайнити: L (Liuda) → V (Vlad) → нікому
      </p>
    </div>
  )
}
