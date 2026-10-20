# 더오름 이앤씨 기업 소개 웹사이트

토목·건설 기업을 위한 한국어 반응형 소개 사이트입니다. Next.js App Router, TypeScript, Tailwind CSS로 제작했으며 모든 주요 콘텐츠는 별도 데이터 파일에서 관리합니다.

사업 분야, 시공 실적, 특허·디자인등록 이미지를 연결했으며 모든 이미지는 클릭해 전체 화면으로 보고 모바일 핀치 확대와 좌우 스와이프로 탐색할 수 있습니다. 인증서는 원본 PDF 열기와 다운로드도 지원합니다.

## 브랜드 로고와 색상

공식 Illustrator 원본에서 추출한 웹용 로고는 `public/images/brand/`에 있습니다.

- `logo-horizontal-transparent.png`: 투명 배경 가로 로고, 헤더와 푸터에서 사용
- `logo-horizontal-dark.png`: 투명 로고 생성에 사용하는 원본 배경 포함 파일
- `logo-symbol-dark.png`: 어두운 배경용 심볼, 파비콘과 축약 표시에 사용

웹 테마는 원본 로고의 네이비 `#2C3F4F`와 샌드 골드 `#C6A383`를 기준으로 구성합니다. 개별 SVG 원본을 내보낸 뒤 같은 파일명으로 교체하면 더 작은 용량으로 벡터 품질을 유지할 수 있습니다.

## 실행 환경

- Node.js 20.9 이상
- npm 10 이상 권장

## 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

Cloudflare Pages용 정적 배포 파일은 다음 명령으로 생성합니다.

```bash
npm run build
```

빌드 결과는 `out/`에 생성됩니다. 이 폴더는 빌드 산출물이므로 Git에 커밋하지 않습니다.

## 품질 검사

```bash
npm test -- --run
npm run lint
npm run typecheck
npm run build
```

## 콘텐츠 수정

회사명, 소개 문구, 내비게이션, 사업 분야, 실적, 인증서, 주소, 전화번호, 팩스, 이메일은 모두 [`src/data/site-data.ts`](src/data/site-data.ts)에서 수정합니다.

전화번호 `031-869-3453`, 팩스 `031-869-3454`, 이메일 `torenc3453@naver.com`, 남양주 사무실 주소가 적용되어 있습니다. 전화번호와 이메일은 각각 전화·메일 앱으로 바로 연결됩니다.

## 이미지 교체 위치

| 구분 | 저장 폴더 | 권장 원본 크기 | 화면 처리 |
|---|---|---:|---|
| 히어로 | `public/images/hero/` | 2400×1600 이상 | `object-cover` |
| 사업 분야 | `public/images/business/` | 가로 1600px 이상 | `object-cover` |
| 시공 실적 | `public/images/projects/` | 2000×1250 이상, 16:10 | `object-cover` |
| 인증서·특허 | `public/images/certificates/` | 1600×2200 이상 | `object-contain` |
| 인증서 PDF | `public/documents/certificates/` | 원본 PDF | 상세 뷰어에서 연결 |
| Open Graph | `public/images/og/` | 정확히 1200×630 | 소셜 공유용 |

원본을 웹용으로 준비할 때는 다음 원칙을 지킵니다.

- 고화질 원본은 별도 보관합니다.
- 실제 표시 크기보다 작은 크기로 미리 축소하지 않습니다.
- WebP, AVIF, 고품질 JPEG 또는 투명 배경이 필요한 PNG를 사용합니다.
- 파일명은 영문 소문자와 하이픈으로 작성합니다.
- 공백, 한글 파일명, `최종`, `수정본` 같은 관리용 표현은 사용하지 않습니다.

권장 파일명 예시:

```text
project-retaining-wall-seoul-01.webp
project-slope-reinforcement-cheonan-01.webp
certificate-patent-retaining-wall-01.webp
og-main.jpg
```

### 이미지와 콘텐츠 연결

`src/data/site-data.ts`의 해당 항목에 `src`를 추가합니다.

```ts
{
  id: "project-01",
  title: "도심 연결도로 옹벽 공사",
  description: "제한된 도심 현장에 맞춘 구조 검토와 단계별 시공",
  alt: "도심 연결도로 옹벽 시공 현장",
  width: 2000,
  height: 1250,
  src: "/images/projects/project-retaining-wall-seoul-01.webp",
}
```

갤러리 컴포넌트는 다음 값을 자동 적용합니다.

- Next Image 품질 `90`
- 카드 위치에 맞는 반응형 `sizes`
- 카드 비율 고정으로 레이아웃 밀림 방지
- 시공 사진 `object-cover`, 인증서 `object-contain`
- 모바일 기본 핀치 확대, 좌우 스와이프 탐색
- 데스크톱 좌우 방향키 탐색과 Escape 닫기

`width`와 `height`에는 파일의 실제 픽셀 크기를 입력합니다. 업로드 전에 작은 이미지를 억지로 키우지 말고 가능한 한 카메라 원본을 사용합니다.

`tmp/image/`의 전달 원본을 다시 정리해야 할 때는 아래 명령을 사용합니다. 원본은 수정하지 않고 운영용 영문 파일명으로 복사합니다.

```bash
node scripts/prepare-content-assets.mjs
```

Open Graph 이미지를 추가한 뒤에는 `src/app/layout.tsx`의 `openGraph`와 `twitter` 메타데이터에 `/images/og/og-main.jpg` 경로를 추가합니다.

## 주요 컴포넌트

- `src/components/layout/header.tsx`: 고정 데스크톱 헤더와 본문 바로가기
- `src/components/layout/mobile-menu.tsx`: ARIA 상태 및 Escape 키를 지원하는 모바일 메뉴
- `src/components/ui/content-gallery.tsx`: 이미지 카드, 전체화면 보기, 터치 스와이프·키보드 탐색, PDF 연결
- `src/components/ui/reveal.tsx`: Intersection Observer 기반의 점진적 노출 효과
- `src/components/ui/kakao-map.tsx`: 카카오맵 SDK를 로드하고 회사 위치와 길찾기를 표시
- `src/components/sections/`: 페이지의 각 기업 소개 섹션

## 지도 연동

카카오맵을 표시하려면 다음 순서로 JavaScript 키를 설정합니다.

1. [Kakao Developers](https://developers.kakao.com/)에서 앱을 만듭니다.
2. [카카오맵 API 사용 안내](https://developers.kakao.com/docs/ko/kakaomap/common)에 따라 앱 관리의 **[카카오맵] > [사용 설정]**에서 상태를 **ON**으로 변경합니다.
3. **[앱] > [플랫폼 키] > [JavaScript 키]**에서 지도에 사용할 JavaScript 키를 확인하고, 해당 키의 **[JavaScript SDK 도메인]**에 다음 두 origin을 추가합니다. 등록 순서와 규칙은 [공식 카카오 지도 Web API 가이드](https://apis.map.kakao.com/web/guide/)와 [JavaScript 키 설정 문서](https://developers.kakao.com/docs/ko/app-setting/app#app-key-javascript-key)를 참고합니다.
   - `http://localhost:3000`
   - `https://torenc.com`
4. 환경 변수 예시를 복사해 로컬 설정 파일을 만듭니다.

   ```bash
   cp .env.example .env.local
   ```

5. `.env.local`의 `NEXT_PUBLIC_KAKAO_MAP_APP_KEY=` 뒤에 위에서 확인한 **JavaScript 키**를 입력합니다.
6. 실행 중인 개발 서버를 종료하고 `npm run dev`로 다시 시작합니다. Next.js는 환경 변수를 시작할 때 읽습니다.

JavaScript 키는 브라우저에서 사용하는 공개 키이므로 클라이언트 코드에 포함되는 것이 정상입니다. 대신 해당 키의 JavaScript SDK 도메인을 위의 개발·운영 origin으로 제한하고, 키를 서버 전용 비밀값처럼 취급하거나 넓은 도메인에 허용하지 마세요.

2026년 7월 21일부터 개발자 계정에서 **첫 번째로 카카오맵 API를 활성화한 앱에만 무료 쿼터**가 제공됩니다. 두 번째 이후에 활성화한 앱에서 카카오맵 API를 사용하거나 무료 쿼터를 초과해야 하는 경우에는 **비즈월렛 연결과 유료 API 사용 설정**이 필요합니다. 세부 조건은 [카카오맵 API 이용 정책](https://developers.kakao.com/docs/ko/kakaomap/common#usage-policy)을 확인하세요.

## Cloudflare Pages 배포

이 저장소는 Next.js 정적 내보내기를 사용하며 별도의 Node.js 서버, Pages Functions 또는 Workers가 필요하지 않습니다. GitHub의 비공개 저장소를 Cloudflare Pages에 연결하고 다음 값을 설정합니다.

| 설정 | 값 |
|---|---|
| 프로덕션 브랜치 | `master` |
| 빌드 명령 | `npm run build` |
| 빌드 출력 디렉터리 | `out` |
| 루트 디렉터리 | `/` |

Cloudflare Pages 프로젝트의 **Settings → Environment variables**에서 다음 변수를 등록합니다.

```text
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=<카카오 JavaScript 키>
```

- Production과 Preview 환경에 각각 등록합니다.
- 실제 키는 `.env.local`, GitHub 또는 README에 커밋하지 않습니다.
- `NEXT_PUBLIC_` 변수는 정적 빌드 시 브라우저 코드에 포함되므로, 값을 바꾼 뒤에는 새 배포가 필요합니다.
- 이 키는 브라우저용 공개 키입니다. 유출 방지는 비밀 저장보다 Kakao Developers의 JavaScript SDK 허용 도메인 제한으로 관리합니다.

Cloudflare Pages에서 Custom domains에 `torenc.com`을 연결하고, Kakao Developers의 JavaScript SDK 도메인에도 `https://torenc.com`을 등록합니다. PR 브랜치는 Cloudflare Preview 배포로 화면과 정적 파일을 검증합니다. 카카오맵까지 Preview에서 확인하려면 해당 Preview origin을 Kakao Developers에 추가해야 합니다. 임의의 모든 Preview 주소를 넓게 허용하지 말고, Kakao의 도메인 정책이 필요한 패턴을 정확히 지원할 때만 사용합니다. 그렇지 않으면 지도 최종 확인은 운영 도메인에서 수행합니다.

상시 `release` 브랜치는 사용하지 않습니다. 기능별 브랜치에서 Draft PR과 Preview를 확인한 뒤 `master`에 병합하면 Cloudflare Pages가 프로덕션을 배포합니다.

## 이번 범위에서 제외한 기능

- 관리자 페이지와 데이터베이스
- 문의 폼 저장 및 이메일 발송
- 별도 상세 페이지
- 다국어 지원

## 운영 전 남은 선택사항

- 사업자등록번호 공개 여부 확정
- 회사 소개와 사업 분야 최종 문구 검수
- 중력식·경관 옹벽 이미지의 더 큰 원본이 있으면 교체
- 대표 도메인과 배포 환경 확정
- Open Graph 이미지 추가
