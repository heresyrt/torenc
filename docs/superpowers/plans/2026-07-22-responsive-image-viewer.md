# Responsive Image Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add responsive desktop controls and image-only touch zoom/pan behavior to the existing full-screen content gallery.

**Architecture:** Keep modal ownership, navigation, and accessibility in `ContentGallery`, while extracting scale and pan calculations into pure utilities. Use pointer events for mouse dragging and multi-touch pinch tracking, with gesture behavior selected by current scale.

**Tech Stack:** React 19, Next.js 15, TypeScript, Tailwind CSS, Vitest, Testing Library

## Global Constraints

- Scale is clamped from `1` (fit) through `3` (maximum).
- Changing the active image, fitting the image, or returning to scale `1` resets pan to `{ x: 0, y: 0 }`.
- Desktop shows previous/next arrows, thumbnails, zoom out, zoom in, and fit controls; it does not show a scroll-to-content control.
- Mobile keeps viewer chrome fixed and transforms only the image.
- At scale `1`, a one-finger horizontal swipe navigates; above scale `1`, one-finger drag pans without navigating.
- Existing Escape, arrow-key navigation, focus restoration, body scroll locking, and PDF links remain functional.
- Add no runtime dependency.

---

### Task 1: Transform State Utilities

**Files:**
- Create: `src/components/ui/image-viewer-transform.ts`
- Test: `src/components/ui/image-viewer-transform.test.ts`

**Interfaces:**
- Produces: `MIN_SCALE`, `MAX_SCALE`, `SCALE_STEP`, `Point`, `ViewerTransform`, `clampScale(scale)`, `changeScale(transform, requestedScale)`, and `clampPan(point, scale, viewport, image)`.

- [ ] **Step 1: Write failing utility tests**

Test that scale clamps to `1...3`, reaching `1` resets pan, and pan is clamped to the overflow created by a scaled contained image.

- [ ] **Step 2: Verify the utility tests fail**

Run: `npm test -- src/components/ui/image-viewer-transform.test.ts`
Expected: FAIL because `image-viewer-transform.ts` does not exist.

- [ ] **Step 3: Implement the pure transform helpers**

Use immutable return values, `Math.min`/`Math.max` scale clamping, contained image dimensions derived from viewport and intrinsic aspect ratios, and half-overflow bounds for x/y pan.

- [ ] **Step 4: Verify the utility tests pass**

Run: `npm test -- src/components/ui/image-viewer-transform.test.ts`
Expected: PASS.

### Task 2: Desktop Navigation and Zoom Controls

**Files:**
- Modify: `src/components/ui/content-gallery.tsx`
- Modify: `src/components/ui/content-gallery.test.tsx`

**Interfaces:**
- Consumes: transform utilities from Task 1.
- Produces: accessible desktop buttons named `이전 이미지`, `다음 이미지`, `축소`, `확대`, `화면 맞춤`, plus thumbnail buttons named `<title> 썸네일`.

- [ ] **Step 1: Replace the obsolete control-absence test with failing desktop interaction tests**

Assert that arrows cycle through items, thumbnail selection opens the requested item, `aria-current` follows the active thumbnail, zoom buttons adjust the image transform, and fit resets it.

- [ ] **Step 2: Verify the component tests fail**

Run: `npm test -- src/components/ui/content-gallery.test.tsx`
Expected: FAIL because the controls and thumbnail strip are absent.

- [ ] **Step 3: Implement desktop controls and reset-on-navigation behavior**

Add transform state, reset it inside all item changes, render responsive arrow buttons and a horizontally scrollable thumbnail strip, and render the three-button toolbar. Apply translate and scale only to an image wrapper marked `data-testid="viewer-image-transform"`.

- [ ] **Step 4: Verify the component tests pass**

Run: `npm test -- src/components/ui/content-gallery.test.tsx`
Expected: PASS for desktop controls and all existing keyboard/PDF behavior.

### Task 3: Mouse Pan and Mobile Gesture Arbitration

**Files:**
- Modify: `src/components/ui/content-gallery.tsx`
- Modify: `src/components/ui/content-gallery.test.tsx`

**Interfaces:**
- Consumes: `clampScale`, `changeScale`, and `clampPan` from Task 1.
- Produces: pointer handlers that pan above scale `1`, navigate by single-pointer swipe at scale `1`, and pinch the image with two touch pointers.

- [ ] **Step 1: Write failing gesture tests**

Assert that desktop left-button drag changes translate only after zooming, scale-1 swipe navigates, zoomed single-touch drag pans without navigation, two-pointer pinch changes image scale without changing dialog or toolbar transforms, and pointer cancellation ends movement.

- [ ] **Step 2: Verify the gesture tests fail**

Run: `npm test -- src/components/ui/content-gallery.test.tsx`
Expected: FAIL because the pointer gesture state machine is absent.

- [ ] **Step 3: Implement pointer tracking and gesture arbitration**

Track active pointers in a ref, capture pointers on the image viewport, store drag or pinch baselines, and update transform using functional state changes. Apply `touch-action: none` only to the image viewport so the modal UI remains independently operable. At scale `1`, evaluate the existing 50px horizontal swipe threshold; above scale `1`, clamp pan and suppress navigation.

- [ ] **Step 4: Verify gesture and regression tests pass**

Run: `npm test -- src/components/ui/content-gallery.test.tsx`
Expected: PASS, including keyboard, PDF, swipe, pinch, and pan cases.

### Task 4: Full Verification and Browser QA

**Files:**
- No planned file changes; failures return to the owning task before this verification task is completed.

**Interfaces:**
- Produces: verified responsive viewer behavior with no regressions.

- [ ] **Step 1: Run focused and full automated verification**

Run: `npm test -- src/components/ui/image-viewer-transform.test.ts src/components/ui/content-gallery.test.tsx`, `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
Expected: every command exits `0` without new warnings.

- [ ] **Step 2: Inspect the viewer in desktop and mobile browser sizes**

Verify desktop arrows, thumbnails, toolbar, zoom, and mouse pan; then verify mobile fixed chrome, scale-1 swipe, pinch zoom, and zoomed pan. Confirm the selected thumbnail remains visible and controls do not overlap the image or PDF links.

- [ ] **Step 3: Review the final diff**

Run: `git diff --check` and `git diff -- src/components/ui/content-gallery.tsx src/components/ui/content-gallery.test.tsx src/components/ui/image-viewer-transform.ts src/components/ui/image-viewer-transform.test.ts`.
Expected: no whitespace errors, unrelated changes, debug output, or accidental edits to `tmp/`.
