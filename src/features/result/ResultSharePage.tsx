import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RadarChart } from '@/components/RadarChart'
import { RADAR_LABELS, RADAR_COLORS } from './resultMeta'
import { ingredientImage } from './ingredientImages'
import type { DiagnosisResult } from '@/features/diagnosis/types'
import { shareKakaoResult } from './shareKakaoResult'
import { fetchDiagnosis } from '@/features/diagnosis/api'

export function ResultSharePage() {
  const navigate = useNavigate()
  const { shareId } = useParams()
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!shareId) {
      navigate('/')
      return
    }
    fetchDiagnosis(shareId)
      .then(setResult)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [shareId])

  if (loading || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        로딩중...
      </div>
    )
  }

  const radarValues = RADAR_LABELS.map(
    (label) => result.metrics.find((m) => m.name === label)?.score ?? 0,
  )

  function handleShareKakao() {
    if (!result) return
    shareKakaoResult(result)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm bg-[#222223] rounded-3xl p-6 relative">
        <button
          onClick={() => navigate(`/result/${result.shareId}`)}
          className="absolute right-4 top-4 text-white/70 hover:text-white text-2xl"
        >
          ×
        </button>

        <h1 className="text-center text-lg font-bold text-white">
          결과 휴대폰으로 저장
        </h1>

        <div
          className="mt-6 rounded-3xl bg-black/40 p-5 ring-1 ring-white/10"
          style={{
            background:
              'radial-gradient(ellipse 150% 100% at bottom center, #663fce 0%, #0a0010 60%, #000000 100%)',
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <p className="text-center font-semibold text-white">
              {result.userNickname} 님
            </p>
            <p className="text-center text-xs text-white/40">
              {result.skinType} &middot; 피부 나이 {result.skinAge}세
            </p>
          </div>

          <div className="mt-2 flex justify-center">
            <RadarChart
              values={radarValues}
              labels={[...RADAR_LABELS]}
              colors={RADAR_COLORS}
              className="h-48 w-48"
            />
          </div>

          <ul className="mt-4 space-y-2">
            {result.ingredients.map((ingredient) => (
              <li
                key={ingredient.engName}
                className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10"
              >
                <img
                  src={ingredientImage(ingredient.korName)}
                  alt={ingredient.korName}
                  className="h-8 w-8 shrink-0 object-contain"
                />
                <span className="flex-1 text-sm text-white">
                  {ingredient.korName}
                </span>
                <span className="rounded-full bg-[#8b6cff]/20 px-2.5 py-0.5 text-xs text-[#c4b5ff]">
                  {ingredient.effects[0]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleShareKakao}
            className="rounded-xl bg-[#7F4FFF] px-6 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            카카오톡으로 결과 전송
          </button>
        </div>
      </div>
    </div>
  )
}
