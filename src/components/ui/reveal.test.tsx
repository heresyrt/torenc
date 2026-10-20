import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Reveal } from "./reveal";

describe("노출 효과", () => {
  it("Intersection Observer가 없으면 콘텐츠를 기본 표시한다", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Reveal>기본 콘텐츠</Reveal>);

    expect(screen.getByText("기본 콘텐츠")).toHaveAttribute("data-visible", "true");
    vi.unstubAllGlobals();
  });

  it("요소가 화면에 들어오면 한 번 표시하고 관찰을 해제한다", () => {
    let callback: IntersectionObserverCallback = () => undefined;
    const unobserve = vi.fn();
    const observe = vi.fn();
    class ObserverMock {
      constructor(nextCallback: IntersectionObserverCallback) { callback = nextCallback; }
      observe = observe;
      unobserve = unobserve;
      disconnect = vi.fn();
    }
    vi.stubGlobal("IntersectionObserver", ObserverMock);
    render(<Reveal>관찰 콘텐츠</Reveal>);

    const wrapper = screen.getByText("관찰 콘텐츠");
    const rect = new DOMRect();
    const entry: IntersectionObserverEntry = {
      boundingClientRect: rect,
      intersectionRatio: 1,
      intersectionRect: rect,
      isIntersecting: true,
      rootBounds: null,
      target: wrapper,
      time: 0,
    };
    act(() => callback([entry], {} as IntersectionObserver));

    expect(wrapper).toHaveAttribute("data-visible", "true");
    expect(unobserve).toHaveBeenCalledWith(wrapper);
    vi.unstubAllGlobals();
  });
});
