// 결과/공유 화면용 임시 데이터.
// TODO(Swagger): DiagnosisResult 스키마 확정 후 백엔드 응답으로 교체.

export interface DiagnosisResult {
  id: string
  resultDate: string
  userName: string
  skinType: string
  skinAge: number
  profileDesc: string
  scores: {
    수분: number
    주름: number
    색소: number
    모공: number
    민감: number
    유분: number
  }
  ingredients: {
    name: string
    badge: string
    desc: string
  }[]
  routine: {
    name: string
    product: string
    desc: string
  }[]
  disclaimer: string
}

export const MOCK_RESULT: DiagnosisResult = {
  id: 'abc123',
  resultDate: '2026.08.24',
  userName: 'Minseo',
  skinType: '복합성 피부',
  skinAge: 24,
  profileDesc: '유분이 많은 T존과 속건조가 함께 공존하는 복합성 피부예요. 피지 조절과 수분 보충이 핵심이에요.',
  scores: {
    수분: 80,
    주름: 55,
    색소: 62,
    모공: 45,
    민감: 52,
    유분: 68,
  },
  ingredients: [
    {
      name: '히알루론산',
      badge: '수분 보습',
      desc: '수분을 끌어당겨 속건조를 완화하고 겉피부 결까지 잔잔하게 정돈해줘요.',
    },
    {
      name: '나이아신아마이드',
      badge: '톤 케어',
      desc: '피부 톤과 유분 밸런스를 도와 맑고 균일한 인상을 만들어줘요.',
    },
    {
      name: '세라마이드',
      badge: '장벽 강화',
      desc: '피부 장벽을 단단하게 채워 외부 자극과 수분 손실을 줄여줘요.',
    },
  ],
  routine: [
    { name: '클렌징', product: '약산성 젤 클렌저', desc: '유분은 덜어내되 속당김은 막아줘요.' },
    { name: '토너', product: '수분 결 토너', desc: '다음 단계 흡수를 도와줘요.' },
    { name: '세럼', product: '히알루론산 세럼', desc: '속건조를 집중적으로 채워줘요.' },
    { name: '수분크림', product: '세라마이드 크림', desc: '장벽을 감싸 수분을 가둬줘요.' },
    { name: '선크림', product: '데일리 선크림', desc: '색소 침착을 예방해줘요.' },
  ],
  disclaimer: '이 결과는 의학적 진단이 아닙니다.',
}

// RadarChart용 상수 (프론트 고정값)
export const RADAR_LABELS = ['수분', '주름', '색소', '모공', '민감', '유분'] as const

// scores 객체 → RadarChart values 배열로 변환
export function scoresToRadarValues(scores: DiagnosisResult['scores']): number[] {
  return RADAR_LABELS.map((label) => scores[label])
}

// 성분별 아이콘 색상 (프론트 전용)
export const INGREDIENT_ICON_CLASSES: Record<string, string> = {
  히알루론산: 'from-[#5ad1ff] to-[#8b6cff]',
  나이아신아마이드: 'from-[#a78bff] to-[#8b6cff]',
  세라마이드: 'from-[#ffd6a0] to-[#ffb86a]',
}

// 지표별 바 색상 (프론트 전용)
export const METRIC_BAR_CLASSES: Record<string, string> = {
  수분: 'from-[#5ad1ff] to-[#8b6cff]',
  주름: 'from-[#8b6cff] to-[#a78bff]',
  색소: 'from-[#ffb86a] to-[#ff9d6a]',
  모공: 'from-[#ff6ab0] to-[#ff8ac4]',
  민감: 'from-[#6affd0] to-[#5ad1ff]',
  유분: 'from-[#ff9d6a] to-[#ff7a6a]',
}