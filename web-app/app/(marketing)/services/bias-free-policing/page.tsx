import {
  Box,
  Container,
  Heading,
  List,
  ListItem,
  Stack,
  Text
} from "@chakra-ui/react";
import type { Metadata } from "next";
import { InteractiveMap } from "@dcc/ui-library/components/InteractiveMap";
import { getBiasFreePolicingContent } from "../../../../lib/queries/compliance";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Bias-Free Policing | Del Carmen Consulting",
    description:
      "Bias-free policing programs, SB 1074 compliance, and equity-focused reporting delivered by Del Carmen Consulting."
  };
}

export default async function BiasFreePolicingPage(): Promise<JSX.Element> {
  const content = await getBiasFreePolicingContent();
  const permissionedAgencies = content.map.agencies.filter((agency) => agency.permissionReceived);

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
          </Stack>

          <InteractiveMap
            heading="Agency engagements"
            agencies={content.map.agencies}
            forceListFallback
            supportsClustering={false}
          />

          {!permissionedAgencies.length ? (
            <Text color="text.muted">
              While the map populates with new engagements, explore the highlights below for a look
              at our compliance roadmap.
            </Text>
          ) : null}

          <Stack spacing={6}>
            <Heading as="h2" size="lg">
              Compliance highlights
            </Heading>
            <List spacing={4}>
              {content.highlights.map((highlight) => (
                <ListItem key={highlight.title}>
                  <Heading as="h3" size="md">
                    {highlight.title}
                  </Heading>
                  <Text color="text.muted">{highlight.description}</Text>
                </ListItem>
              ))}
            </List>
          </Stack>

          <Stack spacing={6}>
            <Heading as="h2" size="lg">
              Frequently asked questions
            </Heading>
            <Stack spacing={4}>
              {content.faqs.map((faq) => (
                <Box key={faq.question} borderWidth="1px" borderRadius="xl" p={6} bg="bg.surface">
                  <Heading as="h3" size="md">
                    {faq.question}
                  </Heading>
                  <Text color="text.muted" mt={2}>
                    {faq.answer}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
