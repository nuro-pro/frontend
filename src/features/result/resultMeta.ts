// 결과 화면 디자인 메타데이터
// 또래 평균(peerScore/peerTotalScore)은 백엔드 응답에서 직접 사용

export const RADAR_LABELS = [
  '수분',
  '주름',
  '색소',
  '모공',
  '민감',
  '유분',
] as const
export type MetricLabel = (typeof RADAR_LABELS)[number]

interface MetricMeta {
  /** 레이더 꼭짓점·점 색 */
  color: string
  /** 점수 바 그라데이션 */
  bar: string
}

export const METRIC_META: Record<MetricLabel, MetricMeta> = {
  수분: { color: '#3fc8ff', bar: 'from-[#5ad1ff] to-[#3b9bff]' },
  주름: { color: '#b07bff', bar: 'from-[#9b6cff] to-[#c4a3ff]' },
  색소: { color: '#FFAF2D', bar: 'from-[#ffb86a] to-[#ff9d6a]' },
  모공: { color: '#ff6ab0', bar: 'from-[#ff6ab0] to-[#ff8ac4]' },
  민감: { color: '#6affd0', bar: 'from-[#6affd0] to-[#3fd8b0]' },
  유분: { color: '#ff9d6a', bar: 'from-[#ff9d6a] to-[#ff7a6a]' },
}

/** RADAR_LABELS 순서에 맞춘 꼭짓점 색 배열 */
export const RADAR_COLORS = RADAR_LABELS.map(
  (label) => METRIC_META[label].color,
)

// 점수 등급
export const Band = { Care: 'care', Normal: 'normal', Good: 'good' } as const
export type Band = (typeof Band)[keyof typeof Band]

export function bandOf(score: number): Band {
  if (score < 40) return Band.Care
  if (score < 80) return Band.Normal
  return Band.Good
}

// 등급칩 색: 보통=옐로우, 관리 권장=레드, 좋음=그린
export const BAND_META: Record<Band, { label: string; chip: string }> = {
  care: { label: '관리 권장', chip: 'bg-[#5a2f38] text-[#ff9aa5]' },
  normal: { label: '보통', chip: 'bg-[#4a3f1c] text-[#f4d06a]' },
  good: { label: '좋음', chip: 'bg-[#245140] text-[#5fe0a5]' },
}

// 지표·등급별 한 줄 설명 (임시 카피)
const METRIC_DESC: Record<MetricLabel, Record<Band, string>> = {
  수분: {
    good: '수분감이 충분히 유지되고 있어요.',
    normal: '피부 속 보습이 조금 더 필요해요.',
    care: '속건조가 뚜렷해 집중 보습이 필요해요.',
  },
  주름: {
    good: '탄력이 잘 유지되고 있어요.',
    normal: '잔주름이 보이기 시작하는 단계예요.',
    care: '탄력 저하 경향이 보여요.',
  },
  색소: {
    good: '맑은 피부톤이 잘 유지되고 있어요.',
    normal: '약간의 색소 침착이 보여요.',
    care: '색소 침착 관리가 필요해요.',
  },
  모공: {
    good: '모공이 매끈하게 관리되고 있어요.',
    normal: '모공이 살짝 도드라져 보여요.',
    care: '모공·피지 관리가 필요해요.',
  },
  민감: {
    good: '외부 자극에 안정적인 편이에요.',
    normal: '가끔 예민해질 수 있는 상태예요.',
    care: '자극에 민감해 진정 케어가 필요해요.',
  },
  유분: {
    good: '유수분 밸런스가 좋아요.',
    normal: '유분이 다소 있는 편이에요.',
    care: '과도한 유분 관리가 필요해요.',
  },
}

export function metricDesc(label: MetricLabel, band: Band): string {
  return METRIC_DESC[label][band]
}
