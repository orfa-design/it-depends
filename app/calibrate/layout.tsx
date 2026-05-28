import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'It Depends — AI Skills Map',
}

export default function CalibrateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
        rel="stylesheet"
      />
      <style>{`body { margin: 0; }`}</style>
      {children}
    </>
  )
}
