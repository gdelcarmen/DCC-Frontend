import type { Metadata } from "next";
import type { MarketingContent, MarketingService } from "../queries/marketing";

const FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://delcarmenconsulting.com";
const SITE_NAME = "Del Carmen Consulting";

const toAbsoluteUrl = (path: string): string => {
  try {
    return new URL(path, FALLBACK_SITE_URL).toString();
  } catch {
    return FALLBACK_SITE_URL;
  }
};

const getDescription = (content: MarketingContent): string =>
  content.siteSettings?.defaultSeo?.description ?? content.hero.description;

export const buildHomeMetadata = (content: MarketingContent): Metadata => {
  const description = getDescription(content);

  return {
    title: content.siteSettings?.defaultSeo?.title ?? content.hero.title,
    description,
    alternates: {
      canonical: toAbsoluteUrl("/")
    },
    openGraph: {
      type: "website",
      title: content.siteSettings?.defaultSeo?.title ?? content.hero.title,
      description,
      url: toAbsoluteUrl("/"),
      siteName: SITE_NAME
    },
    twitter: {
      card: "summary_large_image",
      title: content.siteSettings?.defaultSeo?.title ?? content.hero.title,
      description
    }
  };
};

export const buildServicesMetadata = (content: MarketingContent): Metadata => {
  const description =
    content.siteSettings?.defaultSeo?.description ??
    "Explore Del Carmen Consulting services covering consent decree compliance, analytics, and training.";

  return {
    title: "Services",
    description,
    alternates: {
      canonical: toAbsoluteUrl("/services")
    },
    openGraph: {
      type: "website",
      title: "Services | Del Carmen Consulting",
      description,
      url: toAbsoluteUrl("/services"),
      siteName: SITE_NAME
    },
    twitter: {
      card: "summary_large_image",
      title: "Services | Del Carmen Consulting",
      description
    }
  };
};

export const buildServiceMetadata = (
  service: MarketingService,
  content: MarketingContent
): Metadata => {
  const description =
    service.excerpt ??
    content.siteSettings?.defaultSeo?.description ??
    "Del Carmen Consulting delivers equitable outcomes for public safety agencies.";

  const canonicalPath = `/services/${service.slug}`;

  return {
    title: `${service.title} | Del Carmen Consulting`,
    description,
    alternates: {
      canonical: toAbsoluteUrl(canonicalPath)
    },
    openGraph: {
      type: "website",
      title: `${service.title} | Del Carmen Consulting`,
      description,
      url: toAbsoluteUrl(canonicalPath),
      siteName: SITE_NAME
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | Del Carmen Consulting`,
      description
    }
  };
};

export const buildHomeJsonLd = (content: MarketingContent): Record<string, unknown> => {
  const services = content.services.slice(0, 6).map((service, index) => ({
    "@type": "Service",
    "@id": toAbsoluteUrl(service.href),
    name: service.title,
    position: index + 1,
    description: service.excerpt
  }));
  const socialLinks =
    content.siteSettings?.socialLinks
      ?.map((link) => link.url)
      .filter((url): url is string => Boolean(url)) ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: toAbsoluteUrl("/"),
    sameAs: socialLinks,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Consulting Services",
      itemListElement: services
    }
  };
};

export const buildServicesJsonLd = (
  services: MarketingService[]
): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Del Carmen Consulting Services",
  url: toAbsoluteUrl("/services"),
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: toAbsoluteUrl(service.href),
    name: service.title,
    description: service.excerpt
  }))
});

export const buildServiceJsonLd = (service: MarketingService): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.title,
  description: service.excerpt,
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: toAbsoluteUrl("/")
  },
  url: toAbsoluteUrl(service.href)
});
