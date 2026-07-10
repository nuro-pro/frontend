export type GuideDirection = 'front' | 'left' | 'right'

interface SphereGuideProps {
  direction: GuideDirection
  aligned: boolean
}

export function SphereGuide({ direction, aligned }: SphereGuideProps) {
  const ring = aligned ? '#c9b3ff' : '#9a6bff'

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* 뒤 글로우 */}
      <div
        className="absolute inset-[6%] rounded-full blur-3xl transition-colors duration-500"
        style={{ backgroundColor: `${ring}22` }}
      />

      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ring} stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* 외곽 얇은 링 */}
        <ellipse
          cx="100"
          cy="100"
          rx="94"
          ry="97"
          fill="none"
          stroke={ring}
          strokeWidth="1"
          opacity="0.35"
        />
        {/* 메인 밝은 링 */}
        <circle
          cx="100"
          cy="100"
          r="82"
          fill="none"
          stroke={ring}
          strokeWidth="3"
          opacity="0.9"
        />

        {/* 세로 자오선 / 가로 적도 */}
        <ellipse
          cx="100"
          cy="100"
          rx="30"
          ry="82"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.22"
        />
        {/* 가로 적도: 중심을 지나는 선 */}
        <line
          x1="20"
          y1="100"
          x2="180"
          y2="100"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.22"
        />

        {/* 회전하는 스캔 하이라이트 */}
        <g
          className="origin-center animate-spin"
          style={{ animationDuration: '2.6s' }}
        >
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="url(#sweep)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="90 425"
          />
        </g>

        {/* 방향 화살표: 가로 그리드 선(적도) 중앙에 얹힌 화살표 */}
      {/* 방향 화살표: 가로 그리드 선(적도) 중앙에 얹힌 화살촉 */}
      {direction !== 'front' && (
        <g
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.95"
        >
          {direction === 'left' ? (
            <polyline points="94,91 84,100 94,109" />
          ) : (
            <polyline points="106,91 116,100 106,109" />
          )}
        </g>
      )}
      </svg>
    </div>
  )
}
