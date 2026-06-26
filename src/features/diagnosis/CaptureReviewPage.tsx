import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'

// 촬영 사진 확인 화면 좌우 화살표는 여러 장 촬영 시 캐러셀용
export function CaptureReviewPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold text-white sm:text-2xl">
        촬영된 사진을 확인해주세요.
      </h1>
      <p className="mt-3 text-sm text-white/50">
        마음에 들지 않으면 다시 촬영할 수 있어요.
      </p>

      <div className="mt-10 flex items-center gap-4 sm:gap-8">
        <button
          type="button"
          aria-label="이전 사진"
          className="text-2xl text-white/40 transition hover:text-white/80"
        >
          ‹
        </button>

        {/* 촬영 사진 미리보기 자리 */}
        <div className="aspect-square w-56 rounded-3xl bg-white/90 shadow-2xl sm:w-64" />

        <button
          type="button"
          aria-label="다음 사진"
          className="text-2xl text-white/40 transition hover:text-white/80"
        >
          ›
        </button>
      </div>

      <div className="mt-10 flex items-center gap-10">
        <Button variant="secondary" onClick={() => navigate('/capture')}>
          다시 촬영하기
        </Button>
        <Button variant="primary" onClick={() => navigate('/survey')}>
          이걸로 할게요
        </Button>
      </div>
    </div>
  )
}
