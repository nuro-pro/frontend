import { RingStatus } from './ringStatus'

interface ScanningRingProps {
  status: RingStatus
}

const COLOR: Record<RingStatus, string> = {
  searching: '#8b6cff',
  aligning: '#b9a6ff',
  locked: '#37e0a6',
}

const CIRCUMFERENCE = 295

/**
 * 가이드 외곽을 도는 스캔 링
 */
export function ScanningRing({ status }: ScanningRingProps) {
  const color = COLOR[status]
  const spinning = status !== RingStatus.Locked
  const dash =
    status === RingStatus.Locked ? `${CIRCUMFERENCE} 0` : `70 ${CIRCUMFERENCE}`

  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-colors duration-500"
        style={{ backgroundColor: `${color}33` }}
      />
      <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
      <svg
        viewBox="0 0 100 100"
        className={`absolute inset-0 h-full w-full ${spinning ? 'animate-spin' : ''}`}
        style={{ animationDuration: '2.2s' }}
      >
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={dash}
          className="transition-all duration-300"
        />
      </svg>
    </div>
  )
}
