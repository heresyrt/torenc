import { describe, expect, it } from "vitest";

import { businessJsonLd, getBusinessSeo, organizationJsonLd } from "./seo";
import { siteData } from "@/data/site-data";

describe("검색 엔진 데이터", () => {
  const selfSupportingWall = siteData.businesses[0];

  it("자립식 옹벽 페이지에 검색어 중심 제목과 설명을 제공한다", () => {
    expect(getBusinessSeo(selfSupportingWall)).toEqual({
      title: "자립식 옹벽(TOR)",
      description: "자립식 옹벽(TOR)은 협소한 공간에도 적용 가능한 안전하고 경제적인 옹벽 설계·시공 시스템입니다.",
      url: "https://torenc.com/business/tor-self-supporting-wall",
    });
  });

  it("회사와 자립식 옹벽 서비스를 구조화 데이터로 제공한다", () => {
    expect(organizationJsonLd).toMatchObject({
      "@type": "Organization",
      name: "더오름 이앤씨",
      url: "https://torenc.com",
    });
    expect(businessJsonLd(selfSupportingWall)).toMatchObject({
      "@type": "Service",
      name: "자립식 옹벽(TOR)",
      url: "https://torenc.com/business/tor-self-supporting-wall",
      provider: { name: "더오름 이앤씨" },
    });
  });
});
