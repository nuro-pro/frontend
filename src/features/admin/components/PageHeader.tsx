export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}
