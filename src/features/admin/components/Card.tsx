interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Card({ children, style }: CardProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        padding: '20px 24px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
