interface RadarChartProps {
  /** 0 ~ max 사이의 값. labels와 같은 길이 */
  values: number[]
  /** 각 축 라벨 (시계방향, 12시 시작) */
  labels: string[]
  /** 각 꼭짓점 색 (labels와 같은 순서·길이) 없으면 단색. */
  colors?: string[]
  max?: number
  className?: string
}

const START_ANGLE = -90 // 12시 방향에서 시작
const GRID_RINGS = [0.25, 0.5, 0.75, 1]

function pointAt(index: number, count: number, radius: number, center: number) {
  const angle = ((START_ANGLE + (360 / count) * index) * Math.PI) / 180
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  }
}

// 6개 지표 밸런스 레이더(육각형) 차트.
export function RadarChart({
  values,
  labels,
  colors,
  max = 100,
  className,
}: RadarChartProps) {
  const size = 240
  const center = size / 2
  const radius = 80
  const count = labels.length

  const ringPolygon = (factor: number) =>
    labels
      .map((_, i) => {
        const p = pointAt(i, count, radius * factor, center)
        return `${p.x},${p.y}`
      })
      .join(' ')

  const clamp = (v: number) => Math.max(0, Math.min(v, max)) / max

  const dataPolygon = values
    .map((v, i) => {
      const p = pointAt(i, count, radius * clamp(v), center)
      return `${p.x},${p.y}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="6개 지표 밸런스 차트"
    >
      {GRID_RINGS.map((factor) => (
        <polygon
          key={factor}
          points={ringPolygon(factor)}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
        />
      ))}

      {labels.map((label, i) => {
        const p = pointAt(i, count, radius, center)
        return (
          <line
            key={`axis-${label}`}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.12)"
          />
        )
      })}

      <polygon
        points={dataPolygon}
        fill="rgba(139,108,255,0.45)"
        stroke="#8b6cff"
        strokeWidth={2}
      />

      {values.map((v, i) => {
        const p = pointAt(i, count, radius * clamp(v), center)
        const color = colors?.[i] ?? '#c4b5ff'
        return (
          <circle
            key={`dot-${labels[i]}`}
            cx={p.x}
            cy={p.y}
            r={3.5}
            fill={color}
            stroke="#fff"
            strokeWidth={1}
          />
        )
      })}

      {labels.map((label, i) => {
        const p = pointAt(i, count, radius + 18, center)
        return (
          <text
            key={`label-${label}`}
            x={p.x}
            y={p.y}
            fill="#ffffff"
            fontSize={12}
            fontWeight={500}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}
