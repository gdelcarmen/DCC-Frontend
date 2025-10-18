'use client';

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack
} from "@chakra-ui/react";

import type { ContactFormStepRenderProps } from "../types";

export function AgencyDetailsStep({
  value,
  errors,
  onUpdate
}: ContactFormStepRenderProps): JSX.Element {
  return (
    <Stack spacing={6}>
      <Heading as="h2" size="lg">
        Agency Details
      </Heading>
      <Stack spacing={4}>
        <FormControl isRequired isInvalid={Boolean(errors.agencyName)}>
          <FormLabel htmlFor="contact-agency-name">Agency name</FormLabel>
          <Input
            id="contact-agency-name"
            value={value.agencyName}
            onChange={(event) => onUpdate("agencyName", event.currentTarget.value)}
            autoComplete="organization"
          />
          <FormErrorMessage>{errors.agencyName}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={Boolean(errors.contactName)}>
          <FormLabel htmlFor="contact-name">Contact name</FormLabel>
          <Input
            id="contact-name"
            value={value.contactName}
            onChange={(event) => onUpdate("contactName", event.currentTarget.value)}
            autoComplete="name"
          />
          <FormErrorMessage>{errors.contactName}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={Boolean(errors.contactEmail)}>
          <FormLabel htmlFor="contact-email">Contact email</FormLabel>
          <Input
            id="contact-email"
            type="email"
            value={value.contactEmail}
            onChange={(event) => onUpdate("contactEmail", event.currentTarget.value)}
            autoComplete="email"
          />
          <FormErrorMessage>{errors.contactEmail}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={Boolean(errors.role)}>
          <FormLabel htmlFor="contact-role">Role</FormLabel>
          <Input
            id="contact-role"
            value={value.role}
            onChange={(event) => onUpdate("role", event.currentTarget.value)}
            autoComplete="organization-title"
          />
          <FormErrorMessage>{errors.role}</FormErrorMessage>
        </FormControl>
      </Stack>
    </Stack>
  );
}
