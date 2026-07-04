import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RadarChart } from '@/components/RadarChart'
import { MOCK_RESULT } from './mockResult'
import { RADAR_LABELS, RADAR_COLORS } from './resultMeta'
import { ingredientImage } from './ingredientImages'
import type { DiagnosisResult } from '@/features/diagnosis/types'

export function ResultSharePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [phone, setPhone] = useState('')
  const result: DiagnosisResult = state?.result ?? MOCK_RESULT

  useEffect(() => {
    if (!state?.result) {
      navigate('/')
    }
  }, [])

  const radarValues = RADAR_LABELS.map(
    (label) => result.metrics.find((m) => m.name === label)?.score ?? 0,
  )

  const canSend = phone.replace(/\D/g, '').length >= 10

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSend) return
    navigate(`/result/${result.shareId}`)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-lg font-bold text-white">
          결과 휴대폰으로 저장
        </h1>

        <div className="mt-6 rounded-3xl bg-black/40 p-5 ring-1 ring-white/10">
          <div className="flex flex-col items-center gap-1">
            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-white/10">
              {result.userImage && (
                  <img
                    src={`http://localhost:8080${result.userImage}`}
                    alt="진단 사진"
                    className="w-full h-full object-cover"
                  />
                )}
            </div>
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

        <form onSubmit={handleSend} className="mt-6">
          <label htmlFor="phone" className="block text-sm text-white/70">
            휴대폰 번호로 결과 전송
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className="flex-1 rounded-xl bg-black/30 px-4 py-3 text-white ring-1 ring-white/10 outline-none placeholder:text-white/30 focus:ring-2 focus:ring-[#8b6cff]"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="rounded-xl bg-gradient-to-b from-[#8b6cff] to-[#6a3fce] px-6 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              전송
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
