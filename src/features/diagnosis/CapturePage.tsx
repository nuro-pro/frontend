import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BoundingBox, Detection } from '@mediapipe/tasks-vision'
import { Button } from '@/components/Button'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'
import { useCamera, CameraStatus } from './hooks/useCamera'
import { useFaceDetection, FaceDetectorStatus } from './hooks/useFaceDetection'
import { SphereGuide } from './components/SphereGuide'
import type { GuideDirection } from './components/SphereGuide'
import { RingStatus } from './components/ringStatus'

const DETECT_INTERVAL_MS = 80

// 정렬 완료 후 정면→왼쪽→오른쪽 촬영 시퀀스 (각 단계 시각 안내)
type Phase = 'aligning' | 'front' | 'left' | 'right'

const PHASE_TEXT: Record<Phase, string> = {
  aligning: '정면을 바라봐주세요.',
  front: '정면을 바라봐주세요.',
  left: '고개를 왼쪽으로 천천히 돌려주세요.',
  right: '고개를 오른쪽으로 천천히 돌려주세요.',
}
const PHASE_DIR: Record<Phase, GuideDirection> = {
  aligning: 'front',
  front: 'front',
  left: 'left',
  right: 'right',
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
  const { addToPhotos } = useDiagnosis()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { videoRef, status: cameraStatus, retry } = useCamera()
  const { detectorRef, status: detectorStatus } = useFaceDetection()

  const [phase, setPhase] = useState<Phase>('aligning')

  const rafRef = useRef<number | null>(null)
  const lastDetectRef = useRef(0)
  const seqStartedRef = useRef(false)
  const seqTimersRef = useRef<number[]>([])

  const cameraReady = cameraStatus === CameraStatus.Ready
  const detectionActive =
    cameraReady && detectorStatus === FaceDetectorStatus.Ready
  const cameraBlocked =
    cameraStatus === CameraStatus.Denied || cameraStatus === CameraStatus.Error

  // 현재 비디오 프레임을 캡처해 photos에 추가 (백엔드엔 원본 프레임)
  const captureFrame = useCallback(
    (after?: () => void) => {
      const video = videoRef.current
      if (!video || video.videoWidth === 0) return
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(video, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (!blob) return
          addToPhotos(new File([blob], 'capture.jpg', { type: 'image/jpeg' }))
          after?.()
        },
        'image/jpeg',
        0.92,
      )
    },
    [addToPhotos, videoRef],
  )

  // 정렬 완료 → 정면/왼쪽/오른쪽 순서로 안내하며 각 단계 촬영
  const runSequence = useCallback(() => {
    setPhase('front')
    seqTimersRef.current = [
      window.setTimeout(() => {
        captureFrame()
        setPhase('left')
      }, 1600),
      window.setTimeout(() => {
        captureFrame()
        setPhase('right')
      }, 4000),
      window.setTimeout(() => {
        captureFrame(() => navigate('/review'))
      }, 6400),
    ]
  }, [captureFrame, navigate])

  // 감지 루프에서 항상 최신 runSequence를 참조 (effect 재실행/타이머 끊김 방지)
  const runSeqRef = useRef(runSequence)
  useEffect(() => {
    runSeqRef.current = runSequence
  }, [runSequence])

  // 언마운트 시에만 시퀀스 타이머 정리
  useEffect(() => {
    const timers = seqTimersRef
    return () => timers.current.forEach(clearTimeout)
  }, [])

  // 감지 루프: 카메라+감지기 모두 준비됐을 때만 구동
  useEffect(() => {
    if (!detectionActive) return

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop)
      if (seqStartedRef.current) return // 시퀀스 시작 후엔 감지 정지
      const video = videoRef.current
      const detector = detectorRef.current
      if (!video || !detector || video.readyState < 2 || video.videoWidth === 0)
        return

      const now = performance.now()
      if (now - lastDetectRef.current < DETECT_INTERVAL_MS) return
      lastDetectRef.current = now

      const result = detector.detectForVideo(video, now)
      const next = evaluateAlignment(video, result.detections)

      if (next === RingStatus.Locked) {
        seqStartedRef.current = true
        runSeqRef.current()
      }
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [detectionActive, detectorRef, videoRef])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    //setPhoto(file)
    addToPhotos(file)
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

        {detectionActive ? (
          <SphereGuide
            direction={PHASE_DIR[phase]}
            aligned={phase !== 'aligning'}
          />
        ) : (
          <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#8b6cff]/80" />
        )}

        {/* 상단 토스트 안내 */}
        {detectionActive && (
          <div className="absolute top-[8%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[#ff6b6b]/40 bg-[#2a1018]/85 px-3.5 py-1.5 text-[11px] whitespace-nowrap text-[#ffb3b3] backdrop-blur-sm">
            <span className="text-[#ff8f8f]">ⓘ</span>
            가이드 라인에 맞게 얼굴 위치를 조정해주세요.
          </div>
        )}

        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <p className="text-sm text-white/70">카메라 준비 중…</p>
          </div>
        )}
      </div>

      <p className="min-h-7 text-center text-lg font-medium text-white">
        {!cameraReady
          ? ''
          : detectorFailed
            ? '얼굴 인식을 불러오지 못했어요. 아래 버튼으로 촬영해 주세요.'
            : detectionActive
              ? PHASE_TEXT[phase]
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
        <Button
          variant="primary"
          className="px-10"
          onClick={() => captureFrame(() => navigate('/review'))}
        >
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
