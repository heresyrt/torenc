import { describe, expect, it } from "vitest";

import { metadata } from "./layout";

describe("루트 메타데이터", () => {
  it("네이버 검색 결과용 설명문을 80자 이내로 제공한다", () => {
    expect(metadata.description).toBe(
      "더오름 이앤씨는 옹벽 설계·시공 전문 기업으로, 안전한 토목·건설 솔루션을 제공합니다.",
    );
    expect(metadata.openGraph?.description).toBe(metadata.description);
  });

  it("네이버 서치어드바이저 소유 확인 태그를 제공한다", () => {
    expect(metadata.verification?.other?.["naver-site-verification"]).toBe(
      "4c3fed93e23e306c0c37d4a3e410abbf38353844",
    );
  });

  it("iOS가 일반 전화·팩스번호를 hydration 전에 자동 링크로 바꾸지 않게 한다", () => {
    expect(metadata.formatDetection).toEqual({
      telephone: false,
    });
  });
});
