export interface DiagnosisResult {
  id: number
  skinType: string
  skinAge: number
  totalScore: number
  totalDesc: string
  summary: string
  metrics: {
    name: string
    score: number
  }[]
  ingredients: {
    name: string
    badge: string
    desc: string
  }[]
  routine: {
    name: string
    product: string
    desc: string
  }[]
  disclaimer: string
}
