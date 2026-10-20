"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { NavigationItem } from "@/types/site";

export function MobileMenu({ items }: { items: NavigationItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="focus-ring relative z-50 grid size-11 place-items-center rounded-full border border-white/20 text-white"
        aria-controls="mobile-navigation"
        aria-expanded={open}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true" className="text-2xl leading-none">{open ? "×" : "≡"}</span>
      </button>
      {open && createPortal(<div
        id="mobile-navigation"
        className="overlay-screen z-20 overflow-y-auto bg-[var(--navy-950)] px-6 pb-10 pt-28"
      >
        <nav aria-label="모바일 주요 메뉴" className="container-shell">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {items.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  className="focus-ring flex items-center justify-between py-5 text-2xl font-bold text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}<span aria-hidden="true" className="text-sm font-normal text-white/35">0{index + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-white/45">기술로 세우고, 신뢰로 연결합니다.</p>
        </nav>
      </div>, document.body)}
    </div>
  );
}
