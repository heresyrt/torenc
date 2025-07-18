import OrgChartSectionOne from "@/components/OrgChart/OrgChartSectionOne";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "더오름이앤씨 | 031-869-3453",
  description: "각종 옹벽 설치 전문회사 더오름이앤씨입니다. 031-869-3453",
  // other metadata
};

const OrgChartPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="더오름 이앤씨 > 조직도"
        description=""
      />
      <OrgChartSectionOne />
    </>
  );
};

export default OrgChartPage;
