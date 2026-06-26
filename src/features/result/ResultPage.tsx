import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { RadarChart } from '@/components/RadarChart'
import {
  MOCK_RESULT,
  RADAR_LABELS,
  scoresToRadarValues,
  INGREDIENT_ICON_CLASSES,
  METRIC_BAR_CLASSES,
} from './mockResult'

export function ResultPage() {
  const navigate = useNavigate()
  const result = MOCK_RESULT  // TODO: 실제 API 응답으로 교체

  const radarValues = scoresToRadarValues(result.scores)

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      {/* 헤더 */}
      <header>
        <p className="text-sm font-medium text-[#a78bff]">AI 피부 진단 결과</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          {result.userName} 님의 피부 진단 결과입니다.
        </h1>
        <p className="mt-2 text-xs text-white/40">
          {result.resultDate} · NURO Skin AI
        </p>
      </header>

      {/* 프로필 + 레이더 차트 */}
      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-2xl bg-[#1e1a27] p-6 ring-1 ring-white/10">
          <div className="flex items-start gap-5">
            <div className="h-24 w-24 shrink-0 rounded-2xl bg-white/10" />
            <div>
              <p className="text-xl font-bold text-white">{result.userName} 님</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[result.skinType, `피부 나이 ${result.skinAge}세`].map((tag) => (
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
            {result.profileDesc}
          </p>
        </article>

        <article className="rounded-2xl bg-[#1e1a27] p-6 ring-1 ring-white/10">
          <span className="inline-block rounded-full bg-[#8b6cff]/20 px-3 py-1 text-xs font-medium text-[#c4b5ff]">
            6개 지표 밸런스
          </span>
          <div className="mt-2 flex justify-center">
            <RadarChart
              values={radarValues}
              labels={[...RADAR_LABELS]}
              className="h-56 w-56"
            />
          </div>
        </article>
      </section>



      {/* 항목별 점수 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">AI Analysis</p>
        <h2 className="mt-1 text-xl font-bold text-white">항목별 분석</h2>

        <div className="px-10 mt-5 flex flex-col gap-4 rounded-2xl bg-[#1e1a27] p-6 ring-1 ring-white/10 sm:flex-row sm:items-center sm:gap-8">
          <div className="shrink-0 border-r border-white pr-8">
            <p className="text-sm text-white/50">종합 점수</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {result.totalScore}
              <span className="text-base font-normal text-white/40"> / 100</span>
            </p>
          </div>
          <p className="text-sm leading-relaxed text-white/60">{result.totalDesc}</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RADAR_LABELS.map((label) => {
            const score = result.scores[label]
            return (
              <article
                key={label}
                className="rounded-2xl bg-[#1e1a27] p-5 ring-1 ring-white/10"
              >
                <span className="text-sm font-medium text-white">{label}</span>
                <p className="mt-3 text-2xl font-bold text-white">
                  {score}
                  <span className="text-sm font-normal text-white/40">/100</span>
                </p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${METRIC_BAR_CLASSES[label]}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* 성분 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">Ingredients</p>
        <h2 className="mt-1 text-xl font-bold text-white">나와 잘 맞는 성분</h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {result.ingredients.map((ingredient) => (
            <article
              key={ingredient.name}
              className="rounded-2xl bg-[#1e1a27] p-5 ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`h-9 w-9 rounded-full bg-gradient-to-br ${INGREDIENT_ICON_CLASSES[ingredient.name] ?? 'from-white/20 to-white/10'}`}
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

      {/* 루틴 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">Routine</p>
        <h2 className="mt-1 text-xl font-bold text-white">추천 스킨케어 루틴</h2>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {result.routine.map((step, index) => (
            <article
              key={step.name}
              className="rounded-2xl bg-[#1e1a27] p-5 ring-1 ring-white/10"
            >
              <p className="text-sm font-bold text-[#a78bff]">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-3 text-sm font-semibold text-white">{step.name}</p>
              <p className="mt-1 text-xs text-white/40">{step.product}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/40">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 면책 문구 */}
      <p className="mt-12 text-center text-xs text-white/40">{result.disclaimer}</p>

      {/* 액션 버튼 */}
      <div className="mt-6 flex items-center justify-center gap-10">
        <Button variant="secondary" className="w-44" onClick={() => navigate('/')}>홈으로</Button>
        <Button variant="primary" className="w-44" onClick={() => navigate('/share')}>휴대폰으로 공유</Button>
      </div>
    </div>
  )
}