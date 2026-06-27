import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RadarChart } from '@/components/RadarChart'
import { MOCK_RESULT, INGREDIENT_ICON_CLASSES } from './mockResult'
import type { DiagnosisResult } from '@/features/diagnosis/types'

const RADAR_LABELS = ['수분', '주름', '색소', '모공', '민감', '유분'] as const

export function ResultSharePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [phone, setPhone] = useState('')

  const result: DiagnosisResult = state?.result ?? MOCK_RESULT
  const userName: string = state?.userName ?? '사용자'
  const userAge: number | undefined = state?.userAge
  const photoUrl: string | null = state?.photoUrl ?? null

  const radarValues = RADAR_LABELS.map(
    (label) => result.metrics.find((m) => m.name === label)?.score ?? 0
  )

  const canSend = phone.replace(/\D/g, '').length >= 10

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSend) return
    navigate('/result', { state: { result, userName, userAge, photoUrl } })
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
              {photoUrl && (
                <img src={photoUrl} alt="진단 사진" className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-center font-semibold text-white">{userName} 님</p>
            <p className="text-center text-xs text-white/40">
              {result.skinType} &middot; 피부 나이 {result.skinAge}세
            </p>
          </div>

          <div className="mt-2 flex justify-center">
            <RadarChart
              values={radarValues}
              labels={[...RADAR_LABELS]}
              className="h-48 w-48"
            />
          </div>

          <ul className="mt-4 space-y-2">
            {result.ingredients.map((ingredient) => (
              <li
                key={ingredient.name}
                className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10"
              >
                <span className={`h-7 w-7 shrink-0 rounded-full bg-gradient-to-br ${INGREDIENT_ICON_CLASSES[ingredient.name] ?? 'from-white/20 to-white/10'}`} />
                <span className="flex-1 text-sm text-white">{ingredient.name}</span>
                <span className="rounded-full bg-[#8b6cff]/20 px-2.5 py-0.5 text-xs text-[#c4b5ff]">
                  {ingredient.badge}
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