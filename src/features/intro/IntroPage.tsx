import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const GREETING = ['안녕하세요.', '만나서 반가워요.']
const DESCRIPTION = [
  '얼굴 촬영과 간단한 설문을 통해 지금의 피부 상태를 알아볼게요.',
]

export const IntroPage = () => {
  const navigate = useNavigate()

  const [line1, setLine1] = useState(false) // 안녕하세요
  const [line2, setLine2] = useState(false) // 만나서 반가워요
  const [greetingOut, setGreetingOut] = useState(false) // 인사말 페이드아웃

  const [descPhase, setDescPhase] = useState<
    'hidden' | 'faint' | 'full' | 'out'
  >('hidden')

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // 1. 안녕하세요 → 만나서 반가워요 순차 페이드인
    timers.push(setTimeout(() => setLine1(true), 50))
    timers.push(setTimeout(() => setLine2(true), 1200))

    // 2. 인사말이 아직 진한 동안, 안내 문구가 화면 밑에서 "흐릿하게" 등장
    timers.push(setTimeout(() => setDescPhase('faint'), 2600))

    // 3. 인사말 페이드아웃 + 안내 문구 진해지며 위로 (동시 크로스페이드)
    timers.push(
      setTimeout(() => {
        setGreetingOut(true)
        setDescPhase('full')
      }, 3600),
    )

    // 4. 안내 문구 제자리에서 페이드아웃 후 이동
    timers.push(setTimeout(() => setDescPhase('out'), 7000))
    timers.push(setTimeout(() => navigate('/onboarding'), 7900))

    return () => timers.forEach(clearTimeout)
  }, [navigate])

  const descOpacity = descPhase === 'faint' ? 0.3 : descPhase === 'full' ? 1 : 0

  // full 이후로는(=out 포함) 제자리 유지, 그 전에만 아래에 위치
  const descRaised = descPhase === 'full' || descPhase === 'out'

  return (
    <div className="fixed inset-0 overflow-hidden px-6 text-center">
      {/* 인사말 (중앙) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <p
          className="text-[#FEFEFE] text-3xl"
          style={{
            opacity: greetingOut ? 0 : line1 ? 1 : 0,
            transition: 'opacity 0.9s ease-in-out',
          }}
        >
          {GREETING[0]}
        </p>
        <p
          className="text-[#FEFEFE] text-3xl"
          style={{
            opacity: greetingOut ? 0 : line2 ? 1 : 0,
            transition: 'opacity 0.9s ease-in-out',
          }}
        >
          {GREETING[1]}
        </p>
      </div>

      {/* 안내 문구 (밑에서 흐릿 → 중앙에서 진하게 → 제자리 페이드아웃) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
        style={{
          opacity: descOpacity,
          transform: descRaised ? 'translateY(0)' : 'translateY(180px)',
          transition: 'opacity 0.9s ease-in-out, transform 0.9s ease-in-out',
        }}
      >
        {DESCRIPTION.map((line, i) => (
          <p key={i} className="text-[#FEFEFE] text-3xl">
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}
