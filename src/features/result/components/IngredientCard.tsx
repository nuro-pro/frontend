import { useState } from 'react'
import type { ReactNode } from 'react'
import type { DiagnosisResult } from '@/features/diagnosis/types'
import { ingredientImage, ingredientAccent } from '../ingredientImages'

type Ingredient = DiagnosisResult['ingredients'][number]

interface IngredientCardProps {
  ingredient: Ingredient
}

/** How to use 경로에서 성분명을 accent 색으로 강조 */
function highlightName(text: string, name: string, accent: string): ReactNode {
  const parts = text.split(name)
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && (
        <span style={{ color: accent }} className="font-medium">
          {name}
        </span>
      )}
    </span>
  ))
}

/** 클릭 시 앞면(요약) ↔ 뒷면(상세)으로 뒤집히는 성분 카드 */
export function IngredientCard({ ingredient }: IngredientCardProps) {
  const [flipped, setFlipped] = useState(false)
  const accent = ingredientAccent(ingredient.korName)
  const image = ingredientImage(ingredient.korName)

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-label={`${ingredient.korName} 카드 ${flipped ? '앞면' : '뒷면'} 보기`}
      className="h-[440px] w-full cursor-pointer text-left [perspective:1200px]"
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* 앞면 — 요약 */}
        <div className="absolute inset-0 flex flex-col rounded-2xl bg-[#1e1a27] p-5 ring-1 ring-white/10 [backface-visibility:hidden]">
          <div className="flex items-center justify-between gap-2">
            <img
              src={image}
              alt={ingredient.korName}
              className="h-12 w-12 shrink-0 object-contain"
            />
            <div className="flex flex-wrap justify-end gap-1.5">
              {ingredient.effects.slice(0, 2).map((effect) => (
                <span
                  key={effect}
                  className="rounded-full bg-[#8b6cff]/20 px-2.5 py-1 text-xs text-[#c4b5ff]"
                >
                  {effect}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-4 font-semibold text-white">{ingredient.korName}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/50">
            {ingredient.desc}
          </p>
          <span className="mt-auto pt-4 text-xs text-white/30">
            탭하여 자세히 보기 →
          </span>
        </div>

        {/* 뒷면 — 상세 */}
        <div
          className="absolute inset-0 overflow-y-auto rounded-2xl p-5 ring-1 ring-white/10 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{
            backgroundImage: `linear-gradient(180deg, ${accent}40 0%, ${accent}12 28%, #15121c 70%)`,
          }}
        >
          <p className="text-[10px] tracking-wide text-white/40">뒷면</p>

          <div className="mt-1 flex items-start justify-between gap-2">
            <div>
              <p className="text-lg leading-tight font-bold text-white">
                {ingredient.engName}
              </p>
              <p className="text-sm text-white/60">{ingredient.korName}</p>
            </div>
            <img
              src={image}
              alt={ingredient.korName}
              className="h-12 w-12 shrink-0 object-contain"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-[#15121c]"
              style={{ backgroundColor: accent }}
            >
              {ingredient.ewgGrade}
            </span>
            <span className="text-xs text-white/70">EWG 등급</span>
            <span className="rounded-full bg-black/30 px-2 py-0.5 text-[11px] text-white/60">
              위험도 : {ingredient.riskLevel}
            </span>
            <span className="rounded-full bg-black/30 px-2 py-0.5 text-[11px] text-white/60">
              데이터 : {ingredient.dataLevel}
            </span>
          </div>

          <div className="my-3 h-px w-full bg-white/10" />

          <p className="text-xs leading-relaxed text-white/70">
            {ingredient.desc}
          </p>

          <p className="mt-4 text-xs font-medium text-white/80">Effects</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {ingredient.effects.map((effect) => (
              <span
                key={effect}
                className="rounded-full bg-black/30 px-2.5 py-1 text-[11px] text-white/70"
              >
                {effect}
              </span>
            ))}
          </div>

          <p className="mt-4 text-xs font-medium text-white/80">How to use</p>
          <p className="mt-1 text-xs text-white/60">
            {highlightName(ingredient.howToUse, ingredient.korName, accent)}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/50">
            {ingredient.tip}
          </p>
        </div>
      </div>
    </button>
  )
}
