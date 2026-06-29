import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'
import { createDiagnosis } from '@/features/diagnosis/api'
import analyzing1 from '@/assets/analyzing/1.png'
import analyzing2 from '@/assets/analyzing/2.png'
import analyzing3 from '@/assets/analyzing/3.png'
import analyzing4 from '@/assets/analyzing/4.png'
import analyzing5 from '@/assets/analyzing/5.png'
import analyzing6 from '@/assets/analyzing/6.png'
import analyzing7 from '@/assets/analyzing/7.png'
import analyzing8 from '@/assets/analyzing/8.png'
import analyzing9 from '@/assets/analyzing/9.png'

const IMAGES = [
  analyzing1,
  analyzing2,
  analyzing3,
  analyzing4,
  analyzing5,
  analyzing6,
  analyzing7,
  analyzing8,
  analyzing9,
]

const INTERVAL_MS = 2050

export function AnalyzingPage() {
  const navigate = useNavigate()
  const { photo, userInfo, surveyAnswers } = useDiagnosis()
  const calledRef = useRef(false)

  const [images] = useState(() => {
    const shuffled = [...IMAGES].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 4)
  })
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [images])

  useEffect(() => {
    if (!photo || !surveyAnswers) {
      navigate('/capture')
      return
    }

    if (calledRef.current) return // ← 두 번째 실행 차단
    calledRef.current = true

    async function analyze() {
      try {
        const result = await createDiagnosis(
          photo!,
          surveyAnswers!.skinCondition,
          surveyAnswers!.skinConcern,
          surveyAnswers!.skinSensitivity,
        )
        const photoUrl = URL.createObjectURL(photo!)
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
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="relative flex h-32 w-1/6 items-center justify-center">
        <div
          className="absolute inset-0 animate-pulse rounded-full bg-amber-200/40 blur-3xl"
          style={{ animationDelay: '-1s' }}
        />
        <img
          src={images[currentIndex]}
          alt="analyzing"
          className="relative w-4/5 min-w-40 object-contain drop-shadow-[0_0_20px_rgba(253,230,138,0.8)]"
        />
      </div>

      <div className="space-y-2">
        <p className="text-lg font-medium text-white">이미지 분석중...</p>
        <p className="text-sm text-white/40">조금만 기다려요</p>
      </div>
    </div>
  )
}
