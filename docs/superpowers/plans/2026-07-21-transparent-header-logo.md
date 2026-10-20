# Transparent Header Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 스크롤 시 헤더와 로고 사이에 보이는 네이비 사각형을 제거한다.

**Architecture:** 불투명 로고 원본에서 배경색과의 색상 거리를 알파값으로 변환해 투명 PNG를 생성한다. 헤더와 푸터는 새 자산을 사용하며 헤더 합성색은 불투명 브랜드 네이비로 고정한다.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Sharp, Vitest

## Global Constraints

- 로고의 흰색·골드 요소와 현재 표시 크기를 유지한다.
- `tmp/`와 제공받은 원본 파일은 수정하지 않는다.

---

### Task 1: 투명 로고 자산과 헤더 적용

**Files:**
- Modify: `src/app/page.test.tsx`
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/layout/footer.tsx`
- Create: `scripts/create-transparent-logo.mjs`
- Create: `public/images/brand/logo-horizontal-transparent.png`

**Interfaces:**
- Consumes: 불투명 로고 `public/images/brand/logo-horizontal-dark.png`
- Produces: 알파 채널 로고 `public/images/brand/logo-horizontal-transparent.png`

- [x] **Step 1: 헤더와 푸터가 투명 로고 경로를 사용해야 한다는 실패 테스트를 작성한다.**
- [x] **Step 2: `npm test -- --run src/app/page.test.tsx`를 실행해 기존 경로 때문에 실패함을 확인한다.**
- [x] **Step 3: Sharp 스크립트로 배경색 `#2c3f4f`를 투명화하고 새 PNG를 생성한다.**
- [x] **Step 4: 헤더·푸터 이미지 경로를 변경하고 헤더의 `/95`, `backdrop-blur-xl`을 제거한다.**
- [x] **Step 5: 테스트, 린트, 타입 검사, 빌드와 브라우저 스크롤 검증을 수행한다.**
- [x] **Step 6: 구현 파일만 커밋하고 `tmp/`는 제외한다.**
