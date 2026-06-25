import { DISCLAIMER } from '@/lib/constants'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
        nuro
      </h1>
      <p className="max-w-md text-slate-600">
        AI 피부 진단 서비스 · 사진을 올리면 분석 결과를 받아보세요.
      </p>
      <p className="max-w-md text-xs text-slate-400">{DISCLAIMER}</p>
    </Layout>
  )
}

export default App
