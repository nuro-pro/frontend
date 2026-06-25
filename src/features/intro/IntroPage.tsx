import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 인트로 슬라이드
const STEPS: string[][] = [
  ['안녕하세요.', '만나서 반가워요.'],
  ['얼굴 촬영과 간단한 설문을 통해', '지금의 피부 상태를 알아볼게요.'],
]

export function IntroPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((prev) => prev + 1)
    } else {
      navigate('/onboarding')
    }
  }

  return (
    <button
      type="button"
      onClick={handleNext}
      className="flex min-h-screen w-full flex-col items-center justify-center px-6 text-center"
    >
      <div className="space-y-2">
        {STEPS[step].map((line) => (
          <p
            key={line}
            className="text-xl leading-relaxed font-light text-white sm:text-2xl md:text-3xl"
          >
            {line}
          </p>
        ))}
      </div>
      <span className="mt-16 text-xs text-white/40">
        화면을 탭하여 계속하기
      </span>
    </button>
  )
}
