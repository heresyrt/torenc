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
