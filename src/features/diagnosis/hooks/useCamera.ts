import { useEffect, useRef, useState } from 'react'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'

export const CameraStatus = {
  Requesting: 'requesting',
  Ready: 'ready',
  Denied: 'denied',
  Error: 'error',
} as const
export type CameraStatus = (typeof CameraStatus)[keyof typeof CameraStatus]

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<CameraStatus>(CameraStatus.Requesting)
  const [retryKey, setRetryKey] = useState(0)
  const { cameraStream, setCameraStream } = useDiagnosis()

  useEffect(() => {
    let cancelled = false

    const applyStream = (s: MediaStream) => {
      const video = videoRef.current
      if (!video) return
      video.srcObject = s
      video.onloadedmetadata = () => {
        if (!cancelled) setStatus(CameraStatus.Ready)
      }
      void video.play().catch(() => undefined)
    }

    // 기존 스트림 있으면 재사용 → getUserMedia 스킵
    if (cameraStream) {
      applyStream(cameraStream)
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false })
      .then((s) => {
        if (cancelled) { s.getTracks().forEach(t => t.stop()); return }
        setCameraStream(s)  // Context에 저장
        applyStream(s)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const name = e instanceof DOMException ? e.name : ''
        setStatus(name === 'NotAllowedError' || name === 'SecurityError'
          ? CameraStatus.Denied : CameraStatus.Error)
      })

    return () => {
      cancelled = true
      // 스트림은 stop하지 않음 — Context가 들고 있음
    }
  }, [retryKey])

  const retry = () => {
    cameraStream?.getTracks().forEach(t => t.stop())
    setCameraStream(null)
    setStatus(CameraStatus.Requesting)
    setRetryKey(k => k + 1)
  }

  return { videoRef, status, retry }
}
