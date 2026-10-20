# Kakao Map Visual Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the successful-state map card, slim the branded company pin, and show a wider initial map area.

**Architecture:** Keep the existing `KakaoMap` lifecycle and error fallbacks. Change only its successful render state, custom-overlay DOM styling, map level, and focused component tests.

**Tech Stack:** React, TypeScript, Tailwind CSS, Kakao Maps JavaScript SDK, Vitest, Testing Library

## Global Constraints

- Normal state renders only the map and company `CustomOverlay`; no address card or directions link.
- Missing-key, SDK-error, and geocode-error states continue to show Korean guidance and the address.
- Keep the existing navy and gold brand colors.
- Replace the 40px circular pin with an approximately 28px-wide slim teardrop pin.
- Change the initial Kakao map level from `3` to `4`.
- Do not alter Kakao's built-in place-label or zoom-animation behavior.

---

### Task 1: Refine successful map presentation

**Files:**
- Modify: `src/components/ui/kakao-map.tsx`
- Test: `src/components/ui/kakao-map.test.tsx`

**Interfaces:**
- Consumes: existing `KakaoMapProps`, Kakao SDK loader, and `KakaoMapsApi.CustomOverlay`.
- Produces: unchanged `KakaoMap({ companyName, address }): JSX.Element` interface.

- [ ] **Step 1: Write failing tests for the approved behavior**

Update the successful-geocode test to assert map level `4`, absence of address text and any directions link, and overlay pin classes representing a slim 28px teardrop. Keep failure tests asserting that the address remains readable.

```ts
expect(maps.Map).toHaveBeenCalledWith(expect.any(HTMLElement), {
  center: maps.latLng,
  level: 4,
});
expect(screen.queryByText(address)).not.toBeInTheDocument();
expect(screen.queryByRole("link", { name: /길찾기/ })).not.toBeInTheDocument();

const pin = overlayContent.querySelector<HTMLElement>("[data-company-map-pin]");
expect(pin).toHaveClass("h-9", "w-7", "rounded-t-full");
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- --run src/components/ui/kakao-map.test.tsx`

Expected: FAIL because the map uses level `3`, the successful-state address/link remain, and the pin still uses `h-10 w-10 rounded-full`.

- [ ] **Step 3: Implement the minimal successful-state changes**

Create the map with level `4`. Stop storing and rendering `directionsHref`. Render the status card only when `status !== "ready"`; this keeps every existing fallback while removing all successful-state card content. Change the pin classes to a 28×36px teardrop with a small white center and a narrower tip.

```tsx
const map = new maps.Map(mapContainer, { center: position, level: 4 });

{message ? (
  <div className="pointer-events-none absolute inset-0 flex items-end p-6 sm:p-8">
    <div className="pointer-events-auto max-w-md rounded-sm border border-black/10 bg-white/95 px-5 py-4 shadow-xl shadow-black/5">
      <p role="status" aria-live="polite" className="font-bold text-[var(--navy-950)]">{message}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--navy-950)]">{address}</p>
    </div>
  </div>
) : null}
```

Use these pin dimensions as the styling contract:

```ts
pin.className = "relative mt-2 grid h-9 w-7 place-items-center rounded-t-full rounded-b-[45%] border-2 border-white bg-[var(--brand-gold-deep)] shadow-md";
```

- [ ] **Step 4: Run focused and full verification**

Run:

```bash
npm test -- --run src/components/ui/kakao-map.test.tsx
npm test -- --run
npm run lint
npm run typecheck
npm run build
```

Expected: focused and full tests pass, ESLint has no warnings, TypeScript has no errors, and Next.js completes the production build.

- [ ] **Step 5: Verify the real-key browser view**

Open the Location section using the configured `.env.local`. Confirm the normal map has no address card or directions link, the company label and slim pin remain anchored while zooming, and the initial view shows a wider area than level `3`.

- [ ] **Step 6: Commit the refinement**

```bash
git add src/components/ui/kakao-map.tsx src/components/ui/kakao-map.test.tsx
git commit -m "fix: refine kakao map presentation"
```
