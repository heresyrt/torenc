import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

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

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Page"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
