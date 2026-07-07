import { useState } from 'react'
import type { ReactNode } from 'react'
import type { DiagnosisResult } from '@/features/diagnosis/types'
import {
  ingredientImage,
  ingredientAccent,
  ingredientEffectsEn,
} from '../ingredientImages'

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

/**
 * 성분 카드. 클릭 시 앞면 ↔ 뒷면 플립.
 * - 앞면: 상단 다크→하단 컬러, 좌측 이름/설명 + 우측 밴드 세로 태그 + 하단 블롭
 * - 뒷면: 상단 컬러 워시, 이름/블롭 + EWG·위험도·데이터 + 설명 + Effects + How to use
 */
export function IngredientCard({ ingredient }: IngredientCardProps) {
  const [flipped, setFlipped] = useState(false)
  const accent = ingredientAccent(ingredient.korName)
  const image = ingredientImage(ingredient.korName)
  // 앞면 태그는 영어(레퍼런스), 매핑 없으면 백엔드 한글 effects로 폴백
  const frontTagsEn = ingredientEffectsEn(ingredient.korName)
  const frontTags = frontTagsEn.length ? frontTagsEn : ingredient.effects

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-label={`${ingredient.korName} 카드 ${flipped ? '앞면' : '뒷면'} 보기`}
      className="aspect-[13/20] w-full cursor-pointer text-left [perspective:1400px]"
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* 앞면 */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl ring-1 ring-white/10 [backface-visibility:hidden]">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, #0a0810 0%, #0a0810 38%, ${accent}1f 72%, ${accent}40 100%)`,
            }}
          />
          <div className="relative flex h-full">
            <div className="relative flex-1 overflow-hidden">
              <div className="p-5">
                <h3 className="text-3xl leading-tight font-bold text-white">
                  {ingredient.engName}
                </h3>
                <p className="mt-2 text-base text-white/80">
                  {ingredient.korName}
                </p>
                <p className="mt-3 line-clamp-3 text-[11px] leading-relaxed text-white/50">
                  {ingredient.desc}
                </p>
              </div>
              <img
                src={image}
                alt={ingredient.korName}
                className="pointer-events-none absolute bottom-[1%] left-1/2 w-[92%] -translate-x-1/2 object-contain"
              />
            </div>

            {/* 우측 accent 밴드 + 세로(90° 회전) 효과 태그 */}
            <div
              className="flex w-10 shrink-0 flex-col items-center justify-between py-6"
              style={{
                background: `linear-gradient(180deg, ${accent}26 0%, ${accent}4d 100%)`,
              }}
            >
              {frontTags.map((effect) => (
                <span
                  key={effect}
                  className="text-[11px] font-medium tracking-wide whitespace-nowrap text-white/85"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'sideways',
                  }}
                >
                  {effect}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 뒷면 */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl ring-1 ring-white/10 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{
            background: `linear-gradient(180deg, ${accent}40 0%, ${accent}14 26%, #0a0810 55%)`,
          }}
        >
          <div className="flex h-full flex-col p-5">
            <p className="text-[10px] tracking-wide text-white/40">뒷면</p>

            <div className="mt-1 flex items-start justify-between gap-2">
              <div>
                <h3 className="text-2xl leading-tight font-bold text-white">
                  {ingredient.engName}
                </h3>
                <p className="mt-1 text-base text-white/70">
                  {ingredient.korName}
                </p>
              </div>
              <img
                src={image}
                alt=""
                className="h-16 w-16 shrink-0 object-contain"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-[#0a0810]"
                style={{ backgroundColor: accent }}
              >
                {ingredient.ewgGrade}
              </span>
              <span className="text-xs text-white/80">EWG 등급</span>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white/65">
                위험도 : {ingredient.riskLevel}
              </span>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white/65">
                데이터 : {ingredient.dataLevel}
              </span>
            </div>

            <p className="mt-4 line-clamp-3 text-[11px] leading-relaxed text-white/70">
              {ingredient.desc}
            </p>

            <p className="mt-4 text-xs font-medium text-white/80">Effects</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ingredient.effects.map((effect) => (
                <span
                  key={effect}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-white/80"
                >
                  {effect}
                </span>
              ))}
            </div>

            <p className="mt-4 text-xs font-medium text-white/80">How to use</p>
            <p className="mt-1 text-[11px] text-white/60">
              {highlightName(ingredient.howToUse, ingredient.korName, accent)}
            </p>
            <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-white/50">
              {ingredient.tip}
            </p>
          </div>
        </div>
      </div>
    </button>
  )
}
