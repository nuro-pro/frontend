import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'

const IDLE_MS = 180_000 // 3분

export function IdleReset() {
  const navigate = useNavigate()
  const location = useLocation()
  const { reset } = useDiagnosis()
  const navRef = useRef(navigate)
  const resetRef = useRef(reset)
  const pathRef = useRef(location.pathname)
  useEffect(() => {
    navRef.current = navigate
  }, [navigate])
  useEffect(() => {
    resetRef.current = reset
  }, [reset])
  useEffect(() => {
    pathRef.current = location.pathname
  }, [location.pathname])

  useEffect(() => {
    let timer: number | undefined

    const goHome = () => {
      if (pathRef.current === '/') return // 이미 홈이면 아무것도 안 함
      resetRef.current()
      navRef.current('/')
    }

    const restart = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(goHome, IDLE_MS)
    }

    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'touchmove',
      'wheel',
      'click',
      'scroll',
    ]
    events.forEach((e) =>
      window.addEventListener(e, restart, { passive: true }),
    )
    restart() // 최초 타이머 시작

    return () => {
      window.clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, restart))
    }
  }, [])

  return null
}
