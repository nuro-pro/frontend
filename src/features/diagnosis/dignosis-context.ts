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
  userId: number | null
  userInfo: UserInfo | null
  surveyAnswers: SurveyAnswers | null
  photos: File[]
  photo: File | null
  setUserId: (id: number | null) => void
  setUserInfo: (info: UserInfo) => void
  setSurveyAnswers: (answers: SurveyAnswers) => void
  setPhoto: (file: File) => void
  setPhotos: (files: File[]) => void
  addToPhotos: (file: File) => void
  reset: () => void
  cameraStream: MediaStream | null
  setCameraStream: (stream: MediaStream | null) => void
}

export const DiagnosisContext = createContext<DiagnosisContextType | null>(null)
