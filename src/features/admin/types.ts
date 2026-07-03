export type Option = {
  answerId: number
  comment: string
}

export type Question = {
  questionId: number
  question: string
  options: Option[]
}

export interface Ingredient {
  ingredientId: number
  korName: string
  engName: string
  ewgGrade: number
  riskLevel: string
  dataLevel: string
  desc: string
  effects: string[]
  howToUse: string
  tip: string
}

export interface AddIngredientRequest {
  korName: string
  engName: string
  ewgGrade: number
  riskLevel: string
  dataLevel: string
  desc: string
  effects: string[]
  howToUse: string
  tip: string
}

export type TabId = 'survey' | 'ingredients'