import { describe, expect, it } from "vitest";

import { changeScale, clampPan, clampScale } from "./image-viewer-transform";

describe("이미지 뷰어 변환", () => {
  it("배율을 1배에서 3배 사이로 제한한다", () => {
    expect(clampScale(0.5)).toBe(1);
    expect(clampScale(2.25)).toBe(2.25);
    expect(clampScale(4)).toBe(3);
  });

  it("화면 맞춤 배율로 돌아오면 이동 위치를 초기화한다", () => {
    expect(changeScale({ scale: 2, x: 120, y: -80 }, 1)).toEqual({ scale: 1, x: 0, y: 0 });
    expect(changeScale({ scale: 2, x: 120, y: -80 }, 2.5)).toEqual({ scale: 2.5, x: 120, y: -80 });
  });

  it("contain 이미지의 확대된 넘침 범위 안으로 이동 위치를 제한한다", () => {
    const viewport = { width: 1000, height: 700 };
    const wideImage = { width: 1200, height: 600 };

    expect(clampPan({ x: 900, y: -900 }, 2, viewport, wideImage)).toEqual({ x: 500, y: -150 });
    expect(clampPan({ x: 50, y: -75 }, 2, viewport, wideImage)).toEqual({ x: 50, y: -75 });
  });

  it("기본 배율에서는 이동 위치를 항상 중앙으로 고정한다", () => {
    expect(clampPan(
      { x: 100, y: -100 },
      1,
      { width: 800, height: 600 },
      { width: 1200, height: 800 },
    )).toEqual({ x: 0, y: 0 });
  });
});
