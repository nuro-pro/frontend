import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MESSAGES = [
  ['안녕하세요.', '만나서 반가워요.'],
  ['얼굴 촬영과 간단한 설문을 통해 지금의 피부 상태를 알아볼게요.'],
]

export const IntroPage = () => {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (index >= MESSAGES.length - 1) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => navigate('/onboarding'), 800) // 페이드아웃 후 이동
      }, 2700)
      return () => clearTimeout(timer)
    }

    const fadeOut = setTimeout(() => setVisible(false), 2000)
    const next = setTimeout(() => {
      setIndex((i) => i + 1)
      setVisible(true)
    }, 2700)

    return () => {
      clearTimeout(fadeOut)
      clearTimeout(next)
    }
  }, [index, navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div
        className="flex flex-col gap-2"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
        {MESSAGES[index].map((line, i) => (
          <p key={i} className="text-[#FEFEFE] text-3xl">
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}
