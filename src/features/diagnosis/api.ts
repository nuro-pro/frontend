import { api, unwrap } from '@/api/client'
import type { CommonResponse } from '@/api/types'
import { MAX_FILE_BYTES } from '@/lib/constants'
import { ApiError } from '@/api/types'
import type { DiagnosisResult, SurveyAnswerItem } from './types'

/**
 * multipart 파일 파트 이름.
 */
const FILE_PART_NAME = 'image'

export async function createDiagnosis(
  userId: number,
  file: File,
  answers: SurveyAnswerItem[],
): Promise<DiagnosisResult> {
  if (file.size > MAX_FILE_BYTES) {
    throw new ApiError('이미지 용량은 10MB를 넘을 수 없어요.')
  }

  const form = new FormData()
  form.append(FILE_PART_NAME, file)

  const surveyPayload = {
    answers: answers
  }

  form.append(
    'survey',
    new Blob(
      [
        JSON.stringify(surveyPayload),
      ],
      { type: 'application/json' },
    ),
  )

  const { data } = await api.post<CommonResponse<DiagnosisResult>>(
    `/diagnoses?userId=${userId}`, //이게 보내는 부분
    form,
  )

  const result = unwrap(data)
  if (!result) {
    throw new ApiError('진단 결과를 받지 못했어요. 다시 시도해 주세요.')
  }
  return result
}

export async function fetchDiagnosis(id: number) {
  const res = await api.get(`/diagnoses/${id}`)
  return res.data.data
}