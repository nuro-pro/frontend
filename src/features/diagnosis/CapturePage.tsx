import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'

export function CapturePage() {
  const navigate = useNavigate()
  const { setPhoto } = useDiagnosis()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    navigate('/review')
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-12 px-6">
      {/* 원형 가이드라인 */}
      <div className="relative flex aspect-square w-72 items-center justify-center sm:w-80">
        <div className="absolute inset-0 rounded-full bg-[#7c5cff]/30 blur-2xl" />
        <div className="absolute inset-0 rounded-full ring-2 ring-[#8b6cff]/80" />
        <div className="absolute inset-3 rounded-full ring-1 ring-white/10" />
        <div className="absolute h-px w-2/3 bg-white/20" />
        <div className="absolute h-2/3 w-px bg-white/20" />
      </div>

      <p className="text-center text-sm text-white/60">
        가이드라인에 맞게 얼굴 위치를 조정해주세요.
      </p>

      {/* 숨긴 파일 input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        variant="primary"
        className="px-10"
        onClick={() => inputRef.current?.click()}
      >
        사진 선택하기
      </Button>
    </div>
  )
}