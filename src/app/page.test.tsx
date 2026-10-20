import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { siteData } from "@/data/site-data";
import Home from "./page";

vi.mock("@/components/ui/kakao-map", () => ({
  KakaoMap: ({ companyName, address }: { companyName: string; address: string }) => (
    <div data-testid="kakao-map" data-company-name={companyName} data-address={address} />
  ),
}));

describe("홈 페이지", () => {
  it("모든 핵심 기업 소개 섹션을 순서대로 제공한다", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1, name: /기술로 세우고/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /현장을 이해하는 기술/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "사업분야" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "시공실적" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "인증현황" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /오시는 길/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /프로젝트를 함께 검토해 보세요/ })).toBeInTheDocument();
  });

  it("실제 사업분야와 시공실적을 표시한다", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 3, name: "TOR 자립식 옹벽" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "산석 옹벽" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "거제 상동2지구 현장" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "자립식 옹벽 특허증" })).toBeInTheDocument();
  });

  it("전화와 이메일 문의 링크를 제공한다", () => {
    render(<Home />);

    for (const phoneLink of screen.getAllByRole("link", { name: "031-869-3453" })) {
      expect(phoneLink).toHaveAttribute("href", "tel:031-869-3453");
    }
    for (const emailLink of screen.getAllByRole("link", { name: "torenc3453@naver.com" })) {
      expect(emailLink).toHaveAttribute("href", "mailto:torenc3453@naver.com");
    }
    expect(screen.getAllByText("031-869-3454").length).toBeGreaterThan(0);
  });

  it("카카오맵에 회사명과 주소를 전달하고 주소를 표시한다", () => {
    render(<Home />);

    expect(screen.getByTestId("kakao-map")).toHaveAttribute("data-company-name", siteData.company.name);
    expect(screen.getByTestId("kakao-map")).toHaveAttribute("data-address", siteData.contact.address);
    expect(screen.queryByText("지도 API 연동 예정")).not.toBeInTheDocument();
    const locationSection = screen.getByRole("heading", { level: 2, name: /오시는 길/ }).closest("section");
    expect(locationSection).not.toBeNull();
    expect(within(locationSection!).getByText(siteData.contact.address)).toBeInTheDocument();
  });

  it("더오름 이앤씨 공식 로고를 헤더와 푸터에 표시한다", () => {
    render(<Home />);

    const headerLogo = screen.getByRole("img", { name: "더오름 이앤씨" });

    expect(headerLogo).toHaveAttribute(
      "src",
      "/images/brand/logo-horizontal-korean-on-dark.svg",
    );
    expect(headerLogo).toHaveClass("w-[240px]", "sm:w-[280px]");
    expect(headerLogo.closest("header")?.firstElementChild).toHaveClass("h-24");
    const footerLogo = screen.getByRole("img", { name: "더오름 이앤씨 푸터 로고" });

    expect(footerLogo).toHaveAttribute(
      "src",
      "/images/brand/logo-stacked-korean.svg",
    );
    expect(footerLogo).toHaveClass("w-[280px]", "sm:w-[320px]", "lg:w-[360px]");
    expect(screen.queryByText("TOR E&C")).not.toBeInTheDocument();
  });
});
