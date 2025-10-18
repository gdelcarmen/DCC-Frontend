'use server';

import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortableTextRenderer } from "@dcc/web-app/lib/portableText";
import {
  getPostBySlug,
  getPostSlugs,
  __fallback as insightsFallback
} from "@dcc/web-app/lib/queries/insights";
import { buildBlogPostJsonLd, buildBlogPostMetadata } from "@dcc/web-app/lib/seo/insights";
import { PostLayout } from "../_components/PostLayout";

export const revalidate = 300;

const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://delcarmenconsulting.com";

type Params = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Insights & Research | Del Carmen Consulting"
    };
  }
  return buildBlogPostMetadata(post);
}

const sanitizeJson = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

export default async function BlogPostPage({ params }: Params): Promise<JSX.Element> {
  const post =
    (await getPostBySlug(params.slug)) ??
    insightsFallback.posts.find((fallbackPost) => fallbackPost.slug === params.slug) ??
    null;

  if (!post) {
    notFound();
  }

  const jsonLd = buildBlogPostJsonLd(post, getSiteUrl());

  return (
    <PostLayout
      title={post.title}
      summary={post.excerpt}
      publishedAt={post.publishedAt}
      estimatedRead={post.estimatedRead}
      authors={post.authors}
      categories={post.categories}
      heroImage={post.heroImage}
      shareUrl={`${getSiteUrl()}/blog/${post.slug}`}
    >
      <Stack spacing={6}>
        {post.body?.length ? (
          <PortableTextRenderer value={post.body} />
        ) : (
          <Text color="text.muted">
            Detailed narrative coming soon. Subscribe for updates on reform playbooks and agency success
            stories.
          </Text>
        )}

        <Divider />

        <Box
          as="script"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: sanitizeJson(jsonLd) }}
        />
      </Stack>
    </PostLayout>
  );
}
