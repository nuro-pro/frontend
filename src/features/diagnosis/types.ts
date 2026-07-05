export interface DiagnosisResult {
  id: number
  shareId: string

  userNickname: string
  userImage: string
  userAge: number

  skinType: string
  skinAge: number
  totalScore: number
  peerTotalScore: number
  totalDesc: string
  summary: string
  metrics: {
    name: string
    score: number
    peerScore: number
  }[]
  ingredients: {
    korName: string
    engName: string
    ewgGrade: number
    riskLevel: string
    dataLevel: string
    desc: string
    effects: string[]
    howToUse: string
    tip: string
  }[]
  routine: {
    name: string
    product: string
    desc: string
  }[]
  disclaimer: string
}

export interface SurveyAnswerItem {
  answerId: number
  questionId: number
}
