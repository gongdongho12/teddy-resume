# Teddy Resume

Astro 기반의 다국어 이력서/포트폴리오 템플릿입니다.  
한 개의 이력서 데이터 파일을 기준으로 한국어/영어 이력서, 여러 레이아웃, 포트폴리오 페이지, 인쇄/PDF 출력 흐름까지 함께 관리할 수 있습니다.

## 무엇을 할 수 있나요?

- `ko`, `en` 2개 언어 이력서 제공
- 여러 이력서 레이아웃 지원
- 프로젝트별 상세 포트폴리오 페이지 지원
- 브라우저 인쇄 최적화 및 PDF 내보내기 지원
- 포트폴리오 참고 이미지, Mermaid 다이어그램, 외부 링크 연결 지원
- 브라우저 언어 기준 기본 랜딩 페이지 리다이렉트

## 기술 스택

- Astro
- TypeScript
- Tailwind CSS
- YAML
- Playwright
- html2canvas / jsPDF

## 빠르게 시작하기

### 1. 요구 사항

- Node.js `>= 25`
- npm

### 2. 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

기본 진입점:

- `/` : 브라우저 언어에 따라 `ko` 또는 `en`으로 이동
- `/ko/` : 한국어 기본 이력서
- `/en/` : 영어 기본 이력서
- `/portfolio/` : 브라우저 언어에 따라 포트폴리오 언어 자동 이동
- `/portfolio/ko/` : 한국어 포트폴리오
- `/portfolio/en/` : 영어 포트폴리오

### 4. 빌드

```bash
npm run build
```

### 5. 빌드 결과 미리보기

```bash
npm run preview
```

## 어떤 파일을 수정하면 되나요?

### 1. 기본 이력서 데이터

이력서 본문 데이터는 아래 파일 하나에서 읽습니다.

- `src/content/resume/profile.yaml`

여기서 관리하는 내용:

- 이름, 연락처, 자기소개
- 경력
- 교육
- 활동
- 프로젝트 섹션
- 이력서에 표시할 하이라이트/성과/기술스택

### 2. 포트폴리오 상세 페이지

프로젝트별 긴 설명, 설계 배경, Mermaid 다이어그램, 참고 이미지 등은 아래 파일에서 관리합니다.

- `src/lib/portfolio-content.ts`

이 파일에서 관리하는 내용:

- 포트폴리오 프로젝트 순서
- 프로젝트 설명/성과/설계 관점
- Mermaid 다이어그램
- 참고 이미지 카드
- 외부 링크

### 3. 템플릿 목록

사용 가능한 이력서 템플릿은 아래 파일에 정의되어 있습니다.

- `src/lib/templates.ts`

현재 템플릿 ID:

- `default`
- `creative`
- `minimal`
- `academic`
- `executive`

참고:

- 개발 환경에서는 모든 템플릿이 보입니다.
- 프로덕션 빌드에서는 현재 `prod`로 표시된 템플릿만 노출됩니다.

## 실제 수정 순서 추천

### 1. 내 정보로 바꾸기

먼저 `src/content/resume/profile.yaml`의 아래 항목부터 바꾸세요.

- `name`, `name_en`
- `contact`
- `summary`
- `experience`
- `projectSections`

### 2. 포트폴리오 상세 프로젝트 연결

이력서 프로젝트에서 포트폴리오로 이동시키려면:

1. `profile.yaml`의 프로젝트에 `portfolioSlug` 또는 `portfolioAnchor`를 넣습니다.
2. `src/lib/portfolio-content.ts`에 같은 프로젝트를 정의합니다.

### 3. 참고 이미지 추가

포트폴리오에 스크린샷을 넣으려면:

1. 이미지를 `public/images/portfolio/` 아래에 넣습니다.
2. `portfolio-content.ts`의 `referenceImages`에 경로를 추가합니다.

예시 경로:

- `/images/portfolio/my-project.png`

## PDF로 내보내기

이 프로젝트에는 Playwright 기반 PDF 내보내기 스크립트가 포함되어 있습니다.

```bash
npm run export:pdf -- ko default
```

또는:

```bash
npm run export:pdf -- en creative
```

인자 형식:

- 첫 번째 인자: 언어 (`ko`, `en`)
- 두 번째 인자: 템플릿 (`default`, `creative`, `minimal`, `academic`, `executive`)

출력 파일:

- `dist/resume-ko-default.pdf`
- `dist/resume-en-creative.pdf`

## 인쇄 팁

- 브라우저 인쇄에서 `배경 그래픽 포함`을 켜세요.
- 여백은 `없음`이 가장 깔끔합니다.
- macOS는 `⌘ + P`, Windows는 `CTRL + P`로 인쇄할 수 있습니다.

## 배포 전 확인할 것

### 1. 사이트 주소

- `astro.config.mjs`의 `site`

### 2. Base 경로

현재는 루트(`/`) 기준입니다.

```js
base: '/'
```

GitHub Pages 프로젝트 사이트처럼 서브 경로에 배포하려면 `base`를 맞춰주세요.

### 3. 파비콘 / 정적 자산

- `public/favicon.png`
- `public/images`
- `public/scripts`

## 디렉터리 구조 요약

```text
src/
  components/           재사용 UI 컴포넌트
  content/resume/       이력서 원본 데이터(YAML)
  lib/                  로딩/로컬라이즈/포트폴리오 데이터
  pages/                Astro 라우트
  templates/            이력서 레이아웃
public/
  images/               포트폴리오 이미지, 인쇄 가이드 이미지
  scripts/              브라우저 동작 스크립트
scripts/
  export-pdf.mjs        PDF 내보내기
```

## 이런 사람에게 맞습니다

- 한/영 이력서를 같이 관리하고 싶은 사람
- 텍스트 이력서와 프로젝트 포트폴리오를 한 레포에서 관리하고 싶은 사람
- 이력서를 PDF와 웹 둘 다로 배포하고 싶은 사람
- YAML 중심으로 콘텐츠를 수정하고 싶은 사람

## 참고

이 프로젝트는 특정 개인 이력서를 바탕으로 발전한 템플릿이라, 처음 사용할 때는 아래 두 파일을 가장 먼저 정리하는 것이 좋습니다.

- `src/content/resume/profile.yaml`
- `src/lib/portfolio-content.ts`
