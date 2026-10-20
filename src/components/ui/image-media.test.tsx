import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ImageMedia } from "./image-media";

const baseItem = {
  id: "project-test",
  title: "교량 하부 보강",
  description: "테스트 설명",
  alt: "교량 하부 보강 공사 현장",
  width: 2000,
  height: 1250,
};

describe("이미지 미디어", () => {
  it("이미지 경로가 없으면 교체 안내와 권장 크기를 표시한다", () => {
    render(<ImageMedia item={baseItem} sizes="100vw" />);

    expect(screen.getByText("이미지 준비 중")).toBeInTheDocument();
    expect(screen.getByText("권장 2000 × 1250px")).toBeInTheDocument();
  });

  it("이미지 경로가 있으면 대체 텍스트와 반응형 규격으로 렌더링한다", () => {
    render(<ImageMedia item={{ ...baseItem, src: "/images/projects/test.webp" }} sizes="(min-width: 1024px) 33vw, 100vw" />);

    const image = screen.getByRole("img", { name: baseItem.alt });
    expect(image).toHaveAttribute("sizes", "(min-width: 1024px) 33vw, 100vw");
    expect(image).toHaveAttribute("src", "/images/projects/test.webp");
  });
});
