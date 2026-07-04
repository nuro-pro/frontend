import { PageHeader } from './components/PageHeader'
import { useState } from 'react'
import type { Ingredient} from './types'
import { inputStyle } from './components/inputstyle'
import { addIngredient, deleteIngredient } from './api'
import { Btn } from './components/Btn'

//form에서 enum? 구현...

const EWG_COLOR: Record<number, string> = {
  1: '#22c55e',
  2: '#86efac',
  3: '#facc15',
  4: '#f97316',
  5: '#ef4444',
}

export function IngredientsTab({ ingredients }: { ingredients: Ingredient[] }) {
  const [ingredientsState, setIngredients] = useState<Ingredient[]>(ingredients)
  const [search, setSearch] = useState('')

  const filtered = ingredientsState.filter(
    (i) =>
      i.korName.includes(search) ||
      i.engName.toLowerCase().includes(search.toLowerCase())
  )

    const deleteIngredientHandler = (ingredientId: number) => {
      if (!confirm('이 성분을 삭제할까요?')) return
      setIngredients((prev) =>
        prev.filter((i) => i.ingredientId !== ingredientId)
      )
      deleteIngredient(ingredientId)
    }

  const [showAdd, setShowAdd] = useState(false)

  const [newIngredient, setNewIngredient] = useState({
    korName: '',
    engName: '',
    ewgGrade: 1,
    riskLevel: '',
    dataLevel: '',
    desc: '',
    effects: '',
    howToUse: '',
    tip: '',
  })

    const isValid =
      newIngredient.korName.trim() &&
      newIngredient.engName.trim() &&
      newIngredient.riskLevel.trim() &&
      newIngredient.dataLevel.trim() &&
      newIngredient.desc.trim() &&
      newIngredient.effects.trim() &&
      newIngredient.howToUse.trim() &&
      newIngredient.tip.trim()

  const handleAddIngredient = async () => {
    try {
      const result = await addIngredient({
        ...newIngredient,
        effects: newIngredient.effects
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
      })
      if (result.data === undefined) {
      throw new Error('질문 ID를 받지 못했습니다.')
    }

      alert('성분이 추가되었습니다.')
      const newI: Ingredient = {
        ingredientId: result.data,
        korName: newIngredient.korName,
        engName: newIngredient.engName,
        ewgGrade: newIngredient.ewgGrade,
        riskLevel: newIngredient.riskLevel,
        dataLevel: newIngredient.dataLevel,
        desc: newIngredient.desc,
        effects: newIngredient.effects
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
        howToUse: newIngredient.howToUse,
        tip: newIngredient.tip,
      }
      setIngredients((prev) => [...prev, newI])

      setShowAdd(false)

      setNewIngredient({
        korName: '',
        engName: '',
        ewgGrade: 1,
        riskLevel: '',
        dataLevel: '',
        desc: '',
        effects: '',
        howToUse: '',
        tip: '',
      })
    } catch (e) {
      console.error(e)
      alert('성분 추가 실패')
    }
  }

  return (
    <div>
      <PageHeader
        title="성분 관리"
        subtitle={`총 ${ingredientsState.length}개 성분`}
        action={<Btn variant="primary" onClick={() => setShowAdd((prev) => !prev)}>{showAdd ? '취소' : '+ 성분 추가'}</Btn>}
      />
          {showAdd && (
      <div
        style={{
          background: '#fff',
          padding: 20,
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          marginBottom: 20,
          display: 'grid',
          gap: 12,
        }}
      >
        <input
          placeholder="한글명"
          style={inputStyle}
          value={newIngredient.korName}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, korName: e.target.value })
          }
        />

        <input
          placeholder="영문명"
          style={inputStyle}
          value={newIngredient.engName}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, engName: e.target.value })
          }
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="number"
            min={1}
            max={5}
            placeholder="EWG 등급 (1~5)"
            style={inputStyle}
            value={newIngredient.ewgGrade}
            onChange={(e) =>
              setNewIngredient({
                ...newIngredient,
                ewgGrade: Number(e.target.value),
              })
            }
          />

          <span style={{ fontSize: 12, color: '#64748b' }}>
            EWG 등급
          </span>
        </div>

        <input
          placeholder="위험도"
          style={inputStyle}
          value={newIngredient.riskLevel}
          onChange={(e) =>
            setNewIngredient({
              ...newIngredient,
              riskLevel: e.target.value,
            })
          }
        />

        <input
          placeholder="데이터 수준"
          style={inputStyle}
          value={newIngredient.dataLevel}
          onChange={(e) =>
            setNewIngredient({
              ...newIngredient,
              dataLevel: e.target.value,
            })
          }
        />

        <textarea
          placeholder="설명"
          style={inputStyle}
          value={newIngredient.desc}
          onChange={(e) =>
            setNewIngredient({
              ...newIngredient,
              desc: e.target.value,
            })
          }
        />

        <input
          placeholder="효과 (쉼표로 구분)"
          style={inputStyle}
          value={newIngredient.effects}
          onChange={(e) =>
            setNewIngredient({
              ...newIngredient,
              effects: e.target.value,
            })
          }
        />

        <textarea
          placeholder="사용법"
          style={inputStyle}
          value={newIngredient.howToUse}
          onChange={(e) =>
            setNewIngredient({
              ...newIngredient,
              howToUse: e.target.value,
            })
          }
        />

        <textarea
          placeholder="팁"
          style={inputStyle}
          value={newIngredient.tip}
          onChange={(e) =>
            setNewIngredient({
              ...newIngredient,
              tip: e.target.value,
            })
          }
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="primary" onClick={handleAddIngredient} disabled={!isValid}>
            저장
          </Btn>
        </div>
      </div>
    )}

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="성분명 검색"
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
              <tr key={i.ingredientId} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
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
                      <span key={`${i.ingredientId}-${e}`} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 99, background: '#f3f0ff', color: '#7c3aed', fontWeight: 500 }}>
                        {e}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <Btn variant="danger" onClick={() => deleteIngredientHandler(i.ingredientId)}>삭제</Btn>
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