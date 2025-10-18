'use client';

import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  Heading,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";

import type { ContactFormStepRenderProps } from "../types";

const FALLBACK_SERVICE_OPTIONS = [
  "Bias-Free Policing",
  "Data Analytics",
  "Implementation Assessment",
  "Innovation & Training",
  "Policy Assessment",
  "Community Engagement"
];

export function ServiceInterestStep({
  value,
  errors,
  onUpdate,
  serviceOptions = FALLBACK_SERVICE_OPTIONS
}: ContactFormStepRenderProps): JSX.Element {
  const toggleInterest = (option: string, checked: boolean) => {
    if (checked) {
      onUpdate("serviceInterest", Array.from(new Set([...value.serviceInterest, option])));
    } else {
      onUpdate(
        "serviceInterest",
        value.serviceInterest.filter((item) => item !== option)
      );
    }
  };

  return (
    <Stack spacing={6}>
      <Heading as="h2" size="lg">
        Service Interest
      </Heading>
      <Text color="text.muted">
        Select the engagements you&apos;re interested in discussing. We tailor our response based on
        the areas you choose.
      </Text>
      <FormControl isRequired isInvalid={Boolean(errors.serviceInterest)}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          {serviceOptions.map((option) => {
            const isChecked = value.serviceInterest.includes(option);
            return (
              <Checkbox
                key={option}
                isChecked={isChecked}
                onChange={(event) => toggleInterest(option, event.target.checked)}
              >
                {option}
              </Checkbox>
            );
          })}
        </SimpleGrid>
        <FormErrorMessage>{errors.serviceInterest}</FormErrorMessage>
      </FormControl>
    </Stack>
  );
}
