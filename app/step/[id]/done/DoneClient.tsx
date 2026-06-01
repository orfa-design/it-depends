'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { type Step } from '@/lib/steps-v2'
import { getProgress } from '@/lib/progress-v2'
import StepCard from '@/components/StepCard'
import { SparkIcon } from '@/components/icons'
import '../../../../styles/v2.css'

export default function DoneClient({ step, related }: { step: Step; related: Step[] }) {
  const router = useRouter()
  const [resultUrl, setResultUrl] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    try {
      if (localStorage.getItem('itdepends_theme') === 'light')
        document.documentElement.setAttribute('data-theme', 'light')
      setName(localStorage.getItem('itdepends_name') ?? '')
    } catch {}
    const p = getProgress(step.id)
    if (p.resultUrl) setResultUrl(p.resultUrl)
  }, [step.id])

  const shareText = `Зробила «${step.title}» з AI 🙂`
  const siteUrl = typeof window !== 'undefined' ? window.location.origin + '/gallery' : ''

  const channels = [
    { label: 'WhatsApp', open: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + siteUrl)}`, '_blank') },
    { label: 'Telegram', open: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`, '_blank') },
    { label: 'LinkedIn', open: () => { navigator.clipboard?.writeText(shareText); window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`, '_blank') } },
  ]

  return (
    <div className="v2-app">
      <div className="v2-done-shell">
        <div className="v2-done-spark"><SparkIcon size={26} /></div>
        <p className="v2-done-eyebrow">{name ? `${name}, готово` : 'Готово'}</p>
        <h1 className="v2-done-title">Зроблено.</h1>

        <div className="v2-done-card">
          <span className="v2-done-card-label">Крок</span>
          <span className="v2-done-card-title">{step.title}</span>
          {resultUrl && (
            <a className="v2-done-card-url" href={resultUrl} target="_blank" rel="noreferrer">
              {resultUrl} ↗
            </a>
          )}
        </div>

        <div className="v2-share">
          <p className="v2-share-label">Поділитись</p>
          <div className="v2-share-row">
            {channels.map((c) => (
              <button key={c.label} className="v2-share-btn" onClick={c.open}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <button className="v2-btn v2-btn-primary" onClick={() => router.push('/map')}>
          На мапу →
        </button>

        {related.length > 0 && (
          <div className="v2-done-related">
            <p className="v2-done-related-label" style={{ marginTop: 32 }}>Також спробуй</p>
            <div className="v2-done-related-grid">
              {related.slice(0, 2).map((s) => (
                <StepCard key={s.id} step={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
