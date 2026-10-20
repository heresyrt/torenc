import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ContentGallery } from "@/components/ui/content-gallery";
import { siteData } from "@/data/site-data";
import { businessJsonLd, getBusinessSeo } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return siteData.businesses.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = siteData.businesses.find((item) => item.slug === slug);
  if (!business) return {};

  const seo = getBusinessSeo(business);
  return { title: seo.title, description: seo.description, alternates: { canonical: `/business/${slug}` } };
}

export default async function BusinessDetailPage({ params }: Props) {
  const { slug } = await params;
  const business = siteData.businesses.find((item) => item.slug === slug);
  if (!business) notFound();
  const usesPlaceholders = business.detailPresentation === "placeholders";
  const isImageOnlyGallery = business.detailPresentation === "gallery";
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(business)) }} /><Header /><main id="main-content"><section className="bg-[var(--navy-950)] pb-16 pt-32 text-white"><div className="container-shell"><Link href="/#business" className="focus-ring text-sm text-[var(--brand-gold-light)]">← 사업분야</Link><p className="mt-10 text-sm font-bold tracking-[.2em] text-[var(--brand-gold-light)]">{business.number} · BUSINESS</p><h1 className="mt-3 text-4xl font-bold sm:text-5xl">{business.title}</h1><div className="mt-8 max-w-3xl space-y-3 text-white/75">{business.overview.map((line) => <p key={line}>- {line}</p>)}</div></div></section><section className="section-space"><div className="container-shell">{!usesPlaceholders && <div className="relative aspect-[16/8] overflow-hidden bg-[var(--concrete-100)]"><Image src={business.media.src!} alt={business.media.alt} fill className="object-cover" priority /></div>}<h2 className={`${usesPlaceholders ? "" : "mt-16"} text-3xl font-bold text-[var(--navy-950)]`}>{business.detailSectionTitle}</h2><div className="mt-8">{usesPlaceholders ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{business.detailImages.map((item) => <article key={item.id} className="bg-white p-6 shadow-[0_14px_40px_rgba(44,63,79,.08)]"><h3 className="text-xl font-bold text-[var(--navy-950)]">{item.step}</h3><div className="mt-6 aspect-[16/10] bg-[var(--concrete-100)]" aria-label={`${item.step} 사진 영역`} /></article>)}</div> : <ContentGallery variant="detail" items={business.detailImages} numbers={isImageOnlyGallery ? undefined : business.detailImages.map((_, index) => String(index + 1).padStart(2, "0"))} />}</div></div></section></main><Footer /></>;
}
