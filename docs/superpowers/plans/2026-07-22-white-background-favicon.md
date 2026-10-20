# White Background Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dark-background application icon with a crisp square favicon made from the dark navy and beige symbol on the white side of the supplied original artwork.

**Architecture:** Keep Next.js's existing file-based favicon convention and replace only `src/app/icon.png`. Add an asset-level Vitest assertion using Sharp so the favicon's square dimensions, white canvas, and visible centered artwork remain protected.

**Tech Stack:** Next.js App Router, PNG, Sharp, Vitest, Poppler/Pillow extraction tools

## Global Constraints

- Use the symbol from the left, white-background half of `로고 원본.ai`.
- Use the dark navy and beige symbol without Korean or English wordmarks.
- Keep a square white canvas and leave all other brand assets unchanged.
- Do not redraw or reinterpret the logo.

---

### Task 1: Replace and Verify the Application Favicon

**Files:**
- Modify: `src/app/icon.png`
- Modify: `src/test/image-config.test.ts`

**Interfaces:**
- Consumes: the white-background symbol embedded in `/Users/grapevine/Downloads/상언이 홈피/로고 원본.ai`
- Produces: a 512 × 512 RGB PNG at `src/app/icon.png`, automatically exposed by Next.js as the application icon

- [x] **Step 1: Add a failing favicon asset test**

Add this test to `src/test/image-config.test.ts`:

```ts
it("흰 바탕용 심볼을 정사각형 파비콘으로 사용한다", async () => {
  const icon = sharp("src/app/icon.png");
  const metadata = await icon.metadata();
  const corners = await Promise.all(
    [
      { left: 0, top: 0 },
      { left: 511, top: 0 },
      { left: 0, top: 511 },
      { left: 511, top: 511 },
    ].map(({ left, top }) =>
      icon.clone().extract({ left, top, width: 1, height: 1 }).raw().toBuffer(),
    ),
  );

  expect(metadata.width).toBe(512);
  expect(metadata.height).toBe(512);
  expect(metadata.hasAlpha).toBe(false);
  for (const corner of corners) {
    expect([...corner]).toEqual([255, 255, 255]);
  }
});
```

- [x] **Step 2: Run the focused test and verify the current icon fails**

Run: `npm test -- src/test/image-config.test.ts --run`

Expected: FAIL because the current icon is 512 × 548 rather than square.

- [x] **Step 3: Extract the approved symbol and replace the favicon**

Render the Illustrator-compatible PDF at high resolution, crop the standalone symbol from the lower-left white-background sample without any wordmark, fit it proportionally onto a white 512 × 512 canvas, and save the result as an RGB PNG at `src/app/icon.png`. Preserve the original dark navy and beige colors and enough white padding to avoid clipping at small sizes.

- [x] **Step 4: Run the focused asset test**

Run: `npm test -- src/test/image-config.test.ts --run`

Expected: PASS, including the 512 × 512, non-alpha favicon assertions.

- [x] **Step 5: Inspect the exported favicon visually**

Open `src/app/icon.png` at original resolution and generate a 32 × 32 preview with Sharp. Confirm the canvas is white, the symbol is centered, no text is present, no logo stroke is clipped, and the mark remains recognizable at favicon scale.

- [x] **Step 6: Run project verification**

Run: `npm test -- --run && npm run lint && npm run typecheck && npm run build`

Expected: all tests pass, ESLint reports zero warnings, TypeScript reports no errors, and the Next.js production build completes successfully.

- [x] **Step 7: Commit the favicon change**

```bash
git add src/app/icon.png src/test/image-config.test.ts docs/superpowers/plans/2026-07-22-white-background-favicon.md
git commit -m "fix: use white background favicon"
```
