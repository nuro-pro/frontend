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

  const reset = () => {
    setUserInfo(null)
    setSurveyAnswers(null)
    setPhoto(null)
  }

  return (
    <DiagnosisContext.Provider
      value={{
        userInfo,
        surveyAnswers,
        photo,
        setUserInfo,
        setSurveyAnswers,
        setPhoto,
        reset,
      }}
    >
      {children}
    </DiagnosisContext.Provider>
  )
}
