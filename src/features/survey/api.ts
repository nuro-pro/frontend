import { api, unwrap } from '@/api/client'
import type { CommonResponse } from '@/api/types'
import type { Question } from './types'

export const getSurveyFull = async (): Promise<Question[]> => {
  const res = await api.get<CommonResponse<Question[]>>('/surveys')
  return unwrap(res.data) ?? []
}