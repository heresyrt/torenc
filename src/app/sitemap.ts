import type { MetadataRoute } from "next";

import { siteData } from "@/data/site-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://torenc.com", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://torenc.com/location", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...siteData.businesses.map(({ slug }) => ({
      url: `https://torenc.com/business/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
