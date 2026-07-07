import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'
import { createUser } from './api'
import { ApiError } from '@/api/types'

export function OnboardingPage() {
  const navigate = useNavigate()
  const { setUserId, setUserInfo, reset } = useDiagnosis()
  const [nickname, setNickname] = useState('')
  const [age, setAge] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string>()

  useEffect(() => {
    reset()
  }, [])

  const loading = status === 'loading'
  const canSubmit = nickname.trim() !== '' && age.trim() !== '' && !loading

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    try {
      setStatus('loading')
      setError(undefined)
      const user = await createUser(nickname.trim(), Number(age))
      setUserId(user.id)
      setUserInfo({ name: nickname.trim(), age: Number(age) })
      navigate('/ready')
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : '잠시 후 다시 시도해 주세요.',
      )
      setStatus('error')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4">
        <p className="text-[#FEFEFE] text-3xl">먼저, 어떻게 불러드릴까요?</p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-lg flex-col text-[#FEFEFE] gap-10 mt-10 text-left"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예) 윤기니"
              autoComplete="off"
              className="py-5 px-5 text-[13px] text-[#FEFEFE] placeholder:text-[#888888] border border-[#2d253e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f4fff]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="age">나이</label>
            <input
              id="age"
              type="text"
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))}
              placeholder="예) 25"
              autoComplete="off"
              className="py-5 px-5 text-[13px] text-[#FEFEFE] placeholder:text-[#888888] border border-[#2d253e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f4fff]"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="bg-[#7f4fff] text-[#FEFEFE] rounded-lg py-4 px-4 mt-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? '저장 중…' : '다음'}
          </button>

          {error && (
            <p className="text-[13px] text-[#ff8f8f]" role="alert">
              {error}
            </p>
          )}
        </form>

        <p className="text-[13px] text-[#8e8d8e]">
          * 입력한 정보는 또래 통계 비교와 결과 저장에만 사용돼요.
        </p>
      </div>
    </div>
  )
}
