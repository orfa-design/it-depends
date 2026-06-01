'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '../../styles/start-flow.css'

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [existing, setExisting] = useState(false)

  useEffect(() => {
    // theme
    try {
      if (localStorage.getItem('itdepends_theme') === 'light')
        document.documentElement.setAttribute('data-theme', 'light')
      const saved = localStorage.getItem('itdepends_name')
      if (saved) { setName(saved); setExisting(true) }
    } catch {}
  }, [])

  function submit() {
    const trimmed = name.trim()
    if (!trimmed) return
    try { localStorage.setItem('itdepends_name', trimmed) } catch {}
    router.push(existing ? '/gallery' : '/calibrate')
  }

  return (
    <div className="sf-page">
      <div className="sf-body" style={{ maxWidth: 400 }}>
        <div className="sf-topbar">
          <div className="sf-brand"><span className="sf-brand-dot" />It Depends</div>
        </div>

        <h1 className="sf-title">Як тебе звати?</h1>
        <p className="sf-sub">
          {existing ? 'Можеш змінити імʼя або продовжити.' : 'Збережемо твій прогрес під цим імʼям.'}
        </p>

        <input
          style={{
            width: '100%', boxSizing: 'border-box',
            fontFamily: 'var(--font-sans)', fontSize: 15, padding: '14px 16px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, color: 'var(--ink)', outline: 'none',
          }}
          placeholder="Твоє імʼя"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
        />

        <button
          className="sf-btn sf-btn-primary"
          style={{ marginTop: 16 }}
          disabled={!name.trim()}
          onClick={submit}
        >
          {existing ? 'Продовжити →' : 'Увійти →'}
        </button>
      </div>
    </div>
  )
}
