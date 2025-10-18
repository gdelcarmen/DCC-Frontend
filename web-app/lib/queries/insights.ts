'use server';

import type {
  CaseStatus,
  PortableText,
  SeoMetadata,
  SiteSettings
} from "@dcc/ui-library";
import { getSanityClient, groq } from "../sanity/client";

type SanityImageAsset = {
  url?: string;
  asset?: {
    _ref?: string;
  };
  alt?: string;
};

type SanityPerson = {
  _id: string;
  name: string;
  role?: string;
};

type SanityPost = {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  body?: PortableText;
  publishedAt?: string;
  estimatedRead?: string;
  status?: string;
  placeholder?: boolean;
  categories?: string[];
  heroImage?: SanityImageAsset;
  authors?: SanityPerson[];
  seo?: SeoMetadata;
};

type SanityCaseStudy = {
  _id: string;
  title: string;
  slug?: { current?: string };
  summary?: string;
  status?: CaseStatus;
  placeholder?: boolean;
  objective?: PortableText;
  approach?: PortableText;
  outcomes?: PortableText;
  metrics?: Array<{ label: string; value: string }>;
  spotlightTestimonial?: {
    quote: string;
    person: string;
    role?: string;
    permissionReceived?: boolean;
  } | null;
  heroImage?: SanityImageAsset;
  publishedAt?: string;
  seo?: SeoMetadata;
};

export type InsightsPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  estimatedRead: string;
  status: "published" | "comingSoon";
  categories: string[];
  heroImage: {
    src: string | null;
    alt?: string;
  } | null;
};

export type InsightsCaseStudySummary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: CaseStatus;
  publishedAt: string;
  metrics: Array<{ label: string; value: string }>;
  testimonial: {
    quote: string;
    person: string;
    role?: string;
    canDisplay: boolean;
  } | null;
  heroImage: {
    src: string | null;
    alt?: string;
  } | null;
};

export type InsightsPostDetail = InsightsPostSummary & {
  body: PortableText;
  authors: Array<{ id: string; name: string; role?: string }>;
  seo: SeoMetadata | null;
};

export type InsightsCaseStudyDetail = InsightsCaseStudySummary & {
  objective: PortableText;
  approach: PortableText;
  outcomes: PortableText;
  seo: SeoMetadata | null;
};

export type InsightsIndexContent = {
  siteSettings: SiteSettings | null;
  posts: InsightsPostSummary[];
  caseStudies: InsightsCaseStudySummary[];
  categories: string[];
  featuredCaseStudy: InsightsCaseStudySummary | null;
  totalPosts: number;
};

const FALLBACK_POSTS: InsightsPostDetail[] = [
  {
    id: "post-data-transparency",
    slug: "data-transparency-community-trust",
    title: "How data transparency rebuilt community trust",
    excerpt:
      "A blueprint for publishing use-of-force dashboards that align with consent decree milestones and community expectations.",
    publishedAt: "2024-06-12T00:00:00.000Z",
    estimatedRead: "6 min read",
    status: "published",
    categories: ["Data Analytics", "Community Engagement"],
    heroImage: {
      src: "/images/blog/data-transparency.jpg",
      alt: "Analysts reviewing accountability dashboards"
    },
    body: [],
    authors: [
      { id: "author-dcc", name: "Dr. Alex Del Carmen", role: "Principal Consultant" },
      { id: "author-harlow", name: "Jamie Harlow", role: "Senior Data Scientist" }
    ],
    seo: {
      title: "How data transparency rebuilt community trust | Del Carmen Consulting",
      description:
        "Del Carmen Consulting shares lessons learned from building transparent accountability dashboards for oversight agencies."
    }
  },
  {
    id: "post-training-iteration",
    slug: "iterative-training-playbook",
    title: "Iterative training playbook for sustainable reforms",
    excerpt:
      "How we pair officer feedback loops with community input to deliver durable training transformations.",
    publishedAt: "2024-04-02T00:00:00.000Z",
    estimatedRead: "5 min read",
    status: "published",
    categories: ["Innovation & Training"],
    heroImage: {
      src: "/images/blog/iterative-training.jpg",
      alt: "Training facilitator leading scenario practice"
    },
    body: [],
    authors: [{ id: "author-bryant", name: "Jordan Bryant", role: "Director of Training" }],
    seo: {
      title: "Iterative training playbook for sustainable reforms | Del Carmen Consulting",
      description:
        "Discover how Del Carmen Consulting structures experiential training programs that stick long after the workshops end."
    }
  }
];

const FALLBACK_CASE_STUDIES: InsightsCaseStudyDetail[] = [
  {
    id: "case-bias-audit",
    slug: "bias-audit-initiative",
    title: "Bias audit initiative",
    summary:
      "Partnering with Cedar Grove Police Department to audit stops, searches, and use-of-force data with independent oversight.",
    status: "comingSoon",
    publishedAt: "2024-02-01T00:00:00.000Z",
    metrics: [
      { label: "Policies revamped", value: "25" },
      { label: "Supervisors trained", value: "320" }
    ],
    testimonial: null,
    heroImage: {
      src: "/images/case-studies/bias-audit.jpg",
      alt: "Officers reviewing policy binders with community observers"
    },
    objective: [],
    approach: [],
    outcomes: [],
    seo: {
      title: "Bias audit initiative | Del Carmen Consulting",
      description: "Cedar Grove PD partnered with DCC to uncover and remediate bias indicators across all operations."
    }
  },
  {
    id: "case-accountability-dashboard",
    slug: "accountability-dashboard-launch",
    title: "Accountability dashboard launch",
    summary:
      "Delivered a public-facing dashboard surfacing quarterly reforms, external monitor scores, and officer wellness metrics.",
    status: "published",
    publishedAt: "2023-11-01T00:00:00.000Z",
    metrics: [
      { label: "Dashboard adoption", value: "12 agencies" },
      { label: "Community briefings", value: "18" }
    ],
    testimonial: {
      quote: "DCC translated our decades of data into a narrative our community could trust.",
      person: "Chief Renee Alvarado",
      role: "Southside Police Department",
      canDisplay: true
    },
    heroImage: {
      src: "/images/case-studies/dashboard-launch.jpg",
      alt: "Community members viewing accountability dashboards"
    },
    objective: [],
    approach: [],
    outcomes: [],
    seo: {
      title: "Accountability dashboard launch | Del Carmen Consulting",
      description:
        "How DCC helped Southside Police Department ship transparent accountability dashboards aligned with consent decree metrics."
    }
  }
];

const FALLBACK_INDEX: InsightsIndexContent = {
  siteSettings: null,
  posts: FALLBACK_POSTS.map(({ body, authors, seo, ...summary }) => summary),
  caseStudies: FALLBACK_CASE_STUDIES.map(({ objective, approach, outcomes, seo, ...summary }) => summary),
  categories: ["Data Analytics", "Community Engagement", "Innovation & Training"],
  featuredCaseStudy: FALLBACK_CASE_STUDIES[1],
  totalPosts: FALLBACK_POSTS.length
};

const insightsQuery = groq`{
  "siteSettings": *[_type == "siteSettings"][0]{
    _id,
    brand,
    navigation,
    socialLinks,
    defaultSeo,
    contact
  },
  "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    excerpt,
    body,
    publishedAt,
    estimatedRead,
    status,
    placeholder,
    "slug": slug.current,
    categories,
    "heroImage": {
      "url": heroImage.asset->url,
      alt: heroImage.alt
    },
    "authors": authors[]->{
      _id,
      name,
      role
    },
    seo
  },
  "caseStudies": *[_type == "caseStudy" && defined(slug.current)] | order(date desc){
    _id,
    title,
    summary,
    status,
    placeholder,
    "slug": slug.current,
    objective,
    approach,
    outcomes,
    metrics,
    "spotlightTestimonial": spotlightTestimonial{
      quote,
      person,
      role,
      permissionReceived
    },
    "heroImage": {
      "url": heroImage.asset->url,
      alt: heroImage.alt
    },
    "publishedAt": coalesce(date, _createdAt),
    seo
  }
}`;

const hasSanityCredentials = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);

const normalizePost = (post: SanityPost): InsightsPostDetail | null => {
  if (!post.slug?.current && !post.slug) {
    return null;
  }

  const slug = typeof post.slug === "string" ? post.slug : post.slug?.current ?? "";
  const publishedAt = post.publishedAt ?? new Date().toISOString();
  if (post.status === "draft") {
    return null;
  }
  const status =
    post.placeholder === true || post.status === "comingSoon" ? "comingSoon" : "published";

  return {
    id: post._id ?? slug,
    slug,
    title: post.title ?? "Untitled post",
    excerpt:
      post.excerpt ??
      "Del Carmen Consulting shares lessons learned from delivering sustainable reforms.",
    publishedAt,
    estimatedRead: post.estimatedRead ?? "5 min read",
    status,
    categories: post.categories ?? [],
    heroImage: post.heroImage?.url
      ? {
          src: post.heroImage.url,
          alt: post.heroImage.alt
        }
      : null,
    body: post.body ?? [],
    authors:
      post.authors?.map((author) => ({
        id: author._id,
        name: author.name,
        role: author.role
      })) ?? [],
    seo: post.seo ?? null
  };
};

const normalizeCaseStudy = (caseStudy: SanityCaseStudy): InsightsCaseStudyDetail | null => {
  if (!caseStudy.slug?.current && typeof caseStudy.slug !== "string") {
    return null;
  }

  const slug = typeof caseStudy.slug === "string" ? caseStudy.slug : caseStudy.slug?.current ?? "";

  return {
    id: caseStudy._id ?? slug,
    slug,
    title: caseStudy.title ?? "Case study",
    summary:
      caseStudy.summary ??
      "Del Carmen Consulting partners with agencies to implement sustainable reforms.",
    status:
      caseStudy.placeholder === true
        ? "comingSoon"
        : caseStudy.status ?? "comingSoon",
    publishedAt: caseStudy.publishedAt ?? new Date().toISOString(),
    metrics: caseStudy.metrics ?? [],
    testimonial: caseStudy.spotlightTestimonial
      ? {
          quote: caseStudy.spotlightTestimonial.quote,
          person: caseStudy.spotlightTestimonial.person,
          role: caseStudy.spotlightTestimonial.role,
          canDisplay: caseStudy.spotlightTestimonial.permissionReceived !== false
        }
      : null,
    heroImage: caseStudy.heroImage?.url
      ? {
          src: caseStudy.heroImage.url,
          alt: caseStudy.heroImage.alt
        }
      : null,
    objective: caseStudy.objective ?? [],
    approach: caseStudy.approach ?? [],
    outcomes: caseStudy.outcomes ?? [],
    seo: caseStudy.seo ?? null
  };
};

export async function getInsightsIndexContent(): Promise<InsightsIndexContent> {
  if (!hasSanityCredentials()) {
    return FALLBACK_INDEX;
  }

  try {
    const client = getSanityClient();
    const data = await client.fetch<{
      siteSettings: SiteSettings | null;
      posts: SanityPost[];
      caseStudies: SanityCaseStudy[];
    }>(insightsQuery);

    const normalizedPosts = data.posts
      .map((post) => normalizePost(post))
      .filter((post): post is InsightsPostDetail => Boolean(post));

    const normalizedCaseStudies = data.caseStudies
      .map((caseStudy) => normalizeCaseStudy(caseStudy))
      .filter((study): study is InsightsCaseStudyDetail => Boolean(study));

    return {
      siteSettings: data.siteSettings ?? null,
      posts: normalizedPosts.map(({ body, authors, seo, ...summary }) => summary),
      caseStudies: normalizedCaseStudies.map(({ objective, approach, outcomes, seo, ...summary }) => summary),
      categories: Array.from(
        new Set(normalizedPosts.flatMap((post) => post.categories).filter(Boolean))
      ),
      featuredCaseStudy: normalizedCaseStudies[0] ?? null,
      totalPosts: normalizedPosts.length
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to fetch insights content from Sanity:", error);
    }
    return FALLBACK_INDEX;
  }
}

export async function getPostBySlug(slug: string): Promise<InsightsPostDetail | null> {
  if (!slug) {
    return null;
  }

  if (!hasSanityCredentials()) {
    return FALLBACK_POSTS.find((post) => post.slug === slug) ?? null;
  }

  try {
    const client = getSanityClient();
    const query = groq`*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      excerpt,
      body,
      publishedAt,
      estimatedRead,
      status,
      placeholder,
      "slug": slug.current,
      categories,
      "heroImage": {
        "url": heroImage.asset->url,
        alt: heroImage.alt
      },
      "authors": authors[]->{
        _id,
        name,
        role
      },
      seo
    }`;
    const result = await client.fetch<SanityPost | null>(query, { slug });
    if (!result) {
      return null;
    }
    const normalized = normalizePost(result);
    if (!normalized) {
      return null;
    }
    return normalized;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Failed to fetch post ${slug}:`, error);
    }
    return FALLBACK_POSTS.find((post) => post.slug === slug) ?? null;
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<InsightsCaseStudyDetail | null> {
  if (!slug) {
    return null;
  }

  if (!hasSanityCredentials()) {
    return FALLBACK_CASE_STUDIES.find((study) => study.slug === slug) ?? null;
  }

  try {
    const client = getSanityClient();
    const query = groq`*[_type == "caseStudy" && slug.current == $slug][0]{
      _id,
      title,
      summary,
      status,
      placeholder,
      "slug": slug.current,
      objective,
      approach,
      outcomes,
      metrics,
      "spotlightTestimonial": spotlightTestimonial{
        quote,
        person,
        role,
        permissionReceived
      },
      "heroImage": {
        "url": heroImage.asset->url,
        alt: heroImage.alt
      },
      "publishedAt": coalesce(date, _createdAt),
      seo
    }`;
    const result = await client.fetch<SanityCaseStudy | null>(query, { slug });
    if (!result) {
      return null;
    }
    const normalized = normalizeCaseStudy(result);
    if (!normalized) {
      return null;
    }
    return normalized;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Failed to fetch case study ${slug}:`, error);
    }
    return FALLBACK_CASE_STUDIES.find((study) => study.slug === slug) ?? null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  if (!hasSanityCredentials()) {
    return FALLBACK_POSTS.map((post) => post.slug);
  }

  try {
    const client = getSanityClient();
    const query = groq`*[_type == "post" && defined(slug.current) && status != "draft"]{ "slug": slug.current }`;
    const slugs = await client.fetch<Array<{ slug: string }>>(query);
    return slugs.map((item) => item.slug);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to fetch post slugs:", error);
    }
    return FALLBACK_POSTS.map((post) => post.slug);
  }
}

export async function getCaseStudySlugs(): Promise<string[]> {
  if (!hasSanityCredentials()) {
    return FALLBACK_CASE_STUDIES.map((study) => study.slug);
  }

  try {
    const client = getSanityClient();
    const query = groq`*[_type == "caseStudy" && defined(slug.current) && status != "draft"]{ "slug": slug.current }`;
    const slugs = await client.fetch<Array<{ slug: string }>>(query);
    return slugs.map((item) => item.slug);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to fetch case study slugs:", error);
    }
    return FALLBACK_CASE_STUDIES.map((study) => study.slug);
  }
}

export const __fallback = {
  posts: FALLBACK_POSTS,
  caseStudies: FALLBACK_CASE_STUDIES
};
