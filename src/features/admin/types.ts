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
  id: number
  korName: string
  engName: string
  ewgGrade: number
  riskLevel: string
  effects: string[]
}

export type TabId = 'survey' | 'ingredients'