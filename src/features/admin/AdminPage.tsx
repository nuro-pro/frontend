import { useState, useEffect } from 'react'
import { SurveyTab } from './SurveyTab'
import type { Question, Ingredient, TabId } from './types'
import { getAdminData } from './api'
import { IngredientsTab } from './IngredientsTab'

const NAV_ITEMS: { id: TabId; label: string }[] = [
  { id: 'survey', label: '설문 관리' },
  { id: 'ingredients', label: '성분 관리' },
]

// ===================== 메인 =====================
export function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('survey')

  const [survey, setSurvey] = useState<Question[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false

    async function fetchAdminData() {
      try {
        const data = await getAdminData()
        if (!cancelled) {
          setSurvey(data.survey)
          setIngredients(data.ingredients)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err)
        setLoading(false)
      }
    }

    fetchAdminData()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <div>로딩 중...</div>

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'Inter', 'Noto Sans KR', sans-serif",
        background: '#f8fafc',
        color: '#0f172a',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: '#fff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '28px 24px 20px',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#8b6cff',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Nuro
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
            관리자
          </div>
        </div>
        <nav style={{ flex: 1, padding: '12px' }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                fontSize: 14,
                fontWeight: activeTab === item.id ? 600 : 400,
                background: activeTab === item.id ? '#f3f0ff' : 'transparent',
                color: activeTab === item.id ? '#8b6cff' : '#475569',
                cursor: 'pointer',
                marginBottom: 2,
                transition: 'all 0.15s',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            fontSize: 12,
            color: '#94a3b8',
          }}
        >
          Nuro Admin v1.0
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        {activeTab === 'survey' && <SurveyTab surveyData={survey} />}
        {activeTab === 'ingredients' && (
          <IngredientsTab ingredients={ingredients} />
        )}
      </main>
    </div>
  )
}
