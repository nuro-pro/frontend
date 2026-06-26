import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const QUESTIONS = [
  {
    question: '세안 후 아무것도 바르지 않았을 때 피부가 어떤가요?',
    options: ['금방 건조하고 당겨요', '조금 건조한 편이에요', '적당히 괜찮아요', '번들거려요'],
  },
  {
    question: '가장 신경쓰이는 피부 고민은 무엇인가요?',
    options: ['피부가 건조해요', '트러블이 나요', '피부톤이 칙칙해요', '탄력이 떨어진 것 같아요'],
  },
  {
    question: '새로운 화장품을 사용하면 피부가 어떤가요?',
    options: ['쉽게 붉어져요', '따갑거나 가려워요', '별다른 변화가 없어요', '잘 모르겠어요'],
  },
]

export function SurveyPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const current = QUESTIONS[step]  // 현재 질문 객체

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
          {current.question}
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {current.options.map((option) => (
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

        <div className="mt-10 flex items-center justify-center gap-2">
          {QUESTIONS.map((q, index) => (
            <span
              key={q.question}
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