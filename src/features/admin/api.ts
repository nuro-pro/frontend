import { api, unwrap } from '@/api/client'
import type { Question, Ingredient, AddIngredientRequest } from './types'
import type { CommonResponse } from '@/api/types'

export async function getAdminData(): Promise<{
  survey: Question[]
  ingredients: Ingredient[]
}> {
  const surveyResponse = await api.get<CommonResponse<Question[]>>('/surveys')
  const ingredientsResponse =
    await api.get<CommonResponse<Ingredient[]>>('/ingredients/admin')
  return {
    survey: unwrap(surveyResponse.data) ?? [],
    ingredients: unwrap(ingredientsResponse.data) ?? [],
  }
}

export const deleteSurveyQuestion = async (
  questionId: number,
): Promise<void> => {
  await api.delete(`/surveys/admin/questions/${questionId}`)
}

export const addSurveyQuestion = async (question: {
  comment: string
}): Promise<CommonResponse<number>> => {
  const response = await api.post<CommonResponse<number>>(
    '/surveys/admin/questions/add',
    question,
  )
  return response.data
}

export const deleteSurveyAnswer = async (answerId: number): Promise<void> => {
  await api.delete(`/surveys/admin/answers/${answerId}`)
}

export const addSurveyAnswer = async (answer: {
  questionId: number
  comment: string
}): Promise<CommonResponse<number>> => {
  const response = await api.post<CommonResponse<number>>(
    '/surveys/admin/answers/add',
    answer,
  )
  return response.data
}

export const addIngredient = async (ingredient: AddIngredientRequest) => {
  const response = await api.post('/ingredients/admin/add', ingredient)
  return response.data
}

export const deleteIngredient = async (ingredientId: number) => {
  await api.delete(`/ingredients/admin/${ingredientId}`)
}
