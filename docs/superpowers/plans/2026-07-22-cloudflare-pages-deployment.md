# Cloudflare Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the existing Next.js corporate site as a static `out/` artifact suitable for Cloudflare Pages and document the exact production setup.

**Architecture:** Next.js static export generates all routes and copies the tracked `public/` assets without a server runtime. Cloudflare Pages builds the private GitHub repository, injects the public Kakao Maps key at build time, previews pull-request branches, and publishes `master` to `torenc.com`.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Cloudflare Pages, GitHub

## Global Constraints

- Preserve the current UI, content, SEO metadata, Kakao Map behavior, images, and PDFs.
- Build command is `npm run build`; output directory is `out`.
- Do not commit `.env.local` or `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`.
- Do not introduce Pages Functions, Workers, Wrangler, R2, or a persistent `release` branch.
- Ignore the pre-existing untracked `tmp/` directory.

---

### Task 1: Static export configuration

**Files:**
- Modify: `next.config.ts`
- Create: `src/test/deployment-config.test.ts`

**Interfaces:**
- Consumes: the existing default export from `next.config.ts`
- Produces: `NextConfig` with `output: "export"` and `images.unoptimized: true`

- [ ] **Step 1: Write the failing deployment configuration test**

```ts
import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

describe("Cloudflare Pages deployment configuration", () => {
  it("exports a fully static site", () => {
    expect(nextConfig.output).toBe("export");
  });

  it("does not depend on the Next.js image optimization server", () => {
    expect(nextConfig.images?.unoptimized).toBe(true);
  });
});
```

- [ ] **Step 2: Run the focused test and verify the intended failure**

Run: `npm test -- --run src/test/deployment-config.test.ts`

Expected: FAIL because `output` and `images.unoptimized` are absent.

- [ ] **Step 3: Add the minimum static export settings**

```ts
const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  allowedDevOrigins: ["macbook", "macbook.local", "192.168.0.160"],
  images: {
    qualities: [90, 95],
    unoptimized: true,
  },
};
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `npm test -- --run src/test/deployment-config.test.ts`

Expected: 2 tests pass.

- [ ] **Step 5: Commit the configuration and test**

```bash
git add next.config.ts src/test/deployment-config.test.ts
git commit -m "build: add Cloudflare Pages static export"
```

### Task 2: Cloudflare deployment documentation

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the static export settings from Task 1
- Produces: exact setup values for Cloudflare Pages and Kakao Developers

- [ ] **Step 1: Replace the server-oriented production instructions**

Document these commands and results:

```text
npm run build
# Static deployment output: out/
```

- [ ] **Step 2: Add Cloudflare Pages project settings**

Document exactly:

```text
Production branch: master
Build command: npm run build
Build output directory: out
Root directory: /
Environment variable: NEXT_PUBLIC_KAKAO_MAP_APP_KEY
```

State that the environment variable must be configured separately for Production and Preview and must not be committed.

- [ ] **Step 3: Add domain and preview guidance**

Document that `torenc.com` is the production custom domain, Cloudflare preview URLs are for PR validation, and any preview origin used for map validation must be allowed in Kakao Developers. State that a wildcard preview domain should only be added if Kakao supports the exact origin policy required; otherwise validate the map on production.

- [ ] **Step 4: Review documentation for obsolete commands and secrets**

Run: `rg -n "npm run start|NEXT_PUBLIC_KAKAO_MAP_APP_KEY|out|Cloudflare Pages|release" README.md`

Expected: no instruction to run a Next.js production server; the variable name appears but no key value appears; no persistent release branch is prescribed.

- [ ] **Step 5: Commit the deployment documentation**

```bash
git add README.md
git commit -m "docs: add Cloudflare Pages deployment guide"
```

### Task 3: Full static artifact verification

**Files:**
- Verify only: `out/` (gitignored generated output)

**Interfaces:**
- Consumes: Tasks 1 and 2
- Produces: verified deployable static artifact

- [ ] **Step 1: Run the complete automated checks**

Run:

```bash
npm test -- --run
npm run lint
npm run typecheck
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=test-build-key npm run build
```

Expected: all commands exit 0 and Next.js reports static routes.

- [ ] **Step 2: Verify required output files and assets**

Run:

```bash
test -f out/index.html
test -f out/sitemap.xml
test -f out/robots.txt
test -f out/images/brand/logo-horizontal-korean-on-dark.svg
test -f out/documents/certificates/self-supporting-wall-patent.pdf
```

Expected: every check exits 0.

- [ ] **Step 3: Verify rendered HTML has no image optimizer dependency**

Run: `if rg -n '/_next/image' out --glob '*.html'; then exit 1; fi`

Expected: no rendered HTML matches and exit 0. The shipped Next.js client runtime may contain inactive default-loader code with this string, so JavaScript bundle text is not an optimizer request dependency.

- [ ] **Step 4: Check the final change scope**

Run: `git status -sb && git diff --check && git log --oneline master..HEAD`

Expected: only the approved deployment files are committed; `tmp/` remains untracked and excluded.

### Task 4: Private GitHub publication

**Files:**
- No repository file changes

**Interfaces:**
- Consumes: verified `codex/cloudflare-pages` branch
- Produces: private GitHub repository, pushed branch, and Draft PR targeting `master`

- [ ] **Step 1: Verify GitHub CLI availability and authentication**

Run: `gh --version && gh auth status`

Expected: GitHub CLI is installed and authenticated.

- [ ] **Step 2: Create the private GitHub repository and configure origin**

Run: `gh repo create torenc.com --private --source=. --remote=origin`

Expected: a private repository is created and `origin` points to it. If the name already exists, inspect it with `gh repo view` and only reuse it when it is private and owned by the authenticated user or organization selected by the user.

- [ ] **Step 3: Push the base and deployment branches**

Run:

```bash
git push -u origin master
git push -u origin codex/cloudflare-pages
```

Expected: both branches are present in the private repository without pushing ignored `.env.local` or `tmp/`.

- [ ] **Step 4: Open a Draft PR**

Create a Draft PR from `codex/cloudflare-pages` to `master` titled `build: deploy site on Cloudflare Pages`. Its body lists the static export configuration, deployment documentation, retained environment-variable boundary, and all verification commands.

- [ ] **Step 5: Confirm repository visibility and PR target**

Run: `gh repo view --json nameWithOwner,visibility,defaultBranchRef && gh pr view --json url,isDraft,baseRefName,headRefName`

Expected: visibility is `PRIVATE`, base is `master`, head is `codex/cloudflare-pages`, and the PR is a draft.
