import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("테스트 환경", () => {
  it("DOM 환경을 제공한다", () => {
    expect(document.documentElement).toBeInTheDocument();
  });
});

describe("전역 스타일", () => {
  it("링크별 글자색을 전역 규칙으로 덮어쓰지 않는다", () => {
    const css = readFileSync("src/app/globals.css", "utf8");

    expect(css).not.toMatch(/a\s*\{\s*color\s*:/);
  });
});
