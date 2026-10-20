# Korean-Primary SVG Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the English-primary logo with reusable Korean-primary vectors sized for a dark header and a large dark footer treatment.

**Architecture:** Extract the approved horizontal Korean-primary artwork from the PDF-compatible Illustrator source as path-based SVG, crop it with a precise SVG `viewBox`, and serve it as a static Next.js image. Update the existing component contract and tests without deleting the legacy PNG or symbol assets.

**Tech Stack:** PDF-compatible Adobe Illustrator source, PyMuPDF SVG extraction, SVG, Next.js `Image`, React, Vitest, Tailwind CSS

## Global Constraints

- Preserve the source logo colors, proportions, transparent background, and vector paths.
- Header widths are exactly `240px` by default and `280px` at the `sm` breakpoint.
- Keep the existing PNG and symbol assets, app icon, link behavior, and accessible names.
- Preserve all unrelated user changes already present in the worktree.

---

### Task 1: Add the Korean-primary SVG asset

**Files:**
- Create: `public/images/brand/logo-horizontal-korean.svg`
- Create: `public/images/brand/logo-stacked-korean.svg`

**Interfaces:**
- Consumes: Korean-primary horizontal artwork in `/Users/grapevine/Downloads/상언이 홈피/로고 원본.ai`
- Produces: transparent path-based SVGs at `/images/brand/logo-horizontal-korean-on-dark.svg` and `/images/brand/logo-stacked-korean.svg`

- [ ] **Step 1: Extract the Illustrator page as SVG**

Use PyMuPDF `page.get_svg_image(text_as_path=True)` so lettering remains reusable paths rather than a bitmap or external font dependency.

- [ ] **Step 2: Crop to the approved horizontal Korean-primary lockup**

Adjust each root `viewBox` to the exact bounds of the right-side dark-background artwork. Use the horizontal lockup for the header and the stacked lockup for the footer. Remove the navy page background shape so both results are transparent.

- [ ] **Step 3: Verify the asset contract**

Run an XML/path inspection and render the SVG to PNG. Expected: a valid `viewBox`, path content, no embedded raster image, transparent background, and no clipping or excess page artwork.

### Task 2: Update tests and logo consumers

**Files:**
- Modify: `src/app/page.test.tsx`
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/layout/footer.tsx`

**Interfaces:**
- Consumes: `/images/brand/logo-horizontal-korean.svg`
- Produces: header and footer references using the new assets; header classes `w-[240px] sm:w-[280px]`; footer classes `w-[280px] sm:w-[320px] lg:w-[360px]`

- [ ] **Step 1: Write the failing component test**

Expect `/images/brand/logo-horizontal-korean-on-dark.svg` in the header and `/images/brand/logo-stacked-korean.svg` in the footer. Assert the approved responsive width classes for both.

- [ ] **Step 2: Run the focused test and verify failure**

Run `npm test -- --run src/app/page.test.tsx`. Expected: FAIL because the components still reference `logo-horizontal-transparent.png` and the old width classes.

- [ ] **Step 3: Apply the minimal component changes**

Update the two `Image` sources, use the SVG's intrinsic dimensions, set the header widths to `w-[260px] sm:w-[304px]`, and set the footer width to `w-[260px]` while retaining automatic height and all accessibility attributes.

- [ ] **Step 4: Run focused verification**

Run `npm test -- --run src/app/page.test.tsx`. Expected: PASS.

### Task 3: Full verification

**Files:**
- Verify only; do not modify unrelated files.

**Interfaces:**
- Consumes: completed SVG and component changes
- Produces: evidence that the logo is reusable, responsive, and build-safe

- [ ] **Step 1: Run automated checks**

Run `npm test -- --run`, `npm run lint`, `npm run typecheck`, and `npm run build`. Expected: all commands exit successfully.

- [ ] **Step 2: Perform visual checks**

Render the SVG directly and inspect the site at mobile and desktop widths. Expected: Korean is primary, English is secondary, logo size is 260px/304px, and neither header nor footer clips or overlaps adjacent content.

- [ ] **Step 3: Review the final diff**

Run `git diff --check` and inspect only the logo-related diff. Expected: no whitespace errors, no deleted legacy assets, and no unrelated user changes included.
