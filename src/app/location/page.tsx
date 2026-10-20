import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Location } from "@/components/sections/location";
import { siteData } from "@/data/site-data";

export const metadata: Metadata = {
  title: "오시는 길",
  description: `${siteData.company.name} 주소, 대표전화, 이메일과 위치 안내입니다.`,
  alternates: { canonical: "/location" },
};

export default function LocationPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Location />
      </main>
      <Footer />
    </>
  );
}
