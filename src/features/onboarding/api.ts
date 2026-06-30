import { api, unwrap } from '@/api/client'
import { ApiError, type CommonResponse } from '@/api/types'
import type { User } from './types'

/**
 * 온보딩 사용자 등록. 응답의 id를 userId로 받아 진단 호출
 * (userId 쿼리파라미터로 식별)
 */
export async function createUser(nickname: string, age: number): Promise<User> {
  const { data } = await api.post<CommonResponse<User>>('/users', {
    nickname,
    age,
  })
  const user = unwrap(data)
  if (!user) {
    throw new ApiError('회원 정보를 저장하지 못했어요. 다시 시도해 주세요.')
  }
  return user
}
