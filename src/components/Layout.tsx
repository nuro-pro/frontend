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
          'radial-gradient(ellipse 90% 40% at bottom center, #663fce 0%, #0a0010 60%, #000000 100%)',
      }}
    >
      {children}
    </div>
  )
}
