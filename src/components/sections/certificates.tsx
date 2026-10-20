import { siteData } from "@/data/site-data";
import { ContentGallery } from "@/components/ui/content-gallery";
import { SectionHeading } from "@/components/ui/section-heading";

export function Certificates() {
  return (
    <section id="certificates" className="section-space scroll-mt-20 bg-[var(--navy-950)]">
      <div className="container-shell">
        <SectionHeading
          light
          eyebrow="04 · CERTIFICATES"
          title="인증현황"
          description={
            <>
              더오름이앤씨가 보유한 특허와 디자인등록 현황입니다.
              <br />
              이미지를 선택하면 상세 내용을 크게 확인할 수 있습니다.
            </>
          }
        />
        <div className="mt-14"><ContentGallery variant="certificates" items={siteData.certificates} /></div>
      </div>
    </section>
  );
}
