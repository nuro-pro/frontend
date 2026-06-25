
import { Link } from 'react-router-dom'
import landingImage from '@/assets/landing1/landingImage.png'
import landingTitle from '@/assets/landing1/landingTitle.png'
import img11 from '@/assets/landing2/11.png'
import img12 from '@/assets/landing2/12.png'
import img13 from '@/assets/landing2/13.png'
import img14 from '@/assets/landing2/14.png'
import img21 from '@/assets/landing2/21.png'
import img22 from '@/assets/landing2/22.png'
import img23 from '@/assets/landing2/23.png'
import img24 from '@/assets/landing2/24.png'
import img31 from '@/assets/landing2/31.png'
import img32 from '@/assets/landing2/32.png'
import img33 from '@/assets/landing2/33.png'
import img34_1 from '@/assets/landing2/34-1.png'
import img34_2 from '@/assets/landing2/34-2.png'
import img41 from '@/assets/landing2/41.png'
import img42 from '@/assets/landing2/42.png'
import img43 from '@/assets/landing2/43.png'
import img44 from '@/assets/landing2/44.png'

export function LandingPage() {
  return (
    <div
      className="relative h-screen snap-y snap-mandatory overflow-y-scroll"
      style={{
        background:
          'radial-gradient(ellipse 150% 100% at bottom center, #663fce 0%, #0a0010 60%, #000000 100%)',
      }}
    >
      {/* 진단 플로우 진입 CTA */}
      <Link
        to="/intro"
        className="fixed bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#8b6cff] to-[#6a3fce] px-10 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#6a3fce]/40 transition hover:brightness-110"
      >
        피부 진단 시작하기
      </Link>
      {/* 첫 번째 화면 */}
      <section className="flex h-screen snap-start flex-col items-start">
        {/* Flow with NURO 화면 */}
        <img
          src={landingImage}
          alt="landingImage"
          className="h-4/7 w-full object-cover object-bottom"
        />
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={landingTitle}
            alt="landingLogo"
            className="mb-4 h-auto w-2/3"
          />
        </div>
      </section>

      {/* 두 번째 화면 */}
      <section className="flex h-screen snap-start flex-col">
        <div className="flex flex-1 items-center justify-center gap-15 overflow-hidden">
          <img src={img11} alt="landingImage" className="h-2/5" />
          <img src={img12} alt="landingImage" className="mt-8 h-1/30 w-1/4" />
          <img src={img13} alt="landingImage" className="h-2/3" />
          <img src={img14} alt="landingImage" className="h-2/5" />
        </div>
        <div className="flex flex-1 items-center justify-center gap-15 overflow-hidden">
          <img src={img21} alt="landing2Image" className="h-2/3" />
          <img src={img22} alt="landing2Image" className="h-2/5" />
          <img src={img23} alt="landing2Image" className="mt-8 h-3/5" />
          <img src={img24} alt="landing2Image" className="h-2/3" />
        </div>
        <div className="flex flex-1 items-center justify-center gap-15 overflow-hidden">
          <img src={img31} alt="landingImage" className="h-2/5" />
          <img src={img32} alt="landingImage" className="h-3/5" />
          <img src={img33} alt="landingImage" className="h-2/3" />
          <div className="align-items flex flex-col gap-5">
            <img src={img34_1} alt="landingImage" className="w-4/6" />
            <img
              src={img34_2}
              alt="landingImage"
              className="ml-1 h-3/5 w-3/7"
            />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center gap-10 overflow-hidden">
          <img src={img41} alt="landingImage" className="h-2/5" />
          <img src={img42} alt="landingImage" className="mt-8 h-1/30 w-1/5" />
          <img src={img43} alt="landingImage" className="h-2/3" />
          <img src={img44} alt="landingImage" className="h-2/5" />
        </div>
      </section>
    </div>
  )
}
