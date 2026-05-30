'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getInProgress, removeInProgress, type InProgressItem } from '@/lib/storage'

export default function ActivePage() {
  const router = useRouter()
  const [items, setItems] = useState<InProgressItem[]>([])

  useEffect(() => { setItems(getInProgress()) }, [])

  function remove(id: string) {
    removeInProgress(id)
    setItems(getInProgress())
  }

  function relativeDate(iso: string) {
    try {
      const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
      if (days === 0) return 'сьогодні'
      if (days === 1) return 'вчора'
      return `${days} дн. тому`
    } catch { return '' }
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#111', padding: '40px 24px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <p style={{ fontSize: 13, color: '#666', letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 32 }}>
          It Depends
        </p>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
          Активні задачі
        </h1>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 40 }}>
          Кроки які ти взяла в роботу але ще не завершила.
        </p>

        {items.length === 0 ? (
          <div style={{ color: '#555', fontSize: 15 }}>
            Немає активних задач. Відкрий крок на карті і натисни «Взяла в роботу».
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <div key={item.id} style={{
                background: '#1c1c1c', border: '1px solid #2a2a2a',
                borderRadius: 14, padding: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>
                      крок {item.stepIdx + 1} · {relativeDate(item.date)}
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{item.subtitle}</div>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 18, padding: '0 0 0 12px' }}
                    aria-label="Видалити"
                  >
                    ×
                  </button>
                </div>
                {item.task && (
                  <div style={{ fontSize: 13, color: '#888', background: '#111', borderRadius: 8, padding: '10px 12px', marginTop: 12 }}>
                    {item.task}
                  </div>
                )}
                <button
                  onClick={() => router.push(`/calibrate?openStep=${item.stepIdx}`)}
                  style={{
                    marginTop: 16, padding: '10px 16px', borderRadius: 8,
                    border: 'none', background: '#fff', color: '#111',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Відкрити завдання →
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => router.back()}
          style={{ marginTop: 40, color: '#555', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer' }}
        >
          ← Назад
        </button>
      </div>
    </div>
  )
}
