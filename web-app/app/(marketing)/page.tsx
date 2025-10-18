import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Link as ChakraLink
} from "@chakra-ui/react";
import type { Metadata } from "next";
import { Hero, StatStrip, ServiceCard, TestimonialCarousel } from "@dcc/ui-library/components";
import { getMarketingContent } from "../../lib/queries/marketing";
import { buildHomeJsonLd, buildHomeMetadata } from "../../lib/seo/marketing";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getMarketingContent();
  return buildHomeMetadata(content);
}

export default async function HomePage(): Promise<JSX.Element> {
  const content = await getMarketingContent();
  const { hero, stats, services, testimonials, caseStudies } = content;
  const homeJsonLd = JSON.stringify(buildHomeJsonLd(content)).replace(/</g, "\\u003c");

  return (
    <Box as="main" bg="bg.canvas">
      <Container maxW="6xl" py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }}>
        <Stack spacing={{ base: 12, md: 16 }}>
          <Hero {...hero} />
          <StatStrip items={stats} srLabel="Del Carmen Consulting impact statistics" />
          <Stack spacing={8}>
            <Heading as="h2" size="lg">
              Explore our services
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  excerpt={service.excerpt}
                  href={service.href}
                  icon={service.icon}
                  ctaLabel={service.ctaLabel}
                />
              ))}
            </SimpleGrid>
            <ChakraLink
              href="/services"
              fontWeight="semibold"
              color="accent.teal"
              alignSelf="flex-start"
            >
              View all services
            </ChakraLink>
          </Stack>
          <Stack spacing={6}>
            <Heading as="h2" size="lg">
              Case studies
            </Heading>
            {caseStudies.length ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {caseStudies.map((study) => (
                  <Box
                    key={study.id}
                    borderWidth="1px"
                    borderRadius="xl"
                    p={6}
                    bg="bg.surface"
                  >
                    <Heading as="h3" size="md" mb={2}>
                      {study.title}
                    </Heading>
                    <Text color="text.muted">{study.summary}</Text>
                    <ChakraLink
                      href={study.href}
                      mt={4}
                      display="inline-block"
                      color="accent.teal"
                      fontWeight="semibold"
                    >
                      Read case study
                    </ChakraLink>
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <Text color="text.muted">Case studies are coming soon.</Text>
            )}
          </Stack>
          <TestimonialCarousel testimonials={testimonials} />
          <Box
            as="script"
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: homeJsonLd
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
