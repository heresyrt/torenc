import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MobileMenu } from "./mobile-menu";

const items = [
  { label: "회사 소개", href: "/#about" as const },
  { label: "사업 분야", href: "/#business" as const },
];

describe("모바일 메뉴", () => {
  it("버튼으로 열고 메뉴 항목 선택 후 닫는다", async () => {
    const user = userEvent.setup();
    render(<MobileMenu items={items} />);

    const button = screen.getByRole("button", { name: "메뉴 열기" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    const closeButton = screen.getByRole("button", { name: "메뉴 닫기" });
    expect(closeButton).toHaveAttribute("aria-expanded", "true");
    expect(document.querySelector("#mobile-navigation")?.parentElement).toBe(document.body);
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByRole("link", { name: "회사 소개" }));
    expect(screen.getByRole("button", { name: "메뉴 열기" })).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
  });

  it("Escape 키로 열린 메뉴를 닫는다", async () => {
    const user = userEvent.setup();
    render(<MobileMenu items={items} />);

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));
    await user.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "메뉴 열기" })).toHaveAttribute("aria-expanded", "false");
  });
});
