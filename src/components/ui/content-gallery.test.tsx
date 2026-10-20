import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { DetailImageItem } from "@/types/site";

import { ContentGallery } from "./content-gallery";

const items = [
  { id: "one", title: "첫 번째", description: "설명", alt: "첫 이미지", width: 1200, height: 800, src: "/images/one.jpg", meta: "절토부옹벽" },
  { id: "two", title: "두 번째", description: "설명", alt: "둘 이미지", width: 1200, height: 800, src: "/images/two.jpg", documentHref: "/documents/two.pdf" },
];

const setDesktopViewport = (matches: boolean) => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches }));
};

afterEach(() => vi.unstubAllGlobals());

describe("콘텐츠 갤러리", () => {
  it("설명 없는 상세 갤러리는 카드 번호와 제목을 표시하지 않는다", () => {
    const detailItem: DetailImageItem = { ...items[0], step: "보차도 블록", fit: "contain" };
    render(<ContentGallery items={[detailItem]} variant="detail" showDetails={false} />);

    expect(screen.queryByText("보차도 블록")).not.toBeInTheDocument();
    expect(screen.queryByText("01")).not.toBeInTheDocument();
  });

  it("번호 없이 상세 갤러리의 사진 이름을 표시한다", () => {
    const detailItem: DetailImageItem = { ...items[0], step: "보차도 블록", fit: "contain" };
    render(<ContentGallery items={[detailItem]} variant="detail" />);

    expect(screen.getByRole("heading", { name: "보차도 블록" })).toBeInTheDocument();
    expect(screen.queryByText("01")).not.toBeInTheDocument();
  });

  it("확대 화면에서만 저장된 원본 이미지를 직접 사용한다", () => {
    render(<ContentGallery items={items} variant="projects" />);

    const cardImage = screen.getByRole("img", { name: "첫 이미지" });
    expect(cardImage).toHaveAttribute("data-unoptimized", "false");

    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));

    const [listedImage, lightboxImage] = screen.getAllByRole("img", { name: "첫 이미지" });
    expect(listedImage).toHaveAttribute("data-unoptimized", "false");
    expect(lightboxImage).toHaveAttribute("src", "/images/one.jpg");
    expect(lightboxImage).toHaveAttribute("data-unoptimized", "true");
  });

  it("프로젝트 공법명을 읽기 쉬운 크기로 표시한다", () => {
    render(<ContentGallery items={items} variant="projects" />);

    expect(screen.getByText("절토부옹벽")).toHaveClass("text-sm");
  });

  it("확대 화면은 아래 페이지가 비치지 않는 균일한 검정 배경을 사용한다", () => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));

    const dialog = screen.getByRole("dialog", { name: "첫 번째 확대 보기" });
    expect(dialog).toHaveClass("bg-black");
    expect(dialog).not.toHaveClass("bg-black/90");
    expect(screen.getByLabelText("사진 스와이프 영역")).not.toHaveClass("bg-black/30");
  });

  it("모바일에서 확대 화면을 열면 닫기 버튼 대신 뷰어에 포커스를 둔다", () => {
    setDesktopViewport(false);
    render(<ContentGallery items={items} variant="projects" />);

    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));

    expect(screen.getByRole("dialog", { name: "첫 번째 확대 보기" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "확대 보기 닫기" })).not.toHaveFocus();
  });

  it("데스크톱에서 확대 화면을 열면 닫기 버튼에 포커스를 둔다", () => {
    setDesktopViewport(true);
    render(<ContentGallery items={items} variant="projects" />);

    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));

    expect(screen.getByRole("button", { name: "확대 보기 닫기" })).toHaveFocus();
  });

  it("PC용 이동 버튼과 썸네일로 사진을 순환하거나 직접 선택한다", () => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));

    expect(screen.getByRole("dialog", { name: "첫 번째 확대 보기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "첫 번째 썸네일" })).toHaveAttribute("aria-current", "true");

    fireEvent.click(screen.getByRole("button", { name: "다음 이미지" }));
    expect(screen.getByRole("dialog", { name: "두 번째 확대 보기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "두 번째 썸네일" })).toHaveAttribute("aria-current", "true");

    fireEvent.click(screen.getByRole("button", { name: "첫 번째 썸네일" }));
    expect(screen.getByRole("dialog", { name: "첫 번째 확대 보기" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "이전 이미지" }));
    expect(screen.getByRole("dialog", { name: "두 번째 확대 보기" })).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("사진 전환 시 선택된 썸네일을 스크롤 영역 안에 표시한다", () => {
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    const scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;

    try {
      render(<ContentGallery items={items} variant="projects" />);
      fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
      scrollIntoView.mockClear();
      fireEvent.click(screen.getByRole("button", { name: "다음 이미지" }));

      expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest", inline: "nearest" });
    } finally {
      if (originalScrollIntoView) HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
      else delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView;
    }
  });

  it("확대·축소·화면 맞춤 버튼으로 사진 변환을 조절한다", () => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
    const imageTransform = screen.getByTestId("viewer-image-transform");

    expect(screen.getByRole("button", { name: "축소" })).toBeDisabled();
    expect(imageTransform).toHaveStyle({ transform: "translate3d(0px, 0px, 0) scale(1)" });

    fireEvent.click(screen.getByRole("button", { name: "확대" }));
    expect(screen.getByRole("button", { name: "축소" })).toBeEnabled();
    expect(imageTransform).toHaveStyle({ transform: "translate3d(0px, 0px, 0) scale(1.5)" });

    fireEvent.click(screen.getByRole("button", { name: "화면 맞춤" }));
    expect(screen.getByRole("button", { name: "축소" })).toBeDisabled();
    expect(imageTransform).toHaveStyle({ transform: "translate3d(0px, 0px, 0) scale(1)" });
  });

  it("화면 맞춤 이미지는 크기가 확정된 뷰포트 내부에서 contain 된다", () => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));

    const imageTransform = screen.getByTestId("viewer-image-transform");
    expect(imageTransform).toHaveClass("absolute", "inset-3");
    expect(screen.getAllByRole("img", { name: "첫 이미지" })[1]).toHaveClass("max-h-full", "max-w-full", "object-contain");
  });

  it("좌우 단일 터치 스와이프로 사진을 순환 이동한다", () => {
    render(<ContentGallery items={items} variant="certificates" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
    const swipeRegion = screen.getByLabelText("사진 스와이프 영역");

    fireEvent.touchStart(swipeRegion, { touches: [{ clientX: 180, clientY: 100 }] });
    fireEvent.touchEnd(swipeRegion, { changedTouches: [{ clientX: 80, clientY: 105 }] });
    expect(screen.getByRole("dialog", { name: "두 번째 확대 보기" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "원본 PDF 열기" })).toHaveAttribute("href", "/documents/two.pdf");

    fireEvent.touchStart(swipeRegion, { touches: [{ clientX: 80, clientY: 100 }] });
    fireEvent.touchEnd(swipeRegion, { changedTouches: [{ clientX: 180, clientY: 105 }] });
    expect(screen.getByRole("dialog", { name: "첫 번째 확대 보기" })).toBeInTheDocument();
  });

  it.each([
    ["짧은 터치", [{ clientX: 100, clientY: 100 }], [{ clientX: 125, clientY: 102 }]],
    ["수직 제스처", [{ clientX: 100, clientY: 100 }], [{ clientX: 120, clientY: 200 }]],
    ["멀티터치", [{ clientX: 100, clientY: 100 }, { clientX: 140, clientY: 100 }], [{ clientX: 20, clientY: 100 }]],
  ])("%s는 사진을 이동하지 않는다", (_name, touches, changedTouches) => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
    const swipeRegion = screen.getByLabelText("사진 스와이프 영역");
    fireEvent.touchStart(swipeRegion, { touches });
    fireEvent.touchEnd(swipeRegion, { changedTouches });
    expect(screen.getByRole("dialog", { name: "첫 번째 확대 보기" })).toBeInTheDocument();
  });

  it("확대 후 마우스 왼쪽 드래그로 사진 위치를 옮긴다", () => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
    const region = screen.getByLabelText("사진 스와이프 영역");
    vi.spyOn(region, "getBoundingClientRect").mockReturnValue({
      width: 1000, height: 600, x: 0, y: 0, top: 0, left: 0, right: 1000, bottom: 600, toJSON: () => ({}),
    });

    fireEvent.click(screen.getByRole("button", { name: "확대" }));
    fireEvent.mouseDown(region, { button: 0, clientX: 100, clientY: 100 });
    fireEvent.mouseMove(region, { buttons: 1, clientX: 160, clientY: 140 });
    fireEvent.mouseUp(region, { button: 0, clientX: 160, clientY: 140 });

    expect(screen.getByTestId("viewer-image-transform")).toHaveStyle({
      transform: "translate3d(60px, 40px, 0) scale(1.5)",
    });
  });

  it("사진을 이동한 뒤 축소하면 새 배율의 이동 범위로 위치를 다시 제한한다", () => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
    const region = screen.getByLabelText("사진 스와이프 영역");
    vi.spyOn(region, "getBoundingClientRect").mockReturnValue({
      width: 1000, height: 600, x: 0, y: 0, top: 0, left: 0, right: 1000, bottom: 600, toJSON: () => ({}),
    });
    const imageTransform = screen.getByTestId("viewer-image-transform");
    Object.defineProperties(imageTransform, {
      clientWidth: { configurable: true, value: 976 },
      clientHeight: { configurable: true, value: 576 },
    });

    fireEvent.click(screen.getByRole("button", { name: "확대" }));
    fireEvent.click(screen.getByRole("button", { name: "확대" }));
    fireEvent.mouseDown(region, { button: 0, clientX: 100, clientY: 100 });
    fireEvent.mouseMove(region, { buttons: 1, clientX: 600, clientY: 100 });
    fireEvent.mouseUp(region, { button: 0, clientX: 600, clientY: 100 });
    fireEvent.click(screen.getByRole("button", { name: "축소" }));

    expect(imageTransform).toHaveStyle({
      transform: "translate3d(160px, 0px, 0) scale(1.5)",
    });
  });

  it("드래그 도중 사진을 전환하면 이전 제스처와 변환을 함께 초기화한다", () => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
    const region = screen.getByLabelText("사진 스와이프 영역");
    vi.spyOn(region, "getBoundingClientRect").mockReturnValue({
      width: 1000, height: 600, x: 0, y: 0, top: 0, left: 0, right: 1000, bottom: 600, toJSON: () => ({}),
    });

    fireEvent.click(screen.getByRole("button", { name: "확대" }));
    fireEvent.mouseDown(region, { button: 0, clientX: 100, clientY: 100 });
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.mouseMove(region, { buttons: 1, clientX: 200, clientY: 150 });

    expect(screen.getByRole("dialog", { name: "두 번째 확대 보기" })).toBeInTheDocument();
    expect(screen.getByTestId("viewer-image-transform")).toHaveStyle({
      transform: "translate3d(0px, 0px, 0) scale(1)",
    });
  });

  it("확대 상태의 한 손가락 드래그는 사진을 이동하고 항목을 전환하지 않는다", () => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
    const region = screen.getByLabelText("사진 스와이프 영역");
    vi.spyOn(region, "getBoundingClientRect").mockReturnValue({
      width: 1000, height: 600, x: 0, y: 0, top: 0, left: 0, right: 1000, bottom: 600, toJSON: () => ({}),
    });

    fireEvent.click(screen.getByRole("button", { name: "확대" }));
    fireEvent.touchStart(region, { touches: [{ clientX: 180, clientY: 100 }] });
    fireEvent.touchMove(region, { touches: [{ clientX: 80, clientY: 130 }] });
    fireEvent.touchEnd(region, { touches: [], changedTouches: [{ clientX: 80, clientY: 130 }] });

    expect(screen.getByRole("dialog", { name: "첫 번째 확대 보기" })).toBeInTheDocument();
    expect(screen.getByTestId("viewer-image-transform")).toHaveStyle({
      transform: "translate3d(-100px, 30px, 0) scale(1.5)",
    });
  });

  it("두 손가락 핀치는 UI가 아니라 사진만 확대한다", () => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
    const dialog = screen.getByRole("dialog", { name: "첫 번째 확대 보기" });
    const region = screen.getByLabelText("사진 스와이프 영역");
    vi.spyOn(region, "getBoundingClientRect").mockReturnValue({
      width: 1000, height: 600, x: 0, y: 0, top: 0, left: 0, right: 1000, bottom: 600, toJSON: () => ({}),
    });

    fireEvent.touchStart(region, { touches: [{ clientX: 400, clientY: 300 }, { clientX: 600, clientY: 300 }] });
    fireEvent.touchMove(region, { touches: [{ clientX: 300, clientY: 300 }, { clientX: 700, clientY: 300 }] });
    fireEvent.touchEnd(region, { touches: [], changedTouches: [{ clientX: 300, clientY: 300 }, { clientX: 700, clientY: 300 }] });

    expect(dialog.style.transform).toBe("");
    expect(screen.getByTestId("viewer-image-transform")).toHaveStyle({
      transform: "translate3d(0px, 0px, 0) scale(2)",
    });
    expect(screen.getByRole("dialog", { name: "첫 번째 확대 보기" })).toBeInTheDocument();
  });

  it("핀치 후 한 손가락이 남으면 다시 터치하지 않아도 사진 이동으로 이어진다", () => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
    const region = screen.getByLabelText("사진 스와이프 영역");
    vi.spyOn(region, "getBoundingClientRect").mockReturnValue({
      width: 1000, height: 600, x: 0, y: 0, top: 0, left: 0, right: 1000, bottom: 600, toJSON: () => ({}),
    });

    fireEvent.touchStart(region, { touches: [{ clientX: 400, clientY: 300 }, { clientX: 600, clientY: 300 }] });
    fireEvent.touchMove(region, { touches: [{ clientX: 300, clientY: 300 }, { clientX: 700, clientY: 300 }] });
    fireEvent.touchEnd(region, {
      touches: [{ clientX: 300, clientY: 300 }],
      changedTouches: [{ clientX: 700, clientY: 300 }],
    });
    fireEvent.touchMove(region, { touches: [{ clientX: 350, clientY: 330 }] });

    expect(screen.getByTestId("viewer-image-transform")).toHaveStyle({
      transform: "translate3d(50px, 30px, 0) scale(2)",
    });
  });

  it("키보드로 이동하고 뷰어를 닫는다", () => {
    render(<ContentGallery items={items} variant="projects" />);
    fireEvent.click(screen.getByRole("button", { name: "첫 번째 크게 보기" }));
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByRole("dialog", { name: "두 번째 확대 보기" })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
