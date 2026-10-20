# Touch-First Gallery Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove on-screen zoom and previous/next controls while adding single-finger swipe navigation and preserving native pinch zoom and keyboard accessibility.

**Architecture:** Keep gallery selection and cyclic movement inside the existing `ContentGallery`. Replace component-managed zoom with browser-native pinch behavior, and add a small touch gesture state machine scoped to the image region. Update behavior tests first, then adjust the component and user-facing documentation.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS, Vitest, Testing Library

## Global Constraints

- Do not add a gesture or gallery dependency.
- Do not call `preventDefault`; native browser pinch zoom must remain available.
- A swipe requires at least 50px horizontal movement and horizontal movement greater than vertical movement.
- Inputs with two or more touches, cancelled touches, short touches, and primarily vertical movement must not change the image.
- Preserve cyclic navigation, `ArrowLeft`, `ArrowRight`, `Escape`, focus restoration, body scroll locking, close controls, and PDF actions.
- Do not modify or stage the user's existing `next-env.d.ts`, `src/components/ui/kakao-map-sdk.test.ts`, or `tmp/` changes.

---

### Task 1: Touch-first lightbox behavior

**Files:**
- Modify: `src/components/ui/content-gallery.test.tsx`
- Modify: `src/components/ui/content-gallery.tsx`

**Interfaces:**
- Consumes: existing `ContentGalleryProps`, `MediaItem[]`, and cyclic `move(direction: number)` behavior.
- Produces: an image region with `aria-label="사진 스와이프 영역"` and single-touch swipe navigation; no zoom or previous/next screen controls.

- [ ] **Step 1: Replace the existing lightbox tests with failing behavior tests**

Keep the shared `items` fixture and write tests that exercise observable behavior:

```tsx
it("확대 뷰어에는 수동 확대와 이전·다음 버튼을 표시하지 않는다", () => {
  render(<ContentGallery items={items} variant="projects" />);
  fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));

  expect(screen.getByRole("dialog", { name: "첫 번째 확대 보기" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "확대" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "축소" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "원래 크기" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "이전 이미지" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "다음 이미지" })).not.toBeInTheDocument();
  expect(screen.getByText("1 / 2")).toBeInTheDocument();
});

it("좌우 단일 터치 스와이프로 사진을 순환 이동한다", () => {
  render(<ContentGallery items={items} variant="certificates" />);
  fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
  const swipeRegion = screen.getByLabelText("사진 스와이프 영역");

  fireEvent.touchStart(swipeRegion, { touches: [{ clientX: 180, clientY: 100 }] });
  fireEvent.touchEnd(swipeRegion, { changedTouches: [{ clientX: 80, clientY: 105 }] });
  expect(screen.getByRole("dialog", { name: "두 번째 확대 보기" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "원본 PDF 열기" })).toHaveAttribute("href", "/documents/two.pdf");

  fireEvent.touchStart(swipeRegion, { touches: [{ clientX: 80, clientY: 100 }] });
  fireEvent.touchEnd(swipeRegion, { changedTouches: [{ clientX: 180, clientY: 105 }] });
  expect(screen.getByRole("dialog", { name: "첫 번째 확대 보기" })).toBeInTheDocument();
});

it.each([
  ["짧은 터치", [{ clientX: 100, clientY: 100 }], [{ clientX: 125, clientY: 102 }]],
  ["수직 제스처", [{ clientX: 100, clientY: 100 }], [{ clientX: 120, clientY: 200 }]],
  ["멀티터치", [{ clientX: 100, clientY: 100 }, { clientX: 140, clientY: 100 }], [{ clientX: 20, clientY: 100 }]],
])("%s는 사진을 이동하지 않는다", (_name, touches, changedTouches) => {
  render(<ContentGallery items={items} variant="projects" />);
  fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
  const swipeRegion = screen.getByLabelText("사진 스와이프 영역");
  fireEvent.touchStart(swipeRegion, { touches });
  fireEvent.touchEnd(swipeRegion, { changedTouches });
  expect(screen.getByRole("dialog", { name: "첫 번째 확대 보기" })).toBeInTheDocument();
});

it("키보드로 이동하고 뷰어를 닫는다", () => {
  render(<ContentGallery items={items} variant="projects" />);
  fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
  fireEvent.keyDown(window, { key: "ArrowRight" });
  expect(screen.getByRole("dialog", { name: "두 번째 확대 보기" })).toBeInTheDocument();
  fireEvent.keyDown(window, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
npm test -- src/components/ui/content-gallery.test.tsx --run
```

Expected: FAIL because the zoom and navigation buttons still exist, `사진 스와이프 영역` does not exist, and touch gestures do not change the active item.

- [ ] **Step 3: Implement minimal touch gesture handling and remove obsolete zoom UI**

In `content-gallery.tsx`, remove `clampZoom`, the `zoom` state, all `setZoom` calls, the `+`, `-`, `=`, and `0` key handlers, the percentage copy, zoom controls, inline image width, and previous/next buttons.

Add refs and handlers inside `ContentGallery`:

```tsx
const touchStartRef = useRef<{ x: number; y: number } | null>(null);
const touchCancelledRef = useRef(false);

const resetTouch = () => {
  touchStartRef.current = null;
  touchCancelledRef.current = false;
};

const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
  if (event.touches.length !== 1) {
    touchStartRef.current = null;
    touchCancelledRef.current = true;
    return;
  }
  const touch = event.touches[0];
  touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  touchCancelledRef.current = false;
};

const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
  if (event.touches.length > 1) touchCancelledRef.current = true;
};

const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
  const start = touchStartRef.current;
  const touch = event.changedTouches[0];
  if (!start || touchCancelledRef.current || !touch) {
    resetTouch();
    return;
  }

  const deltaX = touch.clientX - start.x;
  const deltaY = touch.clientY - start.y;
  resetTouch();
  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
  move(deltaX < 0 ? 1 : -1);
};
```

Import the React event type without adding a runtime import:

```tsx
import type { TouchEvent as ReactTouchEvent } from "react";
```

Use `ReactTouchEvent<HTMLDivElement>` in the handler signatures. Attach the handlers only to the image region and preserve native gestures:

```tsx
<div
  className="relative mx-auto mt-3 flex min-h-0 w-full max-w-7xl flex-1 overflow-auto rounded bg-black/30 [touch-action:pan-y_pinch-zoom]"
  aria-label="사진 스와이프 영역"
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
  onTouchCancel={resetTouch}
>
```

Render the image without component zoom sizing:

```tsx
<Image
  src={activeItem.src!}
  alt={activeItem.alt}
  width={activeItem.width}
  height={activeItem.height}
  quality={90}
  sizes="100vw"
  className="h-auto max-h-full w-auto max-w-full object-contain"
  priority
/>
```

Render the PDF actions in a centered footer only when present:

```tsx
{activeItem.documentHref && (
  <div className="mx-auto mt-3 flex w-full max-w-7xl justify-center gap-2">
    <a href={activeItem.documentHref} target="_blank" rel="noreferrer" className="focus-ring rounded bg-[var(--brand-gold)] px-4 py-2 text-sm font-bold text-[var(--navy-950)]">원본 PDF 열기</a>
    <a href={activeItem.documentHref} download className="focus-ring hidden rounded border border-white/30 px-4 py-2 text-sm text-white sm:block">PDF 다운로드</a>
  </div>
)}
```

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run:

```bash
npm test -- src/components/ui/content-gallery.test.tsx --run
```

Expected: all `content-gallery` tests PASS with no warnings.

- [ ] **Step 5: Commit the tested component change**

```bash
git add src/components/ui/content-gallery.tsx src/components/ui/content-gallery.test.tsx
git commit -m "feat: add touch-first gallery navigation"
```

### Task 2: User-facing documentation and full verification

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the completed touch-first gallery behavior from Task 1.
- Produces: accurate repository documentation describing pinch, swipe, and keyboard behavior.

- [ ] **Step 1: Update outdated gallery documentation**

Replace claims that the gallery provides button-controlled 50–250% zoom and on-screen previous/next navigation. Describe the completed behavior precisely:

```markdown
- 모바일 기본 핀치 확대, 좌우 스와이프 탐색
- 데스크톱 좌우 방향키 탐색과 Esc 닫기
```

Update the component description to:

```markdown
- `src/components/ui/content-gallery.tsx`: 이미지 카드, 전체화면 보기, 터치 스와이프·키보드 탐색, PDF 연결
```

- [ ] **Step 2: Run complete automated verification**

Run each command separately:

```bash
npm test -- --run
npm run lint
npm run typecheck
npm run build
```

Expected: every command exits 0; all tests pass; ESLint reports no warnings; TypeScript reports no errors; Next.js production build completes successfully.

- [ ] **Step 3: Review the final diff and confirm scope**

Run:

```bash
git diff --check
git diff -- src/components/ui/content-gallery.tsx src/components/ui/content-gallery.test.tsx README.md
git status --short
```

Expected: no whitespace errors; diff contains only the approved gallery behavior and documentation changes; unrelated user files remain unstaged.

- [ ] **Step 4: Commit documentation**

```bash
git add README.md
git commit -m "docs: describe touch gallery controls"
```

- [ ] **Step 5: Perform mobile interaction verification**

Start the development server with `npm run dev` and verify in a mobile-sized browser:

1. Open a project image and confirm there are no zoom or previous/next buttons.
2. Pinch with two fingers and confirm browser-native zoom remains available.
3. Swipe left and right with one finger and confirm cyclic image movement.
4. Swipe mostly vertically and confirm the image does not change.
5. Open a certificate and confirm PDF actions remain usable.
6. Confirm the close button works and the background page does not scroll while the viewer is open.
