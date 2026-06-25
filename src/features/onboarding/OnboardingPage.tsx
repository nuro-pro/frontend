import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export function OnboardingPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [age, setAge] = useState('')

  const canSubmit = nickname.trim() !== '' && age.trim() !== ''

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    // TODO: 입력값(닉네임/나이)을 진단 플로우 상태로 전달
    navigate('/ready')
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 sm:p-8"
      >
        <h1 className="text-center text-lg font-semibold text-white sm:text-xl">
          먼저, 어떻게 불러드릴까요?
        </h1>

        <div className="mt-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="nickname" className="block text-sm text-white/70">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예) 옹가니"
              className="w-full rounded-xl bg-black/30 px-4 py-3 text-white ring-1 ring-white/10 outline-none placeholder:text-white/30 focus:ring-2 focus:ring-[#8b6cff]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm text-white/70">
              나이
            </label>
            <input
              id="age"
              type="text"
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))}
              placeholder="예) 24"
              className="w-full rounded-xl bg-black/30 px-4 py-3 text-white ring-1 ring-white/10 outline-none placeholder:text-white/30 focus:ring-2 focus:ring-[#8b6cff]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-8 w-full rounded-xl bg-gradient-to-b from-[#8b6cff] to-[#6a3fce] px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#6a3fce]/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          다음
        </button>

        <p className="mt-4 text-center text-xs text-white/40">
          입력한 정보는 또래 통계 비교와 결과 저장에만 사용돼요.
        </p>
      </form>
    </div>
  )
}
