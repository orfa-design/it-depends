import type { Metadata } from 'next'
import '../styles/design-tokens.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'It Depends',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
