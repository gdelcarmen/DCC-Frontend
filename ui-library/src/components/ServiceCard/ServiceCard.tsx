'use client';

import {
  Box,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
  Icon,
  chakra
} from "@chakra-ui/react";
import { forwardRef } from "react";

type IconName = "shield" | "chart" | "compass" | "insight";

const iconPaths: Record<IconName, string> = {
  shield: "M12 1.5 3 4.5v6c0 5.25 4.5 9.75 9 12 4.5-2.25 9-6.75 9-12v-6l-9-3Z",
  chart: "M4 18h16M6 10v6m6-10v10m6-6v6M9 4h6l-3 4Z",
  compass: "M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm2.828 6.172-1.414 4.242-4.242 1.414 1.414-4.242 4.242-1.414Z",
  insight: "M5 13a7 7 0 0 1 14 0v2h1a1 1 0 1 1 0 2h-5.268A3 3 0 0 1 13 20.816V22a1 1 0 0 1-2 0v-1.184A3 3 0 0 1 9.268 17H4a1 1 0 0 1 0-2h1v-2Z"
};

export type ServiceCardProps = {
  title: string;
  excerpt: string;
  href: string;
  icon?: IconName;
  ctaLabel?: string;
};

export const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ title, excerpt, href, icon = "shield", ctaLabel = "Learn more" }, ref) => {
    const borderColor = useColorModeValue("neutral.200", "neutral.700");
    const hoverBorderColor = useColorModeValue("accent.gold", "accent.teal");

    return (
      <Box
        ref={ref}
        as="article"
        borderWidth="1px"
        borderRadius="xl"
        borderColor={borderColor}
        transition="border-color 0.2s ease, box-shadow 0.2s ease"
        _hover={{
          borderColor: hoverBorderColor,
          boxShadow: "lg"
        }}
        p={{ base: 6, md: 8 }}
        bg="bg.surface"
      >
        <Stack spacing={5}>
          <Box
            boxSize={12}
            bg="accent.teal"
            color="neutral.50"
            borderRadius="full"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={chakra.svg} viewBox="0 0 24 24" boxSize={6} fill="currentColor">
              <path d={iconPaths[icon] ?? iconPaths.shield} />
            </Icon>
          </Box>
          <Stack spacing={3}>
            <Heading as="h3" size="md">
              {title}
            </Heading>
            <Text color="text.muted" fontSize="md">
              {excerpt}
            </Text>
          </Stack>
          <Link
            href={href}
            color="accent.teal"
            fontWeight="semibold"
            display="inline-flex"
            alignItems="center"
            gap={2}
            role="link"
          >
            {ctaLabel}
          </Link>
        </Stack>
      </Box>
    );
  }
);

ServiceCard.displayName = "ServiceCard";
