import type { Metadata } from "next";

import type {
  InsightsCaseStudyDetail,
  InsightsCaseStudySummary,
  InsightsIndexContent,
  InsightsPostDetail
} from "../queries/insights";

const SITE_NAME = "Del Carmen Consulting";
const FALLBACK_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://delcarmenconsulting.com";

const toAbsoluteUrl = (path: string): string => {
  try {
    return new URL(path, FALLBACK_SITE_URL).toString();
  } catch {
    return FALLBACK_SITE_URL;
  }
};

type MetadataFallback = {
  fallbackTitle: string;
  fallbackDescription: string;
};

export const buildBlogIndexMetadata = (
  content: InsightsIndexContent,
  fallback: MetadataFallback
): Metadata => {
  const description =
    content.siteSettings?.defaultSeo?.description ?? fallback.fallbackDescription;
  return {
    title: content.siteSettings?.defaultSeo?.title ?? fallback.fallbackTitle,
    description,
    alternates: {
      canonical: toAbsoluteUrl("/blog")
    },
    openGraph: {
      type: "website",
      title: fallback.fallbackTitle,
      description,
      url: toAbsoluteUrl("/blog"),
      siteName: SITE_NAME
    },
    twitter: {
      card: "summary_large_image",
      title: fallback.fallbackTitle,
      description
    }
  };
};

export const buildBlogPostMetadata = (post: InsightsPostDetail): Metadata => {
  const canonical = toAbsoluteUrl(`/blog/${post.slug}`);
  return {
    title: post.seo?.title ?? `${post.title} | ${SITE_NAME}`,
    description: post.seo?.description ?? post.excerpt,
    alternates: {
      canonical
    },
    openGraph: {
      type: "article",
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.excerpt,
      url: canonical,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.excerpt
    }
  };
};

type ArticleJson = {
  slug: string;
  data: Record<string, unknown>;
};

export const buildBlogIndexJsonLd = (
  content: InsightsIndexContent,
  fallbackPosts: InsightsPostDetail[]
): { graph: Record<string, unknown>; articles: ArticleJson[] } => {
  const posts = content.posts.length
    ? content.posts
    : fallbackPosts.map(
        ({
          slug,
          title,
          excerpt,
          publishedAt,
          estimatedRead,
          categories,
          heroImage
        }) => ({
          slug,
          title,
          excerpt,
          publishedAt,
          estimatedRead,
          status: "published" as const,
          categories,
          heroImage
        })
      );

  const articles: ArticleJson[] = posts.map((post, index) => ({
    slug: post.slug,
    data: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      position: index + 1,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      url: toAbsoluteUrl(`/blog/${post.slug}`)
    }
  }));

  return {
    graph: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `${SITE_NAME} Insights`,
      url: toAbsoluteUrl("/blog"),
      blogPost: articles.map((article) => article.data)
    },
    articles
  };
};

export const buildBlogPostJsonLd = (
  post: InsightsPostDetail,
  siteUrl: string
): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.excerpt,
  datePublished: post.publishedAt,
  author: post.authors.map((author) => ({
    "@type": "Person",
    name: author.name
  })),
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl
  },
  url: `${siteUrl}/blog/${post.slug}`
});

export const buildCaseStudiesMetadata = (
  content: InsightsIndexContent,
  fallback: MetadataFallback
): Metadata => {
  const description =
    content.siteSettings?.defaultSeo?.description ?? fallback.fallbackDescription;
  return {
    title: fallback.fallbackTitle,
    description,
    alternates: {
      canonical: toAbsoluteUrl("/case-studies")
    },
    openGraph: {
      type: "website",
      title: fallback.fallbackTitle,
      description,
      url: toAbsoluteUrl("/case-studies"),
      siteName: SITE_NAME
    },
    twitter: {
      card: "summary_large_image",
      title: fallback.fallbackTitle,
      description
    }
  };
};

export const buildCaseStudyMetadata = (caseStudy: InsightsCaseStudyDetail): Metadata => {
  const canonical = toAbsoluteUrl(`/case-studies/${caseStudy.slug}`);
  return {
    title: caseStudy.seo?.title ?? `${caseStudy.title} | ${SITE_NAME}`,
    description: caseStudy.seo?.description ?? caseStudy.summary,
    alternates: {
      canonical
    },
    openGraph: {
      type: "article",
      title: caseStudy.seo?.title ?? caseStudy.title,
      description: caseStudy.seo?.description ?? caseStudy.summary,
      url: canonical,
      siteName: SITE_NAME,
      publishedTime: caseStudy.publishedAt
    },
    twitter: {
      card: "summary_large_image",
      title: caseStudy.seo?.title ?? caseStudy.title,
      description: caseStudy.seo?.description ?? caseStudy.summary
    }
  };
};

type CaseStudyJson = {
  slug: string;
  data: Record<string, unknown>;
};

export const buildCaseStudiesIndexJsonLd = (
  content: InsightsIndexContent,
  fallbackCaseStudies: InsightsCaseStudyDetail[]
): { graph: Record<string, unknown>; caseStudies: CaseStudyJson[] } => {
  const caseStudies: InsightsCaseStudySummary[] = content.caseStudies.length
    ? content.caseStudies
    : fallbackCaseStudies.map(
        ({
          slug,
          title,
          summary,
          status,
          publishedAt,
          metrics,
          testimonial,
          heroImage
        }) => ({
          id: slug,
          slug,
          title,
          summary,
          status,
          publishedAt,
          metrics,
          testimonial,
          heroImage
        })
      );

  const nodes: CaseStudyJson[] = caseStudies.map((study, index) => ({
    slug: study.slug,
    data: {
      "@type": "CreativeWork",
      "@id": toAbsoluteUrl(`/case-studies/${study.slug}`),
      name: study.title,
      position: index + 1,
      url: toAbsoluteUrl(`/case-studies/${study.slug}`),
      description: study.summary
    }
  }));

  return {
    graph: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${SITE_NAME} Case Studies`,
      itemListElement: nodes.map((node) => ({
        "@type": "ListItem",
        position: node.data.position,
        item: node.data
      }))
    },
    caseStudies: nodes
  };
};

export const buildCaseStudyJsonLd = (
  caseStudy: InsightsCaseStudyDetail
): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: caseStudy.title,
  description: caseStudy.summary,
  datePublished: caseStudy.publishedAt,
  url: toAbsoluteUrl(`/case-studies/${caseStudy.slug}`)
});
