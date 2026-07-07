import { Link } from 'react-router-dom'
import landingTitle from '@/assets/landing1/landingTitle.png'

// 표지 블롭 아이콘 
const BLOB_MODULES = import.meta.glob('../../assets/landing3/*.{svg,png}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const BLOBS = Object.entries(BLOB_MODULES)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url)

const ROW1 = BLOBS.slice(0, 6) // landing1~6 (윗줄)
const ROW2 = BLOBS.slice(6, 12) // landing7~12 (아랫줄)
const EDGE_BLEED = '2vw' 
const TOP_CLIP = '2.5vw' 
const ROW_OVERLAP = '8vw' 
const BLOB_SCALE = 'scale-[1.14]' 

function BlobRow({ items, offset }: { items: string[]; offset: number }) {
  return (
    <div
      className="grid grid-cols-6"
      style={{ marginLeft: `-${EDGE_BLEED}`, marginRight: `-${EDGE_BLEED}` }}
    >
      {items.map((src, i) => (
        <div key={i} className="aspect-square">
          <img
            src={src}
            alt=""
            className={`animate-drop-in h-full w-full object-contain ${BLOB_SCALE}`}
            style={{ animationDelay: `${(i + offset) * 60}ms` }}
          />
        </div>
      ))}
    </div>
  )
}

export function LandingPage() {
  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #070510 0%, #0a0714 42%, #2c1578 76%, #6b30d6 100%)',
      }}
    >
      {/* 위에서 떨어지는 블롭 (윗줄 상단 잘림, 두 줄은 겹쳐 붙음, 좌우 끝은 화면 밖) */}
      <div
        className="pointer-events-none absolute inset-x-0"
        style={{ top: `-${TOP_CLIP}` }}
      >
        <BlobRow items={ROW1} offset={0} />
        <div style={{ marginTop: `-${ROW_OVERLAP}` }}>
          <BlobRow items={ROW2} offset={6} />
        </div>
      </div>

      {/* CTA + 타이틀 */}
      <div className="absolute inset-x-0 bottom-[7%] flex flex-col items-center px-6">
        <Link
          to="/intro"
          className="rounded-full border border-white/10 bg-white/[0.07] px-8 py-3.5 text-lg font-medium tracking-[0.02em] text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/20"
        >
          Let&apos;s get started
        </Link>
        <img
          src={landingTitle}
          alt="Flow with NURO"
          className="mt-8 w-[90%] max-w-7xl"
        />
      </div>
    </div>
  )
}
