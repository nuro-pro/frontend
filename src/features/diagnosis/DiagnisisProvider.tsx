import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  DiagnosisContext,
  type UserInfo,
  type SurveyAnswers,
} from './dignosis-context'

export function DiagnosisProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const addToPhotos = (file: File) => {
    setPhotos((prev) => [file, ...prev])
  }


  const reset = () => {
    setUserInfo(null)
    setSurveyAnswers(null)
    setPhoto(null)
    setPhotos([])
  }

  return (
    <DiagnosisContext.Provider
      value={{
        userInfo,
        surveyAnswers,
        photo,
        photos,
        setUserInfo,
        setSurveyAnswers,
        setPhoto,
        setPhotos,
        addToPhotos,
        reset,
      }}
    >
      {children}
    </DiagnosisContext.Provider>
  )
}
