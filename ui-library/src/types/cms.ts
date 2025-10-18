export interface SanityDocumentMeta {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface SanityReference<T extends string = string> {
  _type: "reference";
  _ref: string;
  _weak?: boolean;
  _strengthenOnPublish?: {
    template?: { id: string; params?: Record<string, string> };
    type: T;
  };
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface SanityImage {
  _type: "image";
  asset: SanityReference<"sanity.imageAsset">;
  alt?: string;
}

export interface SanityFile {
  _type: "file";
  asset: SanityReference<"sanity.fileAsset">;
}

export type PortableText = Array<Record<string, unknown>>;

export interface Agency extends SanityDocumentMeta {
  name: string;
  slug: SanitySlug;
  jurisdiction: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  logo?: SanityImage;
  permissionReceived: boolean;
  permissionNotes?: string;
  mapDisplay?: boolean;
  engagementTypes: string[];
  yearEngaged?: number;
  caseStudies: Array<SanityReference<"caseStudy">>;
  testimonials: Array<SanityReference<"testimonial">>;
  featured: boolean;
}

export type CaseStatus = "published" | "comingSoon" | "draft";

export interface CaseStudy extends SanityDocumentMeta {
  title: string;
  slug: SanitySlug;
  summary: string;
  objective: PortableText;
  approach: PortableText;
  outcomes: PortableText;
  lessonsLearned?: PortableText;
  agency: SanityReference<"agency">;
  date: string;
  status: CaseStatus;
  engagementType?: SanityReference<"service">;
  heroImage?: SanityImage;
  seo?: SeoMetadata;
}

export type PostStatus = "published" | "draft" | "comingSoon";

export interface Post extends SanityDocumentMeta {
  title: string;
  slug: SanitySlug;
  excerpt: string;
  body: PortableText;
  authors: Array<SanityReference<"people">>;
  categories?: string[];
  heroImage?: SanityImage;
  publishedAt: string;
  status?: PostStatus;
  seo?: SeoMetadata;
}

export interface Service extends SanityDocumentMeta {
  title: string;
  slug: SanitySlug;
  excerpt: string;
  body: PortableText;
  focusAreas: string[];
  faqs: Array<{
    question: string;
    answer: PortableText;
  }>;
  relatedCaseStudies: Array<SanityReference<"caseStudy">>;
  relatedPosts: Array<SanityReference<"post">>;
  ctaLabel?: string;
  ctaUrl?: string;
  seo?: SeoMetadata;
}

export interface Testimonial extends SanityDocumentMeta {
  quote: string;
  person: string;
  role?: string;
  agency?: SanityReference<"agency">;
  date?: string;
  permissionDocument?: SanityFile;
  permissionReceived: boolean;
  display: boolean;
}

export interface Person extends SanityDocumentMeta {
  name: string;
  role: string;
  credentials: string[];
  bio: PortableText;
  headshot: SanityImage;
  mediaLinks: Array<{
    label: string;
    url: string;
  }>;
}

export interface SeoMetadata {
  title?: string;
  description?: string;
  ogImage?: SanityImage;
}

export interface NavigationLink {
  _key: string;
  label: string;
  href: string;
}

export interface SiteSettings extends SanityDocumentMeta {
  brand?: {
    colors?: Record<string, string>;
    typography?: Record<string, string>;
    logo?: SanityImage;
  };
  navigation: NavigationLink[];
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  defaultSeo?: SeoMetadata;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  accessibilityStatement?: PortableText;
}

export interface ContactSubmission {
  agencyName: string;
  contactName: string;
  contactEmail: string;
  role?: string;
  serviceInterest: string[];
  message: string;
  consent: boolean;
  ipHash?: string;
  createdAt: string;
  metadata?: {
    userAgent?: string;
    referrer?: string;
  };
}
