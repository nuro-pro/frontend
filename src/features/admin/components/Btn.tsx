type BtnVariant = 'primary' | 'ghost' | 'danger'

interface BtnProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: BtnVariant
}

export function Btn({ children, onClick, variant = 'ghost' }: BtnProps) {
  const styles: Record<BtnVariant, React.CSSProperties> = {
    primary: { background: '#8b6cff', color: '#fff', border: 'none' },
    ghost: { background: '#f1f5f9', color: '#475569', border: 'none' },
    danger: { background: '#fff', color: '#ef4444', border: '1px solid #fecaca' },
  }
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
        cursor: 'pointer', whiteSpace: 'nowrap', transition: 'opacity 0.15s',
        ...styles[variant],
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.8' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
    >
      {children}
    </button>
  )
}