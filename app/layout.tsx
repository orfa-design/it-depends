import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'It Depends — Checklist',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f9f9f9' }}>
        {children}
      </body>
    </html>
  )
}
