'use client';

import {
  Box,
  Button,
  Heading,
  List,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden
} from "@chakra-ui/react";
import { useId, useMemo, useRef } from "react";

export interface InteractiveMapAgency {
  id: string;
  name: string;
  jurisdiction: string;
  coordinates: { lat: number; lng: number };
  engagementTypes: string[];
  permissionReceived?: boolean;
}

export interface InteractiveMapProps {
  heading: string;
  agencies: InteractiveMapAgency[];
  forceListFallback?: boolean;
  prefersReducedMotion?: boolean;
  supportsClustering?: boolean;
  emptyMessage?: string;
}

const defaultEmptyMessage =
  "Agencies are being onboarded to the interactive map. Check back soon for live engagements.";

export function InteractiveMap({
  heading,
  agencies,
  forceListFallback = false,
  prefersReducedMotion = false,
  supportsClustering = true,
  emptyMessage = defaultEmptyMessage
}: InteractiveMapProps): JSX.Element {
  const regionId = useId();
  const headingId = `${regionId}-heading`;
  const listboxId = `${regionId}-listbox`;
  const reducedMotionAttr = prefersReducedMotion ? "true" : undefined;
  const showFallback = forceListFallback || !supportsClustering;
  const fallbackMessage = !supportsClustering
    ? "Showing simplified list while clustering is unavailable."
    : undefined;

  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const summaryBg = useColorModeValue("bg.surface", "neutral.700");

  const permissionedAgencies = useMemo(
    () => agencies.filter((agency) => agency.permissionReceived !== false),
    [agencies]
  );

  const statusLabel = `${permissionedAgencies.length} ${
    permissionedAgencies.length === 1 ? "agency" : "agencies"
  } displayed`;

  const focusOption = (index: number) => {
    const node = optionRefs.current[index];
    if (node) {
      node.focus();
    }
  };

  const handleOptionKeyDown =
    (index: number, total: number) => (event: React.KeyboardEvent<HTMLLIElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = (index + 1) % total;
        focusOption(nextIndex);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex = index - 1 < 0 ? total - 1 : index - 1;
        focusOption(prevIndex);
      }
    };

  return (
    <Box
      role="region"
      aria-labelledby={headingId}
      bg="bg.surface"
      borderRadius="2xl"
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 8 }}
      data-reduced-motion={reducedMotionAttr}
    >
      <Stack spacing={4}>
        <Heading as="h2" id={headingId} size="lg">
          {heading}
        </Heading>
        <Box
          role="status"
          aria-live="polite"
          bg={summaryBg}
          borderRadius="xl"
          px={4}
          py={2}
        >
          {statusLabel}
        </Box>
        {fallbackMessage ? <Text color="text.muted">{fallbackMessage}</Text> : null}
        {showFallback ? (
          <Stack spacing={3}>
            {!permissionedAgencies.length ? (
              <Text color="text.muted">{emptyMessage}</Text>
            ) : null}
            <List
              role="listbox"
              id={listboxId}
              aria-label={heading}
              borderWidth="1px"
              borderRadius="xl"
              borderColor="border.subtle"
              maxH="320px"
              overflowY="auto"
            >
              {permissionedAgencies.map((agency, index) => (
                <ListItem
                  key={agency.id}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  tabIndex={index === 0 ? 0 : -1}
                  onKeyDown={handleOptionKeyDown(index, permissionedAgencies.length)}
                  px={4}
                  py={3}
                  _focusVisible={{ boxShadow: "outline" }}
                >
                  <Text fontWeight="semibold">{agency.name}</Text>
                  <Text color="text.muted" fontSize="sm">
                    {agency.jurisdiction}
                  </Text>
                </ListItem>
              ))}
              {!permissionedAgencies.length ? (
                <VisuallyHidden aria-live="polite">No agencies available</VisuallyHidden>
              ) : null}
            </List>
          </Stack>
        ) : (
          <Stack spacing={4}>
            <Box
              borderRadius="xl"
              borderWidth="1px"
              borderColor="border.subtle"
              px={4}
              py={10}
              textAlign="center"
            >
              <Text fontWeight="semibold">Interactive map placeholder</Text>
              <Text color="text.muted" fontSize="sm">
                Map rendering will be enabled once map tiles and clustering are configured.
              </Text>
            </Box>
            <Button variant="outline" alignSelf="flex-start">
              View agencies directory
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
