# Cloudflare Pages 배포 설계

## 목표

현재 Next.js 기업 소개 사이트를 서버 런타임 없이 Cloudflare Pages에서 정적 사이트로 배포한다. 운영 도메인은 `https://torenc.com`이며, 기존 화면·SEO 메타데이터·카카오맵·이미지 갤러리 동작을 유지한다.

## 배포 구조

- Next.js의 정적 내보내기 기능으로 `out/` 디렉터리를 생성한다.
- Cloudflare Pages의 Git 연동이 `master` 브랜치를 프로덕션으로 배포한다.
- 작업은 `codex/cloudflare-pages` 브랜치에서 수행하고 Draft PR을 거쳐 `master`에 병합한다.
- Cloudflare Pages 빌드 명령은 `npm run build`, 출력 디렉터리는 `out`으로 설정한다.
- 별도의 Pages Functions, Workers, Wrangler 배포 스크립트는 추가하지 않는다.

## 애플리케이션 변경

- `next.config.ts`에서 `output: "export"`를 활성화한다.
- Cloudflare의 정적 호스팅에는 Next.js 이미지 최적화 서버가 없으므로 `images.unoptimized: true`를 설정한다.
- 기존 `public/` 이미지와 PDF는 Git 저장소에 그대로 포함하고 정적 산출물로 복사한다.
- 기존 라우트는 홈, sitemap, robots 및 정적 아이콘이며 모두 빌드 시 생성한다.

## 환경변수와 보안

- `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`는 Cloudflare Pages의 Production 및 Preview 환경변수에 등록한다.
- `.env.local`은 기존 `.gitignore` 규칙에 따라 커밋하지 않는다.
- 해당 값은 브라우저용 공개 JavaScript 키지만, Kakao Developers에서 허용 도메인을 `https://torenc.com`과 필요한 Preview 도메인으로 제한한다.
- 키가 없어도 기존 대체 UI가 표시되므로 빌드는 실패하지 않는다.

## 브랜치 및 출시 전략

상시 `release` 브랜치는 두지 않는다. 소규모 정적 사이트에서 `master`와 `release`를 계속 동기화하면 운영 복잡성만 증가하므로, 기능별 작업 브랜치와 PR을 사용하고 Cloudflare의 프로덕션 브랜치를 `master`로 둔다. PR 브랜치는 Cloudflare Preview 배포로 확인한다.

## 테스트 및 검증

- 배포 설정을 검증하는 자동화 테스트에서 정적 export와 이미지 최적화 비활성화를 확인한다.
- 기존 Vitest 전체 테스트, ESLint, TypeScript 검사를 실행한다.
- 환경변수를 주입한 `npm run build`가 성공하고 `out/index.html`, `out/sitemap.xml`, `out/robots.txt`, 이미지 및 PDF가 생성되는지 확인한다.
- 산출물에서 Next.js 이미지 최적화 엔드포인트(`/_next/image`)를 참조하지 않는지 확인한다.

## 운영 문서

README에 Cloudflare Pages 프로젝트 생성 값, 환경변수 등록, 사용자 도메인 연결, Kakao 허용 도메인, Preview 배포 주의사항을 기록한다. 실제 Cloudflare 계정 연결과 대시보드 설정은 저장소 푸시 이후 사용자가 수행하거나 별도 권한이 제공된 경우 진행한다.

## 범위 제외

- Cloudflare 계정 생성 및 결제 설정
- Pages Functions 또는 Workers 런타임 도입
- R2로 이미지 이전
- 새로운 문의 폼, 데이터베이스 또는 서버 API 추가
- 기존 디자인과 콘텐츠 변경
