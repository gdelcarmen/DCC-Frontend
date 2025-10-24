import { Box, Container, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { CaseCard } from "@dcc/ui-library/components/CaseCard";
import type { Metadata } from "next";

import {
  getInsightsIndexContent,
  __fallback as insightsFallback
} from "@dcc/web-app/lib/queries/insights";
import {
  buildCaseStudiesIndexJsonLd,
  buildCaseStudiesMetadata
} from "@dcc/web-app/lib/seo/insights";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getInsightsIndexContent();
  return buildCaseStudiesMetadata(content, {
    fallbackTitle: "Case Studies | Del Carmen Consulting",
    fallbackDescription:
      "Explore how Del Carmen Consulting partners with agencies to deliver measurable accountability outcomes."
  });
}

const sanitizeJson = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

export default async function CaseStudiesPage(): Promise<JSX.Element> {
  const content = await getInsightsIndexContent();
  const jsonLd = buildCaseStudiesIndexJsonLd(content, insightsFallback.caseStudies);

  return (
    <Box as="main" bg="bg.canvas">
      <Container maxW="6xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 8 }}>
        <Stack spacing={{ base: 10, md: 14 }}>
          <Stack spacing={3}>
            <Heading as="h1" size="2xl">
              Case studies
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="text.muted">
              Engagements that demonstrate how we deliver durable reforms, accountability,
              and community trust.
            </Text>
          </Stack>

          {content.caseStudies.length ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {content.caseStudies.map((study) => (
                <CaseCard
                  key={study.id}
                  title={study.title}
                  summary={study.summary}
                  status={study.status}
                  heroImage={study.heroImage}
                  href={`/case-studies/${study.slug}`}
                  metrics={study.metrics}
                  testimonial={study.testimonial ?? undefined}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Text color="text.muted">
              Case studies are coming soon. Subscribe for updates.
            </Text>
          )}

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
