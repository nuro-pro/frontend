# nuro-fe

**nuro** — AI 피부 진단 웹 서비스의 프론트엔드.
사용자가 피부 사진을 업로드하면 비전 LLM이 분석해 구조화된 진단 결과를 반환한다.

> 진단 결과는 참고용이며 의학적 진단이 아니다. UI에 면책 문구를 반드시 노출한다.

## 기술 스택

- React 19 + TypeScript
- Vite (빌드/dev 서버), 배포: Vercel
- Tailwind CSS v4 (`@tailwindcss/vite`)
- axios (API 클라이언트)
- ESLint + Prettier

## 시작하기

```bash
# Node 버전 (fnm 사용 시 자동 적용; .node-version 참조)
fnm use

npm install
npm run dev      # http://localhost:5173
```

## 스크립트

| 명령                   | 설명                     |
| ---------------------- | ------------------------ |
| `npm run dev`          | 개발 서버                |
| `npm run build`        | 타입체크 + 프로덕션 빌드 |
| `npm run preview`      | 빌드 결과 미리보기       |
| `npm run lint`         | ESLint                   |
| `npm run lint:fix`     | ESLint 자동 수정         |
| `npm run format`       | Prettier 포맷 적용       |
| `npm run format:check` | 포맷 검사 (CI용)         |
| `npm run typecheck`    | 타입 검사만              |

## 백엔드 연동 (nuro-be)

- 모든 엔드포인트는 `/api/v1/...` prefix.
- 모든 응답은 `CommonResponse` 래퍼로 감싸짐:
  - 성공: `{ "message": "success", "data": {...} }` (data 없을 수도 있음)
  - 에러: `{ "errorCode": 4040, "message": "..." }` — message는 한글, 사용자 노출 가능.
- 이미지 업로드는 `multipart/form-data` (JSON body 아님). 파일 10MB / 요청 12MB 초과 시 400.
- 인증/로그인 체계는 아직 없음.
- 실제 API 스펙은 항상 Swagger 기준으로 확인:
  - Swagger UI: http://localhost:8080/swagger-ui.html
  - Health: http://localhost:8080/actuator/health

### 환경변수

`.env.example` 참고. 로컬에서는 `VITE_API_BASE_URL`을 비워두면 `/api/v1`로 요청되고
Vite dev 프록시(`vite.config.ts`)가 `localhost:8080`으로 포워딩한다.
운영(Vercel)에서는 백엔드 절대 URL을 설정한다.

## 디렉토리 구조

```
src/
  api/                 공통 API 클라이언트 (axios 인스턴스, CommonResponse/에러 정규화)
    client.ts
    types.ts           CommonResponse, ApiError
  features/
    diagnosis/         진단 도메인 (API 호출, 타입) — 스키마는 Swagger 확정 후 갱신
  components/          공용 UI 컴포넌트
  lib/                 상수/유틸 (용량 한도, 면책 문구 등)
  types/               전역 타입
  assets/              정적 에셋
```
