import { describe, expect, it } from "vitest";

import { metadata } from "./page";

describe("오시는 길 페이지", () => {
  it("기존 /location URL에 맞는 검색 메타데이터를 제공한다", () => {
    expect(metadata).toMatchObject({
      title: "오시는 길",
      alternates: { canonical: "/location" },
    });
  });
});
