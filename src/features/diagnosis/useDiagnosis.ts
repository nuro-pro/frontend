import { useContext } from 'react'
import { DiagnosisContext } from './dignosis-context'

export function useDiagnosis() {
  const context = useContext(DiagnosisContext)
  if (!context) throw new Error('DiagnosisProvider 안에서 사용해야 해요.')
  return context
}
