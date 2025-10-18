import {
  Box,
  Container,
  Heading,
  List,
  ListItem,
  Stack,
  Text,
  Link as ChakraLink
} from "@chakra-ui/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarketingContent } from "../../../../lib/queries/marketing";
import { buildServiceJsonLd, buildServiceMetadata } from "../../../../lib/seo/marketing";

type ServiceParams = {
  params: {
    slug: string;
  };
};

export const revalidate = 120;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { services } = await getMarketingContent();
  return services.filter((service) => service.slug).map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServiceParams): Promise<Metadata> {
  const content = await getMarketingContent();
  const service = content.services.find((item) => item.slug === params.slug);

  if (!service) {
    return {
      title: "Service not found"
    };
  }

  return buildServiceMetadata(service, content);
}

export default async function ServiceDetailPage({ params }: ServiceParams): Promise<JSX.Element> {
  const content = await getMarketingContent();
  const { services, caseStudies } = content;
  const service = services.find((item) => item.slug === params.slug);

  if (!service) {
    notFound();
  }

  const currentService = service;
  const relatedStudies = caseStudies.filter((study) => study.status === "published").slice(0, 2);
  const serviceJsonLd = JSON.stringify(buildServiceJsonLd(currentService)).replace(
    /</g,
    "\\u003c"
  );

  return (
    <Box as="main" bg="bg.canvas">
      <Container maxW="5xl" py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }}>
        <Stack spacing={{ base: 10, md: 14 }}>
          <Stack spacing={4}>
            <Heading as="h1" size="2xl">
              {currentService.title}
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="text.muted">
              {currentService.excerpt}
            </Text>
            <ChakraLink href="/contact" fontWeight="semibold" color="accent.teal">
              Talk with our team
            </ChakraLink>
          </Stack>
          <Stack spacing={6}>
            <Heading as="h2" size="lg">
              What this service delivers
            </Heading>
            <List spacing={3} styleType="disc" pl={5}>
              <ListItem>Comprehensive assessments aligned with consent decree obligations.</ListItem>
              <ListItem>Actionable data dashboards tracking progress against equity benchmarks.</ListItem>
              <ListItem>Workshops and coaching that embed practices across leadership levels.</ListItem>
            </List>
          </Stack>
          <Stack spacing={4}>
            <Heading as="h2" size="lg">
              Related case studies
            </Heading>
            {relatedStudies.length ? (
              <Stack spacing={4}>
                {relatedStudies.map((study) => (
                  <Box key={study.id} borderWidth="1px" borderRadius="xl" p={6}>
                    <Heading as="h3" size="md">
                      {study.title}
                    </Heading>
                    <Text color="text.muted" mt={2}>
                      {study.summary}
                    </Text>
                    <ChakraLink
                      href={study.href}
                      mt={4}
                      display="inline-flex"
                      fontWeight="semibold"
                      color="accent.teal"
                    >
                      Read case study
                    </ChakraLink>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Text color="text.muted">Case studies are coming soon.</Text>
            )}
          </Stack>
          <Box
            as="script"
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: serviceJsonLd
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
