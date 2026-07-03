import {api, unwrap} from '@/api/client'
import type { Question, Ingredient } from './types'
import type { CommonResponse } from '@/api/types'


export async function getAdminData(): Promise<{ survey: Question[], ingredients: Ingredient[] }> {
  const surveyResponse = await api.get<CommonResponse<Question[]>>('/surveys')
  const ingredientsResponse = await api.get<CommonResponse<Ingredient[]>>('/ingredients/admin')
  return {
    survey: unwrap(surveyResponse.data) ?? [],
    ingredients: unwrap(ingredientsResponse.data) ?? [],
  }
}
