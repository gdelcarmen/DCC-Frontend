import type { SiteSettings, Service, Testimonial } from "@dcc/ui-library";
import type { StatStripItem } from "@dcc/ui-library/components/StatStrip";
import type { CarouselTestimonial } from "@dcc/ui-library/components/Testimonial";
import { getSanityClient, groq } from "../sanity/client";

type SanityService = Service & {
  _id: string;
  slug: { current: string };
  ctaLabel?: string;
  ctaUrl?: string;
};

type SanityTestimonial = Testimonial & {
  _id: string;
  permissionReceived?: boolean;
  display?: boolean;
};

type SanityCaseStudy = {
  _id: string;
  title: string;
  summary: string;
  slug?: { current?: string };
  status?: string;
};

type MarketingQueryResult = {
  siteSettings: SiteSettings | null;
  services: SanityService[];
  testimonials: SanityTestimonial[];
  caseStudies: SanityCaseStudy[];
};

export type MarketingHero = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export type MarketingService = {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  icon: "shield" | "chart" | "compass" | "insight";
  ctaLabel: string;
  slug: string;
};

export type MarketingCaseStudyHighlight = {
  id: string;
  title: string;
  summary: string;
  href: string;
  status: string;
};

export type MarketingContent = {
  siteSettings: SiteSettings | null;
  hero: MarketingHero;
  stats: StatStripItem[];
  services: MarketingService[];
  testimonials: CarouselTestimonial[];
  caseStudies: MarketingCaseStudyHighlight[];
};

const FALLBACK_CONTENT: MarketingContent = {
  siteSettings: null,
  hero: {
    eyebrow: "Strategy & Accountability",
    title: "Del Carmen Consulting partners with agencies to deliver equitable outcomes.",
    description:
      "We combine data-driven insights, civil rights expertise, and collaborative training to help agencies comply with consent decrees and build community trust.",
    ctaLabel: "View Services",
    ctaHref: "/services",
    secondaryCtaLabel: "Contact Us",
    secondaryCtaHref: "/contact"
  },
  stats: [
    { label: "Agencies partnered", value: "120+" },
    { label: "Training hours delivered", value: "15k" },
    { label: "Policy audits completed", value: "48" }
  ],
  services: [
    {
      id: "service-compliance",
      title: "Consent Decree Compliance",
      excerpt: "Operational roadmaps that sustain constitutional policing commitments.",
      href: "/services/consent-decree-compliance",
      icon: "shield",
      ctaLabel: "Learn more",
      slug: "consent-decree-compliance"
    },
    {
      id: "service-analytics",
      title: "Data Analytics",
      excerpt: "Turnkey analytics programs tracking racial equity, use of force, and policy adherence.",
      href: "/services/data-analytics",
      icon: "chart",
      ctaLabel: "Learn more",
      slug: "data-analytics"
    },
    {
      id: "service-training",
      title: "Innovation & Training",
      excerpt: "Immersive workshops that transform policy into on-the-ground practice.",
      href: "/services/innovation-training",
      icon: "compass",
      ctaLabel: "Learn more",
      slug: "innovation-training"
    }
  ],
  testimonials: [
    {
      id: "testimonial-cedar-grove",
      quote: "Del Carmen Consulting guided us through transformational compliance reforms.",
      person: "Chief Jordan Williams",
      role: "Cedar Grove Police Department",
      canDisplay: true
    }
  ],
  caseStudies: []
};

const marketingQuery = groq`{
  "siteSettings": *[_type == "siteSettings"][0]{
    _id,
    brand,
    navigation,
    socialLinks,
    defaultSeo,
    contact,
    accessibilityStatement
  },
  "services": *[_type == "service"] | order(_createdAt asc){
    _id,
    title,
    excerpt,
    "slug": slug,
    ctaLabel,
    ctaUrl
  },
  "testimonials": *[_type == "testimonial" && permissionReceived == true && coalesce(display, true) == true] | order(coalesce(date, _createdAt) desc){
    _id,
    quote,
    person,
    role,
    permissionReceived,
    display
  },
  "caseStudies": *[_type == "caseStudy" && status == "published"] | order(date desc)[0...3]{
    _id,
    title,
    summary,
    "slug": slug,
    status
  }
}`;

const hasSanityCredentials = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);

const normalizeServices = (services: SanityService[]): MarketingService[] => {
  if (!services?.length) {
    return FALLBACK_CONTENT.services;
  }
  return services.map((service, index) => {
    const slug = service.slug?.current ?? "";
    const href = slug ? `/services/${slug}` : `/services`;
    const icons: MarketingService["icon"][] = ["shield", "chart", "compass", "insight"];
    return {
      id: service._id ?? `service-${index}`,
      title: service.title,
      excerpt: service.excerpt,
      href,
      icon: icons[index % icons.length],
      ctaLabel: service.ctaLabel ?? "Learn more",
      slug
    };
  });
};

const normalizeTestimonials = (
  testimonials: SanityTestimonial[]
): CarouselTestimonial[] => {
  if (!testimonials?.length) {
    return FALLBACK_CONTENT.testimonials;
  }
  return testimonials
    .filter((testimonial) => testimonial.permissionReceived !== false)
    .map((testimonial) => ({
      id: testimonial._id ?? testimonial.person ?? "testimonial",
      quote: testimonial.quote,
      person: testimonial.person,
      role: testimonial.role ?? undefined,
      canDisplay: true
    }));
};

const normalizeCaseStudies = (caseStudies: SanityCaseStudy[]): MarketingCaseStudyHighlight[] => {
  if (!caseStudies?.length) {
    return [];
  }
  return caseStudies.map((caseStudy) => {
    const slug = caseStudy.slug?.current ?? "";
    return {
      id: caseStudy._id ?? caseStudy.title,
      title: caseStudy.title,
      summary: caseStudy.summary,
      href: slug ? `/case-studies/${slug}` : "/case-studies",
      status: caseStudy.status ?? "published"
    };
  });
};

export async function getMarketingContent(): Promise<MarketingContent> {
  if (!hasSanityCredentials()) {
    return FALLBACK_CONTENT;
  }

  try {
    const client = getSanityClient();
    const data = await client.fetch<MarketingQueryResult>(marketingQuery);
    return {
      siteSettings: data.siteSettings ?? null,
      hero: FALLBACK_CONTENT.hero,
      stats: FALLBACK_CONTENT.stats,
      services: normalizeServices(data.services),
      testimonials: normalizeTestimonials(data.testimonials),
      caseStudies: normalizeCaseStudies(data.caseStudies)
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to fetch marketing content from Sanity:", error);
    }
    return FALLBACK_CONTENT;
  }
}
