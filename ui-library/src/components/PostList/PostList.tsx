'use client';

import {
  AspectRatio,
  Box,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { memo, useMemo } from "react";

export type PostStatus = "published" | "comingSoon" | "draft";

export type PostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  estimatedRead?: string;
  status: PostStatus;
  categories?: string[];
  heroImage?: {
    src?: string | null;
    alt?: string;
  } | null;
};

export type PostListProps = {
  posts: PostListItem[];
  emptyMessage?: string;
  basePath?: string;
  ctaLabel?: string;
  buildStructuredData?: (post: PostListItem) => Record<string, unknown>;
};

const DEFAULT_EMPTY_MESSAGE = "New insights are coming soon.";

const sanitizeJson = (value: unknown): string =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");

const PostListItemCard = memo(function PostListItemCard({
  post,
  href,
  ctaLabel
}: {
  post: PostListItem;
  href: string | null;
  ctaLabel: string;
}) {
  const borderColor = useColorModeValue("neutral.200", "neutral.700");
  const hoverBorderColor = useColorModeValue("accent.gold", "accent.teal");
  const isPublished = post.status === "published";

  return (
    <Box
      as="article"
      borderWidth="1px"
      borderRadius="xl"
      borderColor={borderColor}
      bg="bg.surface"
      overflow="hidden"
      transition="border-color 0.2s ease, box-shadow 0.2s ease"
      _hover={{
        borderColor: hoverBorderColor,
        boxShadow: "lg"
      }}
    >
      {post.heroImage?.src ? (
        <AspectRatio ratio={16 / 9}>
          <Image
            src={post.heroImage.src}
            alt={post.heroImage.alt ?? ""}
            objectFit="cover"
            width="100%"
            height="100%"
          />
        </AspectRatio>
      ) : null}
      <Stack spacing={4} p={{ base: 6, md: 8 }}>
        <Stack spacing={2}>
          <Heading as="h3" size="md">
            {post.title}
          </Heading>
          <Text color="text.muted">{post.excerpt}</Text>
        </Stack>
        <Text color="text.muted" fontSize="sm">
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric"
          })}
          {post.estimatedRead ? ` · ${post.estimatedRead}` : ""}
        </Text>
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
            Coming soon
          </Text>
        )}
      </Stack>
    </Box>
  );
});

PostListItemCard.displayName = "PostListItemCard";

export function PostList({
  posts,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  basePath = "/blog",
  ctaLabel = "Read article",
  buildStructuredData
}: PostListProps): JSX.Element {
  const visiblePosts = useMemo(
    () => posts.filter((post) => post.status !== "draft"),
    [posts]
  );

  const structuredData = useMemo(() => {
    if (!buildStructuredData) {
      return null;
    }
    return visiblePosts.map((post) => buildStructuredData(post));
  }, [buildStructuredData, visiblePosts]);

  if (!visiblePosts.length) {
    return <Text color="text.muted">{emptyMessage}</Text>;
  }

  return (
    <>
      <Stack spacing={6}>
        {visiblePosts.map((post) => {
          const href =
            post.status === "published" ? `${basePath}/${post.slug}` : null;
          return (
            <PostListItemCard
              key={post.id}
              post={post}
              href={href}
              ctaLabel={ctaLabel}
            />
          );
        })}
      </Stack>
      {structuredData ? (
        <Box
          as="script"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: sanitizeJson(structuredData) }}
        />
      ) : null}
    </>
  );
}
