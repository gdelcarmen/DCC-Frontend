'use client';

import { Box, Heading, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";

export interface ComplianceHighlight {
  title: string;
  description: string;
  detail?: string;
}

export interface ComplianceHighlightsProps {
  heading?: string;
  items: ComplianceHighlight[];
  columns?: number | Partial<Record<"base" | "md" | "lg", number>>;
  supportingText?: string;
}

export function ComplianceHighlights({
  heading = "Compliance highlights",
  items,
  columns = { base: 1, md: 2 },
  supportingText
}: ComplianceHighlightsProps): JSX.Element {
  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <Heading as="h2" size="lg">
          {heading}
        </Heading>
        {supportingText ? <Text color="text.muted">{supportingText}</Text> : null}
      </Stack>
      <SimpleGrid columns={columns} spacing={{ base: 4, md: 6 }}>
        {items.map((item) => (
          <Box
            key={item.title}
            borderWidth="1px"
            borderRadius="xl"
            borderColor="border.subtle"
            bg="bg.surface"
            px={{ base: 4, md: 6 }}
            py={{ base: 5, md: 6 }}
          >
            <VStack align="flex-start" spacing={3}>
              <Heading as="h3" size="md">
                {item.title}
              </Heading>
              <Text color="text.muted">{item.description}</Text>
              {item.detail ? (
                <Text fontSize="sm" color="text.muted">
                  {item.detail}
                </Text>
              ) : null}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
