import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BoundingBox, Detection } from '@mediapipe/tasks-vision'
import { Button } from '@/components/Button'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'
import { useCamera, CameraStatus } from './hooks/useCamera'
import { useFaceDetection, FaceDetectorStatus } from './hooks/useFaceDetection'
import { ScanningRing } from './components/ScanningRing'
import { RingStatus } from './components/ringStatus'

const DETECT_INTERVAL_MS = 80
const HOLD_MS = 1200

const HINT: Record<RingStatus, string> = {
  searching: '얼굴이 보이도록 카메라를 바라봐 주세요.',
  aligning: '가이드 원 안에 얼굴을 맞춰주세요.',
  locked: '좋아요! 잠시만 그대로 멈춰주세요…',
}

function evaluateAlignment(
  video: HTMLVideoElement,
  detections: Detection[],
): RingStatus {
  let best: BoundingBox | undefined
  let bestArea = 0
  for (const d of detections) {
    const b = d.boundingBox
    if (!b) continue
    const area = b.width * b.height
    if (area > bestArea) {
      bestArea = area
      best = b
    }
  }
  if (!best) return RingStatus.Searching

  const cx = (best.originX + best.width / 2) / video.videoWidth
  const cy = (best.originY + best.height / 2) / video.videoHeight
  const fw = best.width / video.videoWidth

  const centered = Math.abs(cx - 0.5) < 0.16 && Math.abs(cy - 0.5) < 0.18
  const sized = fw >= 0.3 && fw <= 0.62
  return centered && sized ? RingStatus.Locked : RingStatus.Aligning
}

export function CapturePage() {
  const navigate = useNavigate()
  const { setPhoto } = useDiagnosis()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { videoRef, status: cameraStatus, retry } = useCamera()
  const { detectorRef, status: detectorStatus } = useFaceDetection()

  const [ring, setRing] = useState<RingStatus>(RingStatus.Searching)

  const rafRef = useRef<number | null>(null)
  const lastDetectRef = useRef(0)
  const alignedSinceRef = useRef<number | null>(null)
  const capturedRef = useRef(false)

  const cameraReady = cameraStatus === CameraStatus.Ready
  const detectionActive =
    cameraReady && detectorStatus === FaceDetectorStatus.Ready
  const cameraBlocked =
    cameraStatus === CameraStatus.Denied || cameraStatus === CameraStatus.Error

  // 현재 비디오 프레임을 캡처해 File로 만들고 다음 단계로
  const captureFrame = useCallback(() => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // 디스플레이는 셀카처럼 좌우반전이지만, 백엔드엔 원본 프레임을 보냄 
    ctx.drawImage(video, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          capturedRef.current = false
          return
        }
        setPhoto(new File([blob], 'capture.jpg', { type: 'image/jpeg' }))
        navigate('/review')
      },
      'image/jpeg',
      0.92,
    )
  }, [navigate, setPhoto, videoRef])

  // 감지 루프: 카메라+감지기 모두 준비됐을 때만 구동
  useEffect(() => {
    if (!detectionActive) return

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop)
      const video = videoRef.current
      const detector = detectorRef.current
      if (!video || !detector || video.readyState < 2 || video.videoWidth === 0)
        return

      const now = performance.now()
      if (now - lastDetectRef.current < DETECT_INTERVAL_MS) return
      lastDetectRef.current = now

      const result = detector.detectForVideo(video, now)
      const next = evaluateAlignment(video, result.detections)
      setRing((prev) => (prev === next ? prev : next))

      if (next === RingStatus.Locked) {
        if (alignedSinceRef.current === null) {
          alignedSinceRef.current = now
        } else if (
          now - alignedSinceRef.current >= HOLD_MS &&
          !capturedRef.current
        ) {
          capturedRef.current = true
          captureFrame()
        }
      } else {
        alignedSinceRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      alignedSinceRef.current = null
    }
  }, [detectionActive, captureFrame, detectorRef, videoRef])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    navigate('/review')
  }

  // 카메라 거부/에러 → 파일 업로드 폴백
  if (cameraBlocked) {
    const denied = cameraStatus === CameraStatus.Denied
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-white/80">
          {denied
            ? '카메라 권한이 차단되어 있어요. 브라우저 설정에서 허용하거나, 사진을 직접 선택해 주세요.'
            : '카메라를 시작할 수 없어요. 사진을 직접 선택해 주세요.'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={retry}>
            다시 시도
          </Button>
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
          >
            사진 선택하기
          </Button>
        </div>
      </div>
    )
  }

  const detectorFailed = detectorStatus === FaceDetectorStatus.Error

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 px-6">
      <div className="relative flex aspect-square w-72 max-w-[80vw] items-center justify-center sm:w-80">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full rounded-full object-cover [transform:scaleX(-1)]"
        />
        <div className="pointer-events-none absolute h-px w-2/3 bg-white/20" />
        <div className="pointer-events-none absolute h-2/3 w-px bg-white/20" />

        {detectionActive ? (
          <ScanningRing status={ring} />
        ) : (
          <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#8b6cff]/80" />
        )}

        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <p className="text-sm text-white/70">카메라 준비 중…</p>
          </div>
        )}
      </div>

      <p className="min-h-5 text-center text-sm text-white/60">
        {!cameraReady
          ? ''
          : detectorFailed
            ? '얼굴 인식을 불러오지 못했어요. 아래 버튼으로 촬영해 주세요.'
            : detectionActive
              ? HINT[ring]
              : '얼굴 인식 준비 중…'}
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {detectorFailed ? (
        <Button variant="primary" className="px-10" onClick={captureFrame}>
          촬영하기
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs text-white/40 underline underline-offset-4"
        >
          사진 직접 선택하기
        </button>
      )}
    </div>
  )
}
