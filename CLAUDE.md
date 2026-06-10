# CLAUDE.md — nuro-fe (AI 피부 진단 프론트엔드)

> Claude Code가 매 세션 자동으로 읽는다. **신규 코드는 이 문서의 룰을 따른다.** 기존 코드와 충돌하면 **본 문서가 우선**이며 기존 코드는 점진적 마이그레이션 대상. 룰을 어길 정당한 사유가 있으면 PR 설명에 명시한다.
>
> ⚠️ 이 프로젝트는 **초기 단계(그린필드)** 다. 아직 화면 코드는 거의 없고 `api/` 클라이언트 레이어와 `features/diagnosis/` 골격, `lib/constants`만 존재한다. 본 문서는 (a) **이미 있는 코드의 실제 컨벤션**과 (b) **앞으로 화면·기능을 추가할 때의 표준**을 함께 정의한다. "표준"이라고 적힌 항목은 아직 코드에 없더라도 신규 코드가 따라야 할 규칙이다.
>
> 🚫 **존재하지 않는 인프라(라우터, 상태관리 라이브러리, 데이터 페칭 라이브러리, 테스트 프레임워크, 폼/검증 라이브러리, UI 컴포넌트 키트 등)를 임의로 도입(`npm install`)하지 말 것.** 필요하면 **먼저 묻는다**(§17). 의존성 추가는 곧 팀 전체의 학습·유지보수 비용이다.
>
> 프론트 관행상 당연한 것도 모호하면 한 번 더 확인한다.

---

## 1. 프로젝트 개요

**서비스**: nuro — AI 피부 진단 웹 서비스의 **프론트엔드(SPA)**.
**핵심 플로우**: `사용자가 피부 사진 업로드 → 백엔드(nuro-be) API 호출(multipart) → 비전 LLM이 분석한 구조화된 진단 결과 수신 → 화면에 렌더링`.
**MVP 범위**: `사진 선택/업로드 UI → 진단 요청 → 결과 표시(면책 문구 포함)` 의 end-to-end 동작.
**확장 예정(현재 범위 아님)**: 성분 카드 · 제품 추천 · 루틴 · 사용자 계정/히스토리 등. 지금은 **진단 1-shot 플로우**에 집중한다.

> ⚖️ **면책 의무**: 진단 결과는 참고용이며 의학적 진단이 아니다. **결과를 보여주는 모든 화면에 면책 문구(`DISCLAIMER`)를 반드시 노출**한다. 백엔드가 `disclaimer`를 같이 내려주면 그 값을, 없으면 `@/lib/constants`의 `DISCLAIMER`를 쓴다.

**백엔드 연동 계약 요약**(상세는 §6):
- 모든 엔드포인트는 `/api/v1/...` prefix.
- 모든 응답은 `CommonResponse` 래퍼: 성공 `{ "message": "success", "data": {...} }` / 에러 `{ "errorCode": 4040, "message": "..." }`.
- 에러 `message`는 **한글이며 그대로 사용자에게 노출 가능**.
- 진단 이미지 업로드는 **`multipart/form-data`**(JSON body 아님). 파일 10MB / 요청 12MB 초과 시 400.
- **실제 API 스펙의 단일 소스(SSOT)는 백엔드 Swagger**: `http://localhost:8080/swagger-ui.html`. 타입을 손으로 적기 전에 항상 Swagger를 먼저 확인한다.

---

## 2. 기술 스택 (변경 시 주의)

| 분류 | 사용 기술 | 비고 |
|---|---|---|
| 런타임 | **Node.js 24.16.0** (`.node-version`) | `fnm`/`nvm` 권장. CI/배포도 24 LTS. |
| 패키지 매니저 | **npm** (`package-lock.json`) | yarn/pnpm 섞지 말 것. lockfile은 npm 기준. |
| 언어 | **TypeScript ~6.0** | strict bundler 모드(§5). `any` 지양. |
| UI | **React 19.2** (`react`/`react-dom`) | 함수형 컴포넌트 + 훅만. RSC/SSR 아님(순수 CSR SPA). |
| 빌드/dev | **Vite 8** (`@vitejs/plugin-react`) | dev 서버 `5173`, dev 프록시로 `/api` → `:8080`. |
| 스타일 | **Tailwind CSS v4** (`@tailwindcss/vite`) | **CSS-first 설정** — `tailwind.config.js` 없음(§9). |
| HTTP | **axios 1.17** | 단일 인스턴스 + 인터셉터(`src/api/client.ts`). |
| 린트/포맷 | **ESLint 10**(flat config) + **Prettier 3.8** | §10. |
| 배포 | **Vercel** | SPA. 환경변수는 Vercel 대시보드에서 주입. |

**기본 import 별칭**: `@/` → `src/` (예: `import { api } from '@/api/client'`). 상대경로 `../../`보다 `@/`를 쓴다.

### 아직 없는 것 (임의 도입 금지 — 필요 시 §17대로 먼저 논의)
- **라우터** (`react-router` 등) — 현재 단일 화면. 화면이 2개 이상 필요해지면 그때 논의.
- **전역 상태관리** (`zustand`/`redux`/`jotai` 등) — 아직 불필요. 우선 `useState`/`useReducer`/props로 해결.
- **서버 상태/데이터 페칭 라이브러리** (`@tanstack/react-query`/`swr` 등) — 현재 axios 직접 호출. 캐싱/재시도/로딩 상태 관리가 본격적으로 필요해지면 논의.
- **폼/검증 라이브러리** (`react-hook-form`/`zod` 등) — 현재 폼이 단순(파일 1개). 복잡한 폼이 생기면 논의.
- **테스트 프레임워크** (`vitest`/`@testing-library/react` 등) — 아직 미설정(§13).
- **UI 컴포넌트 키트** (`shadcn/ui`/MUI/Radix 등) — 현재 Tailwind 유틸리티만으로 작성.
- **상태/디자인 도구** (Storybook 등).

> 위 중 하나가 정말 필요하다고 판단되면, **설치하기 전에** "왜 필요한지 / 대안은 / 번들·학습 비용"을 한 줄로 정리해 사용자에게 묻는다.

---

## 3. 빌드 / 실행 / 검증

```bash
npm install            # 의존성 설치 (최초 1회 / package.json 바뀔 때마다)

npm run dev            # 개발 서버 (http://localhost:5173, HMR)
npm run build          # tsc -b (타입체크) + vite build → dist/
npm run preview        # 빌드 결과 로컬 미리보기
npm run lint           # ESLint
npm run lint:fix       # ESLint 자동 수정
npm run format         # Prettier 포맷 적용
npm run format:check   # 포맷 검사 (CI용, 쓰지 않음)
npm run typecheck      # tsc -b --noEmit (타입만 검사)
```

> 💡 진단 API까지 실제로 동작시키려면 백엔드(nuro-be)가 `http://localhost:8080`에 떠 있어야 한다. 백엔드 없이도 **화면 자체는 뜬다**(API 호출만 실패).

### 코드 수정 후 검증 체크리스트 (매번)
1. **`npm run typecheck` 통과** — 타입 에러 0. (TS 설정이 엄격해서 미사용 변수·import만 있어도 실패한다.)
2. **`npm run lint` 통과** — 경고/에러 0. 못 고치겠으면 무시(`eslint-disable`)하기 전에 사유를 주석/PR에 남긴다.
3. **`npm run format` 적용** — 포맷 자동 정리.
4. **UI 변경이면 `npm run dev`로 눈으로 확인** — 콘솔 에러 없는지, 면책 문구 노출되는지.
5. **빌드가 깨질 만한 변경이면 `npm run build`까지** 돌려본다(타입체크가 build에 포함됨).

> ⛔ **`npm run typecheck`와 `npm run lint`가 통과하지 않은 코드는 "완료"가 아니다.** 작업을 끝내기 전에 반드시 돌린다.

---

## 4. 환경변수 / API 베이스 URL / 프록시

- **Vite 환경변수는 `VITE_` prefix만 클라이언트에 노출된다.** 그 외 변수는 번들에 들어가지 않는다. **시크릿(키 등)을 `VITE_*`에 넣지 말 것** — 프론트 번들은 누구나 볼 수 있다.
- 현재 유일한 환경변수: **`VITE_API_BASE_URL`** (`src/vite-env.d.ts`에 타입 선언됨).

| 환경 | `VITE_API_BASE_URL` | 실제 요청 경로 | CORS |
|---|---|---|---|
| 로컬(dev) | **비워둠** | `/api/v1/...` | Vite dev 프록시가 `/api` → `http://localhost:8080`로 포워딩(§`vite.config.ts`) |
| 운영(Vercel) | 백엔드 절대 URL (예: `https://api.example.com/api/v1`) | 그 절대 URL | 백엔드 CORS 설정에 의존 |

- 로컬에서 `api` 인스턴스의 `baseURL`은 `import.meta.env.VITE_API_BASE_URL ?? '/api/v1'` (`src/api/client.ts`)이라, **`.env`를 안 만들어도 로컬은 그냥 동작**한다.
- `.env`, `.env.*`는 `.gitignore` 처리됨. **커밋되는 건 `.env.example`뿐.** 새 환경변수를 추가하면 **반드시 `.env.example`와 `src/vite-env.d.ts`(`ImportMetaEnv`)에 동시 반영**한다.
- 새 환경변수는 운영을 위해 **Vercel 대시보드에도 등록**해야 한다(사람이). PR/메모에 "Vercel에 `VITE_XXX` 추가 필요"라고 남긴다.

---

## 5. TypeScript 룰 (설정이 엄격하다 — 반드시 인지)

`tsconfig.app.json`이 다음을 강제한다. 위반하면 **빌드·타입체크가 실패**한다:

- **`verbatimModuleSyntax: true`** → **타입 전용 import는 반드시 `import type { Foo }`** 로. 값과 타입을 섞어 import하면 안 된다.
  ```ts
  import { api } from '@/api/client'        // 값(런타임에 필요)
  import type { CommonResponse } from '@/api/types'  // 타입(런타임에 사라짐)
  // 한 모듈에서 둘 다 필요하면 줄을 나누거나 인라인 type 키워드 사용:
  import { ApiError, type CommonResponse } from '@/api/types'
  ```
- **`noUnusedLocals` / `noUnusedParameters`** → 안 쓰는 변수·import·매개변수 금지. 의도적으로 안 쓰는 매개변수는 `_` prefix.
- **`erasableSyntaxOnly`** → TS enum, `namespace`, 파라미터 프로퍼티 등 "런타임 코드를 만드는" TS 문법 금지. **enum 대신 `as const` 객체 + union 타입**을 쓴다:
  ```ts
  export const Status = { Idle: 'idle', Loading: 'loading', Done: 'done' } as const
  export type Status = (typeof Status)[keyof typeof Status]
  ```
- **`noFallthroughCasesInSwitch`** → switch fall-through 금지(각 case에 `break`/`return`).
- **`allowImportingTsExtensions`** → 같은 패키지 내 import에 `.tsx` 확장자가 붙을 수 있다(예: `App.tsx`). 기존 스타일을 따른다.
- **`strict`** 계열 활성 → `any` 지양. 외부 데이터(API 응답)는 **반드시 타입을 정의**해서 받는다(§6). 부득이하게 모르면 `unknown` 후 좁히기.
- 타입 위치: 도메인 타입은 그 feature 안(`features/xxx/types.ts`), API 공통 타입은 `src/api/types.ts`, 진짜 전역 타입만 `src/types/`.

---

## 6. API 레이어 (이 프로젝트의 핵심 컨벤션)

> 백엔드의 `CommonResponse`/`ApiError` 계약을 프론트에서 일관되게 다루기 위한 구조다. **새 API 호출은 반드시 이 패턴을 따른다.** raw `fetch`나 새 axios 인스턴스를 만들지 말 것.

### 6.1 단일 axios 인스턴스 (`src/api/client.ts`)
- 모든 호출은 **`@/api/client`의 `api` 인스턴스**를 쓴다. `baseURL`이 `/api/v1`이라 **엔드포인트 함수에는 prefix 없이** 경로만 적는다(`api.post('/diagnoses', ...)`).
- **응답 인터셉터가 모든 에러를 `ApiError`로 정규화**한다(§6.2). 그러니 호출부에서는 `catch (e)` 했을 때 `e`가 `ApiError`라고 가정하면 된다.
- `timeout`은 30초. LLM 호출이 느릴 수 있어 길게 잡혀 있다 — 함부로 줄이지 말 것.

### 6.2 에러 타입 (`ApiError`)
```ts
class ApiError extends Error {
  readonly errorCode?: number  // 백엔드 비즈니스 4자리 코드 (분기용)
  readonly status?: number     // HTTP status
  // message: 백엔드가 준 한글 메시지(사용자 노출 가능) 또는 일반화 메시지
}
```
- **`message`는 그대로 화면에 보여줘도 된다**(백엔드가 한글로 내려줌). 백엔드가 구체 메시지를 안 준 경우(네트워크/5xx) 인터셉터가 `GENERIC_ERROR_MESSAGE`("일시적인 오류가 발생했어요...")로 대체한다.
- **특정 비즈니스 분기가 필요하면 `errorCode`로** 분기한다(HTTP status가 아니라). 예: `if (e instanceof ApiError && e.errorCode === 4001) { /* 이미지 용량 초과 UI */ }`.
- 클라이언트단에서 잡을 수 있는 검증(파일 용량 등)은 **요청 전에** `ApiError`를 던져 네트워크 왕복을 아낀다(`features/diagnosis/api.ts`의 `MAX_FILE_BYTES` 체크 참고).

### 6.3 응답 언래핑 (`unwrap`)
- 백엔드 성공 응답은 `{ message, data }` 래퍼다. **`unwrap(body)`로 `data`를 꺼낸다**(없으면 `undefined`).
- 엔드포인트 함수는 **래퍼가 아니라 실제 도메인 타입을 반환**한다. 데이터가 비어 있으면(`undefined`) 함수에서 `ApiError`를 던져 호출부를 단순하게 유지한다(예: "진단 결과를 받지 못했어요").

### 6.4 표준 엔드포인트 함수 패턴
```ts
// features/diagnosis/api.ts
export async function createDiagnosis(file: File): Promise<DiagnosisResult> {
  if (file.size > MAX_FILE_BYTES) {
    throw new ApiError('이미지 용량은 10MB를 넘을 수 없어요.')   // 요청 전 가드
  }
  const form = new FormData()
  form.append('image', file)                                      // multipart 파트명 'image'

  const { data } = await api.post<CommonResponse<DiagnosisResult>>('/diagnoses', form)
  const result = unwrap(data)
  if (!result) throw new ApiError('진단 결과를 받지 못했어요. 다시 시도해 주세요.')
  return result
}
```
- 제네릭은 **`CommonResponse<도메인타입>`** 으로 명시 → `unwrap`이 타입 안전.
- **타입을 손으로 적기 전에 Swagger 확인**(§1). 추측한 필드에는 `// TODO(Swagger): ...` 주석을 남긴다(현재 `DiagnosisResult`처럼).
- multipart 호출 시 `Content-Type`을 **수동으로 설정하지 말 것** — `FormData`를 넘기면 axios/브라우저가 boundary 포함해 자동 설정한다.

---

## 7. 디렉토리 / 모듈 컨벤션

```
src/
├── main.tsx                 앱 진입점(createRoot + StrictMode). 건드릴 일 거의 없음.
├── App.tsx                  루트 컴포넌트. 화면 조합.
├── index.css                Tailwind import + 전역 베이스 스타일.
├── vite-env.d.ts            Vite 환경변수 타입 선언(ImportMetaEnv).
├── api/                     ← 공통 API 인프라 (이미 존재)
│   ├── client.ts            axios 인스턴스 + 인터셉터 + unwrap
│   └── types.ts             CommonResponse<T>, ApiError
├── features/                ← 도메인(기능) 단위. 화면+로직은 여기에.
│   └── diagnosis/           진단 도메인
│       ├── api.ts           진단 API 호출 함수
│       ├── types.ts         진단 도메인 타입 (DiagnosisResult 등)
│       ├── components/      (표준) 이 기능 전용 컴포넌트
│       └── hooks/           (표준) 이 기능 전용 훅 (예: useDiagnosis)
├── components/              ← 여러 기능이 공유하는 공용 UI 컴포넌트 (Button 등)
├── lib/                     ← 상수/순수 유틸 (constants.ts: 용량 한도·면책 문구)
├── types/                   ← 진짜 전역 타입만
└── assets/                  ← 정적 에셋(이미지 등)
```

### 모듈 룰
- **기능 코드는 `features/{도메인}/`에 담는다**(feature-based, 기술레이어-based 아님). 진단 관련 컴포넌트·훅·타입·API는 전부 `features/diagnosis/` 안에.
- **`features/` 간 직접 import 금지** — feature는 서로 독립적이어야 한다. 공유가 필요하면 `components/`·`lib/`·`api/`로 끌어올린다.
- **공용 vs 기능전용 판단**: 한 기능에서만 쓰면 `features/xxx/components/`, 둘 이상에서 쓰면 `components/`. 애매하면 일단 기능 안에 두고 두 번째 사용처가 생길 때 끌어올린다(성급한 추상화 금지).
- 파일/폴더명: **컴포넌트 파일은 `PascalCase.tsx`**(예: `UploadButton.tsx`), 훅·유틸·api는 **`camelCase.ts`**(예: `useDiagnosis.ts`, `formatBytes.ts`), 디렉토리는 `camelCase`/한 단어.
- import는 **`@/` 별칭** 사용(상대경로 `../../` 지양). 같은 디렉토리 내부만 상대경로 OK.

---

## 8. 컴포넌트 / React 룰

### 8.1 골격 (표준)
```tsx
import { DISCLAIMER } from '@/lib/constants'
import type { DiagnosisResult } from '../types'

interface DiagnosisCardProps {
  result: DiagnosisResult
}

export function DiagnosisCard({ result }: DiagnosisCardProps) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm">
      {/* ... 결과 렌더링 ... */}
      <p className="mt-4 text-xs text-slate-400">
        {result.disclaimer ?? DISCLAIMER}   {/* 면책 문구 항상 노출 */}
      </p>
    </article>
  )
}
```

- **함수형 컴포넌트 + 훅만.** 클래스 컴포넌트 금지.
- **Props는 `interface XxxProps`로 명시**(`any` 금지). 디스트럭처링으로 받는다.
- **공용/기능 컴포넌트는 named export**(`export function Xxx`). `App` 같은 진입 컴포넌트만 default export(기존 스타일 유지).
- **훅 규칙 준수**(eslint-plugin-react-hooks가 강제): 훅은 최상위에서만 호출, 조건/반복문 안에서 호출 금지. `useEffect` 의존성 배열 정확히.
- **`react-refresh`(HMR) 규칙**: 컴포넌트 파일은 **컴포넌트만 export**하는 게 안전하다. 상수/헬퍼를 같이 export하면 HMR 경고가 날 수 있으니 → 상수는 `lib/`, 헬퍼는 별도 `.ts`로 분리.
- `key`는 안정적인 ID 사용(배열 index 지양).
- **`StrictMode`가 켜져 있다**(`main.tsx`) → 개발 모드에서 effect가 2번 실행된다. 이를 가정하고 effect를 멱등하게 작성(중복 요청 방지 등).

### 8.2 상태 / 비동기 (현재 방침)
- 로컬 상태는 `useState`/`useReducer`. **전역 상태 라이브러리·데이터페칭 라이브러리는 아직 없다**(§2) — API 호출은 `features/xxx/api.ts` 함수를 컴포넌트/훅에서 직접 `await`한다.
- 비동기 호출 패턴은 **로딩/에러/데이터 3-상태**를 명시적으로 다룬다:
  ```tsx
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string>()
  // try { setStatus('loading'); const r = await createDiagnosis(file); ... }
  // catch (e) { setError(e instanceof ApiError ? e.message : '알 수 없는 오류'); setStatus('error') }
  ```
- 호출 로직이 한 컴포넌트를 넘어 재사용되면 **`features/xxx/hooks/useXxx.ts` 커스텀 훅으로 추출**한다(상태관리 라이브러리 도입 전 1차 수단).

---

## 9. 스타일링 — Tailwind CSS v4 (CSS-first)

- **Tailwind v4 + `@tailwindcss/vite` 플러그인** 사용. **`tailwind.config.js`/`postcss.config.js`가 없다** — v4는 CSS-first 설정이다. `src/index.css`의 `@import 'tailwindcss';`가 전부다.
- **유틸리티 클래스를 JSX `className`에 직접 작성**한다(`src/App.tsx` 참고). 별도 CSS 파일·CSS Modules·styled-components를 새로 만들지 말 것.
- **테마/디자인 토큰 커스터마이즈가 필요하면 `index.css`의 `@theme { ... }` 블록**에 CSS 변수로 정의한다(v4 방식). JS config 파일을 만들지 말 것. 토큰을 추가할 땐 먼저 §17대로 확인.
- 전역 베이스 스타일(폰트·`color-scheme` 등)은 `index.css`에 이미 있다 — 거기에 모은다. 컴포넌트별 전역 CSS를 흩뿌리지 말 것.
- 클래스 순서/조건부 클래스: 현재 `clsx`/`tailwind-merge` 같은 헬퍼가 없다. 조건부는 템플릿 리터럴/삼항으로 간단히. 복잡해지면 헬퍼 도입을 §17대로 논의.
- **반응형은 모바일 우선**(기본 = 모바일, `sm:`/`md:`로 확장). 피부 사진 업로드는 모바일 사용이 많다는 점을 가정.

---

## 10. 린트 / 포맷 (Prettier가 SSOT)

- **포맷은 Prettier가 결정한다**(`.prettierrc.json`). 스타일을 손으로 맞추려 하지 말고 `npm run format`을 돌린다. 설정:
  - **세미콜론 없음**(`semi: false`), **작은따옴표**(`singleQuote: true`), **trailing comma all**, **printWidth 80**, **tabWidth 2**, **화살표 함수 괄호 항상**(`arrowParens: always`).
- **ESLint(flat config, `eslint.config.js`)**: `js.recommended` + `typescript-eslint.recommended` + `react-hooks` + `react-refresh` + `eslint-config-prettier`(포맷 규칙 충돌 제거). `dist`는 무시.
- **포맷터(Prettier)와 린터(ESLint)를 새로 설정하거나 규칙을 바꾸지 말 것.** 규칙 변경이 필요하면 §17대로 논의.
- 자동수정: `npm run lint:fix` + `npm run format`. 그래도 남는 린트 에러는 **무시(`// eslint-disable-...`)하기 전에 원인을 고치는 게 우선**. 부득이하면 사유 주석을 단다.

---

## 11. 이미지 업로드 (진단 핵심 플로우)

- 입력은 **`<input type="file" accept="image/*">`** 로 받은 `File`. 진단 요청은 **`FormData`에 `'image'` 파트로** 담아 `createDiagnosis(file)`에 넘긴다(§6.4).
- **클라이언트 가드(요청 전)**: `MAX_FILE_BYTES`(10MB) 초과면 네트워크 전에 `ApiError`로 막는다. 이미지 MIME(`file.type.startsWith('image/')`)도 가능하면 미리 확인.
  - 용량 한도 상수는 `@/lib/constants`(`MAX_FILE_BYTES` 10MB / `MAX_REQUEST_BYTES` 12MB). **백엔드 한도와 동기화** — 백엔드가 바뀌면 이 상수도 같이 고친다.
- **미리보기**는 `URL.createObjectURL(file)` 사용 후 **`URL.revokeObjectURL`로 해제**(메모리 누수 방지, effect cleanup에서).
- **리사이즈/압축**: 현재 프론트는 원본을 그대로 보낸다. 백엔드가 LLM 전송 전 리사이즈를 책임진다(nuro-be 정책). 프론트에서 캔버스 리사이즈를 추가할지는 백엔드와 합의 후 결정 — 임의 추가 금지.
- 업로드 중에는 **로딩 상태 표시 + 중복 제출 방지**(버튼 disable). LLM 응답이 수 초 걸릴 수 있음(timeout 30s).

---

## 12. 에러 / UX 처리

- **사용자에게 보여주는 에러 메시지는 `ApiError.message`를 우선 사용**(백엔드 한글 메시지). `instanceof ApiError`가 아니면 일반화 문구로 폴백.
- 진단 결과·민감 정보를 **`console.log`로 운영에 남기지 말 것.** 디버그 로그는 작업 후 제거하거나 dev 조건으로 감싼다.
- **면책 문구는 결과 화면에 항상**(§1). 빠뜨리면 안 되는 규제/신뢰 요소다.
- 로딩·빈상태·에러상태를 화면마다 명시적으로 다룬다(스피너/스켈레톤/재시도 버튼). "성공만 가정한 UI"를 만들지 말 것.
- 접근성 기본: 버튼은 `<button>`, 이미지엔 `alt`, 폼 input엔 `label`. 클릭 가능한 `<div>` 만들지 말 것.

---

## 13. 테스트 (아직 미설정)

- **현재 테스트 프레임워크가 없다**(`vitest`/`testing-library` 미설치). 따라서 신규 코드에 테스트를 강제하지 않는다 — 대신 **§3 검증 체크리스트(typecheck/lint/dev 확인)를 반드시** 거친다.
- 테스트 도입이 필요하다고 판단되면(로직이 복잡해지는 시점) **§17대로 먼저 논의**한다. 도입 시 표준 후보: **Vitest + @testing-library/react**(Vite 네이티브).
- 그 전까지 **테스트하기 쉬운 구조**를 지향: 순수 로직은 `lib/`의 순수 함수로 빼고(부수효과 없는 함수는 나중에 테스트 붙이기 쉽다), 컴포넌트는 props로 데이터를 받게(부수효과·페칭을 컴포넌트 깊숙이 박지 않기).

---

## 14. 백엔드 연동 시 알아둘 것 (nuro-be 계약)

> 프론트는 백엔드 계약의 **소비자**다. 계약은 백엔드가 정하고 **Swagger가 SSOT**다. 추측 금지.

- 응답 래퍼: `CommonResponse` — 성공 `{message:"success", data?}`, 에러 `{errorCode, message}`. **`data`·`errorCode`는 optional**(`@JsonInclude(NON_NULL)`이라 null 필드는 아예 빠진다). 옵셔널 체이닝으로 안전하게 접근.
- 에러코드 대역(백엔드 도메인별): 진단 `40xx`(예: 4001 이미지 용량 초과, 4002 지원 안 하는 형식, 4040 진단 없음), 외부/LLM 장애 `50xx`(502/504 → 일반화 메시지로 처리). **분기는 `errorCode` 기준**.
- 진단 결과 스키마(`DiagnosisResult`)는 **백엔드의 "고정 JSON 스키마"와 1:1**. 백엔드가 스키마를 바꾸면 **계약 변경**이므로 양쪽이 합의하고 타입을 동시에 업데이트한다. 현재 프론트 타입은 골격(`id`, `disclaimer?`)뿐 → **Swagger 확정 후 필드를 채운다**(`// TODO(Swagger)`).
- 헬스/문서: `http://localhost:8080/actuator/health`, `http://localhost:8080/swagger-ui.html`.

---

## 15. 알려진 함정 / 금지사항

1. **`import type` 누락** — `verbatimModuleSyntax`라 타입 import에 `type`을 안 붙이면 빌드 실패(§5).
2. **TS enum / namespace 사용** — `erasableSyntaxOnly`로 금지. `as const` union으로(§5).
3. **미사용 변수·import·매개변수** — `noUnusedLocals/Parameters`로 빌드 실패. 정리하거나 `_` prefix.
4. **`tailwind.config.js`를 만들거나 PostCSS 설정 추가** — v4는 CSS-first다. `index.css`의 `@theme`을 쓴다(§9).
5. **새 axios 인스턴스·raw `fetch`** — 항상 `@/api/client`의 `api`를 쓴다(인터셉터/에러정규화 우회 금지)(§6).
6. **multipart에 `Content-Type` 수동 지정** — `FormData`면 자동. 수동 지정 시 boundary 깨짐(§6.4).
7. **`/api/v1` prefix 중복** — `baseURL`에 이미 들어있다. 엔드포인트 함수엔 경로만(§6.1).
8. **시크릿을 `VITE_*`에 넣기** — 클라이언트 번들에 노출된다(§4).
9. **`.env.example`/`vite-env.d.ts` 동기화 누락** — 새 환경변수는 둘 다 + Vercel에 반영(§4).
10. **면책 문구 누락** — 결과 화면엔 항상(§1, §12).
11. **의존성 임의 설치** — 라우터/상태관리/테스트/폼 라이브러리 등은 §17대로 먼저 논의(§2).
12. **`features/` 간 직접 import** — 공유는 `components/`·`lib/`로 끌어올린다(§7).
13. **패키지 매니저 혼용** — npm만. `yarn.lock`/`pnpm-lock.yaml` 만들지 말 것.
14. **`dist/`·`node_modules` 커밋** — gitignore됨. `dist/`는 빌드 산출물, 손대지 말 것.
15. **타입 추측으로 채우기** — API 타입은 Swagger 확인 후. 모르면 `// TODO(Swagger)`(§6.4, §14).
16. **악성 코드 / 취약점 코드 작성 거부** — 보안 연구 명목이라도 금지.

---

## 16. 신규 기능/화면 추가 체크리스트

신규 기능 `xxx`를 추가할 때:

- [ ] 위치: `src/features/xxx/`. 컴포넌트는 `components/`, 훅은 `hooks/`, API는 `api.ts`, 타입은 `types.ts`.
- [ ] API 호출은 `@/api/client`의 `api` 인스턴스 + `unwrap` + `CommonResponse<T>` 제네릭(§6). 호출 전 클라이언트 가드(용량 등) 검토.
- [ ] 타입은 **Swagger 확인 후** 정의. 미확정 필드는 `// TODO(Swagger)`.
- [ ] 컴포넌트: 함수형 + named export, `interface XxxProps` 명시, 훅 규칙 준수(§8).
- [ ] 상태: 로딩/에러/데이터 3-상태 명시. 재사용되면 `hooks/useXxx.ts`로 추출. (전역 상태/페칭 라이브러리는 임의 도입 금지 — §17.)
- [ ] 스타일: Tailwind 유틸리티 직접. 모바일 우선 반응형(§9).
- [ ] 에러 UX: `ApiError.message` 노출 + 폴백, 빈/로딩/에러 상태 처리(§12).
- [ ] 결과/진단 화면이면 **면책 문구** 노출.
- [ ] 새 환경변수면 `.env.example` + `src/vite-env.d.ts` + (운영) Vercel 반영(§4).
- [ ] `@/` 별칭 import. `features/` 간 직접 import 금지.
- [ ] **`npm run typecheck` + `npm run lint` 통과**, `npm run format` 적용, `npm run dev`로 눈 확인(§3).
- [ ] 새 라우트/상태관리/테스트 등 인프라가 필요하면 **추가 전에 §17대로 논의**.

---

## 17. Claude Code 작업 지침 (셀프 룰)

1. **존재하지 않는 인프라를 발명하지 않는다.** 라우터·상태관리·데이터페칭·폼/검증·테스트·UI키트 라이브러리는 아직 없다 — `npm install` 하기 전에 **"왜 필요한지·대안·비용"을 한 줄로 정리해 먼저 묻는다**(§2). 사용자가 프론트를 잘 모르므로, 의존성 추가는 특히 신중히.
2. **이 프로젝트의 primitive를 쓴다.** API는 `@/api/client`의 `api`+`unwrap`+`ApiError`, 응답은 `CommonResponse`, 상수/면책은 `@/lib/constants`. 새 패턴을 평행 도입하지 말 것.
3. **타입을 추측하지 말고 Swagger를 본다.** API 타입을 손으로 적기 전에 백엔드 Swagger를 확인하고, 미확정이면 `// TODO(Swagger)`를 남긴다(§6, §14).
4. **작업 끝에 항상 검증.** `npm run typecheck` + `npm run lint` 통과, `npm run format` 적용. UI면 `npm run dev`로 콘솔 에러·면책 문구 확인(§3). 이걸 안 돌린 코드는 "완료"가 아니다.
5. **TS 엄격 모드를 항상 의식.** `import type`, `as const` union(enum 금지), 미사용 변수 제거(§5).
6. **시크릿·민감정보 보호.** `VITE_*`는 번들에 노출됨 — 키 금지. 진단 결과/이미지를 운영 로그에 남기지 말 것(§4, §12).
7. **면책 의무를 잊지 않는다** — 진단 결과 화면엔 항상 `DISCLAIMER`(§1).
8. **한글 OK.** UI 텍스트·에러 메시지·주석은 자연스러운 한글로. 백엔드가 주는 에러 메시지도 한글이라 그대로 노출 가능.
9. **모호하면 추측보다 질문.** 룰 충돌·패턴 불명확·새 라이브러리 필요·디자인 결정이 필요할 때 한 번 묻는 게 낫다. 프론트 관행상 당연해 보여도, 사용자가 백엔드 개발자라는 점을 고려해 결정의 이유를 짧게 설명한다.
10. **브랜치 전략**: `main` ← `develop` ← `feature/*`. 커밋/푸시는 **사용자가 요청할 때만**. PR은 `.github/PULL_REQUEST_TEMPLATE.md` 양식을 따른다.
11. **수정 전 영향 범위 확인.** `api/client.ts`·`index.css`·`vite.config.ts`·tsconfig·eslint/prettier 설정 등 **횡단 파일은 영향이 크므로 신중히** 다루고, 변경 시 이유를 PR에 남긴다.
