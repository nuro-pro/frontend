import { useState, useEffect } from 'react'
import { PageHeader } from './components/PageHeader'
import { Card } from './components/Card'
import { Btn } from './components/Btn'
import type { Question, Ingredient, TabId, Option } from './types'
import { getAdminData } from './api'

const EWG_COLOR: Record<number, string> = {
  1: '#22c55e',
  2: '#86efac',
  3: '#facc15',
  4: '#f97316',
  5: '#ef4444',
}

const NAV_ITEMS: { id: TabId; label: string }[] = [
  { id: 'survey', label: '설문 관리' },
  { id: 'ingredients', label: '성분 관리' },
]

// ===================== 메인 =====================
export function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('survey')
  
  const [ survey, setSurvey ] = useState<Question[]>([])
  const [ ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    let cancelled = false;

    async function fetchAdminData() {
      try {
        const data = await getAdminData();
        if (!cancelled) {
          setSurvey(data.survey);
          setIngredients(data.ingredients);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
        setLoading(false);
      }
    }
    
    fetchAdminData();
    return () => { cancelled = true; }
  }, []);

    if (loading) return <div>로딩 중...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Noto Sans KR', sans-serif", background: '#f8fafc', color: '#0f172a' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#8b6cff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Nuro</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>관리자</div>
        </div>
        <nav style={{ flex: 1, padding: '12px' }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 14px', borderRadius: 8, border: 'none',
                fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400,
                background: activeTab === item.id ? '#f3f0ff' : 'transparent',
                color: activeTab === item.id ? '#8b6cff' : '#475569',
                cursor: 'pointer', marginBottom: 2, transition: 'all 0.15s',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', fontSize: 12, color: '#94a3b8' }}>
          Nuro Admin v1.0
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        {activeTab === 'survey' && <SurveyTab surveyData={survey} />}
        {activeTab === 'ingredients' && <IngredientsTab ingredients={ingredients} />}
      </main>
    </div>
  )
}

// ===================== 설문 관리 탭 =====================
function SurveyTab({ surveyData }: { surveyData: Question[] }) {
  const [ survey, setSurvey ] = useState<Question[]>(surveyData)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswers, setNewAnswers] = useState<Record<number, string>>({})
  const [showAddQuestion, setShowAddQuestion] = useState(false)

  const deleteQuestion = (id: number) => {
    if (!confirm('이 문항을 삭제할까요?')) return
    setSurvey((prev) => prev.filter((q) => q.questionId !== id))
    // TODO: DELETE /api/v1/surveys/admin/questions/{id}
  }

  const addQuestion = () => {
    if (!newQuestion.trim()) return
    const newQ: Question = { questionId: Date.now(), question: newQuestion.trim(), options: [] }
    setSurvey((prev) => [...prev, newQ])
    setNewQuestion('')
    setShowAddQuestion(false)
    // TODO: POST /api/v1/surveys/admin/questions/add { comment: newQuestion }
  }

  const deleteAnswer = (questionId: number, answerId: number) => {
    setSurvey((prev) =>
      prev.map((q) =>
        q.questionId === questionId ? { ...q, options: q.options.filter((a) => a.answerId !== answerId) } : q
      )
    )
    // TODO: DELETE /api/v1/surveys/admin/answers/{answerId}
  }

  const addAnswer = (questionId: number) => {
    const text = newAnswers[questionId]?.trim()
    if (!text) return
    const newA: Option = { answerId: Date.now(), comment: text }
    setSurvey((prev) =>
      prev.map((q) =>
        q.questionId === questionId ? { ...q, options: [...q.options, newA] } : q
      )
    )
    setNewAnswers((prev) => ({ ...prev, [questionId]: '' }))
    // TODO: POST /api/v1/surveys/admin/answers/add { questionId, comment: text }
  }

  return (
    <div>
      <PageHeader
        title="설문 관리"
        subtitle={`총 ${survey.length}개 문항`}
        action={<Btn variant="primary" onClick={() => setShowAddQuestion(true)}>+ 문항 추가</Btn>}
      />

      {showAddQuestion && (
        <Card style={{ marginBottom: 16, background: '#f3f0ff', border: '1px solid #c4b5fd' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#7c3aed' }}>새 문항</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
              placeholder="문항 내용을 입력하세요"
              style={inputStyle}
            />
            <Btn variant="primary" onClick={addQuestion}>저장</Btn>
            <Btn variant="ghost" onClick={() => { setShowAddQuestion(false); setNewQuestion('') }}>취소</Btn>
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(survey || []).map((q, idx) => (
          <Card key={q.questionId}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#8b6cff', background: '#f3f0ff', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap', marginTop: 1 }}>
                  Q{idx + 1}
                </span>
                <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>{q.question}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}> 
                <Btn variant="ghost" onClick={() => setExpandedId(expandedId === q.questionId ? null : q.questionId)}>
                  {expandedId === q.questionId ? '접기' : `선택지 ${q.options.length}개`}
                </Btn>
                <Btn variant="danger" onClick={() => deleteQuestion(q.questionId)}>삭제</Btn>
              </div>
            </div>

            {expandedId === q.questionId && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>선택지</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                  {q.options.map((a) => (
                    <div key={a.answerId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', borderRadius: 8, padding: '8px 12px' }}>
                      <span style={{ fontSize: 14 }}>{a.comment}</span>
                      <Btn variant="danger" onClick={() => deleteAnswer(q.questionId, a.answerId)}>삭제</Btn>
                    </div>
                  ))}
                  {q.options.length === 0 && (
                    <div style={{ fontSize: 13, color: '#94a3b8', padding: '8px 0' }}>선택지가 없어요.</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={newAnswers[q.questionId] ?? ''}
                    onChange={(e) => setNewAnswers((prev) => ({ ...prev, [q.questionId]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && addAnswer(q.questionId)}
                    placeholder="선택지 추가"
                    style={{ ...inputStyle, fontSize: 13 }}
                  />
                  <Btn variant="primary" onClick={() => addAnswer(q.questionId)}>추가</Btn>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

// ===================== 성분 관리 탭 =====================
function IngredientsTab({ ingredients }: { ingredients: Ingredient[] }) {
  const [search, setSearch] = useState('')

  const filtered = ingredients.filter(
    (i) =>
      i.korName.includes(search) ||
      i.engName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="성분 관리"
        subtitle={`총 ${ingredients.length}개 성분`}
      />

      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="성분명 검색 (한글/영문)"
          style={{ ...inputStyle, maxWidth: 320 }}
        />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['한글명', '영문명', 'EWG 등급', '위험도', '효과'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((i, idx) => (
              <tr key={i.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{i.korName}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{i.engName}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: '50%',
                    background: EWG_COLOR[i.ewgGrade] ?? '#e2e8f0',
                    color: '#fff', fontWeight: 700, fontSize: 13,
                  }}>
                    {i.ewgGrade}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                    background: i.riskLevel === '낮음' ? '#dcfce7' : i.riskLevel === '보통' ? '#fef9c3' : '#fee2e2',
                    color: i.riskLevel === '낮음' ? '#16a34a' : i.riskLevel === '보통' ? '#ca8a04' : '#dc2626',
                  }}>
                    {i.riskLevel}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {i.effects.map((e) => (
                      <span key={e} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 99, background: '#f3f0ff', color: '#7c3aed', fontWeight: 500 }}>
                        {e}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                  검색 결과가 없어요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


const inputStyle: React.CSSProperties = {
  flex: 1, padding: '9px 13px', borderRadius: 8, border: '1px solid #e2e8f0',
  fontSize: 14, outline: 'none', background: '#fff', color: '#0f172a',
  width: '100%', boxSizing: 'border-box',
}