// 결과/공유 화면용 임시 데이터.
// TODO(Swagger): DiagnosisResult 스키마 확정 후 백엔드 응답으로 교체.

export const USER_NAME = 'Minseo'
export const RESULT_DATE = '2026.08.24'
export const PROFILE_TAGS = ['복합성 피부', '피부 나이 24세']
export const PROFILE_DESC =
  '유분이 많은 T존과 속건조가 함께 공존하는 복합성 피부예요. 피지 조절과 수분 보충이 핵심이에요.'

export const TOTAL_SCORE = 53
export const PEER_SCORE = 52
export const TOTAL_DESC =
  '20대 평균보다 종합 점수가 +1 높아요. 전반적으로 균형 잡힌 편이지만 수분 관리에 조금 더 신경 쓰면 좋아요.'

// 레이더 차트 (시계방향, 12시 시작)
export const RADAR_LABELS = ['수분', '주름', '색소', '모공', '민감', '유분']
export const RADAR_VALUES = [80, 55, 62, 45, 52, 68]

export interface Metric {
  label: string
  score: number
  grade: string
  peer: string
  desc: string
  barClass: string
}

export const METRICS: Metric[] = [
  {
    label: '수분',
    score: 62,
    grade: '보통',
    peer: '또래 평균 대비 ▲ 2점',
    desc: '속건조 경향이 보여요.',
    barClass: 'from-[#5ad1ff] to-[#8b6cff]',
  },
  {
    label: '주름',
    score: 62,
    grade: '보통',
    peer: '또래 평균 대비 ▲ 2점',
    desc: '잔주름은 적은 편이에요.',
    barClass: 'from-[#8b6cff] to-[#a78bff]',
  },
  {
    label: '색소',
    score: 62,
    grade: '보통',
    peer: '또래 평균 대비 ▲ 2점',
    desc: '부분적인 색소 침착이 있어요.',
    barClass: 'from-[#ffb86a] to-[#ff9d6a]',
  },
  {
    label: '모공',
    score: 62,
    grade: '보통',
    peer: '또래 평균 대비 ▲ 2점',
    desc: 'T존 모공이 도드라져요.',
    barClass: 'from-[#ff6ab0] to-[#ff8ac4]',
  },
  {
    label: '민감',
    score: 62,
    grade: '보통',
    peer: '또래 평균 대비 ▲ 2점',
    desc: '자극에 비교적 안정적이에요.',
    barClass: 'from-[#6affd0] to-[#5ad1ff]',
  },
  {
    label: '유분',
    score: 62,
    grade: '보통',
    peer: '또래 평균 대비 ▲ 2점',
    desc: '오후에 유분이 늘어요.',
    barClass: 'from-[#ff9d6a] to-[#ff7a6a]',
  },
]

export interface Ingredient {
  name: string
  badge: string
  desc: string
  iconClass: string
}

export const INGREDIENTS: Ingredient[] = [
  {
    name: '히알루론산',
    badge: '수분 보습',
    desc: '수분을 끌어당겨 속건조를 완화하고 겉피부 결까지 잔잔하게 정돈해줘요.',
    iconClass: 'from-[#5ad1ff] to-[#8b6cff]',
  },
  {
    name: '나이아신아마이드',
    badge: '톤 케어',
    desc: '피부 톤과 유분 밸런스를 도와 맑고 균일한 인상을 만들어줘요.',
    iconClass: 'from-[#a78bff] to-[#8b6cff]',
  },
  {
    name: '세라마이드',
    badge: '장벽 강화',
    desc: '피부 장벽을 단단하게 채워 외부 자극과 수분 손실을 줄여줘요.',
    iconClass: 'from-[#ffd6a0] to-[#ffb86a]',
  },
]

export interface RoutineStep {
  name: string
  product: string
  desc: string
}

export const ROUTINE: RoutineStep[] = [
  {
    name: '클렌징',
    product: '약산성 젤 클렌저',
    desc: '유분은 덜어내되 속당김은 막아줘요.',
  },
  { name: '토너', product: '수분 결 토너', desc: '다음 단계 흡수를 도와줘요.' },
  {
    name: '세럼',
    product: '히알루론산 세럼',
    desc: '속건조를 집중적으로 채워줘요.',
  },
  {
    name: '수분크림',
    product: '세라마이드 크림',
    desc: '장벽을 감싸 수분을 가둬줘요.',
  },
  { name: '선크림', product: '데일리 선크림', desc: '색소 침착을 예방해줘요.' },
]
