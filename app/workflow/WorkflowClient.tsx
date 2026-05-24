'use client'

import { useState, useRef, useCallback } from 'react'
import { getSeed } from './seed'
import type { WorkflowState, WorkflowPhase, WorkflowItem, PinnedItem, Owner, Status } from './seed'

// ── Constants ──────────────────────────────────────────────────────────────
const STATUS_NEXT: Record<Status, Status> = {
  not_started: 'in_progress',
  in_progress: 'done',
  done: 'not_started',
}

const OWNER_NEXT: Record<string, Owner> = {
  'null': 'vlad', vlad: 'liuda', liuda: 'both', both: null,
}

const PINNED_SECTIONS: { key: keyof WorkflowState['pinned']; label: string }[] = [
  { key: 'next48h',   label: '🔥 Наступні 48 год' },
  { key: 'blocked',   label: '🚧 Блокери / рішення' },
  { key: 'questions', label: '🧠 Відкриті питання' },
]

const uid   = () => crypto.randomUUID()
const tsNow = () => new Date().toISOString()

// ── SVG Icons ──────────────────────────────────────────────────────────────
const IcEmpty = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="#d1d5db" strokeWidth="2" />
  </svg>
)
const IcHalf = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="8" fill="none" stroke="#6366f1" strokeWidth="2" />
    <path d="M10 2 A8 8 0 0 1 10 18 Z" fill="#6366f1" />
  </svg>
)
const IcFull = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="10" fill="#6366f1" />
    <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const IcTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
)
const IcPlus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

// ── Owner chip ──────────────────────────────────────────────────────────────
function OwnerChip({ owner, onClick }: { owner: Owner; onClick: () => void }) {
  const cls   = owner === 'vlad' ? 'oc-vlad' : owner === 'liuda' ? 'oc-liuda' : owner === 'both' ? 'oc-both' : 'oc-none'
  const label = owner === 'vlad' ? 'Vlad'    : owner === 'liuda' ? 'Liuda'    : owner === 'both' ? 'Both'    : '—'
  return <button className={`owner-chip ${cls}`} onClick={onClick} type="button">{label}</button>
}

function StatusIcon({ status }: { status: Status }) {
  return status === 'done' ? <IcFull /> : status === 'in_progress' ? <IcHalf /> : <IcEmpty />
}

// ── PinnedInput ────────────────────────────────────────────────────────────
function PinnedInput({ onCommit, onCancel }: { onCommit: (text: string) => void; onCancel: () => void }) {
  const [val, setVal] = useState('')
  return (
    <input
      className="wf-pinned-input"
      value={val}
      autoFocus
      placeholder="Напишіть і натисніть Enter…"
      onChange={e => setVal(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter')  { e.preventDefault(); onCommit(val) }
        if (e.key === 'Escape') onCancel()
      }}
      onBlur={() => onCommit(val)}
    />
  )
}

// ── ItemRow ────────────────────────────────────────────────────────────────
function ItemRow({
  item, editingId,
  onToggleStatus, onCycleOwner,
  onStartEdit, onCommitEdit, onCancelEdit, onDelete,
}: {
  item: WorkflowItem
  editingId: string | null
  onToggleStatus: () => void
  onCycleOwner:   () => void
  onStartEdit:    () => void
  onCommitEdit:   (val: string) => void
  onCancelEdit:   () => void
  onDelete:       () => void
}) {
  const isEditing = editingId === item.id
  return (
    <div className={`wf-item-row${item.status === 'done' ? ' is-done' : ''}`}>
      <button className="wf-status-btn" onClick={onToggleStatus} type="button" aria-label="Toggle status">
        <StatusIcon status={item.status} />
      </button>
      <OwnerChip owner={item.owner} onClick={onCycleOwner} />
      <div className="wf-item-title-wrap">
        {isEditing ? (
          <input
            className="wf-item-input"
            defaultValue={item.title}
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter')  { e.preventDefault(); onCommitEdit((e.target as HTMLInputElement).value) }
              if (e.key === 'Escape') onCancelEdit()
            }}
            onBlur={e => onCommitEdit(e.target.value)}
          />
        ) : (
          <span className="wf-item-title" onClick={onStartEdit}>{item.title}</span>
        )}
      </div>
      <button className="wf-del-btn" onClick={onDelete} type="button" aria-label="Delete item">
        <IcTrash />
      </button>
    </div>
  )
}

// ── PhaseCard ──────────────────────────────────────────────────────────────
function PhaseCard({
  phase, editingId,
  onTogglePhase, onToggleStatus, onCycleOwner,
  onStartEdit, onCommitEdit, onCancelEdit,
  onAddItem, onDeleteItem,
}: {
  phase:           WorkflowPhase
  editingId:       string | null
  onTogglePhase:   () => void
  onToggleStatus:  (itemId: string) => void
  onCycleOwner:    (itemId: string) => void
  onStartEdit:     (itemId: string) => void
  onCommitEdit:    (itemId: string, val: string) => void
  onCancelEdit:    () => void
  onAddItem:       () => void
  onDeleteItem:    (itemId: string) => void
}) {
  const isOpen  = !phase.collapsed
  const doneCt  = phase.items.filter(i => i.status === 'done').length
  const pct     = phase.items.length ? Math.round(doneCt / phase.items.length * 100) : 0

  return (
    <div className="wf-phase-card">
      <div className="wf-phase-head" onClick={onTogglePhase}>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" className="wf-caret"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="wf-phase-title">{phase.title}</span>
        <span className="wf-phase-count">{doneCt}/{phase.items.length}</span>
        <div className="wf-phase-bar-wrap">
          <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: `${pct}%` }} /></div>
          <span className="wf-bar-label" style={{ fontSize: 11 }}>{pct}%</span>
        </div>
      </div>
      {isOpen && (
        <div className="wf-phase-body">
          {phase.items.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              editingId={editingId}
              onToggleStatus={() => onToggleStatus(item.id)}
              onCycleOwner={()   => onCycleOwner(item.id)}
              onStartEdit={()    => onStartEdit(item.id)}
              onCommitEdit={val  => onCommitEdit(item.id, val)}
              onCancelEdit={onCancelEdit}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
          <div className="wf-add-item" onClick={onAddItem} role="button" tabIndex={0}>
            <IcPlus /> Додати пункт
          </div>
        </div>
      )}
    </div>
  )
}

// ── CSS ────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.wf-app { max-width: 960px; margin: 0 auto; padding: 28px 20px 80px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #111827; line-height: 1.5; }

.wf-header { display: flex; align-items: center; gap: 16px; padding: 14px 20px; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 16px; }
.wf-header-title { font-size: 15px; font-weight: 600; white-space: nowrap; }
.wf-header-progress { flex: 1; display: flex; align-items: center; gap: 10px; }
.wf-bar-track { flex: 1; height: 5px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
.wf-bar-fill  { height: 100%; background: #6366f1; border-radius: 99px; transition: width .3s ease; }
.wf-bar-label { font-size: 12px; color: #6b7280; min-width: 32px; text-align: right; }
.wf-save-time { font-size: 11px; color: #9ca3af; white-space: nowrap; }
.wf-btn { padding: 5px 11px; border-radius: 6px; border: 1px solid #e5e7eb; background: #fff; color: #6b7280; font-size: 12px; font-weight: 500; font-family: inherit; cursor: pointer; transition: border-color .15s, color .15s; }
.wf-btn:hover { border-color: #6b7280; color: #111827; }
.wf-btn-danger:hover { border-color: #ef4444; color: #ef4444; }

.wf-constraints { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 20px; margin-bottom: 16px; }
.wf-section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #9ca3af; margin-bottom: 10px; }
.wf-reminders { display: flex; flex-wrap: wrap; gap: 6px 18px; }
.wf-reminder  { font-size: 12px; color: #6b7280; }

.wf-pinned-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
@media (max-width: 680px) { .wf-pinned-grid { grid-template-columns: 1fr; } }
.wf-pinned-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; }
.wf-pinned-head { font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 10px; }
.wf-pinned-list { display: flex; flex-direction: column; gap: 2px; }
.wf-pinned-item { display: flex; align-items: flex-start; gap: 6px; padding: 3px 0; font-size: 13px; }
.wf-pinned-dot  { color: #9ca3af; font-size: 12px; line-height: 1.6; flex-shrink: 0; }
.wf-pinned-text { flex: 1; word-break: break-word; }
.wf-pinned-del  { opacity: 0; cursor: pointer; color: #9ca3af; flex-shrink: 0; padding: 2px; background: none; border: none; display: flex; align-items: center; margin-top: 2px; transition: opacity .15s, color .15s; }
.wf-pinned-item:hover .wf-pinned-del { opacity: 1; }
.wf-pinned-del:hover { color: #ef4444; }
.wf-pinned-add   { display: flex; align-items: center; gap: 5px; margin-top: 8px; color: #9ca3af; font-size: 12px; cursor: pointer; background: none; border: none; font-family: inherit; padding: 0; transition: color .15s; }
.wf-pinned-add:hover { color: #6366f1; }
.wf-pinned-input { width: 100%; border: none; border-bottom: 1px solid #6366f1; outline: none; font-family: inherit; font-size: 13px; background: transparent; color: #111827; padding: 2px 0; margin-top: 8px; }

.wf-phases     { display: flex; flex-direction: column; gap: 10px; }
.wf-phase-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
.wf-phase-head { display: flex; align-items: center; gap: 12px; padding: 13px 20px; cursor: pointer; user-select: none; transition: background .1s; }
.wf-phase-head:hover { background: #f9fafb; }
.wf-caret      { flex-shrink: 0; color: #9ca3af; display: block; transition: transform .2s; }
.wf-phase-title { font-weight: 600; font-size: 14px; flex: 1; }
.wf-phase-count { font-size: 12px; color: #9ca3af; flex-shrink: 0; }
.wf-phase-bar-wrap { display: flex; align-items: center; gap: 8px; width: 110px; flex-shrink: 0; }
.wf-phase-body { border-top: 1px solid #f3f4f6; }

.wf-item-row { display: flex; align-items: center; gap: 10px; padding: 7px 20px; border-left: 3px solid transparent; transition: background .1s; }
.wf-item-row:hover { background: #f9fafb; }
.wf-item-row.is-done .wf-item-title { text-decoration: line-through; color: #9ca3af; }
.wf-status-btn { flex-shrink: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; width: 22px; height: 22px; background: none; border: none; padding: 0; transition: opacity .15s; }
.wf-status-btn:hover { opacity: 0.65; }

.owner-chip       { flex-shrink: 0; min-width: 58px; height: 20px; border-radius: 99px; font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none; padding: 0 8px; transition: opacity .15s; white-space: nowrap; font-family: inherit; }
.owner-chip:hover { opacity: 0.7; }
.oc-none  { background: #f3f4f6; color: #9ca3af; border: 1px dashed #e5e7eb; }
.oc-vlad  { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; }
.oc-liuda { background: #f0fdf4; color: #10b981; border: 1px solid #a7f3d0; }
.oc-both  { background: linear-gradient(90deg, #eff6ff 50%, #f0fdf4 50%); color: #6b7280; border: 1px solid #e5e7eb; }

.wf-item-title-wrap { flex: 1; min-width: 0; }
.wf-item-title { font-size: 13px; color: #111827; cursor: text; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wf-item-title:hover { color: #6366f1; }
.wf-item-input { width: 100%; border: none; border-bottom: 1px solid #6366f1; outline: none; font-family: inherit; font-size: 13px; background: transparent; color: #111827; padding: 0; }

.wf-del-btn { flex-shrink: 0; opacity: 0; cursor: pointer; color: #9ca3af; display: flex; align-items: center; padding: 2px; background: none; border: none; transition: opacity .15s, color .15s; }
.wf-item-row:hover .wf-del-btn { opacity: 1; }
.wf-del-btn:hover { color: #ef4444; }

.wf-add-item { display: flex; align-items: center; gap: 8px; padding: 9px 20px; font-size: 13px; color: #9ca3af; cursor: pointer; border-top: 1px solid #f3f4f6; transition: color .15s, background .1s; user-select: none; }
.wf-add-item:hover { color: #6366f1; background: #f9fafb; }
`

// ── Main component ─────────────────────────────────────────────────────────
export function WorkflowClient({ initialState }: { initialState: WorkflowState }) {
  const [state, setState]     = useState<WorkflowState>(initialState)
  const [editingId, setEditing] = useState<string | null>(null)
  const [saveStatus, setSave]   = useState<'idle' | 'saving' | 'unsaved'>('idle')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Debounced persist ────────────────────────────────────────────────────
  const persist = useCallback((next: WorkflowState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSave('saving')
    saveTimer.current = setTimeout(async () => {
      try {
        const res  = await fetch('/api/workflow/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        })
        const data = await res.json()
        if (data.ok) {
          setState(s => ({ ...s, lastSaved: data.lastSaved }))
          setSave('idle')
        } else {
          setSave('unsaved')
        }
      } catch {
        console.error('[workflow] save failed')
        setSave('unsaved')
      }
    }, 300)
  }, [])

  function update(next: WorkflowState) { setState(next); persist(next) }

  // ── Computed ─────────────────────────────────────────────────────────────
  const allItems = state.phases.flatMap(p => p.items)
  const totalPct = allItems.length
    ? Math.round(allItems.filter(i => i.status === 'done').length / allItems.length * 100) : 0
  const savedTime = state.lastSaved
    ? new Date(state.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null

  // ── Phase mutations ───────────────────────────────────────────────────────
  function togglePhase(phaseId: string) {
    update({ ...state, phases: state.phases.map(p => p.id !== phaseId ? p : { ...p, collapsed: !p.collapsed }) })
  }

  function toggleStatus(phaseId: string, itemId: string) {
    update({
      ...state,
      phases: state.phases.map(p => p.id !== phaseId ? p : {
        ...p,
        items: p.items.map(it => it.id !== itemId ? it : { ...it, status: STATUS_NEXT[it.status], updatedAt: tsNow() }),
      }),
    })
  }

  function cycleOwner(phaseId: string, itemId: string) {
    update({
      ...state,
      phases: state.phases.map(p => p.id !== phaseId ? p : {
        ...p,
        items: p.items.map(it => it.id !== itemId ? it : { ...it, owner: OWNER_NEXT[String(it.owner)], updatedAt: tsNow() }),
      }),
    })
  }

  function commitItemEdit(phaseId: string, itemId: string, val: string) {
    setEditing(null)
    if (!val.trim()) return
    update({
      ...state,
      phases: state.phases.map(p => p.id !== phaseId ? p : {
        ...p,
        items: p.items.map(it => it.id !== itemId ? it : { ...it, title: val.trim(), updatedAt: tsNow() }),
      }),
    })
  }

  function addItem(phaseId: string) {
    const newItem: WorkflowItem = { id: uid(), title: 'New item', status: 'not_started', owner: null, notes: '', updatedAt: tsNow() }
    update({ ...state, phases: state.phases.map(p => p.id !== phaseId ? p : { ...p, items: [...p.items, newItem] }) })
    setEditing(newItem.id)
  }

  function deleteItem(phaseId: string, itemId: string) {
    if (!confirm('Видалити цей пункт?')) return
    update({ ...state, phases: state.phases.map(p => p.id !== phaseId ? p : { ...p, items: p.items.filter(it => it.id !== itemId) }) })
  }

  // ── Pinned mutations ──────────────────────────────────────────────────────
  function addPinned(list: keyof WorkflowState['pinned'], text: string) {
    setEditing(null)
    if (!text.trim()) return
    update({ ...state, pinned: { ...state.pinned, [list]: [...state.pinned[list], { id: uid(), text: text.trim() }] } })
  }

  function deletePinned(list: keyof WorkflowState['pinned'], id: string) {
    update({ ...state, pinned: { ...state.pinned, [list]: state.pinned[list].filter((i: PinnedItem) => i.id !== id) } })
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  function doReset() {
    if (!confirm('Скинути до початкового стану? Весь прогрес буде втрачено.')) return
    const seed = getSeed()
    setState(seed)
    persist(seed)
    setEditing(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="wf-app">

        {/* Header */}
        <div className="wf-header">
          <span className="wf-header-title">It Depends — Workflow</span>
          <div className="wf-header-progress">
            <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: `${totalPct}%` }} /></div>
            <span className="wf-bar-label">{totalPct}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {savedTime && (
              <span className="wf-save-time">
                {saveStatus === 'unsaved' ? '⚠ не збережено' : `Збережено ${savedTime}`}
              </span>
            )}
            <button className="wf-btn wf-btn-danger" onClick={doReset}>Скинути</button>
          </div>
        </div>

        {/* Brief Reminders */}
        <div className="wf-constraints">
          <div className="wf-section-label">Нагадування</div>
          <div className="wf-reminders">
            {state.constraints.map(c => <span key={c.id} className="wf-reminder">• {c.title}</span>)}
          </div>
        </div>

        {/* Pinned */}
        <div className="wf-pinned-grid">
          {PINNED_SECTIONS.map(({ key, label }) => {
            const list   = state.pinned[key]
            const addKey = `add-${key}`
            return (
              <div key={key} className="wf-pinned-card">
                <div className="wf-pinned-head">{label}</div>
                <div className="wf-pinned-list">
                  {list.map((item: PinnedItem) => (
                    <div key={item.id} className="wf-pinned-item">
                      <span className="wf-pinned-dot">•</span>
                      <span className="wf-pinned-text">{item.text}</span>
                      <button className="wf-pinned-del" onClick={() => deletePinned(key, item.id)} type="button" aria-label="Delete">
                        <IcTrash />
                      </button>
                    </div>
                  ))}
                </div>
                {editingId === addKey
                  ? <PinnedInput onCommit={text => addPinned(key, text)} onCancel={() => setEditing(null)} />
                  : <button className="wf-pinned-add" onClick={() => setEditing(addKey)} type="button"><IcPlus /> Додати</button>
                }
              </div>
            )
          })}
        </div>

        {/* Phases */}
        <div className="wf-phases">
          {state.phases.map(phase => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              editingId={editingId}
              onTogglePhase={() => togglePhase(phase.id)}
              onToggleStatus={itemId => toggleStatus(phase.id, itemId)}
              onCycleOwner={itemId   => cycleOwner(phase.id, itemId)}
              onStartEdit={itemId    => setEditing(itemId)}
              onCommitEdit={(itemId, val) => commitItemEdit(phase.id, itemId, val)}
              onCancelEdit={() => setEditing(null)}
              onAddItem={() => addItem(phase.id)}
              onDeleteItem={itemId => deleteItem(phase.id, itemId)}
            />
          ))}
        </div>

      </div>
    </>
  )
}
