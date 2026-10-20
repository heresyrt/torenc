# 토목·건설 기업 소개 웹사이트 구현 계획

> **에이전트 작업자용:** 각 작업을 실행할 때 `superpowers:subagent-driven-development`(권장) 또는 `superpowers:executing-plans`를 사용한다. 진행 상태는 체크박스로 추적한다.

**목표:** 고화질 이미지 교체 구조와 접근성을 갖춘 한국어 토목·건설 기업 소개 단일 페이지를 Next.js로 구현한다.

**구조:** App Router 서버 컴포넌트를 중심으로 섹션을 조립하고, 모바일 메뉴와 노출 애니메이션만 클라이언트 컴포넌트로 제한한다. 모든 콘텐츠는 타입이 지정된 데이터 모듈에서 제공하며 공통 미디어 컴포넌트가 플레이스홀더와 실제 Next Image 렌더링을 전환한다.

**기술 스택:** Next.js 최신 안정 버전, React, TypeScript, Tailwind CSS, Vitest, Testing Library, ESLint

## 전체 제약 조건

- 사용자에게 노출되는 콘텐츠, 메타데이터, 접근성 문구, README는 한국어로 작성한다.
- HTML 문서 언어는 `ko`로 지정한다.
- 관리자, 데이터베이스, 문의 발송, 실제 지도 API는 구현하지 않는다.
- 이미지 품질은 90을 사용하고 명시적 `sizes`와 안정적인 화면 비율을 제공한다.
- 최종 이미지가 없을 때 네트워크 이미지 대신 의도적인 플레이스홀더를 표시한다.
- `prefers-reduced-motion`을 존중하며 자바스크립트가 없어도 본문을 볼 수 있어야 한다.

---

## 파일 구조

```text
src/
├── app/
│   ├── globals.css          # 디자인 토큰, 공통 스타일, 애니메이션
│   ├── layout.tsx           # 한국어 문서, 전역 메타데이터
│   ├── page.tsx             # 섹션 조립
│   ├── robots.ts            # 검색 로봇 정책
│   └── sitemap.ts           # 사이트맵
├── components/
│   ├── layout/
│   │   ├── footer.tsx       # 기업 정보 푸터
│   │   ├── header.tsx       # 고정 헤더
│   │   └── mobile-menu.tsx  # 키보드 지원 모바일 메뉴
│   ├── sections/
│   │   ├── about.tsx
│   │   ├── business.tsx
│   │   ├── certificates.tsx
│   │   ├── contact-cta.tsx
│   │   ├── hero.tsx
│   │   ├── location.tsx
│   │   └── projects.tsx
│   └── ui/
│       ├── image-media.tsx  # 실제 이미지와 플레이스홀더 전환
│       ├── map-placeholder.tsx
│       ├── reveal.tsx
│       └── section-heading.tsx
├── data/site-data.ts        # 한국어 사이트 데이터
├── test/setup.ts            # DOM 테스트 설정
└── types/site.ts            # 데이터 계약
public/images/{hero,projects,certificates,og}/
```

### 작업 1: 프로젝트 기반과 테스트 환경

**파일:** `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `vitest.config.ts`, `src/test/setup.ts`, `src/app/globals.css`

**제공 인터페이스:** `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`

- [ ] Next.js App Router 및 TypeScript 프로젝트 설정을 생성한다.
- [ ] Tailwind CSS, ESLint, Vitest, jsdom, Testing Library 의존성을 설치한다.
- [ ] Vitest가 `src/**/*.test.ts?(x)`를 jsdom 환경에서 실행하도록 설정한다.
- [ ] 빈 스모크 테스트를 실행해 테스트 러너가 정상 동작하는지 확인한다.
- [ ] 디자인 토큰과 기본 리셋을 `globals.css`에 정의한다.

### 작업 2: 타입 데이터와 메타데이터

**파일:** `src/types/site.ts`, `src/data/site-data.test.ts`, `src/data/site-data.ts`, `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`

**제공 인터페이스:** `SiteData`, `MediaItem`, `siteData`

- [ ] 내비게이션, 사업 분야, 실적, 인증서, 연락처 데이터의 필수 한국어 필드를 검증하는 실패 테스트를 작성한다.
- [ ] 테스트 실패가 데이터 모듈 부재 때문인지 확인한다.
- [ ] 정확한 타입과 한국어 샘플 콘텐츠를 최소 구현해 테스트를 통과시킨다.
- [ ] `lang="ko"`, 한국어 SEO 메타데이터, Open Graph, robots, sitemap을 구현한다.
- [ ] 데이터 테스트와 타입 검사를 실행한다.

### 작업 3: 공통 미디어와 지도 대체 UI

**파일:** `src/components/ui/image-media.test.tsx`, `src/components/ui/image-media.tsx`, `src/components/ui/map-placeholder.test.tsx`, `src/components/ui/map-placeholder.tsx`, `src/components/ui/section-heading.tsx`

**제공 인터페이스:** `ImageMedia({ item, sizes, fit, priority })`, `MapPlaceholder({ address })`

- [ ] 이미지 경로가 없을 때 한국어 플레이스홀더와 권장 비율을 표시하는 실패 테스트를 작성한다.
- [ ] 실패를 확인한 뒤, 실제 경로가 있으면 Next Image를 품질 90으로 렌더링하는 최소 구현을 추가한다.
- [ ] 주소가 항상 노출되는 지도 대체 UI의 실패 테스트를 작성하고 구현한다.
- [ ] 공통 섹션 제목 컴포넌트를 추가한다.
- [ ] 관련 테스트를 실행한다.

### 작업 4: 헤더와 모바일 메뉴

**파일:** `src/components/layout/mobile-menu.test.tsx`, `src/components/layout/mobile-menu.tsx`, `src/components/layout/header.tsx`

**제공 인터페이스:** `MobileMenu({ items })`, `Header()`

- [ ] 메뉴 버튼의 초기 닫힘 상태와 열기/닫기/Escape 동작을 검사하는 실패 테스트를 작성한다.
- [ ] 예상 실패를 확인한다.
- [ ] ARIA 상태, 키보드 동작, 항목 선택 후 닫힘을 구현한다.
- [ ] 고정 데스크톱 헤더와 본문 바로가기 링크를 구현한다.
- [ ] 메뉴 테스트와 타입 검사를 실행한다.

### 작업 5: 페이지 섹션과 조립

**파일:** `src/app/page.test.tsx`, `src/app/page.tsx`, `src/components/sections/*.tsx`, `src/components/layout/footer.tsx`

**제공 인터페이스:** 각 섹션의 기본 React 컴포넌트와 완성된 홈 페이지

- [ ] 모든 필수 섹션 제목, CTA, 기업 연락처가 렌더링되는 실패 테스트를 작성한다.
- [ ] 예상 실패를 확인한다.
- [ ] 히어로, 회사 소개, 사업 분야, 실적, 인증서, 오시는 길, 문의 CTA, 푸터를 데이터 기반으로 구현한다.
- [ ] 딥 네이비·콘크리트 회색·오렌지 디자인과 반응형 그리드를 적용한다.
- [ ] 페이지 테스트와 타입 검사를 실행한다.

### 작업 6: 노출 효과와 접근성 보완

**파일:** `src/components/ui/reveal.test.tsx`, `src/components/ui/reveal.tsx`, `src/app/globals.css`

**제공 인터페이스:** `Reveal({ children, className })`

- [ ] 콘텐츠가 기본 표시되고 관찰 시 한 번만 활성화되는 실패 테스트를 작성한다.
- [ ] Intersection Observer를 점진적 향상 방식으로 구현한다.
- [ ] 모션 감소, 포커스 표시, 모바일 메뉴 오버레이, 스크롤 여백을 보완한다.
- [ ] 전체 테스트를 실행한다.

### 작업 7: 한국어 README와 이미지 폴더

**파일:** `README.md`, `public/images/hero/.gitkeep`, `public/images/projects/.gitkeep`, `public/images/certificates/.gitkeep`, `public/images/og/.gitkeep`

- [ ] 한국어로 설치·실행·검증 명령을 문서화한다.
- [ ] 데이터 수정 위치와 이미지 교체 절차를 설명한다.
- [ ] 카테고리별 권장 크기, 품질, 파일명 규칙, `sizes` 기준을 명시한다.
- [ ] 지도 API 교체 지점과 제외 범위를 기록한다.

### 작업 8: 최종 검증

**파일:** 전체 프로젝트

- [ ] `npm test -- --run`을 실행해 전체 테스트가 통과하는지 확인한다.
- [ ] `npm run lint`를 실행해 오류와 경고가 없는지 확인한다.
- [ ] `npm run typecheck`를 실행해 타입 오류가 없는지 확인한다.
- [ ] `npm run build`를 실행해 프로덕션 빌드가 성공하는지 확인한다.
- [ ] 개발 서버를 열어 모바일과 데스크톱 화면, 키보드 포커스, 가로 넘침을 확인한다.
- [ ] 명세 요구사항을 항목별로 다시 대조하고 누락을 수정한다.
