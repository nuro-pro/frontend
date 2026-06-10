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

> 터미널(맥: `터미널`, 윈도우: `PowerShell` 또는 `Git Bash`)에서 진행합니다.
> 명령어 한 줄씩 복사해서 붙여넣고 Enter 치면 됩니다.

### 0. 사전 준비 — Node.js 설치 (최초 1회)

이 프로젝트는 **Node.js 24 (LTS)** 버전을 사용합니다. 설치 여부 확인:

```bash
node -v        # v24.x.x 처럼 나오면 OK. "command not found" 면 아래로.
```

설치가 안 되어 있다면 둘 중 하나:

- **간단한 방법**: [nodejs.org](https://nodejs.org) 에서 LTS 버전을 받아 설치.
- **버전 관리까지 하고 싶다면(권장)**: `fnm` 사용.
  ```bash
  # macOS (Homebrew 필요)
  brew install fnm
  # 셸 설정에 fnm 자동 로딩 추가 (zsh 기준, 최초 1회)
  echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
  # 터미널을 껐다 켠 뒤, 프로젝트 폴더에서:
  fnm install        # .node-version에 적힌 버전 자동 설치
  fnm use            # 그 버전으로 전환
  ```

### 1. 프로젝트 받기 (최초 1회)

```bash
git clone https://github.com/nuro-pro/frontend.git
cd frontend
```

### 2. 의존성 설치 (최초 1회 / package.json 바뀔 때마다)

```bash
npm install
```

### 3. 개발 서버 실행 (매번 개발할 때)

```bash
npm run dev
```

- 실행되면 터미널에 `Local: http://localhost:5173/` 가 뜹니다.
- 브라우저에서 **http://localhost:5173** 를 열면 화면이 보입니다.
- 코드를 저장하면 **새로고침 없이 화면이 자동 갱신**됩니다 (HMR).
- **서버 끄기**: 터미널에서 `Ctrl + C`.

> 💡 API(진단 요청)까지 실제로 테스트하려면 백엔드(nuro-be)도 같이
> `http://localhost:8080` 에 떠 있어야 합니다. 백엔드 없이도 화면 자체는 열립니다.

### 자주 묻는 문제

| 증상                                  | 해결                                                                 |
| ------------------------------------- | -------------------------------------------------------------------- |
| `command not found: node` / `npm`     | 0번(Node 설치)부터. fnm 쓰면 터미널 껐다 켜야 적용됨.                |
| `5173 포트가 이미 사용 중`            | 기존 dev 서버를 `Ctrl + C`로 끄거나, 새 포트로 열림(터미널 주소 확인). |
| 화면은 뜨는데 진단 API가 안 됨         | 백엔드가 `localhost:8080`에 떠 있는지 확인 (위 💡 참고).             |
| 패키지 에러가 계속 남                  | `rm -rf node_modules package-lock.json && npm install` 후 재시도.    |

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
