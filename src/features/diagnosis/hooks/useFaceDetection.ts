import { useEffect, useRef, useState } from 'react'
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision'

const WASM_BASE =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'

export const FaceDetectorStatus = {
  Loading: 'loading',
  Ready: 'ready',
  Error: 'error',
} as const
export type FaceDetectorStatus =
  (typeof FaceDetectorStatus)[keyof typeof FaceDetectorStatus]

async function createDetector(
  vision: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>,
): Promise<FaceDetector> {
  try {
    return await FaceDetector.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
      runningMode: 'VIDEO',
      minDetectionConfidence: 0.5,
    })
  } catch {
    return await FaceDetector.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
      runningMode: 'VIDEO',
      minDetectionConfidence: 0.5,
    })
  }
}

export function useFaceDetection() {
  const detectorRef = useRef<FaceDetector | null>(null)
  const [status, setStatus] = useState<FaceDetectorStatus>(
    FaceDetectorStatus.Loading,
  )

  useEffect(() => {
    let cancelled = false
    let detector: FaceDetector | null = null

    const load = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_BASE)
        detector = await createDetector(vision)
        if (cancelled) {
          detector.close()
          return
        }
        detectorRef.current = detector
        setStatus(FaceDetectorStatus.Ready)
      } catch {
        if (!cancelled) setStatus(FaceDetectorStatus.Error)
      }
    }

    void load()

    return () => {
      cancelled = true
      detector?.close()
      detectorRef.current = null
    }
  }, [])

  return { detectorRef, status }
}
