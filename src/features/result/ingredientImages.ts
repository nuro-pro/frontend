// 성분 아이콘 이미지
// 백엔드 응답의 korName으로 이미지를 찾고 못 찾으면 폴백 이미지

const MODULES = import.meta.glob('../../assets/ingredient/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

/** 파일명(확장자 제외) → url */
function byFileName(name: string): string | undefined {
  const hit = Object.entries(MODULES).find(([path]) =>
    path.endsWith(`/${name}.png`),
  )
  return hit?.[1]
}

const norm = (s: string) => s.replace(/\s+/g, '')

const KOR_TO_FILE: Record<string, string> = {
  히알루론산: 'Hyaluronic-Acid',
  글리세린: 'Glycerin',
  세라마이드: 'Ceramide',
  나이아신아마이드: 'Nicotinic-acid-amide',
  징크PCA: 'Zinc-PCA',
  BHA: 'BHA',
  AHA: 'AHA',
  LHA: 'LHA',
  PHA: 'PHA',
  레티놀: 'Retinol',
  펩타이드: 'Peptide',
  아데노신: 'Adenosine',
  비타민C: 'Vitamin-C',
  알파알부틴: 'Alpha-Arbutin',
  글루타치온: 'Glutathione',
  판테놀: 'Panthenol',
  병풀추출물: 'Centella Asiatica',
  어성초: 'Houttuynia-Cordata',
}

const FALLBACK_IMAGE = byFileName('Hyaluronic-Acid')

export function ingredientImage(korName: string): string | undefined {
  const file = KOR_TO_FILE[norm(korName)]
  return (file ? byFileName(file) : undefined) ?? FALLBACK_IMAGE
}

// 성분별 대표 색
const ACCENT: Record<string, string> = {
  히알루론산: '#6cc5ff',
  글리세린: '#57c5d6',
  세라마이드: '#69c0d4',
  나이아신아마이드: '#c79d99',
  징크PCA: '#c98f93',
  BHA: '#cf9591',
  AHA: '#d49aa0',
  LHA: '#e2899b',
  PHA: '#e09a93',
  레티놀: '#b6a0e6',
  펩타이드: '#b3a6ee',
  아데노신: '#b9a6ff',
  비타민C: '#f2cd72',
  알파알부틴: '#f0c97a',
  글루타치온: '#f0d07a',
  판테놀: '#8fd29a',
  병풀추출물: '#7fc58f',
  어성초: '#86c98f',
}

const FALLBACK_ACCENT = '#8b6cff'

export function ingredientAccent(korName: string): string {
  return ACCENT[norm(korName)] ?? FALLBACK_ACCENT
}

// 카드 앞면 효과 태그(영어)
const EN_HYDRATION = [
  'Deep Hydration',
  'Moisture Retention',
  'Skin Plumping',
  'Hydration Boost',
]
const EN_SEBUM = [
  'Sebum Regulation',
  'Balanced Oil Production',
  'Pore Care',
  'Shine Control',
]
const EN_SOOTHING = [
  'Sensitive Skin Care',
  'Anti-inflammatory',
  'Trouble Care',
  'Natural Herb',
]
const EN_BRIGHTENING = [
  'Brightening Care',
  'Dark Spot Care',
  'Even Skin Tone',
  'Radiance Boost',
]
const EN_WRINKLE = [
  'Anti-Wrinkle Care',
  'Fine Line Reduction',
  'Elasticity Boost',
  'Youthful Skin',
]
const EN_EXFOLIATION = [
  'Pore Minimizing',
  'Pore Refining',
  'Texture Improvement',
  'Sebum Control',
]

const EFFECTS_EN: Record<string, string[]> = {
  히알루론산: EN_HYDRATION,
  글리세린: EN_HYDRATION,
  세라마이드: EN_HYDRATION,
  징크PCA: EN_SEBUM,
  나이아신아마이드: EN_SEBUM,
  BHA: EN_SEBUM,
  병풀추출물: EN_SOOTHING,
  어성초: EN_SOOTHING,
  판테놀: EN_SOOTHING,
  글루타치온: EN_BRIGHTENING,
  비타민C: EN_BRIGHTENING,
  알파알부틴: EN_BRIGHTENING,
  레티놀: EN_WRINKLE,
  펩타이드: EN_WRINKLE,
  아데노신: EN_WRINKLE,
  AHA: EN_EXFOLIATION,
  LHA: EN_EXFOLIATION,
  PHA: EN_EXFOLIATION,
}

/** 성분 한글명 → 카드 앞면 영어 효과 태그(없으면 빈 배열) */
export function ingredientEffectsEn(korName: string): string[] {
  return EFFECTS_EN[norm(korName)] ?? []
}
