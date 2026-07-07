import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(ellipse 55% 26% at bottom center, #5b34ad 0%, #0a0010 55%, #000000 100%)',
      }}
    >
      {children}
    </div>
  )
}
