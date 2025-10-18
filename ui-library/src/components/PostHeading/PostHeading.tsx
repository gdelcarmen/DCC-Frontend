'use client';

import {
  Badge,
  Heading,
  HStack,
  Stack,
  Text,
  Wrap,
  WrapItem,
  useColorModeValue
} from "@chakra-ui/react";
import { format } from "date-fns";

export type PostHeadingAuthor = {
  id: string;
  name: string;
  role?: string;
  url?: string;
};

export type PostHeadingProps = {
  title: string;
  summary?: string;
  publishedAt: string;
  estimatedRead?: string;
  categories?: string[];
  eyebrow?: string;
  authors: PostHeadingAuthor[];
};

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return format(date, "MMMM d, yyyy");
};

export function PostHeading({
  title,
  summary,
  publishedAt,
  estimatedRead,
  categories = [],
  eyebrow,
  authors
}: PostHeadingProps): JSX.Element {
  const mutedColor = useColorModeValue("text.muted", "neutral.300");

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        {eyebrow ? (
          <Text
            textTransform="uppercase"
            letterSpacing="wide"
            fontSize="sm"
            color="accent.teal"
            fontWeight="semibold"
          >
            {eyebrow}
          </Text>
        ) : null}
        <Heading as="h1" size="2xl">
          {title}
        </Heading>
        {summary ? (
          <Text fontSize={{ base: "lg", md: "xl" }} color={mutedColor}>
            {summary}
          </Text>
        ) : null}
      </Stack>

      <HStack spacing={4} color={mutedColor} fontSize="sm" alignItems="center">
        <Text as="time" dateTime={publishedAt}>
          {formatDate(publishedAt)}
        </Text>
        {estimatedRead ? <Text>&bull; {estimatedRead}</Text> : null}
      </HStack>

      <Stack spacing={2}>
        <Text fontWeight="semibold">By</Text>
        <Stack spacing={1}>
          {authors.map((author) => (
            <Text key={author.id}>
              {author.name}
              {author.role ? (
                <Text as="span" color={mutedColor}>
                  {" "}
                  · {author.role}
                </Text>
              ) : null}
            </Text>
          ))}
        </Stack>
      </Stack>

      {categories.length ? (
        <Wrap spacing={2}>
          {categories.map((category) => (
            <WrapItem key={category}>
              <Badge colorScheme="teal" variant="subtle">
                {category}
              </Badge>
            </WrapItem>
          ))}
        </Wrap>
      ) : null}
    </Stack>
  );
}
