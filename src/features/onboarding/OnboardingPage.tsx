import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDiagnosis } from '@/features/diagnosis/useDiagnosis'

export function OnboardingPage() {
  const navigate = useNavigate()
  const { setUserInfo } = useDiagnosis()
  const [nickname, setNickname] = useState('')
  const [age, setAge] = useState('')

  const canSubmit = nickname.trim() !== '' && age.trim() !== ''

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    setUserInfo({ name: nickname, age: Number(age) })  
    navigate('/ready')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-[#FEFEFE] text-3xl">먼저, 어떻게 불러드릴까요?</p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col text-[#FEFEFE] gap-10 mt-10 w-6/4 text-left"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예) 윤기니"
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
              className="py-5 px-5 text-[13px] text-[#FEFEFE] placeholder:text-[#888888] border border-[#2d253e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f4fff]"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="bg-[#7f4fff] text-[#FEFEFE] rounded-lg py-4 px-4 mt-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
          </button>
        </form>

        <p className="text-[13px] text-[#8e8d8e]">
          * 입력한 정보는 또래 통계 비교와 결과 저장에만 사용돼요.
        </p>
      </div>
    </div>
  )
}
