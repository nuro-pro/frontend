import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 설문 화면
const QUESTIONS: string[] = [
  '나는 기초케어를 하지 않으면 피부가 당긴다',
  '오후가 되면 얼굴에 유분이 두드러진다',
  '자극적인 제품을 쓰면 쉽게 붉어진다',
]

const OPTIONS: string[] = ['전혀 아니에요', '아니에요', '그래요', '매우 그래요']

export function SurveyPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const handleSelect = () => {
    // TODO: 선택값을 진단 요청 상태로 누적 (현재는 UI만)
    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1)
    } else {
      navigate('/analyzing')
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6">
      <div className="w-full max-w-2xl text-center">
        <span className="inline-block rounded-full bg-white px-4 py-1 text-sm font-medium text-[#3a2a6e]">
          설문 {step + 1}
        </span>

        <h1 className="mt-6 text-xl leading-relaxed font-semibold text-white sm:text-2xl">
          {QUESTIONS[step]}
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={handleSelect}
              className="rounded-2xl bg-white/5 px-6 py-8 text-white/90 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-[#8b6cff]/60"
            >
              {option}
            </button>
          ))}
        </div>

        {/* 진행 표시 */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {QUESTIONS.map((question, index) => (
            <span
              key={question}
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
