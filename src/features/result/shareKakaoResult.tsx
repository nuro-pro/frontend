interface DiagnosisResult {
  shareId: string
  userNickname: string
  summary: string
  userImage?: string | null
}

export function shareKakaoResult(result: DiagnosisResult) {
  const url = `${window.location.origin}/result/${result.shareId}`
  const API_BASE = import.meta.env.VITE_API_URL ?? window.location.origin

  const imageUrl = result.userImage
    ? result.userImage.startsWith('http')
      ? result.userImage // 이미 완전한 URL이면 그대로
      : `${API_BASE}${result.userImage}` // 경로 조각이면 도메인 붙이기
    : 'https://via.placeholder.com/300'

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `${result.userNickname}님의 피부 진단 결과`,
      description: result.summary,
      imageUrl: imageUrl,
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
  })

  return url
}
