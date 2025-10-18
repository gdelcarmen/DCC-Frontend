'use client';

import {
  Box,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  type ResponsiveValue
} from "@chakra-ui/react";
import { useId } from "react";

export type StatStripItem = {
  label: string;
  value: string;
  description?: string;
};

export type StatStripProps = {
  items: StatStripItem[];
  srLabel?: string;
  columns?: ResponsiveValue<number>;
};

export function StatStrip({
  items,
  srLabel,
  columns = { base: 1, sm: 2, md: 3 }
}: StatStripProps): JSX.Element {
  const generatedId = useId();
  const labelId = `${generatedId}-statstrip`;
  const hasSrLabel = Boolean(srLabel);

  return (
    <Box
      as="section"
      role="group"
      aria-label={hasSrLabel ? srLabel : undefined}
      aria-labelledby={hasSrLabel ? undefined : labelId}
      bg="bg.canvas"
      borderRadius="2xl"
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 10 }}
    >
      {!hasSrLabel ? (
        <VisuallyHidden id={labelId}>Impact statistics</VisuallyHidden>
      ) : null}
      <SimpleGrid columns={columns} spacing={{ base: 6, md: 10 }} as="dl" role="presentation">
        {items.map((item) => (
          <Stack key={item.label} spacing={2}>
            <Text as="dt" fontSize="sm" textTransform="uppercase" color="text.muted">
              {item.label}
            </Text>
            <Text
              as="dd"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="extrabold"
              aria-label={item.label}
            >
              {item.value}
            </Text>
            {item.description ? (
              <Text fontSize="sm" color="text.muted">
                {item.description}
              </Text>
            ) : null}
          </Stack>
        ))}
      </SimpleGrid>
    </Box>
  );
}
