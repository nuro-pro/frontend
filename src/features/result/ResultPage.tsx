import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { RadarChart } from '@/components/RadarChart'
import { DISCLAIMER } from '@/lib/constants'
import {
  INGREDIENTS,
  METRICS,
  PEER_SCORE,
  PROFILE_DESC,
  PROFILE_TAGS,
  RADAR_LABELS,
  RADAR_VALUES,
  RESULT_DATE,
  ROUTINE,
  TOTAL_DESC,
  TOTAL_SCORE,
  USER_NAME,
} from './mockResult'

export function ResultPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      {/* 헤더 */}
      <header>
        <p className="text-sm font-medium text-[#a78bff]">AI 피부 진단 결과</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          {USER_NAME} 님의 피부 진단 결과입니다.
        </h1>
        <p className="mt-2 text-xs text-white/40">
          {RESULT_DATE} · NURO Skin AI
        </p>
      </header>

      {/* 상단: 프로필 + 6지표 밸런스 */}
      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 1. 프로필 카드 */}
        <article className="rounded-2xl bg-[#1e1a27] p-6 ring-1 ring-white/10">
          <div className="flex items-start gap-5">
            {/* 진단 사진 자리 — 실제 촬영 이미지로 교체 예정 */}
            <div className="h-24 w-24 shrink-0 rounded-2xl bg-white/10" />
            <div>
              <p className="text-xl font-bold text-white">{USER_NAME} 님</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {PROFILE_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#8b6cff]/20 px-3 py-1 text-xs text-[#c4b5ff]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            {PROFILE_DESC}
          </p>
        </article>

        {/* 2. 6개 지표 밸런스 카드 */}
        <article className="rounded-2xl bg-[#1e1a27] p-6 ring-1 ring-white/10">
          <span className="inline-block rounded-full bg-[#8b6cff]/20 px-3 py-1 text-xs font-medium text-[#c4b5ff]">
            6개 지표 밸런스
          </span>
          <div className="mt-2 flex justify-center">
            <RadarChart
              values={RADAR_VALUES}
              labels={RADAR_LABELS}
              className="h-56 w-56"
            />
          </div>
        </article>
      </section>

      {/* 항목별 분석 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">AI Analysis</p>
        <h2 className="mt-1 text-xl font-bold text-white">항목별 분석</h2>

        <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-[#1e1a27] p-6 ring-1 ring-white/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="shrink-0">
            <p className="text-sm text-white/50">종합 점수</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {TOTAL_SCORE}
              <span className="text-base font-normal text-white/40">
                {' '}
                / 또래 {PEER_SCORE}
              </span>
            </p>
          </div>
          <p className="text-sm leading-relaxed text-white/60">{TOTAL_DESC}</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 3. 항목별 상세 분석 리스트 */}
          {METRICS.map((metric) => (
            <article
              key={metric.label}
              className="rounded-2xl bg-[#1e1a27] p-5 ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  {metric.label}
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/60">
                  {metric.grade}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <p className="text-2xl font-bold text-white">
                  {metric.score}
                  <span className="text-sm font-normal text-white/40">
                    /100
                  </span>
                </p>
                <span className="text-xs text-[#a78bff]">{metric.peer}</span>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${metric.barClass}`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-white/40">{metric.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 나와 잘 맞는 성분 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">Ingredients</p>
        <h2 className="mt-1 text-xl font-bold text-white">나와 잘 맞는 성분</h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* 4. 추천 성분 리스트 */}
          {INGREDIENTS.map((ingredient) => (
            <article
              key={ingredient.name}
              className="rounded-2xl bg-[#1e1a27] p-5 ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`h-9 w-9 rounded-full bg-gradient-to-br ${ingredient.iconClass}`}
                />
                <span className="rounded-full bg-[#8b6cff]/20 px-3 py-1 text-xs text-[#c4b5ff]">
                  {ingredient.badge}
                </span>
              </div>
              <p className="mt-4 font-semibold text-white">{ingredient.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {ingredient.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 추천 스킨케어 루틴 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">Routine</p>
        <h2 className="mt-1 text-xl font-bold text-white">
          추천 스킨케어 루틴
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {/* 5. 루틴 단계 리스트 */}
          {ROUTINE.map((step, index) => (
            <article
              key={step.name}
              className="rounded-2xl bg-[#1e1a27] p-5 ring-1 ring-white/10"
            >
              <p className="text-sm font-bold text-[#a78bff]">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-3 text-sm font-semibold text-white">
                {step.name}
              </p>
              <p className="mt-1 text-xs text-white/40">{step.product}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                {step.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 면책 문구 (결과 화면 필수) */}
      <p className="mt-12 text-center text-xs text-white/40">{DISCLAIMER}</p>

      {/* 하단 액션 */}
        <div className="mt-8 flex justify-center">
          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            <Button 
              variant="secondary" 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              홈으로
            </Button>
            <Button 
              variant="primary" 
              className="w-full" 
              onClick={() => navigate('/share')}
            >
              이미지로 공유
            </Button>
          </div>
        </div>
    </div>
  )
}