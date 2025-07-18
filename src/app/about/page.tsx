import AboutSectionOne from "@/components/About/AboutSectionOne";
// import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "더오름이앤씨 | 031-869-3453",
  description: "각종 옹벽 설치 전문회사 더오름이앤씨입니다. 031-869-3453",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="더오름 이앤씨 > 소개"
        description="더오름이앤씨는 토목 공사, 지반조성, 기초 공사, 절·성토 작업 등 설계,시공 전문기업으로 건설 산업의 필수적인 토공 사업을 전문으로 하는 기업입니다. 안정적인 시장 진입을 목표로 지속 가능한 성장을 통해 업계 선도적인 기업으로 발돋움하고자 합니다.더오름 이앤씨는 친환경 TOR옹벽패널 제조 및 판매를 통해 건설 산업의 지속가능성을 선도하고자 합니다. 토공사업 및 제조업을 기반으로, 혁신적인 디자인과 기술력을 바탕으로 한 옹벽패널을 개발하여 국내외 시장에 진출할 계획입니다."
      />
      <AboutSectionOne />
      {/* <AboutSectionTwo /> */}
    </>
  );
};

export default AboutPage;
