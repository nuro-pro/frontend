import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'
import {getSurveyFull} from './api'
import type { Question } from './types'

export function SurveyPage() {
  const navigate = useNavigate()
  const { setSurveyAnswers } = useDiagnosis()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [questions, setQuestions] = useState<Question[]>([])



  const [selected, setSelected] = useState<number | null>(null)
  const [visible, setVisible] = useState(true)

  const current = questions[step]

  // 설문 데이터 가져오기
  useEffect(() => {
    let cancelled = false

    async function fetchSurvey() {
      try {
        //이거 나중에 백에서 관리자용 전체조회 만드는게 좋을것 같긴 함
        const response = await getSurveyFull().
            then((questions) => questions.filter((q) => q.options.length > 0)) // 옵션이 없는 문항은 제외
        if (!cancelled) setQuestions(response)
      } catch (error) {
        console.error('Failed to fetch survey questions:', error)
      }
    }

    fetchSurvey()
    return () => { cancelled = true }
  }, [])

  // ⭐️ 데이터가 아직 없거나 로딩 중일 때 보여줄 UI 추가
  if (!current) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center text-white">
        <p>설문 문항을 불러오는 중입니다...</p>
      </div>
    )
  }

  const handleSelect = (answerId:number) => {
    if (!current || selected !== null) return

    setSelected(answerId)

    const updated = { ...answers, [current.questionId]: answerId }
    setAnswers(updated)
    setVisible(false) // 클릭하자마자 바로 페이드아웃

    setTimeout(() => {
      setSelected(null)
      setVisible(true)
      if (step < questions.length - 1) {
        setStep((prev) => prev + 1)
      } else {

        const formattedAnswers = Object.entries(updated).map(([qId, aId]) => ({
          answerId: Number(aId),      // Long 타입 대응
          questionId: Number(qId),    // Long 타입 대응
        }))

        setSurveyAnswers({
          answers: formattedAnswers,
        })
        console.log('설문 완료, answers:', formattedAnswers)
        navigate('/analyzing')
      }
    }, 600)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6">
      <div
        className={`w-full max-w-2xl text-center transition-opacity duration-1100 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="inline-block rounded-full bg-white px-4 py-1 text-sm font-medium text-[#3a2a6e]">
          설문 {step + 1}
        </span>

        <h1 className="mt-6 text-xl leading-relaxed font-semibold text-white sm:text-2xl">
          {current.question}
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {current.options.map((option, index) => (
            <button
              key={`option-${option.answerId}-${index}`}
              type="button"
              onClick={() => handleSelect(option.answerId)}
              className={`rounded-2xl bg-white/5 px-6 py-8 text-white/90 ring-1 ring-white/10 transition ${
                selected
                  ? 'pointer-events-none' // 선택 후 모든 버튼 hover/click 차단
                  : 'hover:bg-white/10 hover:ring-[#8b6cff]/60'
              }`}
            >
              {option.comment}
            </button>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {questions.map((q, index) => (
            <span
              key={`dot-${q.questionId || index}`}
              className={
                index === step
                  ? 'h-2 w-6 rounded-full bg-[#8b6cff] transition-all'
                  : 'h-2 w-2 rounded-full bg-white/20 transition-all'
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
