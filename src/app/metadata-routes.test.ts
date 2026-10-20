import { describe, expect, it } from "vitest";

import { dynamic as robotsDynamic } from "./robots";
import { dynamic as sitemapDynamic } from "./sitemap";

describe("정적 메타데이터 라우트", () => {
  it("sitemap을 정적 export 대상으로 고정한다", () => {
    expect(sitemapDynamic).toBe("force-static");
  });

  it("robots를 정적 export 대상으로 고정한다", () => {
    expect(robotsDynamic).toBe("force-static");
  });
});
