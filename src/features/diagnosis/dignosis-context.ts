import { createContext } from 'react'

export interface UserInfo {
  name: string
  age: number
}

export interface SurveyAnswers {
  skinCondition: string
  skinConcern: string
  skinSensitivity: string
}

export interface DiagnosisContextType {
  userInfo: UserInfo | null
  surveyAnswers: SurveyAnswers | null
  photos: File[]
  photo: File | null
  setUserInfo: (info: UserInfo) => void
  setSurveyAnswers: (answers: SurveyAnswers) => void
  setPhoto: (file: File) => void
  setPhotos: (files: File[]) => void
  addToPhotos: (file: File) => void
  reset: () => void
}

export const DiagnosisContext = createContext<DiagnosisContextType | null>(null)
