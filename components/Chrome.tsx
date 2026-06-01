'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { countInProgress } from '@/lib/progress-v2'
import { SunIcon, MoonIcon } from './icons'

export default function Chrome({ view }: { view?: 'gallery' | 'map' }) {
  const router = useRouter()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  useEffect(() => {
    try {
      if (localStorage.getItem('itdepends_theme') === 'light') setTheme('light')
      setName(localStorage.getItem('itdepends_name') ?? '')
    } catch {}
    setCount(countInProgress())
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('itdepends_theme', theme) } catch {}
    return () => document.documentElement.removeAttribute('data-theme')
  }, [theme])

  return (
    <header className="v2-chrome">
      <button className="v2-brand" onClick={() => router.push('/gallery')}>
        <span className="v2-brand-dot" />
        It Depends
      </button>

      {view && (
        <div className="v2-toggle">
          <button className={view === 'gallery' ? 'active' : ''} onClick={() => router.push('/gallery')}>
            Галерея
          </button>
          <button className={view === 'map' ? 'active' : ''} onClick={() => router.push('/map')}>
            Мапа
          </button>
        </div>
      )}

      <div className="v2-chrome-right">
        <button className="v2-chrome-link" onClick={() => router.push('/progress')}>
          Активні
          {count > 0 && <span className="v2-chrome-badge">{count}</span>}
        </button>
        {name && (
          <button className="v2-name" onClick={() => router.push('/login')}>
            {name}
          </button>
        )}
        <button
          className="v2-theme"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          aria-label="theme"
        >
          {theme === 'dark' ? <SunIcon size={15} /> : <MoonIcon size={15} />}
        </button>
      </div>
    </header>
  )
}
