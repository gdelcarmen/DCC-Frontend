'use client';

import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Container,
  Icon,
  Image,
  Stack,
  useToast
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { FiCopy, FiLinkedin, FiShare2 } from "react-icons/fi";

import { PostHeading, type PostHeadingAuthor } from "@dcc/ui-library/components/PostHeading";

export type PostLayoutProps = {
  title: string;
  summary?: string;
  publishedAt: string;
  estimatedRead?: string;
  authors: PostHeadingAuthor[];
  categories?: string[];
  heroImage?: {
    src?: string | null;
    alt?: string;
  } | null;
  children: ReactNode;
  shareUrl?: string;
};

const defaultShareUrl =
  typeof window !== "undefined" ? window.location.href : "https://delcarmenconsulting.com/blog";

export function PostLayout({
  title,
  summary,
  publishedAt,
  estimatedRead,
  authors,
  categories,
  heroImage,
  children,
  shareUrl
}: PostLayoutProps): JSX.Element {
  const toast = useToast();
  const [resolvedShareUrl, setResolvedShareUrl] = useState(shareUrl ?? defaultShareUrl);

  useEffect(() => {
    if (!shareUrl && typeof window !== "undefined") {
      setResolvedShareUrl(window.location.href);
    }
  }, [shareUrl]);

  const shareTargets = useMemo(
    () => ({
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        resolvedShareUrl
      )}&title=${encodeURIComponent(title)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        resolvedShareUrl
      )}&text=${encodeURIComponent(title)}`
    }),
    [resolvedShareUrl, title]
  );

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(resolvedShareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = resolvedShareUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      toast({
        title: "Link copied",
        status: "success",
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: "Unable to copy link",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      console.error("Failed to copy link", error);
    }
  }, [resolvedShareUrl, toast]);

  const openShareWindow = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  }, []);

  return (
    <Box as="article" role="article" bg="bg.canvas">
      <Container maxW="4xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 8 }}>
        <Stack spacing={10}>
          <PostHeading
            title={title}
            summary={summary}
            publishedAt={publishedAt}
            estimatedRead={estimatedRead}
            authors={authors}
            categories={categories}
            eyebrow="Insights & Research"
          />

          {heroImage?.src ? (
            <AspectRatio ratio={16 / 9} borderRadius="2xl" overflow="hidden">
              <Image src={heroImage.src} alt={heroImage.alt ?? ""} objectFit="cover" />
            </AspectRatio>
          ) : null}

          <ButtonGroup spacing={3} variant="outline" colorScheme="teal" alignSelf="flex-start">
            <Button
              leftIcon={<Icon as={FiCopy} />}
              onClick={handleCopy}
              aria-label="Copy link"
            >
              Copy link
            </Button>
            <Button
              leftIcon={<Icon as={FiLinkedin} />}
              onClick={() => openShareWindow(shareTargets.linkedin)}
              aria-label="Share on LinkedIn"
            >
              Share on LinkedIn
            </Button>
            <Button
              leftIcon={<Icon as={FiShare2} />}
              onClick={() => openShareWindow(shareTargets.twitter)}
              aria-label="Share on X"
            >
              Share on X
            </Button>
          </ButtonGroup>

          <Stack spacing={6}>{children}</Stack>
        </Stack>
      </Container>
    </Box>
  );
}
