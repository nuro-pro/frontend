import {api, unwrap} from '@/api/client'
import type { Survey, Ingredient } from './types'
import type { CommonResponse } from '@/api/types'


export async function getAdminData(): Promise<{ survey: Survey[], ingredients: Ingredient[] }> {
  const surveyResponse = await api.get<CommonResponse<Survey[]>>('/surveys')
  const ingredientsResponse = await api.get<CommonResponse<Ingredient[]>>('/ingredients/admin')
  return {
    survey: unwrap(surveyResponse.data) ?? [],
    ingredients: unwrap(ingredientsResponse.data) ?? [],
  }
}
