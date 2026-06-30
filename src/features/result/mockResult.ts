// 결과/공유 화면용 임시 데이터 (state 없이 진입했을 때의 폴백)
// 실제 타입은 @/features/diagnosis/types 의 DiagnosisResult를 단일 소스로 따른다.
import type { DiagnosisResult } from '@/features/diagnosis/types'

export const MOCK_RESULT: DiagnosisResult = {
  id: 1,
  skinType: '복합성 피부',
  skinAge: 24,
  totalScore: 62,
  peerTotalScore: 60,
  totalDesc: '전반적으로 양호하나 수분과 탄력 관리에 집중이 필요해요.',
  summary:
    '유분이 많은 T존과 속건조가 함께 공존하는 복합성 피부예요. 피지 조절과 수분 보충이 핵심이에요.',
  metrics: [
    { name: '수분', score: 62, peerScore: 60 },
    { name: '주름', score: 32, peerScore: 72 },
    { name: '색소', score: 94, peerScore: 66 },
    { name: '모공', score: 58, peerScore: 56 },
    { name: '민감', score: 70, peerScore: 60 },
    { name: '유분', score: 55, peerScore: 54 },
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
      korName: '징크 PCA',
      engName: 'Zinc PCA',
      ewgGrade: 3,
      riskLevel: '보통',
      dataLevel: '확인 필요',
      desc: '피지 조절에 도움을 주는 성분으로, 과도한 유분을 관리해 피부를 산뜻하게 유지해요. 유수분 밸런스를 맞추고 건강한 피부 컨디션 유지에 도움을 줘요.',
      effects: ['피지 조절', '유분 균형', '모공 관리'],
      howToUse: '세안 > 토너 > 징크 PCA > 크림',
      tip: '유분이 고민되는 부위에 사용해 피지 밸런스를 관리하고 피부를 산뜻하게 유지해 주세요.',
    },
    {
      korName: '병풀추출물',
      engName: 'Centella Asiatica',
      ewgGrade: 1,
      riskLevel: '낮음',
      dataLevel: '적당함',
      desc: '피부 진정과 장벽 강화에 도움을 주는 성분으로, 외부 자극으로 민감해진 피부를 편안하게 케어하고 건강한 피부 상태를 유지하는 데 도움을 줘요.',
      effects: ['피부 진정', '장벽 강화', '자극 완화'],
      howToUse: '세안 > 토너 > 병풀추출물 > 크림',
      tip: '민감하거나 붉어진 피부에 사용하여 피부를 편안하게 진정시켜 주세요.',
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
