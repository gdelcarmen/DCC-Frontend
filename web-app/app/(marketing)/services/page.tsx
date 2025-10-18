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
import { ServiceCard } from "@dcc/ui-library/components";
import { getMarketingContent } from "../../../lib/queries/marketing";
import { buildServicesJsonLd, buildServicesMetadata } from "../../../lib/seo/marketing";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getMarketingContent();
  return buildServicesMetadata(content);
}

export default async function ServicesPage(): Promise<JSX.Element> {
  const content = await getMarketingContent();
  const { services, caseStudies } = content;
  const servicesJsonLd = JSON.stringify(buildServicesJsonLd(services)).replace(
    /</g,
    "\\u003c"
  );

  return (
    <Box as="main" bg="bg.canvas">
      <Container maxW="6xl" py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }}>
        <Stack spacing={{ base: 12, md: 16 }}>
          <Stack spacing={4}>
            <Heading as="h1" size="2xl">
              Services built for accountable agencies
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="text.muted">
              From compliance roadmaps to immersive training, Del Carmen Consulting equips
              public safety agencies with measurable strategies that build community trust.
            </Text>
          </Stack>
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
          <Stack spacing={4} bg="bg.surface" borderRadius="2xl" p={{ base: 6, md: 10 }}>
            <Heading as="h2" size="lg">
              Case studies
            </Heading>
            {caseStudies.length ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {caseStudies.map((study) => (
                  <Box key={study.id} borderWidth={1} borderRadius="xl" p={6}>
                    <Heading as="h3" size="md">
                      {study.title}
                    </Heading>
                    <Text color="text.muted" mt={2}>
                      {study.summary}
                    </Text>
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
          <Stack
            spacing={4}
            borderRadius="2xl"
            p={{ base: 6, md: 10 }}
            bg="accent.teal"
            color="white"
          >
            <Heading as="h2" size="lg">
              Ready to move forward?
            </Heading>
            <Text fontSize="lg">
              Connect with our team to schedule a consultation tailored to your agency’s needs.
            </Text>
            <ChakraLink
              href="/contact"
              fontWeight="bold"
              color="white"
              textDecoration="underline"
            >
              Contact us
            </ChakraLink>
          </Stack>
          <Box
            as="script"
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: servicesJsonLd
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
