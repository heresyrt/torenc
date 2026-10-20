import { siteData } from "@/data/site-data";
import { SectionHeading } from "@/components/ui/section-heading";

export function About() {
  return (
    <section id="about" className="section-space scroll-mt-20 bg-white">
      <div className="container-shell">
        <div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
          <SectionHeading eyebrow="01 · COMPANY" title="현장을 이해하는 기술, 결과로 답하는 기업" />
          <div className="border-t border-black/15 pt-7">
            <p className="text-xl font-semibold leading-9 text-[var(--navy-800)] sm:text-2xl">{siteData.company.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
