import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import landingDesktop from '@/assets/mov/landing1.mp4' // 16:9 데스크톱
import landingMobile from '@/assets/mov/landing2.mp4' // 9:16 모바일

const MOBILE_QUERY = '(max-width: 767px)'

export function LandingPage() {
  // 화면 폭으로 데스크톱/모바일 영상 선택
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const cta = (
    <div className="absolute inset-x-0 top-[63%] flex flex-col items-center px-6">
      <Link
        to="/intro"
        className="rounded-full border border-white/10 bg-white/[0.07] px-8 py-2.5 text-2xl font-bold tracking-[0.02em] text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/20"
      >
        Let&apos;s get started
      </Link>
    </div>
  )

  if (isMobile) {
    return (
      <div className="relative h-dvh w-full overflow-hidden bg-black">
        <video
          key="mobile"
          className="absolute inset-0 h-full w-full object-cover"
          src={landingMobile}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {cta}
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      <div
        className="relative"
        style={{
          aspectRatio: '16 / 9',
          width: 'min(100vw, calc(100vh * 16 / 9))',
        }}
      >
        <video
          key="desktop"
          className="h-full w-full object-cover"
          src={landingDesktop}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {cta}
      </div>
    </div>
  )
}
