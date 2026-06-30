// 결과/공유 화면용 임시 데이터 (state 없이 진입했을 때의 폴백)
// 실제 타입은 @/features/diagnosis/types 의 DiagnosisResult를 단일 소스로 따른다.
import type { DiagnosisResult } from '@/features/diagnosis/types'

export const MOCK_RESULT: DiagnosisResult = {
  id: 1,
  skinType: '복합성 피부',
  skinAge: 24,
  totalScore: 62,
  totalDesc: '전반적으로 양호하나 수분과 탄력 관리에 집중이 필요해요.',
  summary:
    '유분이 많은 T존과 속건조가 함께 공존하는 복합성 피부예요. 피지 조절과 수분 보충이 핵심이에요.',
  metrics: [
    { name: '수분', score: 62 },
    { name: '주름', score: 32 },
    { name: '색소', score: 94 },
    { name: '모공', score: 58 },
    { name: '민감', score: 70 },
    { name: '유분', score: 55 },
  ],
  ingredients: [
    {
      korName: '히알루론산',
      engName: 'Hyaluronic acid',
      ewgGrade: 1,
      riskLevel: '낮음',
      dataLevel: '적당함',
      desc: '수분을 끌어당겨 속건조를 완화하고 겉피부 결까지 잔잔하게 정돈해줘요.',
      effects: ['깊은 보습', '탄력 케어', '진정 회복'],
      howToUse: '세안 > 토너 > 히알루론산 > 보습제',
      tip: '촉촉할 때 발라 수분을 끌어오고, 마지막에 보습제로 덮어 가둬주세요.',
    },
    {
      korName: 'LHA',
      engName: 'Lipohydroxy Acid',
      ewgGrade: 4,
      riskLevel: '보통',
      dataLevel: '적당함',
      desc: '모공 속 노폐물과 각질을 부드럽게 관리해 피부결을 매끄럽게 정돈해줘요.',
      effects: ['모공 관리', '각질 제거', '피부결 개선'],
      howToUse: '세안 > 토너 > LHA > 크림',
      tip: '저녁에 사용하며 피부 상태에 따라 횟수를 조절해 주세요.',
    },
    {
      korName: 'BHA',
      engName: 'Beta Hydroxy Acid',
      ewgGrade: 4,
      riskLevel: '보통',
      dataLevel: '적당함',
      desc: '모공 속 피지와 노폐물을 관리하는 데 도움을 주며 피부를 깨끗하게 정돈해줘요.',
      effects: ['피지 조절', '모공 관리', '각질 제거'],
      howToUse: '세안 > 토너 > BHA > 크림',
      tip: '주 1~3회 저녁에 사용하고 피부 상태에 따라 횟수를 조절해 주세요.',
    },
  ],
  routine: [
    {
      name: '클렌징',
      product: '약산성 젤 클렌저',
      desc: '유분은 덜어내되 속당김은 막아줘요.',
    },
    {
      name: '토너',
      product: '수분 결 토너',
      desc: '다음 단계 흡수를 도와줘요.',
    },
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
    {
      name: '선크림',
      product: '데일리 선크림',
      desc: '색소 침착을 예방해줘요.',
    },
  ],
  disclaimer: '이 결과는 의학적 진단이 아닙니다.',
}
