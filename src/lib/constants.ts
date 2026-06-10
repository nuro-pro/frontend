/** 업로드 파일 단일 용량 한도 (백엔드: 10MB 초과 시 400). */
export const MAX_FILE_BYTES = 10 * 1024 * 1024

/** 요청 전체 용량 한도 (백엔드: 12MB 초과 시 400). */
export const MAX_REQUEST_BYTES = 12 * 1024 * 1024

/** 진단 결과에 항상 노출해야 하는 면책 문구. */
export const DISCLAIMER = '본 결과는 참고용이며 의학적 진단이 아닙니다.'
