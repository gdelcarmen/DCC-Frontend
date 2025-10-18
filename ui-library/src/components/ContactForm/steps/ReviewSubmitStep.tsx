'use client';

import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Stack,
  Text,
  Textarea
} from "@chakra-ui/react";

import type { ContactFormStepRenderProps } from "../types";

export function ReviewSubmitStep({
  value,
  errors,
  onUpdate
}: ContactFormStepRenderProps): JSX.Element {
  const summaryItems = [
    { label: "Agency", value: value.agencyName || "—" },
    { label: "Primary contact", value: value.contactName || "—" },
    { label: "Email", value: value.contactEmail || "—" },
    { label: "Role", value: value.role || "—" },
    {
      label: "Engagement interests",
      value: value.serviceInterest.length ? value.serviceInterest.join(", ") : "—"
    }
  ];

  return (
    <Stack spacing={6}>
      <Heading as="h2" size="lg">
        Review &amp; Submit
      </Heading>
      <Text color="text.muted">
        Confirm your details and provide any context that will help our team prepare for a follow-up
        conversation.
      </Text>
      <Box borderWidth="1px" borderRadius="xl" px={4} py={4} bg="bg.surface">
        <Stack spacing={3}>
          {summaryItems.map((item) => (
            <Box key={item.label}>
              <Text fontSize="sm" color="text.muted">
                {item.label}
              </Text>
              <Text fontWeight="medium">{item.value}</Text>
            </Box>
          ))}
        </Stack>
      </Box>
      <Divider />
      <FormControl isInvalid={Boolean(errors.message)}>
        <FormLabel htmlFor="contact-message">How can we support your agency?</FormLabel>
        <Textarea
          id="contact-message"
          value={value.message}
          onChange={(event) => onUpdate("message", event.currentTarget.value)}
          minH="140px"
        />
        <FormErrorMessage>{errors.message}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={Boolean(errors.consent)}>
        <Checkbox
          isChecked={value.consent}
          onChange={(event) => onUpdate("consent", event.target.checked)}
        >
          I consent to Del Carmen Consulting storing this submission securely.
        </Checkbox>
        <FormErrorMessage>{errors.consent}</FormErrorMessage>
      </FormControl>
    </Stack>
  );
}
