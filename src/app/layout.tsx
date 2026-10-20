import type { Metadata } from "next";

import { siteData } from "@/data/site-data";

import "./globals.css";

const siteUrl = "https://torenc.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteData.company.name} | 토목·건설 엔지니어링`,
    template: `%s | ${siteData.company.name}`,
  },
  description: siteData.company.description,
  formatDetection: {
    telephone: false,
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: siteData.company.name,
    title: `${siteData.company.name} | 토목·건설 엔지니어링`,
    description: siteData.company.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteData.company.name} | 토목·건설 엔지니어링`,
    description: siteData.company.description,
  },
  verification: {
    other: {
      "naver-site-verification": "4c3fed93e23e306c0c37d4a3e410abbf38353844",
    },
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
