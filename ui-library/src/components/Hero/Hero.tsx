'use client';

import { Box, Button, Heading, Stack, Text, usePrefersReducedMotion } from "@chakra-ui/react";
import { useId } from "react";

export type HeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  prefersReducedMotion?: boolean;
};

export function Hero({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  secondaryCtaHref,
  secondaryCtaLabel,
  prefersReducedMotion
}: HeroProps): JSX.Element {
  const id = useId();
  const systemPrefersReducedMotion = usePrefersReducedMotion();
  const shouldReduceMotion = prefersReducedMotion ?? systemPrefersReducedMotion;
  const transitionStyles = shouldReduceMotion
    ? { transition: "none" }
    : { transition: "opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)" };

  return (
    <Box
      as="section"
      bg="bg.surface"
      borderRadius="3xl"
      px={{ base: 6, md: 10 }}
      py={{ base: 12, md: 16 }}
      data-reduced-motion={shouldReduceMotion ? "true" : undefined}
      aria-labelledby={`${id}-heading`}
      style={transitionStyles}
    >
      <Stack spacing={6} maxW="3xl">
        {eyebrow ? (
          <Text
            fontSize="sm"
            textTransform="uppercase"
            letterSpacing="widest"
            color="accent.teal"
            fontWeight="semibold"
            id={`${id}-eyebrow`}
          >
            {eyebrow}
          </Text>
        ) : null}
        <Heading id={`${id}-heading`} size="2xl" lineHeight="1.1">
          {title}
        </Heading>
        {description ? (
          <Text fontSize={{ base: "lg", md: "xl" }} color="text.muted">
            {description}
          </Text>
        ) : null}
        <Stack
          direction={{ base: "column", sm: "row" }}
          spacing={4}
          align={{ base: "stretch", sm: "center" }}
        >
          <Button
            as="a"
            href={ctaHref}
            size="lg"
            variant="solid"
            data-testid="hero-primary-cta"
          >
            {ctaLabel}
          </Button>
          {secondaryCtaLabel && secondaryCtaHref ? (
            <Button
              as="a"
              href={secondaryCtaHref}
              size="lg"
              variant="outline"
              data-testid="hero-secondary-cta"
            >
              {secondaryCtaLabel}
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}
