// 사용자 등록 응답 (POST /users). userId 식별자로 진단
export interface User {
  id: number
  username: string | null
  nickname: string
  age: number
}
