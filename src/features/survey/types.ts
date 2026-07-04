export type Option = {
  answerId: number
  comment: string
}

export type Question = {
  questionId: number
  question: string
  options: Option[]
}
