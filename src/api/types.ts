/**
 * 백엔드 공통 응답 래퍼 (CommonResponse).
 * - 성공 + 데이터:    { message: "success", data: {...} }
 * - 성공 + 데이터 없음: { message: "success" }
 * - 에러:             { errorCode: 4040, message: "..." }
 *
 * null 필드는 직렬화에서 빠지므로(@JsonInclude(NON_NULL)) data/errorCode는 optional.
 */
export interface CommonResponse<T = unknown> {
  message: string
  data?: T
  errorCode?: number
}

/**
 * 정규화된 API 에러.
 * - message: 백엔드가 내려준 한글 메시지 (그대로 사용자 노출 가능).
 * - errorCode: 비즈니스 4자리 코드 (HTTP status와 별개, 분기용).
 * - status: HTTP status code.
 */
export class ApiError extends Error {
  readonly errorCode?: number
  readonly status?: number

  constructor(
    message: string,
    options?: { errorCode?: number; status?: number },
  ) {
    super(message)
    this.name = 'ApiError'
    this.errorCode = options?.errorCode
    this.status = options?.status
  }
}
