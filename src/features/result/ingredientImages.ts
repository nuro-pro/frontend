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

// 백엔드 korName(공백 제거) → assets 파일명
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

/** 성분 한글명 → 아이콘 이미지 url (없으면 폴백) */
export function ingredientImage(korName: string): string | undefined {
  const file = KOR_TO_FILE[norm(korName)]
  return (file ? byFileName(file) : undefined) ?? FALLBACK_IMAGE
}
