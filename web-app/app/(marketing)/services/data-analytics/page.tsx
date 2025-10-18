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
import { ComplianceHighlights } from "@dcc/ui-library/components/ComplianceHighlights";
import { getDataAnalyticsContent } from "../../../../lib/queries/compliance";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Data Analytics | Del Carmen Consulting",
    description:
      "Build actionable policing analytics with equity dashboards, compliance automation, and command-ready reporting."
  };
}

export default async function DataAnalyticsPage(): Promise<JSX.Element> {
  const content = await getDataAnalyticsContent();

  return (
    <Box as="main" bg="bg.canvas">
      <Container maxW="6xl" py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }}>
        <Stack spacing={{ base: 12, md: 16 }}>
          <Stack spacing={4}>
            <Heading as="h1" size="2xl">
              {content.hero.title}
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="text.muted">
              {content.hero.description}
            </Text>
            <ChakraLink
              href={content.hero.ctaHref}
              fontWeight="semibold"
              color="accent.teal"
            >
              {content.hero.ctaLabel}
            </ChakraLink>
          </Stack>

          <Stack spacing={6}>
            <Heading as="h2" size="lg">
              Impact metrics
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {content.metrics.map((metric) => (
                <Box key={metric.label} borderRadius="xl" borderWidth="1px" p={6} bg="bg.surface">
                  <Stack spacing={2}>
                    <Text fontSize="sm" textTransform="uppercase" color="text.muted">
                      {metric.label}
                    </Text>
                    <Text fontSize="3xl" fontWeight="extrabold">
                      {metric.value}
                    </Text>
                    {metric.description ? (
                      <Text fontSize="sm" color="text.muted">
                        {metric.description}
                      </Text>
                    ) : null}
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>

          <Stack spacing={4}>
            <Heading as="h2" size="lg">
              Methodology
            </Heading>
            <Stack spacing={4}>
              {content.methodology.map((step) => (
                <Box key={step.title} borderWidth="1px" borderRadius="xl" p={6} bg="bg.surface">
                  <Heading as="h3" size="md">
                    {step.title}
                  </Heading>
                  <Text color="text.muted" mt={2}>
                    {step.description}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Stack>

          <ComplianceHighlights
            heading={content.complianceCta.heading}
            supportingText={content.complianceCta.description}
            items={[
              {
                title: "Connect analytics with map insights",
                description:
                  "Overlay compliance metrics with geographic storytelling to keep stakeholders aligned."
              },
              {
                title: "Streamline reporting cadence",
                description:
                  "Automate delivery of bias-free policing metrics with the same data pipelines powering dashboards."
              }
            ]}
          />

          <ChakraLink
            href={content.complianceCta.href}
            fontWeight="semibold"
            color="accent.teal"
            alignSelf="flex-start"
          >
            {content.complianceCta.label}
          </ChakraLink>
        </Stack>
      </Container>
    </Box>
  );
}
