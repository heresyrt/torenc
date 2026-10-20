# Project Categories and Sixth Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 시공실적을 6개로 확장하고 각 카드에 현장별 공법명을 표시한다.

**Architecture:** 기존 `SiteData.projects` 배열을 단일 데이터 소스로 유지하고 `MediaItem.meta`에 공법명을 저장한다. 기존 `ContentGallery`가 이 값을 그대로 표시하고 확대 보기에 새 항목을 자동 포함하므로 컴포넌트 구조는 변경하지 않는다.

**Tech Stack:** Next.js, React, TypeScript, Vitest, Next Image

## Global Constraints

- 기존 카드 레이아웃과 골드색 메타 텍스트 위치를 유지한다.
- 프로젝트는 정확히 6개 표시한다.
- 정읍 이미지는 새 원본으로 교체하고 화성 이미지는 영문 파일명으로 공개 경로에 추가한다.
- 공법명은 사업 분야 표기와 동일하게 사용한다.
- 새로운 UI 필터나 이미지 위 배지는 추가하지 않는다.

---

### Task 1: 프로젝트 데이터 요구사항을 테스트로 고정

**Files:**
- Modify: `src/data/site-data.test.ts`
- Test: `src/data/site-data.test.ts`

**Interfaces:**
- Consumes: `siteData.projects: MediaItem[]`
- Produces: 프로젝트 수, 제목, 공법명에 대한 회귀 테스트

- [ ] **Step 1: 실패하는 테스트 작성**

```ts
expect(siteData.projects).toHaveLength(6);
expect(siteData.projects.map(({ title }) => title)).toContain("화성 석포리 현장");
expect(siteData.projects.map(({ meta }) => meta)).toEqual([
  "TOR 자립식 옹벽",
  "절토부옹벽",
  "보강토 옹벽",
  "보강토 옹벽",
  "산석 옹벽",
  "절토부옹벽",
]);
```

- [ ] **Step 2: 테스트가 올바르게 실패하는지 확인**

Run: `npm test -- src/data/site-data.test.ts`
Expected: 프로젝트 개수 5와 기존 `시공실적` 메타 때문에 FAIL

- [ ] **Step 3: 다음 작업에서 구현할 수 있도록 실패 상태 유지**

코드 변경 없이 실패 원인이 요구사항과 일치하는지 확인한다.

---

### Task 2: 이미지 자산과 프로젝트 데이터 구현

**Files:**
- Modify: `public/images/projects/jeongeup-naejangsan-resort.jpg`
- Create: `public/images/projects/hwaseong-seokpo-ri.jpg`
- Modify: `src/data/site-data.ts`
- Test: `src/data/site-data.test.ts`

**Interfaces:**
- Consumes: `MediaItem`의 `id`, `title`, `description`, `alt`, `width`, `height`, `src`, `meta`
- Produces: `siteData.projects`의 6개 완전한 프로젝트 항목

- [ ] **Step 1: 이미지 파일 준비**

`tmp/image/시공실적/정읍 내장산 리조트 현장.jpg`를 기존 공개 정읍 이미지에 복사하고, `tmp/image/시공실적/화성 석포리 현장.jpeg`를 `public/images/projects/hwaseong-seokpo-ri.jpg`로 복사한다.

- [ ] **Step 2: 최소 데이터 구현**

기존 다섯 프로젝트의 `meta`를 승인된 공법명으로 바꾸고 아래 항목을 배열 끝에 추가한다.

```ts
{
  id: "project-06",
  title: "화성 석포리 현장",
  description: "화성 석포리 절토부옹벽 시공 현장",
  alt: "화성 석포리 절토부옹벽 시공 현장",
  width: 4032,
  height: 3024,
  src: "/images/projects/hwaseong-seokpo-ri.jpg",
  meta: "절토부옹벽",
}
```

- [ ] **Step 3: 데이터 테스트 통과 확인**

Run: `npm test -- src/data/site-data.test.ts`
Expected: PASS

- [ ] **Step 4: 이미지 실제 크기 확인**

Run: `sips -g pixelWidth -g pixelHeight public/images/projects/jeongeup-naejangsan-resort.jpg public/images/projects/hwaseong-seokpo-ri.jpg`
Expected: 정읍 `1280 × 960`, 화성 `4032 × 3024`로 데이터 선언과 정확히 일치

---

### Task 3: 전체 회귀 검증

**Files:**
- Verify: `src/data/site-data.ts`
- Verify: `src/data/site-data.test.ts`
- Verify: `public/images/projects/jeongeup-naejangsan-resort.jpg`
- Verify: `public/images/projects/hwaseong-seokpo-ri.jpg`

**Interfaces:**
- Consumes: 완성된 프로젝트 데이터와 공개 이미지 자산
- Produces: 배포 가능한 검증 결과

- [ ] **Step 1: 전체 테스트 실행**

Run: `npm test`
Expected: 모든 테스트 PASS

- [ ] **Step 2: 린트 실행**

Run: `npm run lint`
Expected: 오류 없이 종료

- [ ] **Step 3: 프로덕션 빌드 실행**

Run: `npm run build`
Expected: Next.js 프로덕션 빌드 성공

- [ ] **Step 4: 변경 내용 점검**

Run: `git diff --check && git status --short`
Expected: 공백 오류가 없고 이번 작업 파일과 사용자 제공 `tmp/` 파일만 표시

---

### Task 4: 공법 기준 정렬과 라벨 가독성 개선

**Files:**
- Modify: `src/data/site-data.test.ts`
- Modify: `src/data/site-data.ts`
- Modify: `src/components/ui/content-gallery.test.tsx`
- Modify: `src/components/ui/content-gallery.tsx`

**Interfaces:**
- Consumes: `siteData.projects: MediaItem[]`, `ContentGallery`의 프로젝트 카드 메타 텍스트
- Produces: `TOR → 절토부 → 보강토 → 산석` 프로젝트 배열과 `text-sm` 공법명

- [ ] **Step 1: 정렬과 글자 크기에 대한 실패 테스트 작성**

프로젝트 제목 배열을 `거제 → 정읍 → 화성 → 곤지암 → 공주 → 평택`으로 검증하고, 프로젝트 공법명 요소에 `text-sm` 클래스가 있는지 검증한다.

- [ ] **Step 2: 테스트가 올바르게 실패하는지 확인**

Run: `npm test -- src/data/site-data.test.ts src/components/ui/content-gallery.test.tsx`
Expected: 현재 화성이 배열 끝에 있고 공법명 요소가 `text-xs`이므로 FAIL

- [ ] **Step 3: 최소 구현**

`siteData.projects`에서 화성 항목을 정읍 다음으로 이동한다. `ContentGallery`의 메타 텍스트 클래스를 프로젝트 변형에 한해 `text-sm`으로 변경하고, 인증서 및 사업 분야의 기존 크기는 유지한다.

- [ ] **Step 4: 대상 테스트 통과 확인**

Run: `npm test -- src/data/site-data.test.ts src/components/ui/content-gallery.test.tsx`
Expected: PASS

- [ ] **Step 5: 전체 회귀 검증**

Run: `npm test && npm run lint && npm run build`
Expected: 모든 테스트, 린트, 프로덕션 빌드 성공
