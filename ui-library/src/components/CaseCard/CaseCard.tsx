'use client';

import {
  AspectRatio,
  Box,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden
} from "@chakra-ui/react";
import { forwardRef } from "react";

import type { CaseStatus } from "../../types/cms";

export type CaseCardMetric = {
  label: string;
  value: string;
};

export type CaseCardTestimonial = {
  quote: string;
  person: string;
  role?: string;
  canDisplay?: boolean;
};

export type CaseCardProps = {
  title: string;
  summary: string;
  status: CaseStatus;
  href?: string;
  ctaLabel?: string;
  heroImage?: {
    src?: string | null;
    alt?: string;
  } | null;
  metrics?: CaseCardMetric[];
  testimonial?: CaseCardTestimonial | null;
};

const PLACEHOLDER_MESSAGE = "Case study coming soon";

export const CaseCard = forwardRef<HTMLDivElement, CaseCardProps>(
  (
    {
      title,
      summary,
      status,
      href,
      ctaLabel = "Read case study",
      heroImage,
      metrics = [],
      testimonial = null
    },
    ref
  ) => {
    const borderColor = useColorModeValue("neutral.200", "neutral.700");
    const hoverBorderColor = useColorModeValue("accent.gold", "accent.teal");
    const isPublished = status === "published";
    const showTestimonial = Boolean(testimonial && testimonial.canDisplay !== false);

    return (
      <Box
        ref={ref}
        as="article"
        role="article"
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        bg="bg.surface"
        overflow="hidden"
        transition="border-color 0.2s ease, box-shadow 0.2s ease"
        _hover={{
          borderColor: hoverBorderColor,
          boxShadow: "lg"
        }}
      >
        {heroImage?.src ? (
          <AspectRatio ratio={16 / 9}>
            <Image
              src={heroImage.src}
              alt={heroImage.alt ?? ""}
              objectFit="cover"
              width="100%"
              height="100%"
            />
          </AspectRatio>
        ) : null}

        <Stack spacing={5} p={{ base: 6, md: 8 }}>
          <Stack spacing={3}>
            <Heading as="h3" size="md">
              {title}
            </Heading>
            <Text color="text.muted">{summary}</Text>
          </Stack>

          {metrics.length ? (
            <Stack spacing={3} role="list">
              <VisuallyHidden>Case study outcomes</VisuallyHidden>
              {metrics.map((metric) => (
                <Box key={`${metric.label}-${metric.value}`} role="listitem">
                  <Text fontSize="lg" fontWeight="semibold" aria-label={metric.label}>
                    {metric.value}
                  </Text>
                  <Text color="text.muted" fontSize="sm">
                    {metric.label}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : null}

          {showTestimonial ? (
            <Box borderLeftWidth="4px" borderLeftColor="accent.teal" pl={4} fontStyle="italic">
              <Text>"{testimonial?.quote}"</Text>
              <Text fontWeight="semibold" mt={2}>
                {testimonial?.person}
              </Text>
              {testimonial?.role ? (
                <Text color="text.muted" fontSize="sm">
                  {testimonial.role}
                </Text>
              ) : null}
            </Box>
          ) : testimonial ? (
            <Text color="text.muted" fontSize="sm">
              Testimonial awaiting permission.
            </Text>
          ) : null}

          {isPublished && href ? (
            <Link
              href={href}
              color="accent.teal"
              fontWeight="semibold"
              display="inline-flex"
              alignItems="center"
            >
              {ctaLabel}
            </Link>
          ) : (
            <Text color="text.muted" fontWeight="medium">
              {PLACEHOLDER_MESSAGE}
            </Text>
          )}
        </Stack>
      </Box>
    );
  }
);

CaseCard.displayName = "CaseCard";
