import Construction from "@/components/construction";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "더오름이앤씨 | 031-869-3453",
  description: "더오름이앤씨,자립식옹벽,절토부옹벽,성토부옹벽,토목공사",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
    },
  },
  openGraph: {
    title: '더오름이앤씨 | 031-869-3453',
    description: '자립식옹벽,절토부옹벽,성토부옹벽,토목공사',
    type: 'website',
    url: 'https://torenc.com',
    siteName: '더오름이앤씨',
    locale: 'ko_KR',
  },
  icons: {
		icon: "/favicon.ico",
	},
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
