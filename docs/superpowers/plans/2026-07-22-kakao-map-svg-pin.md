# Kakao Map SVG Pin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the awkward CSS-composed company marker with a small, smooth SVG teardrop marker.

**Architecture:** Keep the existing Kakao `CustomOverlay` and create its marker graphic with safe SVG DOM APIs. Only the overlay presentation and focused tests change; geocoding, map state, and error handling remain untouched.

**Tech Stack:** React, TypeScript, DOM SVG APIs, Tailwind CSS, Kakao Maps JavaScript SDK, Vitest

## Global Constraints

- Render a single 24×32px SVG pin using `document.createElementNS`.
- Use a smooth gold teardrop path, thin white stroke, small white center circle, and subtle shadow.
- Reduce the navy company label padding and type size by one step.
- Continue inserting the company name with `textContent`.
- Keep map level `4`, address geocoding, error states, and map interactions unchanged.
- Do not add image assets, external marker URLs, or animation.

---

### Task 1: Replace CSS marker with SVG marker

**Files:**
- Modify: `src/components/ui/kakao-map.tsx`
- Test: `src/components/ui/kakao-map.test.tsx`

**Interfaces:**
- Consumes: existing `CustomOverlay` DOM content.
- Produces: the same `KakaoMap({ companyName, address }): JSX.Element` interface and `data-company-map-pin` test hook.

- [ ] **Step 1: Write the failing SVG marker test**

Update the successful-map test to require an SVG marker, its viewBox, a gold path, a white center circle, and the absence of the old CSS tip span.

```ts
const pin = overlayContent.querySelector<SVGElement>("svg[data-company-map-pin]");
expect(pin).not.toBeNull();
expect(pin).toHaveAttribute("viewBox", "0 0 24 32");
expect(pin?.querySelector("path[data-company-map-pin-shape]")).not.toBeNull();
expect(pin?.querySelector("circle[data-company-map-pin-center]")).not.toBeNull();
expect(overlayContent.querySelector("[data-company-map-pin-tip]")).toBeNull();
```

- [ ] **Step 2: Run focused test and verify RED**

Run: `npm test -- --run src/components/ui/kakao-map.test.tsx`

Expected: FAIL because the current pin is an HTML `span` with a separate CSS tip.

- [ ] **Step 3: Implement the SVG marker**

Create the SVG namespace elements and append them to the overlay.

```ts
const svgNamespace = "http://www.w3.org/2000/svg";
const pin = document.createElementNS(svgNamespace, "svg");
pin.dataset.companyMapPin = "true";
pin.setAttribute("viewBox", "0 0 24 32");
pin.setAttribute("width", "24");
pin.setAttribute("height", "32");
pin.classList.add("mt-1.5", "drop-shadow-md");

const pinShape = document.createElementNS(svgNamespace, "path");
pinShape.dataset.companyMapPinShape = "true";
pinShape.setAttribute("d", "M12 1C5.925 1 1 5.925 1 12c0 8.25 11 19 11 19s11-10.75 11-19C23 5.925 18.075 1 12 1Z");
pinShape.setAttribute("fill", "var(--brand-gold-deep)");
pinShape.setAttribute("stroke", "white");
pinShape.setAttribute("stroke-width", "1.5");

const pinCenter = document.createElementNS(svgNamespace, "circle");
pinCenter.dataset.companyMapPinCenter = "true";
pinCenter.setAttribute("cx", "12");
pinCenter.setAttribute("cy", "11.5");
pinCenter.setAttribute("r", "3.5");
pinCenter.setAttribute("fill", "white");
pin.append(pinShape, pinCenter);
```

Set the label classes to `px-3 py-1.5 text-xs` while preserving the navy background, white text, border, and shadow.

- [ ] **Step 4: Run focused and full verification**

Run:

```bash
npm test -- --run src/components/ui/kakao-map.test.tsx
npm test -- --run
npm run lint
npm run typecheck
npm run build
```

Expected: all tests pass, ESLint and TypeScript are clean, and Next.js finishes the production build.

- [ ] **Step 5: Verify the real map visually**

Open the Location section with the configured key and confirm the SVG appears as a smooth teardrop, the label is smaller, and both remain positioned after zoom.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/kakao-map.tsx src/components/ui/kakao-map.test.tsx
git commit -m "fix: redraw kakao map pin"
```
