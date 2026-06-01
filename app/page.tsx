'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    let name = ''
    try { name = localStorage.getItem('itdepends_name') ?? '' } catch {}
    router.replace(name ? '/gallery' : '/login')
  }, [router])
  return null
}
