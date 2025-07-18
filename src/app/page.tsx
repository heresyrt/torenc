import Construction from "@/components/construction";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "더오름이앤씨 | 031-869-3453",
  description: "더오름이앤씨는 토목 공사 분야에서 최고의 품질과 안전을 추구하는 기업입니다.",
  icons: {
		icon: "/favicon.ico",
	},
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      {/* <Video /> */}
      {/* <Brands /> */}
      {/* <AboutSectionOne /> */}
      {/* <AboutSectionTwo /> */}
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <Construction />
      <Contact />
    </>
  );
}
