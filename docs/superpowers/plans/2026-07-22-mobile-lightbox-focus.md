# Mobile Lightbox Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the mobile lightbox close button visible and operable without showing its focus ring immediately after the viewer opens.

**Architecture:** Keep focus inside the modal on every viewport. At the existing Tailwind `md` breakpoint (`768px`), focus the close button on desktop and focus the dialog container on smaller screens; the container is programmatically focusable and has no outline.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vitest, Testing Library

## Global Constraints

- The close button must remain rendered and touch-operable on mobile.
- Desktop close-button autofocus, Escape closing, arrow-key navigation, and trigger focus restoration must remain unchanged.
- Do not modify the global `focus-ring` style or any image zoom, pan, swipe, or navigation behavior.

---

### Task 1: Responsive lightbox focus target

**Files:**
- Modify: `src/components/ui/content-gallery.tsx:29-33,209-224,265-269`
- Test: `src/components/ui/content-gallery.test.tsx:1-3,255-263`

**Interfaces:**
- Consumes: `window.matchMedia("(min-width: 768px)").matches`, existing `closeButtonRef`, and the lightbox dialog element.
- Produces: mobile dialog-container focus and desktop close-button focus when the lightbox opens.

- [ ] **Step 1: Write failing mobile and desktop focus tests**

Add a local media-query stub and two behavior tests:

```tsx
const setDesktopViewport = (matches: boolean) => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches }));
};

it("모바일에서 확대 화면을 열면 닫기 버튼 대신 뷰어에 포커스를 둔다", () => {
  setDesktopViewport(false);
  render(<ContentGallery items={items} variant="projects" />);

  fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));

  expect(screen.getByRole("dialog", { name: "첫 번째 확대 보기" })).toHaveFocus();
  expect(screen.getByRole("button", { name: "확대 보기 닫기" })).not.toHaveFocus();
});

it("데스크톱에서 확대 화면을 열면 닫기 버튼에 포커스를 둔다", () => {
  setDesktopViewport(true);
  render(<ContentGallery items={items} variant="projects" />);

  fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));

  expect(screen.getByRole("button", { name: "확대 보기 닫기" })).toHaveFocus();
});
```

Use `afterEach(() => vi.unstubAllGlobals())` so media-query state does not leak between tests.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm test -- src/components/ui/content-gallery.test.tsx -t "포커스를 둔다" --run`

Expected: FAIL because the dialog is not focusable and the close button receives focus at mobile width.

- [ ] **Step 3: Add responsive focus targeting**

Add the dialog ref:

```tsx
const dialogRef = useRef<HTMLDivElement>(null);
```

Replace unconditional close-button focus with:

```tsx
const isDesktop = window.matchMedia?.("(min-width: 768px)").matches ?? false;
(isDesktop ? closeButtonRef.current : dialogRef.current)?.focus({ preventScroll: true });
```

Make the dialog programmatically focusable without an outline:

```tsx
<div
  ref={dialogRef}
  tabIndex={-1}
  className="overlay-screen z-[100] flex flex-col overflow-hidden bg-black p-3 outline-none sm:p-6"
  role="dialog"
  aria-modal="true"
  aria-label={`${activeItem.title} 확대 보기`}
>
```

- [ ] **Step 4: Run the component tests and verify GREEN**

Run: `npm test -- src/components/ui/content-gallery.test.tsx --run`

Expected: all `content-gallery` tests PASS.

- [ ] **Step 5: Run project verification**

Run: `npm test -- --run`

Expected: all tests PASS.

Run: `npm run lint`

Expected: ESLint exits successfully with no warnings.

Run: `npm run typecheck`

Expected: TypeScript exits successfully with no errors.

Run: `npm run build`

Expected: Next.js production build completes successfully.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 6: Commit the focused change**

```bash
git add docs/superpowers/plans/2026-07-22-mobile-lightbox-focus.md src/components/ui/content-gallery.tsx src/components/ui/content-gallery.test.tsx
git commit -m "fix: avoid mobile lightbox close focus ring"
```
