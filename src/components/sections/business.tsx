import { siteData } from "@/data/site-data";
import { SectionHeading } from "@/components/ui/section-heading";
import Image from "next/image";
import Link from "next/link";

export function Business() {
  return (
    <section id="business" className="section-space scroll-mt-20 bg-[var(--concrete-100)]">
      <div className="container-shell">
        <SectionHeading eyebrow="02 · BUSINESS" title="사업분야" description="지형과 토질을 고려하여 다양한 종류의 옹벽을 설계하고 시공합니다. 또한, 기존 옹벽의 유지보수 및 보강 작업도 수행하며, 필요에 따라 기술 개발이나 자재 납품, 컨설팅 등의 부가적인 사업도 진행합니다." />
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{siteData.businesses.map((item) => <Link key={item.slug} href={`/business/${item.slug}`} className="group bg-white shadow-[0_14px_40px_rgba(44,63,79,.08)] focus-ring"><div className="relative aspect-[16/10] overflow-hidden bg-[var(--navy-900)]"><Image src={item.media.src!} alt={item.media.alt} fill className="object-cover transition duration-500 group-hover:scale-[1.02]" sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw" /></div><div className="p-6"><p className="text-xs font-bold text-[var(--brand-gold-deep)]">{item.number}</p><h3 className="mt-2 text-xl font-bold text-[var(--navy-950)]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.description}</p><p className="mt-5 text-sm font-bold text-[var(--navy-950)]">상세 보기 <span aria-hidden>→</span></p></div></Link>)}</div>
      </div>
    </section>
  );
}
