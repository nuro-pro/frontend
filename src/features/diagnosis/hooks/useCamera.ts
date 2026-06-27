import { useEffect, useRef, useState } from 'react'

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

  useEffect(() => {
    let stream: MediaStream | null = null
    let cancelled = false

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        stream = s
        const video = videoRef.current
        if (video) {
          video.srcObject = s
          // iOS 사파리: 사용자 제스처 없이도 muted+playsInline이면 재생됨.
          void video.play().catch(() => undefined)
        }
        setStatus(CameraStatus.Ready)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const name = e instanceof DOMException ? e.name : ''
        setStatus(
          name === 'NotAllowedError' || name === 'SecurityError'
            ? CameraStatus.Denied
            : CameraStatus.Error,
        )
      })

    return () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [retryKey])

  const retry = () => {
    setStatus(CameraStatus.Requesting)
    setRetryKey((k) => k + 1)
  }

  return { videoRef, status, retry }
}
