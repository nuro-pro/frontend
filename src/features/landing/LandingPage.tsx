import { Link } from 'react-router-dom'
import landingVideo from '@/assets/mov/landing1.mp4'

export function LandingPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={landingVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      <div className="absolute inset-x-0 top-[63%] flex flex-col items-center px-6">
        <Link
          to="/intro"
          className="rounded-full border border-white/10 bg-white/[0.07] px-8 py-2.5 text-2xl font-bold tracking-[0.02em] text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/20"
        >
          Let&apos;s get started
        </Link>
      </div>
    </div>
  )
}
