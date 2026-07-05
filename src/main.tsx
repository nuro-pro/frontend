import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void
      isInitialized: () => boolean
      Share: {
        sendDefault: (settings: Record<string, unknown>) => void
      }
      // 필요한 API 더 있으면 여기 추가
    }
  }
}

// 👉 이거 추가
function initKakao() {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init('f7d54141e94b2101c808ca48a565b40c') // 🔥 여기 키 넣기
  }
}

initKakao()

initKakao()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
