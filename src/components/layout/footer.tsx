import Image from "next/image";

import { siteData } from "@/data/site-data";

export function Footer() {
  return (
    <footer className="bg-[var(--navy-950)] py-12 text-white">
      <div className="container-shell grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2">
        <div><Image src="/images/brand/logo-stacked-korean.svg" alt={`${siteData.company.name} 푸터 로고`} width={580} height={400} className="h-auto w-[280px] sm:w-[320px] lg:w-[360px]" /><p className="mt-3 text-sm text-white/45">{siteData.company.tagline}</p></div>
        <address className="not-italic text-sm leading-7 text-white/55 md:text-right"><p>{siteData.contact.address}</p><p><a className="focus-ring" href={siteData.contact.phoneHref}>{siteData.contact.phone}</a> · 팩스 {siteData.contact.fax}</p><p><a className="focus-ring" href={siteData.contact.emailHref}>{siteData.contact.email}</a></p></address>
      </div>
      <div className="container-shell mt-7 flex flex-col gap-2 text-xs text-white/30 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} {siteData.company.name}. 모든 권리 보유.</p><p>{siteData.company.registrationNumber}</p></div>
    </footer>
  );
}
