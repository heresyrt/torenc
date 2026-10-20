import { siteData } from "@/data/site-data";

export function ContactCta() {
  return (
    <section id="contact" className="scroll-mt-20 bg-[var(--brand-gold)] py-20 text-[var(--navy-950)] sm:py-28">
      <div className="container-shell grid items-end gap-10 lg:grid-cols-[1fr_auto]">
        <div><p className="text-sm font-bold tracking-[0.18em] text-[var(--navy-800)]">PROJECT INQUIRY</p><h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.05em] sm:text-6xl">프로젝트를 함께 검토해 보세요</h2><p className="mt-6 max-w-2xl text-lg text-[var(--navy-800)]">현장 조건과 필요한 공법을 알려주시면 검토 후 담당자가 안내해 드립니다.</p></div>
        <div className="flex flex-col items-start gap-3 lg:items-end"><a className="focus-ring bg-[var(--navy-950)] px-7 py-4 font-bold text-white" href={siteData.contact.phoneHref}>{siteData.contact.phone}</a><a className="focus-ring border-b border-[var(--navy-800)]/50 text-sm font-semibold" href={siteData.contact.emailHref}>{siteData.contact.email}</a></div>
      </div>
    </section>
  );
}
