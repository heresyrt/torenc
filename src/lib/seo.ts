import type { BusinessItem } from "@/types/site";

import { siteData } from "@/data/site-data";

export const siteUrl = "https://torenc.com";

export function getBusinessSeo(business: BusinessItem) {
  const title = business.seoTitle ?? business.title;
  const description = business.seoDescription ?? business.description;

  return {
    title,
    description,
    url: `${siteUrl}/business/${business.slug}`,
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteData.company.name,
  url: siteUrl,
  logo: `${siteUrl}/images/brand/logo-horizontal-korean.svg`,
  telephone: siteData.contact.phone,
  email: siteData.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteData.contact.address,
    addressCountry: "KR",
  },
};

export function businessJsonLd(business: BusinessItem) {
  const seo = getBusinessSeo(business);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: seo.title,
    description: seo.description,
    url: seo.url,
    provider: {
      "@type": "Organization",
      name: siteData.company.name,
      url: siteUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "대한민국",
    },
  };
}
