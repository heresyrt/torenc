# Original Image Lightbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the stored original image only for the active lightbox image so mobile zoom uses the highest available source resolution.

**Architecture:** Keep `next/image` optimization for gallery cards and thumbnails. Mark only the active lightbox `Image` as `unoptimized`, which makes its rendered `src` point directly to the `/public` asset while preserving intrinsic dimensions, accessibility, and the existing transform layer.

**Tech Stack:** React, Next.js `Image`, TypeScript, Tailwind CSS, Vitest, Testing Library

## Global Constraints

- Gallery cards and thumbnails retain existing Next.js image optimization.
- Only an opened lightbox image requests the original `/images/...` asset.
- Existing fit, pinch zoom, pan, swipe, keyboard navigation, and PDF actions remain unchanged.
- Low-resolution originals receive no upscaling or image-specific zoom restriction.
- Add no runtime dependency and modify no source image files.

---

### Task 1: Load the Original Asset in the Lightbox

**Files:**
- Modify: `src/test/setup.tsx`
- Modify: `src/components/ui/content-gallery.test.tsx`
- Modify: `src/components/ui/content-gallery.tsx:291`

**Interfaces:**
- Consumes: `MediaItem.src`, `MediaItem.width`, and `MediaItem.height` already used by `ContentGallery`.
- Produces: an active lightbox `Image` with `unoptimized={true}` and a direct source path; card and thumbnail images remain optimized.

- [ ] **Step 1: Expose the Next Image optimization mode in tests**

Update the existing `next/image` mock so it removes the non-DOM `unoptimized` prop and exposes it as a stable test attribute:

```tsx
vi.mock("next/image", () => ({
  default: ({ priority, unoptimized, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean; unoptimized?: boolean }) => {
    void priority;
    return createElement("img", {
      alt: props.alt ?? "",
      ...props,
      "data-unoptimized": unoptimized ? "true" : "false",
    });
  },
}));
```

- [ ] **Step 2: Write the failing component test**

Add this test to `src/components/ui/content-gallery.test.tsx`:

```tsx
it("확대 화면에서만 저장된 원본 이미지를 직접 사용한다", () => {
  render(<ContentGallery items={items} variant="projects" />);

  const cardImage = screen.getByRole("img", { name: "첫 이미지" });
  expect(cardImage).toHaveAttribute("data-unoptimized", "false");

  fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));

  const [listedImage, lightboxImage] = screen.getAllByRole("img", { name: "첫 이미지" });
  expect(listedImage).toHaveAttribute("data-unoptimized", "false");
  expect(lightboxImage).toHaveAttribute("src", "/images/one.jpg");
  expect(lightboxImage).toHaveAttribute("data-unoptimized", "true");
});
```

- [ ] **Step 3: Run the test and confirm the feature is absent**

Run: `npm test -- src/components/ui/content-gallery.test.tsx -t "확대 화면에서만 저장된 원본 이미지를 직접 사용한다"`

Expected: FAIL because the lightbox image has `data-unoptimized="false"`.

- [ ] **Step 4: Enable original loading for the active lightbox image**

Change only the main lightbox image in `src/components/ui/content-gallery.tsx`:

```tsx
<Image
  src={activeItem.src!}
  alt={activeItem.alt}
  width={activeItem.width}
  height={activeItem.height}
  unoptimized
  className="h-auto max-h-full w-auto max-w-full select-none object-contain"
  priority
  draggable={false}
/>
```

Removing `quality` and `sizes` here is intentional because neither affects an unoptimized image. Do not add `unoptimized` to card or thumbnail images.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- src/components/ui/content-gallery.test.tsx`

Expected: PASS for the new source-selection test and all existing gallery interaction tests.

- [ ] **Step 6: Run full verification**

Run: `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.

Expected: all commands exit `0`; lint reports no unknown DOM-property warning because the mock consumes `unoptimized`.

- [ ] **Step 7: Review and commit the implementation**

Run: `git diff --check` and `git diff -- src/test/setup.tsx src/components/ui/content-gallery.test.tsx src/components/ui/content-gallery.tsx`.

Expected: no whitespace errors, no change to card or thumbnail optimization, and no unrelated file changes.

```bash
git add src/test/setup.tsx src/components/ui/content-gallery.test.tsx src/components/ui/content-gallery.tsx
git commit -m "fix: load original images in gallery lightbox"
```
