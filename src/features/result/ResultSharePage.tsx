import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RadarChart } from '@/components/RadarChart'
import { RADAR_LABELS, RADAR_COLORS } from './resultMeta'
import { ingredientImage } from './ingredientImages'
import type { DiagnosisResult } from '@/features/diagnosis/types'
import { shareKakaoResult } from './shareKakaoResult'
import { fetchDiagnosis } from '@/features/diagnosis/api'
import { api } from '@/api/client'

export function ResultSharePage() {
  const navigate = useNavigate()
  const { shareId } = useParams()
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)

  // 010-1234-5678 형태로 자동 포맷
  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length < 4) return d
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
  }

  const phoneValid = phone.replace(/\D/g, '').length === 11

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

  const handleShareSms = async () => {
    if (!phoneValid || sending) return
    setSending(true)
    try {
      await api.post(`/notifications/${result.shareId}/sms`, {
        phoneNumber: phone.replace(/\D/g, ''),
      })
      alert('전송 완료! 잠시 후 휴대폰을 확인해주세요.')
      navigate(`/result/${result.shareId}`)
    } catch (e) {
      console.error(e)
      alert('전송 실패. 잠시 후 다시 시도해주세요.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm bg-[#222223] rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-center text-lg font-bold text-white">
            결과를 휴대폰으로 저장
          </h1>
          <button
            onClick={() => navigate(`/result/${result.shareId}`)}
            className="text-white/70 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        <div
          className="mt-6 rounded-3xl bg-black/40 p-5 ring-1 ring-white/10 shadow-[0_0_0_0.5px_#7F4FFF]"
          style={{
            background:
              'radial-gradient(ellipse 150% 100% at bottom center, #663fce 0%, #0a0010 60%, #000000 100%)',
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <p className="text-center font-semibold text-white">
              {result.userNickname} 님,
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

          <ul className="mt-6 space-y-3">
            {result.ingredients.map((ingredient) => (
              <li
                key={ingredient.engName}
                className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-1 ring-1 ring-white/10"
              >
                <img
                  src={ingredientImage(ingredient.korName)}
                  alt={ingredient.korName}
                  className="h-8 w-8 shrink-0 object-contain"
                />
                <span className="flex-1 text-sm text-white">
                  {ingredient.korName}
                </span>
                <span className="rounded-full bg-[#8391C7]/10 px-4 py-1.5 text-[13px] text-[#ffffff]">
                  {ingredient.effects[0]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <p className="text-base font-semibold text-white">
              휴대폰 번호로 결과 전송
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="010-0000-0000"
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#7F4FFF] focus:outline-none focus:ring-1 focus:ring-[#7F4FFF]"
              />
              <button
                type="button"
                onClick={handleShareSms}
                disabled={!phoneValid || sending}
                className="shrink-0 rounded-xl bg-[#7F4FFF] px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
              >
                전송
              </button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/35">또는</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {/* 메인 CTA: 카카오톡 */}
          <button
            type="button"
            onClick={handleShareKakao}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-6 py-3.5 text-sm font-semibold text-[#3A1D1D] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.94 5.33 4.86 6.74-.16.55-.86 2.97-.89 3.16 0 0-.02.15.08.21.1.06.22.01.22.01.29-.04 3.36-2.2 3.9-2.58.6.08 1.21.13 1.83.13 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
            </svg>
            카카오톡으로 결과 전송
          </button>
        </div>
      </div>
    </div>
  )
}
