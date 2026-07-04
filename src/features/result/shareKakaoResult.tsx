interface DiagnosisResult {
  shareId: string
  userNickname: string
  summary: string
  userImage?: string | null
}

export function shareKakaoResult(result: DiagnosisResult) {
  const url = `${window.location.origin}/result/${result.shareId}`

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `${result.userNickname}님의 피부 진단 결과`,
      description: result.summary,
      imageUrl: result.userImage
        ? `http://localhost:8080${result.userImage}`
        : 'https://via.placeholder.com/300',
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
  })

  return url
}