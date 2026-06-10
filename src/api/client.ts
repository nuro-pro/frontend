import axios, { AxiosError } from 'axios'
import { ApiError, type CommonResponse } from './types'

/**
 * 외부 장애(LLM/저장소 실패·타임아웃 등 5xx)나 네트워크 오류처럼
 * 백엔드가 구체 메시지를 주지 않는 경우 사용자에게 보여줄 일반화 메시지.
 */
const GENERIC_ERROR_MESSAGE =
  '일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.'

/**
 * axios 인스턴스.
 * - baseURL: 운영에선 VITE_API_BASE_URL(.env)로 주입, 로컬에선 비워두면
 *   '/api/v1'로 동작하며 Vite dev 프록시가 localhost:8080으로 포워딩한다.
 * - 모든 도메인 엔드포인트는 /api/v1/... prefix를 가진다.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  timeout: 30_000,
})

/**
 * 응답 인터셉터: 에러를 ApiError로 정규화한다.
 * 성공 응답은 CommonResponse 형태 그대로 통과시키고, 각 엔드포인트 함수가
 * unwrap()으로 data를 꺼낸다.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<CommonResponse>) => {
    const data = error.response?.data
    const status = error.response?.status
    // 백엔드가 내려준 한글 message는 사용자 노출 가능. 없으면 일반화 메시지.
    const message = data?.message ?? GENERIC_ERROR_MESSAGE
    return Promise.reject(
      new ApiError(message, { errorCode: data?.errorCode, status }),
    )
  },
)

/**
 * CommonResponse 래퍼에서 실제 페이로드(data)를 꺼낸다.
 * 데이터 없는 성공 응답이면 undefined.
 */
export function unwrap<T>(body: CommonResponse<T>): T | undefined {
  return body.data
}
