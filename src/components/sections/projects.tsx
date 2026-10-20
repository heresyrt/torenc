import { siteData } from "@/data/site-data";
import { ContentGallery } from "@/components/ui/content-gallery";
import { SectionHeading } from "@/components/ui/section-heading";

export function Projects() {
  return (
    <section id="projects" className="section-space scroll-mt-20 bg-white">
      <div className="container-shell">
        <SectionHeading eyebrow="03 · PROJECTS" title="시공실적" description="다양한 시공 실적을 통해 더오름이앤씨의 전문성과 신뢰성을 확인하세요." />
        <div className="mt-14"><ContentGallery variant="projects" items={siteData.projects} /></div>
      </div>
    </section>
  );
}
