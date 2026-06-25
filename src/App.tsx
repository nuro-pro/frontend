import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './features/landing/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/*
          %<Route path="/diagnosis" element={<InputPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/result" element={<ResultPage />} />*/}
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
