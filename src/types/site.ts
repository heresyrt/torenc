export interface NavigationItem {
  label: string;
  href: `/#${string}`;
}

export interface BusinessItem {
  number: string;
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  overview: string[];
  media: MediaItem;
  detailSectionTitle: string;
  detailImages: DetailImageItem[];
  detailPresentation?: "steps" | "placeholders" | "gallery";
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  alt: string;
  width: number;
  height: number;
  src?: string;
  blurDataURL?: string;
  meta?: string;
  documentHref?: string;
}

export interface DetailImageItem extends MediaItem {
  step: string;
  fit: "cover" | "contain";
}

export interface ContactInfo {
  phone: string;
  phoneHref: `tel:${string}`;
  fax: string;
  email: string;
  emailHref: `mailto:${string}`;
  address: string;
  businessHours: string;
}

export interface SiteData {
  company: {
    name: string;
    nameEnglish: string;
    tagline: string;
    description: string;
    registrationNumber: string;
  };
  navigation: NavigationItem[];
  businesses: BusinessItem[];
  projects: MediaItem[];
  certificates: MediaItem[];
  contact: ContactInfo;
}
