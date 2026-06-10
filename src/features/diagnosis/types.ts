export interface DiagnosisResult {
  /** 진단 레코드 식별자 */
  id: string
  /** 면책 문구 (백엔드가 함께 내려줌). 없으면 lib/constants의 DISCLAIMER 사용. */
  disclaimer?: string
  // TODO(Swagger): 실제 진단 항목 필드 추가
}
