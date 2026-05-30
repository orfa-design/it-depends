import { useState } from 'react'

export function useClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false)
  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), resetMs)
    }).catch(() => {})
  }
  return { copied, copy }
}
