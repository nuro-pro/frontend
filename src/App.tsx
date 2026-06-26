import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { LandingPage } from '@/features/landing/LandingPage'
import { IntroPage } from '@/features/intro/IntroPage'
import { OnboardingPage } from '@/features/onboarding/OnboardingPage'
import { CaptureReadyPage } from '@/features/diagnosis/CaptureReadyPage'
import { CapturePage } from '@/features/diagnosis/CapturePage'
import { CaptureReviewPage } from '@/features/diagnosis/CaptureReviewPage'
import { SurveyPage } from '@/features/survey/SurveyPage'
import { AnalyzingPage } from '@/features/result/AnalyzingPage'
import { ResultPage } from '@/features/result/ResultPage'
import { ResultSharePage } from '@/features/result/ResultSharePage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/ready" element={<CaptureReadyPage />} />
          <Route path="/capture" element={<CapturePage />} />
          <Route path="/review" element={<CaptureReviewPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/analyzing" element={<AnalyzingPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/share" element={<ResultSharePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
