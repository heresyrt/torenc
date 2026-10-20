import Image from "next/image";
import Link from "next/link";

import { siteData } from "@/data/site-data";

import { MobileMenu } from "./mobile-menu";

export function Header() {
  return (
    <>
      <a href="#main-content" className="focus-ring fixed left-4 top-4 z-[60] -translate-y-24 bg-white px-4 py-2 font-bold text-[var(--navy-950)] transition focus:translate-y-0">본문 바로가기</a>
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[var(--navy-950)] text-white">
        <div className="container-shell flex h-24 items-center justify-between">
          <Link href="/" className="focus-ring flex items-center" aria-label={`${siteData.company.name} 홈`}>
            <Image src="/images/brand/logo-horizontal-korean-on-dark.svg" alt={siteData.company.name} width={760} height={230} priority className="h-auto w-[240px] sm:w-[280px]" />
          </Link>
          <nav aria-label="주요 메뉴" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {siteData.navigation.map((item) => (
                <li key={item.href}><a className="focus-ring text-sm font-semibold text-white/70 transition hover:text-white" href={item.href}>{item.label}</a></li>
              ))}
            </ul>
          </nav>
          <Link href="/#contact" className="focus-ring hidden bg-[var(--brand-gold)] px-5 py-3 text-sm font-bold text-[var(--navy-950)] transition hover:bg-white xl:block">프로젝트 문의</Link>
          <MobileMenu items={siteData.navigation} />
        </div>
      </header>
    </>
  );
}
