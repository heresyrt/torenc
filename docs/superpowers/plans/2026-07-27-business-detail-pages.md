# 사업분야 상세 페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 여섯 사업 카드를 독립적인 정적 상세 페이지로 연결하고 기존 사이트 문구·공정 정보를 고해상도 사진과 함께 제공한다.

**Architecture:** `siteData.businesses`를 상세 페이지의 단일 콘텐츠 원천으로 확장하고, App Router의 `/business/[slug]` 정적 경로가 해당 레코드를 렌더링한다. 홈페이지는 전용 링크 카드로 바꾸고, 상세 페이지의 공정·제품 사진은 기존 전체화면 이미지 갤러리를 재사용한다.

**Tech Stack:** Next.js App Router static export, TypeScript, React, Tailwind CSS, Vitest, Next Image

## Global Constraints

- 기존 `buField1`~`buField6`의 한국어 설명, 설치 순서 및 경관 옹벽 제품 분류를 사용한다.
- mp4는 복사·배포·표시하지 않으며 영상 UI를 만들지 않는다.
- 전달 원본의 사진만 `public/images/business/details/`로 복사하고 영문 소문자·하이픈 파일명을 사용한다.
- 상세 URL은 `tor-self-supporting-wall`, `cut-slope-wall`, `reinforced-soil-wall`, `gravity-wall`, `landscape-wall`, `natural-stone-wall`이다.
- 유효하지 않은 slug는 404를 반환하며, 모든 유효 페이지는 `output: "export"`에서 빌드되어야 한다.
- 기존 작업과 무관한 `next-env.d.ts`, `tmp/`는 커밋하지 않는다.

---

### Task 1: 상세 사업 데이터 모델과 원본 사진 준비

**Files:**
- Modify: `src/types/site.ts`
- Modify: `src/data/site-data.ts`
- Modify: `src/data/site-data.test.ts`
- Create: `public/images/business/details/*.jpg`
- Create: `public/images/business/details/*.png`

**Interfaces:**
- Produces: `BusinessItem` with `slug`, `overview`, `detailImages`, and optional `detailSectionTitle`.
- Produces: `DetailImageItem extends MediaItem` with `step` and `fit: "cover" | "contain"`.
- Consumed by: homepage link cards and `/business/[slug]/page.tsx`.

- [ ] **Step 1: Write failing data tests**

```ts
it("사업분야마다 고유 상세 경로와 이미지 자료를 제공한다", () => {
  expect(siteData.businesses.map((item) => item.slug)).toEqual([
    "tor-self-supporting-wall",
    "cut-slope-wall",
    "reinforced-soil-wall",
    "gravity-wall",
    "landscape-wall",
    "natural-stone-wall",
  ]);

  for (const item of siteData.businesses) {
    expect(item.overview.length).toBeGreaterThan(0);
    expect(item.detailImages.length).toBeGreaterThan(0);
    expect(item.detailImages.every(({ src }) => src?.startsWith("/images/business/details/"))).toBe(true);
  }
});
```

- [ ] **Step 2: Run the data test and verify the intended failure**

Run: `npm test -- --run src/data/site-data.test.ts`

Expected: FAIL because the existing `BusinessItem` has no `slug`, `overview`, or `detailImages`.

- [ ] **Step 3: Copy only still-image inputs with web-safe names**

Copy the matching photos from `tmp/image/사업분야_디테일/` into six folders under `public/images/business/details/`:

```text
tor-self-supporting-wall/step-01-work-road.jpg ... step-06-finish.jpg
cut-slope-wall/step-01-excavation.jpg ... step-06-finish.jpg
reinforced-soil-wall/step-01-excavation.jpg ... step-06-finish.jpg
gravity-wall/step-01-excavation.jpg ... step-06-finish.jpg
landscape-wall/type-01-landscape-block.png ... type-15-pedestrian-block.png
natural-stone-wall/step-01-slope-drilling.png ... step-06-finish.jpg
```

Exclude every `.mp4` and the source `.pptx`. Obtain each copied file's actual width and height using `sips -g pixelWidth -g pixelHeight`.

- [ ] **Step 4: Extend the data types and add business detail records**

Add this shape to `src/types/site.ts`:

```ts
export interface DetailImageItem extends MediaItem {
  step: string;
  fit: "cover" | "contain";
}

export interface BusinessItem {
  number: string;
  slug: string;
  title: string;
  description: string;
  overview: string[];
  media: MediaItem;
  detailSectionTitle: string;
  detailImages: DetailImageItem[];
}
```

Populate all six records with the existing-page copy. Use `설치 순서` for business 01–04 and 06; use `경관 옹벽 종류` for business 05. For business 05 set `fit: "contain"`; all other detail images use `fit: "cover"`.

- [ ] **Step 5: Run data tests and verify they pass**

Run: `npm test -- --run src/data/site-data.test.ts`

Expected: all site-data tests pass, including the six-slug and image assertions.

- [ ] **Step 6: Commit the data and asset changes**

```bash
git add src/types/site.ts src/data/site-data.ts src/data/site-data.test.ts public/images/business/details
git commit -m "feat: add business detail content"
```

### Task 2: Reusable business detail image gallery

**Files:**
- Modify: `src/components/ui/content-gallery.tsx`
- Modify: `src/components/ui/content-gallery.test.tsx`

**Interfaces:**
- Consumes: `DetailImageItem[]`, `variant="detail"`, and `numbers`.
- Produces: responsive detail cards with `cover` or `contain` fit and existing full-screen viewer behavior.

- [ ] **Step 1: Write failing gallery tests**

```tsx
it("상세 갤러리에 단계 제목과 번호를 표시한다", () => {
  render(<ContentGallery variant="detail" items={[detailImage]} numbers={["01"]} />);

  expect(screen.getByText("01")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "장비 작업로 개설" })).toBeInTheDocument();
});

it("제품 이미지는 contain 방식으로 렌더링한다", () => {
  render(<ContentGallery variant="detail" items={[{ ...detailImage, fit: "contain" }]} />);

  expect(screen.getByRole("img", { name: detailImage.alt }).className).toContain("object-contain");
});
```

- [ ] **Step 2: Run the focused gallery test and verify it fails**

Run: `npm test -- --run src/components/ui/content-gallery.test.tsx`

Expected: FAIL because `detail` is not an accepted gallery variant and `fit` is unused.

- [ ] **Step 3: Implement the minimum detail variant**

Extend `ContentGalleryProps.variant` with `"detail"`. Give it a 1/2/3-column responsive grid, render `DetailImageItem.step` as the card title, and choose the image class from `item.fit`. Preserve the existing click-to-open dialog, keyboard controls, thumbnails, swipe, and zoom behavior.

- [ ] **Step 4: Run gallery tests and verify they pass**

Run: `npm test -- --run src/components/ui/content-gallery.test.tsx`

Expected: all gallery tests pass.

- [ ] **Step 5: Commit the reusable gallery behavior**

```bash
git add src/components/ui/content-gallery.tsx src/components/ui/content-gallery.test.tsx
git commit -m "feat: support business detail galleries"
```

### Task 3: Static business detail routes and homepage links

**Files:**
- Create: `src/app/business/[slug]/page.tsx`
- Create: `src/app/business/[slug]/page.test.tsx`
- Modify: `src/components/sections/business.tsx`
- Modify: `src/components/sections/business.test.tsx`

**Interfaces:**
- Consumes: `siteData.businesses` detail properties and `ContentGallery variant="detail"`.
- Produces: six pre-rendered pages returned from `generateStaticParams()` and linked homepage business cards.

- [ ] **Step 1: Write failing route and card tests**

```tsx
it("모든 사업분야 slug를 정적으로 생성한다", async () => {
  expect(await generateStaticParams()).toEqual(siteData.businesses.map(({ slug }) => ({ slug })));
});

it("사업 카드를 해당 상세 페이지로 연결한다", () => {
  render(<Business />);

  expect(screen.getByRole("link", { name: /TOR 자립식 옹벽 상세 보기/ })).toHaveAttribute(
    "href",
    "/business/tor-self-supporting-wall",
  );
});
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run: `npm test -- --run src/app/business/[slug]/page.test.tsx src/components/sections/business.test.tsx`

Expected: FAIL because the route module and link cards do not exist.

- [ ] **Step 3: Add the page route with metadata and 404 handling**

Implement `generateStaticParams`, `generateMetadata`, and the async page component. Lookup the record by slug; call `notFound()` when absent. The page must render a breadcrumb-style `사업분야` link to `/#business`, its number/title, every `overview` line, one lead image, the detail section heading, `ContentGallery`, and neighboring business links.

- [ ] **Step 4: Replace homepage lightbox cards with link cards**

Render each item as a semantic `Link` with its existing image, number, title, description, and a visible `상세 보기 →` label. Keep the section's responsive 3-column layout and hover/focus treatment consistent with the rest of the site.

- [ ] **Step 5: Run route and homepage tests and verify they pass**

Run: `npm test -- --run src/app/business/[slug]/page.test.tsx src/components/sections/business.test.tsx`

Expected: all tests pass and the invalid-slug behavior is covered through the mocked `notFound()` assertion.

- [ ] **Step 6: Commit the routed UI**

```bash
git add src/app/business/[slug]/page.tsx src/app/business/[slug]/page.test.tsx src/components/sections/business.tsx src/components/sections/business.test.tsx
git commit -m "feat: add business detail pages"
```

### Task 4: Full static-site verification

**Files:**
- Verify only: `out/`

**Interfaces:**
- Consumes: Tasks 1–3
- Produces: verified static pages and assets for Cloudflare Pages.

- [ ] **Step 1: Run all automated checks**

```bash
npm test -- --run
npm run lint
npm run typecheck
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=test-build-key npm run build
```

Expected: all commands exit 0.

- [ ] **Step 2: Verify each static page and representative detail asset**

```bash
test -f out/business/tor-self-supporting-wall.html
test -f out/business/cut-slope-wall.html
test -f out/business/reinforced-soil-wall.html
test -f out/business/gravity-wall.html
test -f out/business/landscape-wall.html
test -f out/business/natural-stone-wall.html
test -f out/images/business/details/tor-self-supporting-wall/step-01-work-road.jpg
```

Expected: every command exits 0.

- [ ] **Step 3: Verify videos are not deployed**

Run: `if find out -type f -iname '*.mp4' -print | rg .; then exit 1; fi`

Expected: no output and exit 0.

- [ ] **Step 4: Check final change scope**

Run: `git diff --check && git status -sb`

Expected: no whitespace errors; no staged or committed change to `next-env.d.ts`; `tmp/` remains untracked.
