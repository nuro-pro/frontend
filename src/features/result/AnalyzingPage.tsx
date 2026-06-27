import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'
import { createDiagnosis } from '@/features/diagnosis/api'

export function AnalyzingPage() {
  const navigate = useNavigate()
  const { photo, userInfo, surveyAnswers, reset } = useDiagnosis()

  useEffect(() => {
    if (!photo || !surveyAnswers) {
      navigate('/capture')
      return
    }

    async function analyze() {
      try {
        const result = await createDiagnosis(
          photo!,
          surveyAnswers!.skinCondition,
          surveyAnswers!.skinConcern,
          surveyAnswers!.skinSensitivity,
        )
        const photoUrl = URL.createObjectURL(photo!)
        reset()
        navigate('/result', {
          state: {
            result,
            userName: userInfo?.name || '사용자',
            userAge: userInfo?.age,
            photoUrl,
          },
        })
      } catch {
        navigate('/capture')
      }
    }

    analyze()
  }, [photo, surveyAnswers, navigate, reset])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-amber-200/40 blur-3xl" />
        <svg
          viewBox="0 0 100 100"
          className="relative h-24 w-24 drop-shadow-[0_0_20px_rgba(253,230,138,0.8)]"
          aria-hidden="true"
        >
          {/* 4-point sparkle */}
          <path
            d="M50 0 C54 30 70 46 100 50 C70 54 54 70 50 100 C46 70 30 54 0 50 C30 46 46 30 50 0 Z"
            fill="#fde68a"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <p className="text-lg font-medium text-white">이미지 분석중...</p>
        <p className="text-sm text-white/40">조금만 기다려요</p>
      </div>
    </div>
  )
}
