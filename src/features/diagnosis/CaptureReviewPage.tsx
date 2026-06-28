import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'
import { useEffect, useMemo, useState } from 'react'

export function CaptureReviewPage() {
  const navigate = useNavigate()
  const { photos, setPhoto } = useDiagnosis()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!photos.length) navigate('/capture')
  }, [photos.length, navigate])

  const currentPhoto = photos[currentIndex] ?? null

  const previewUrl = useMemo(() => {
    if (!currentPhoto) return null
    return URL.createObjectURL(currentPhoto)
  }, [currentPhoto])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  if (!currentPhoto) return null

  const handlePrev = () => setCurrentIndex(prev => Math.max(0, prev - 1))
  const handleNext = () => setCurrentIndex(prev => Math.min(photos.length - 1, prev + 1))

  const handleConfirm = () => {
    setPhoto(currentPhoto)
    navigate('/survey')
  }

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
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="text-2xl text-white/40 transition hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          ‹
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="aspect-square w-56 rounded-3xl overflow-hidden bg-white/10 shadow-2xl sm:w-64">
            {previewUrl && (
              <img
                src={previewUrl}
                alt={`촬영된 사진 ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* 페이지네이션 dots */}
          {photos.length > 1 && (
            <div className="flex items-center gap-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`rounded-full transition-all ${
                    i === currentIndex
                      ? 'w-4 h-2 bg-white'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="다음 사진"
          onClick={handleNext}
          disabled={currentIndex === photos.length - 1}
          className="text-2xl text-white/40 transition hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          ›
        </button>
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