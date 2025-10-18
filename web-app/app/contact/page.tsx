import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from "next";

import { ContactFormClient } from "./ContactFormClient";

export const metadata: Metadata = {
  title: "Contact Del Carmen Consulting",
  description:
    "Start a conversation with Del Carmen Consulting about bias-free policing, analytics, and implementation partnerships."
};

export default function ContactPage(): JSX.Element {
  return (
    <Box as="main" bg="bg.canvas">
      <Container maxW="4xl" py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }}>
        <Stack spacing={{ base: 8, md: 12 }}>
          <Stack spacing={4} textAlign="left">
            <Heading as="h1" size="2xl">
              Let&apos;s build accountable public safety together
            </Heading>
            <Text color="text.muted" fontSize={{ base: "md", md: "lg" }}>
              Share a few details about your agency&apos;s needs. Our team will follow up within two
              business days with next steps and scheduling options.
            </Text>
          </Stack>
          <ContactFormClient />
        </Stack>
      </Container>
    </Box>
  );
}
