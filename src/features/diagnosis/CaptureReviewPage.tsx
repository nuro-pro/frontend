import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'
import { useEffect, useState } from 'react'

export function CaptureReviewPage() {
  const navigate = useNavigate()
  const { photos, setPhoto, cameraStream, setCameraStream } = useDiagnosis()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!photos.length) navigate('/capture')
  }, [photos.length, navigate])

  const currentPhoto = photos[currentIndex] ?? null

  // 사진을 data URL(base64)로 읽어 저장
  const [urls, setUrls] = useState<string[]>([])
  useEffect(() => {
    let cancelled = false
    Promise.all(
      photos.map(
        (p) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = () => resolve('')
            reader.readAsDataURL(p)
          }),
      ),
    ).then((results) => {
      if (!cancelled) setUrls(results)
    })
    return () => {
      cancelled = true
    }
  }, [photos])

  if (!currentPhoto) return null

  const currentUrl = urls[currentIndex]
  const prevUrl = currentIndex > 0 ? urls[currentIndex - 1] : null
  const nextUrl =
    currentIndex < photos.length - 1 ? urls[currentIndex + 1] : null

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1))
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(photos.length - 1, prev + 1))

  const handleConfirm = () => {
    cameraStream?.getTracks().forEach((track) => track.stop())
    setCameraStream(null)
    setPhoto(currentPhoto)
    navigate('/survey')
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
      <h1 className="text-[#FEFEFE] text-4xl">촬영된 사진을 확인해주세요.</h1>
      <p className="mt-3 text-lg text-white/50">
        마음에 들지 않으면 다시 촬영할 수 있어요.
      </p>

      <div className="relative mt-10 w-full max-w-xl lg:max-w-2xl xl:max-w-3xl">
        {/* 캐러셀: 중앙 현재 사진 + 양옆 이전/다음 프리뷰 */}
        <div className="relative flex h-56 items-center justify-center sm:h-64 lg:h-72 xl:h-80">
          {prevUrl && (
            <img
              src={prevUrl}
              alt=""
              className="pointer-events-none absolute left-2 top-1/2 h-[76%] w-28 -translate-y-1/2 rounded-2xl object-cover opacity-45 brightness-[0.45] sm:w-40 lg:w-48 xl:w-56"
            />
          )}
          {nextUrl && (
            <img
              src={nextUrl}
              alt=""
              className="pointer-events-none absolute right-2 top-1/2 h-[76%] w-28 -translate-y-1/2 rounded-2xl object-cover opacity-45 brightness-[0.45] sm:w-40 lg:w-48 xl:w-56"
            />
          )}

          <div className="relative z-10 aspect-square w-52 overflow-hidden rounded-3xl bg-white/10 shadow-2xl sm:w-60 lg:w-72 xl:w-80">
            {currentUrl && (
              <img
                src={currentUrl}
                alt={`촬영된 사진 ${currentIndex + 1}`}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* 화살표 (프리뷰 위) */}
          <button
            type="button"
            aria-label="이전 사진"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 6 9 12 15 18" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="다음 사진"
            onClick={handleNext}
            disabled={currentIndex === photos.length - 1}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>

        {/* 페이지네이션 dots */}
        {photos.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}번째 사진`}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 bg-[#7F4FFF]'
                    : 'w-2 bg-white/25 hover:bg-white/45'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center gap-10">
        <Button variant="secondary" onClick={() => navigate('/capture')}>
          다시 촬영하기
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          이걸로 할게요
        </Button>
      </div>
    </div>
  )
}
