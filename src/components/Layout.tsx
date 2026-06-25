function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
      style={{
        background:
          'radial-gradient(ellipse 90% 40% at bottom center, #3b0764 0%, #0a0010 60%, #000000 100%)',
      }}
    >
      {children}
    </div>
  )
}

export default Layout
