'use server';

import { Box, Container, Divider, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortableTextRenderer } from "@dcc/web-app/lib/portableText";
import {
  getCaseStudyBySlug,
  getCaseStudySlugs,
  __fallback as insightsFallback
} from "@dcc/web-app/lib/queries/insights";
import { buildCaseStudyJsonLd, buildCaseStudyMetadata } from "@dcc/web-app/lib/seo/insights";

export const revalidate = 300;

type Params = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const caseStudy = await getCaseStudyBySlug(params.slug);
  if (!caseStudy) {
    return {
      title: "Case Studies | Del Carmen Consulting"
    };
  }
  return buildCaseStudyMetadata(caseStudy);
}

const sanitizeJson = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

export default async function CaseStudyDetailPage({ params }: Params): Promise<JSX.Element> {
  const caseStudy =
    (await getCaseStudyBySlug(params.slug)) ??
    insightsFallback.caseStudies.find((fallback) => fallback.slug === params.slug) ??
    null;

  if (!caseStudy) {
    notFound();
  }

  const jsonLd = buildCaseStudyJsonLd(caseStudy);

  return (
    <Box as="main" bg="bg.canvas">
      <Container maxW="5xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 8 }}>
        <Stack spacing={{ base: 10, md: 14 }}>
          <Stack spacing={3}>
            <Text
              textTransform="uppercase"
              letterSpacing="wide"
              fontSize="sm"
              color="accent.teal"
              fontWeight="semibold"
            >
              Case study
            </Text>
            <Heading as="h1" size="2xl">
              {caseStudy.title}
            </Heading>
            <Text color="text.muted" fontSize={{ base: "lg", md: "xl" }}>
              {caseStudy.summary}
            </Text>
          </Stack>

          {caseStudy.status !== "published" ? (
            <Text color="text.muted" fontWeight="medium">
              Case study coming soon. Sign up for our newsletter to be the first to know when the full
              engagement story is available.
            </Text>
          ) : null}

          {caseStudy.metrics.length ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {caseStudy.metrics.map((metric) => (
                <Box
                  key={`${metric.label}-${metric.value}`}
                  bg="bg.surface"
                  borderRadius="xl"
                  p={6}
                  borderWidth="1px"
                  borderColor="neutral.200"
                >
                  <Text fontSize="3xl" fontWeight="bold" aria-label={metric.label}>
                    {metric.value}
                  </Text>
                  <Text color="text.muted">{metric.label}</Text>
                </Box>
              ))}
            </SimpleGrid>
          ) : null}

          {caseStudy.status === "published" ? (
            <Stack spacing={8}>
              <Stack spacing={4}>
                <Heading as="h2" size="lg">
                  Objectives
                </Heading>
                <PortableTextRenderer value={caseStudy.objective} />
              </Stack>

              <Stack spacing={4}>
                <Heading as="h2" size="lg">
                  Approach
                </Heading>
                <PortableTextRenderer value={caseStudy.approach} />
              </Stack>

              <Stack spacing={4}>
                <Heading as="h2" size="lg">
                  Outcomes
                </Heading>
                <PortableTextRenderer value={caseStudy.outcomes} />
              </Stack>
            </Stack>
          ) : null}

          {caseStudy.testimonial?.canDisplay ? (
            <Box borderLeftWidth="4px" borderLeftColor="accent.teal" pl={4} fontStyle="italic">
              <Text>"{caseStudy.testimonial.quote}"</Text>
              <Text fontWeight="semibold" mt={2}>
                {caseStudy.testimonial.person}
              </Text>
              {caseStudy.testimonial.role ? (
                <Text color="text.muted">{caseStudy.testimonial.role}</Text>
              ) : null}
            </Box>
          ) : null}

          <Divider />

          <Box
            as="script"
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: sanitizeJson(jsonLd) }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
