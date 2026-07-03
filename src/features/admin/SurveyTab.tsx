import { useState } from 'react'
import { Card } from './components/Card'
import { Btn } from './components/Btn'
import { inputStyle } from './components/inputstyle'
import { PageHeader } from './components/PageHeader'
import { deleteSurveyQuestion, addSurveyQuestion, deleteSurveyAnswer, addSurveyAnswer } from './api'
import type { Question, Option } from './types'

export function SurveyTab({ surveyData }: { surveyData: Question[] }) {
  const [ survey, setSurvey ] = useState<Question[]>(surveyData)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswers, setNewAnswers] = useState<Record<number, string>>({})
  const [showAddQuestion, setShowAddQuestion] = useState(false)

  const deleteQuestion = (id: number) => {
    if (!confirm('이 문항을 삭제할까요?')) return
    setSurvey((prev) => prev.filter((q) => q.questionId !== id))
    deleteSurveyQuestion(id)
  }

  const addQuestion = async () => {
    if (!newQuestion.trim()) return
    try{
      const response = await addSurveyQuestion({ comment: newQuestion.trim() })
    if (response.data === undefined) {
      throw new Error('질문 ID를 받지 못했습니다.')
    }
      const newQ: Question = { questionId: response.data, question: newQuestion.trim(), options: [] }
      setSurvey((prev) => [...prev, newQ])
      setNewQuestion('')
      setShowAddQuestion(false)
    } catch (error) {
      console.error('Error adding survey question:', error)
    }
  }

  const deleteAnswer = (questionId: number, answerId: number) => {
    setSurvey((prev) =>
      prev.map((q) =>
        q.questionId === questionId ? { ...q, options: q.options.filter((a) => a.answerId !== answerId) } : q
      )
    )
    deleteSurveyAnswer(answerId)
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
    addSurveyAnswer({ questionId, comment: text })
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