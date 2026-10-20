import { siteData } from "@/data/site-data";
import { KakaoMap } from "@/components/ui/kakao-map";
import { SectionHeading } from "@/components/ui/section-heading";

export function Location() {
  return (
    <section id="location" className="section-space scroll-mt-20 bg-[var(--concrete-50)]">
      <div className="container-shell">
        <SectionHeading eyebrow="05 · LOCATION" title="오시는 길" description="방문 전 연락해 주시면 담당자가 빠르게 안내해 드리겠습니다." />
        <div className="mt-14 grid overflow-hidden border border-black/10 bg-white lg:grid-cols-[.65fr_1.35fr]">
          <div className="p-7 sm:p-10">
            <dl className="space-y-8">
              <div><dt className="text-xs font-bold tracking-widest text-[var(--brand-gold-deep)]">주소</dt><dd className="mt-2 font-semibold leading-7">{siteData.contact.address}</dd></div>
              <div><dt className="text-xs font-bold tracking-widest text-[var(--brand-gold-deep)]">대표 전화</dt><dd className="mt-2"><a className="focus-ring font-semibold underline decoration-black/20 underline-offset-4" href={siteData.contact.phoneHref}>{siteData.contact.phone}</a></dd></div>
              <div><dt className="text-xs font-bold tracking-widest text-[var(--brand-gold-deep)]">팩스</dt><dd className="mt-2 font-semibold">{siteData.contact.fax}</dd></div>
              <div><dt className="text-xs font-bold tracking-widest text-[var(--brand-gold-deep)]">이메일</dt><dd className="mt-2"><a className="focus-ring break-all font-semibold underline decoration-black/20 underline-offset-4" href={siteData.contact.emailHref}>{siteData.contact.email}</a></dd></div>
              <div><dt className="text-xs font-bold tracking-widest text-[var(--brand-gold-deep)]">운영 시간</dt><dd className="mt-2 text-sm text-[var(--muted)]">{siteData.contact.businessHours}</dd></div>
            </dl>
          </div>
          <KakaoMap companyName={siteData.company.name} address={siteData.contact.address} />
        </div>
      </div>
    </section>
  );
}
