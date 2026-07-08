import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { RadarChart } from '@/components/RadarChart'
import type { DiagnosisResult } from '@/features/diagnosis/types'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchDiagnosis } from '@/features/diagnosis/api'

import {
  RADAR_LABELS,
  RADAR_COLORS,
  METRIC_META,
  bandOf,
  BAND_META,
  metricDesc,
} from './resultMeta'
import { IngredientCard } from './components/IngredientCard'
import { ingredientImage } from './ingredientImages'

// TODO(backend): 실제 촬영일(createdAt) 내려오면 교체 (QA #10)
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const
function formatResultDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}. ${WEEKDAYS[d.getDay()]}요일`
}

export function ResultPage() {
  const navigate = useNavigate()
  const { reset } = useDiagnosis()
  const { shareId } = useParams()
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!shareId) {
      console.log(shareId)
      navigate('/')
      return
    }

    const load = async () => {
      try {
        const data = await fetchDiagnosis(String(shareId))
        setResult(data)
      } catch (e) {
        console.log(e)
        alert('결과를 불러오지 못했어요. 다시 시도해 주세요.')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [shareId])

  if (loading || !result?.metrics) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center text-white">
        <p>로딩중 . . .</p>
      </div>
    )
  }

  const handleHome = () => {
    reset()
    navigate('/')
  }

  // metrics 배열 → 레이더 차트용 배열로 변환
  const radarValues = RADAR_LABELS.map((label) => {
    return result.metrics?.find((m) => m.name === label)?.score ?? 0
  })

  // 사용처: createdAt이 없을 수도 있으니 방어적으로
  const resultDate = result.createdAt ? new Date(result.createdAt) : new Date()
  const dateLabel = formatResultDate(resultDate)

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      {/* 헤더 */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#a78bff]">
            NURO Skin Care Routine Service
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {result.userNickname}님의 피부 분석 결과입니다.
          </h1>
        </div>
        <p className="shrink-0 pt-1 text-xs text-white/40 sm:text-sm">
          {dateLabel}
        </p>
      </header>

      {/* 프로필 + 레이더 차트 */}
      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 프로필 카드 */}
        <article className="relative rounded-2xl bg-[#1e1a27] p-5 pt-12 ring-1 ring-white/10">
          <span className="absolute left-4 top-0 rounded-b-xl border border-white/15 bg-[radial-gradient(ellipse_at_center,#7F4FFFB3,#7F4FFF33_70%,transparent)] px-3 py-1.5 text-[14px] font-semibold text-[#efeaff] shadow-inner backdrop-blur-md">
            한눈에 보는 피부 상태
          </span>
          <div className="flex items-start gap-6 pt-6 sm:gap-8">
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <div className="h-36 w-36 overflow-hidden rounded-2xl bg-white/10">
                {result.userImage && (
                  <img
                    src={result.userImage}
                    alt="진단 사진"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <p className="text-[14px] text-[#ffffff]">
                {result.userNickname} 님 · {result.userAge ?? ''}세
              </p>
            </div>

            <div className="flex-1">
              <p className="text-sm text-[#DFDFDF]/80">종합 점수</p>
              <p className="mt-0.5 text-3xl font-bold text-white">
                {result.totalScore}
                <span className="text-sm font-normal text-white/40">
                  {' '}
                  / 또래 {result.peerTotalScore}
                </span>
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {[result.skinType, `피부 나이 ${result.skinAge}세`].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/15 bg-[#8391C7]/40 px-5 py-1.5 text-xs text-white shadow-inner backdrop-blur-md"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#DFDFDF]">
                {result.summary}
              </p>
            </div>
          </div>
        </article>

        {/* 레이더 차트 */}
        <article className="relative flex flex-col rounded-2xl bg-[#1e1a27] p-5 pt-12 ring-1 ring-white/10">
          <span className="absolute left-4 top-0 rounded-b-xl border border-white/15 bg-[radial-gradient(ellipse_at_center,#7F4FFFB3,#7F4FFF33_70%,transparent)] px-3 py-1.5  text-[14px]  font-semibold text-[#efeaff] shadow-inner backdrop-blur-md">
            6개 지표 밸런스
          </span>
          <div className="flex flex-1 items-center justify-center">
            <RadarChart
              values={radarValues}
              labels={[...RADAR_LABELS]}
              colors={RADAR_COLORS}
              className="h-60 w-60 sm:h-64 sm:w-64"
            />
          </div>
        </article>
      </section>

      {/* 항목별 점수 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">
          AI Skin Category Analysis
        </p>
        <h2 className="mt-1 text-2xl font-bold text-white">항목별 분석</h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RADAR_LABELS.map((label) => {
            const metric = result.metrics.find((m) => m.name === label)
            const score = metric?.score ?? 0
            const peerScore = metric?.peerScore ?? 0
            const band = bandOf(score)
            const meta = METRIC_META[label]
            const diff = score - peerScore
            return (
              <article
                key={label}
                className="rounded-2xl bg-[#1e1a27] p-5 ring-1 ring-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-white">
                    {label}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${BAND_META[band].chip}`}
                  >
                    {BAND_META[band].label}
                  </span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <p
                    className="text-3xl font-bold"
                    style={{ color: meta.color }}
                  >
                    {score}
                    <span className="text-sm font-normal text-white/40">
                      /100
                    </span>
                  </p>
                  <span
                    className={`text-sm ${diff >= 0 ? 'text-[#5ce8bb]' : 'text-[#ff8f8f]'}`}
                  >
                    또래 평균 대비 {diff >= 0 ? '▲' : '▼'} {Math.abs(diff)}점
                  </span>
                </div>

                {/* 프로그래스 바 */}
                <div className="relative mt-3 h-2 w-full rounded-full bg-white/10">
                  {/* 채워지는 바 (본인 점수만큼) */}
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${meta.bar}`}
                    style={{ width: `${score}%` }}
                  />
                  {/* 흰 점: 본인 점수 끝에 위치 */}
                  <div
                    className="absolute top-1/2 h-2 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-1 ring-black/20"
                    style={{
                      left: `clamp(4px, ${Number(score) || 0}%, calc(100% - 4px))`,
                    }}
                  />
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {metric?.comment ?? metricDesc(label, band)}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      {/* 성분 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">
          Ingredients for My Skin
        </p>
        <h2 className="mt-1 text-2xl font-bold text-white">
          내 피부와 잘 맞는 성분
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-12 sm:grid-cols-3">
          {result.ingredients.map((ingredient) => (
            <IngredientCard key={ingredient.engName} ingredient={ingredient} />
          ))}
        </div>
      </section>

      {/* 루틴 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">
          NURO&apos;s Personalized Skincare Routine
        </p>
        <h2 className="mt-1 text-2xl font-bold text-white">
          NURO 추천 스킨케어 루틴
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-10 sm:grid-cols-3">
          {result.routine.map((step, index) => (
            <article
              key={step.name}
              className="rounded-2xl bg-[#1e1a27] p-5 ring-1 ring-white/10"
            >
              <div className="flex items-start justify-between">
                <p className="text-xl font-bold text-[#a78bff]">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <img
                  src={ingredientImage(
                    result.ingredients[index]?.korName ?? '',
                  )}
                  alt=""
                  className="h-10 w-10 shrink-0 object-contain"
                />
              </div>
              <p className="mt-3 text-lg font-semibold text-white">
                {step.name}
              </p>
              <p className="mt-1 text-sm font-medium text-[#a78bff]">
                {step.product}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/45">
                {step.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-30 flex items-center justify-center gap-3 sm:gap-6">
        <Button
          variant="secondary"
          className="bg-[#1b1622]! px-6! whitespace-nowrap sm:px-10! w-[150px]"
          onClick={handleHome}
        >
          홈으로
        </Button>
        <Button
          variant="primary"
          className="px-6! whitespace-nowrap sm:px-10!"
          onClick={() => navigate(`/share/${result.shareId}`)}
        >
          휴대폰으로 결과 확인하기
        </Button>
      </div>
    </div>
  )
}
