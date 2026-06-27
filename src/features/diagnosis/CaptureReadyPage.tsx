import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'

// 촬영 시작 확인 화면(디자인 04).
export function CaptureReadyPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl leading-relaxed font-semibold text-white sm:text-2xl">
        그럼 지금부터 얼굴 촬영을 시작할게요.
        <br />
        준비 되셨나요?
      </h1>
      <p className="mt-4 max-w-sm text-sm text-white/50">
        촬영한 사진은 맞춤 결과를 제공하는 데에만 사용돼요.
      </p>

      <div className="mt-10 flex items-center gap-10">
        <Button variant="secondary" className="cursor-pointer bg-[#7F4FFF]" onClick={() => navigate('/onboarding')}>
          다음에 할게요
        </Button>
        <Button variant="primary" className="cursor-pointer" onClick={() => navigate('/capture')}>
          네, 시작할게요
        </Button>
      </div>
    </div>
  )
}
