import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'

// 얼굴 촬영 화면(디자인 05·06·07). 카메라 연동은 추후, 현재는 가이드 UI만.
export function CapturePage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-12 px-6">
      {/* 원형 가이드라인 */}
      <div className="relative flex aspect-square w-72 items-center justify-center sm:w-80">
        {/* 외곽 글로우 */}
        <div className="absolute inset-0 rounded-full bg-[#7c5cff]/30 blur-2xl" />
        {/* 링 */}
        <div className="absolute inset-0 rounded-full ring-2 ring-[#8b6cff]/80" />
        <div className="absolute inset-3 rounded-full ring-1 ring-white/10" />
        {/* 얼굴 가이드 크로스헤어 */}
        <div className="absolute h-px w-2/3 bg-white/20" />
        <div className="absolute h-2/3 w-px bg-white/20" />
      </div>

      <p className="text-center text-sm text-white/60">
        가이드라인에 맞게 얼굴 위치를 조정해주세요.
      </p>

      <Button
        variant="primary"
        className="px-10"
        onClick={() => navigate('/review')}
      >
        촬영하기
      </Button>
    </div>
  )
}
