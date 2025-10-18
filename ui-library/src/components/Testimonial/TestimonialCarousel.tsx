'use client';

import {
  Box,
  Heading,
  HStack,
  Stack,
  Text,
  VisuallyHidden,
  Button,
  useColorModeValue
} from "@chakra-ui/react";
import { useCallback, useMemo, useState, type KeyboardEvent } from "react";

export type CarouselTestimonial = {
  id: string;
  quote: string;
  person: string;
  role?: string;
  canDisplay?: boolean;
};

export type TestimonialCarouselProps = {
  testimonials: CarouselTestimonial[];
  title?: string;
};

export function TestimonialCarousel({
  testimonials,
  title = "Testimonials"
}: TestimonialCarouselProps): JSX.Element | null {
  const visibleTestimonials = useMemo(
    () => testimonials.filter((testimonial) => testimonial.canDisplay !== false),
    [testimonials]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const boundedIndex = Math.min(activeIndex, visibleTestimonials.length - 1);
  const testimonial = visibleTestimonials[boundedIndex];

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!visibleTestimonials.length) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % visibleTestimonials.length);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((prev) =>
          prev - 1 < 0 ? visibleTestimonials.length - 1 : prev - 1
        );
      } else if (event.key === "Home") {
        event.preventDefault();
        setActiveIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setActiveIndex(visibleTestimonials.length - 1);
      }
    },
    [visibleTestimonials.length]
  );

  if (!visibleTestimonials.length || !testimonial) {
    return null;
  }

  const dotBg = useColorModeValue("neutral.200", "neutral.600");
  const activeDotBg = useColorModeValue("accent.teal", "accent.gold");

  return (
    <Box
      as="section"
      aria-label="Testimonial carousel"
      role="region"
      data-active-index={boundedIndex}
      bg="bg.surface"
      borderRadius="2xl"
      px={{ base: 6, md: 12 }}
      py={{ base: 8, md: 12 }}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <Stack spacing={6}>
        <Heading as="h2" size="lg">
          {title}
        </Heading>
        <Stack spacing={4}>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold">
            “{testimonial.quote}”
          </Text>
          <Box>
            <Text fontWeight="bold">{testimonial.person}</Text>
            {testimonial.role ? (
              <Text color="text.muted" fontSize="sm">
                {testimonial.role}
              </Text>
            ) : null}
          </Box>
        </Stack>
        <HStack spacing={3}>
          <VisuallyHidden>Carousel controls</VisuallyHidden>
          {visibleTestimonials.map((item, index) => (
            <Button
              key={item.id}
              size="sm"
              variant="ghost"
              aria-label={`View testimonial from ${item.person}`}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveIndex(index);
                }
              }}
              _focusVisible={{ boxShadow: "outline" }}
              borderRadius="full"
              width={3}
              height={3}
              minWidth={3}
              padding={0}
              backgroundColor={index === boundedIndex ? activeDotBg : dotBg}
            />
          ))}
        </HStack>
      </Stack>
    </Box>
  );
}
