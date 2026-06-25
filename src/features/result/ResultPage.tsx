import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { DISCLAIMER } from '@/lib/constants'

// 결과 화면(디자인 결과) 데이터는 백엔드 진단 결과로 교체 예정 — 현재는 mock
// TODO(Swagger): DiagnosisResult 스키마 확정 후 props/state로 주입
const USER_NAME = 'Minseo'
const TOTAL_SCORE = 53

interface Metric {
  label: string
  score: number
  delta: string
}

const METRICS: Metric[] = [
  { label: '수분', score: 62, delta: '+4' },
  { label: '유분', score: 62, delta: '-2' },
  { label: '탄력', score: 48, delta: '+1' },
  { label: '모공', score: 55, delta: '+3' },
  { label: '주름', score: 41, delta: '-1' },
  { label: '색소', score: 58, delta: '+5' },
]

interface Ingredient {
  name: string
  desc: string
}

const INGREDIENTS: Ingredient[] = [
  { name: '히알루론산', desc: '수분을 끌어당겨 건조함을 완화해 줘요.' },
  { name: '나이아신아마이드', desc: '피부 톤과 유분 밸런스를 도와줘요.' },
  { name: '세라마이드', desc: '장벽을 강화해 자극을 줄여줘요.' },
]

const ROUTINE: string[] = ['클렌징', '토너', '세럼', '수분크림', '선크림']

// 6개 지표 밸런스 도넛(임시 색상 분할)
const BALANCE_DONUT =
  'conic-gradient(#8b6cff 0deg 60deg, #5ad1ff 60deg 120deg, #6affd0 120deg 180deg, #ffe68a 180deg 240deg, #ff9d6a 240deg 300deg, #ff7a9c 300deg 360deg)'

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
          2026.06.24 · 20대 · NURO Skin AI
        </p>
      </header>

      {/* 상단 카드: 프로필 + 6지표 밸런스 */}
      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex items-center gap-5 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="h-24 w-24 shrink-0 rounded-2xl bg-white/80" />
          <div>
            <p className="text-3xl font-bold text-white">{TOTAL_SCORE}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#8b6cff]/20 px-3 py-1 text-xs text-[#c4b5ff]">
                복합성 피부
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                또래 평균 24점
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div
            className="h-28 w-28 shrink-0 rounded-full"
            style={{ background: BALANCE_DONUT }}
          >
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-[#15101f]" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-white">6개 지표 밸런스</p>
            <p className="mt-1 text-sm text-white/50">
              지표별 분포를 한눈에 확인해요.
            </p>
          </div>
        </div>
      </section>

      {/* 항목별 분석 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">AI Analysis</p>
        <h2 className="mt-1 text-xl font-bold text-white">항목별 분석</h2>

        <div className="mt-5 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <p className="text-sm text-white/50">종합 점수</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {TOTAL_SCORE}
            <span className="text-base font-normal text-white/40"> / 100</span>
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">{metric.label}</span>
                <span className="text-xs text-[#a78bff]">{metric.delta}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {metric.score}
                <span className="text-sm font-normal text-white/40">
                  {' '}
                  / 100
                </span>
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8b6cff] to-[#5ad1ff]"
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 나와 잘 맞는 성분 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">Ingredients</p>
        <h2 className="mt-1 text-xl font-bold text-white">나와 잘 맞는 성분</h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {INGREDIENTS.map((ingredient) => (
            <div
              key={ingredient.name}
              className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#8b6cff] to-[#5ad1ff]" />
              <p className="mt-4 font-semibold text-white">{ingredient.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {ingredient.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 추천 스킨케어 루틴 */}
      <section className="mt-12">
        <p className="text-sm font-medium text-[#a78bff]">Routine</p>
        <h2 className="mt-1 text-xl font-bold text-white">
          추천 스킨케어 루틴
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {ROUTINE.map((label, index) => (
            <div
              key={label}
              className="rounded-2xl bg-white/5 p-5 text-center ring-1 ring-white/10"
            >
              <p className="text-xs text-[#a78bff]">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-2 text-sm font-medium text-white">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 면책 문구 (결과 화면 필수) */}
      <p className="mt-12 text-center text-xs text-white/40">{DISCLAIMER}</p>

      {/* 하단 액션 */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button variant="secondary" onClick={() => navigate('/')}>
          처음으로
        </Button>
        <Button variant="primary" onClick={() => navigate('/intro')}>
          다시 진단하기
        </Button>
      </div>
    </div>
  )
}
