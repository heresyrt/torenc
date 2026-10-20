import { describe, expect, it } from "vitest";

import { dynamic as robotsDynamic } from "./robots";
import sitemap, { dynamic as sitemapDynamic } from "./sitemap";
import { siteData } from "@/data/site-data";

describe("정적 메타데이터 라우트", () => {
  it("sitemap을 정적 export 대상으로 고정한다", () => {
    expect(sitemapDynamic).toBe("force-static");
  });

  it("robots를 정적 export 대상으로 고정한다", () => {
    expect(robotsDynamic).toBe("force-static");
  });

  it("홈과 모든 사업 상세 페이지를 사이트맵에 제공한다", () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      "https://torenc.com",
      ...siteData.businesses.map(({ slug }) => `https://torenc.com/business/${slug}`),
    ]);
  });
});
