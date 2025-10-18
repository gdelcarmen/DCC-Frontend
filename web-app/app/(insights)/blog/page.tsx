'use server';

import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from "next";

import { PostList } from "@dcc/ui-library/components/PostList";

import {
  getInsightsIndexContent,
  __fallback as insightsFallback
} from "@dcc/web-app/lib/queries/insights";
import { buildBlogIndexJsonLd, buildBlogIndexMetadata } from "@dcc/web-app/lib/seo/insights";

export const revalidate = 300;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://delcarmenconsulting.com";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getInsightsIndexContent();
  return buildBlogIndexMetadata(content, {
    fallbackTitle: "Insights & Research | Del Carmen Consulting",
    fallbackDescription:
      "Insights, playbooks, and case studies from Del Carmen Consulting on sustaining police reform."
  });
}

const sanitizeJson = (value: unknown): string =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");

export default async function BlogIndexPage(): Promise<JSX.Element> {
  const content = await getInsightsIndexContent();
  const jsonLd = buildBlogIndexJsonLd(content, insightsFallback.posts);

  return (
    <Box as="main" bg="bg.canvas">
      <Container maxW="6xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 8 }}>
        <Stack spacing={{ base: 10, md: 14 }}>
          <Stack spacing={3}>
            <Heading as="h1" size="2xl">
              Insights & Research
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="text.muted">
              How Del Carmen Consulting partners with agencies to deliver sustained accountability, equity,
              and data-driven reforms.
            </Text>
          </Stack>

          <PostList
            posts={content.posts}
            buildStructuredData={(post) => {
              const article = jsonLd.articles.find((item) => item.slug === post.slug);
              return (
                article?.data ?? {
                  "@type": "BlogPosting",
                  headline: post.title,
                  datePublished: post.publishedAt,
                  description: post.excerpt,
                  url: `${siteUrl.replace(/\/$/, "")}/blog/${post.slug}`
                }
              );
            }}
          />

          <Box
            as="script"
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: sanitizeJson(jsonLd.graph) }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
