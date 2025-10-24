import { createClient, type ClientConfig, type SanityClient } from "@sanity/client";
import groq from "groq";

type RequiredEnv = "NEXT_PUBLIC_SANITY_PROJECT_ID" | "NEXT_PUBLIC_SANITY_DATASET";

const getEnv = (key: RequiredEnv): string => {
  const value = process.env[key];
  if (value) {
    return value;
  }

  if (process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID) {
    return `test-${key.toLowerCase()}`;
  }

  const placeholder = `placeholder-${key.toLowerCase()}`;
  const message = `[sanity] Missing ${key}. Using placeholder credentials; Sanity data will fall back to seeded defaults.`;

  if (process.env.NODE_ENV === "production") {
    console.error(message);
    return placeholder;
  }

  console.warn(message);
  return placeholder;
};

const apiVersion = "2024-05-01";

const baseConfig: ClientConfig = {
  apiVersion,
  projectId: getEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset: getEnv("NEXT_PUBLIC_SANITY_DATASET"),
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published"
};

const withToken = (): ClientConfig => {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SANITY_API_TOKEN environment variable for authenticated Sanity requests."
    );
  }
  return { ...baseConfig, token, useCdn: false };
};

declare global {
  // eslint-disable-next-line no-var
  var __sanityClient: SanityClient | undefined;
  // eslint-disable-next-line no-var
  var __sanityPreviewClient: SanityClient | undefined;
}

const createCachedClient = (
  config: ClientConfig,
  cacheKey: "__sanityClient" | "__sanityPreviewClient"
): SanityClient => {
  if (process.env.NODE_ENV !== "development") {
    return createClient(config);
  }

  if (cacheKey === "__sanityClient") {
    if (!globalThis.__sanityClient) {
      globalThis.__sanityClient = createClient(config);
    }
    return globalThis.__sanityClient;
  }

  if (!globalThis.__sanityPreviewClient) {
    globalThis.__sanityPreviewClient = createClient(config);
  }
  return globalThis.__sanityPreviewClient;
};

export const sanityConfig: ClientConfig = baseConfig;

export const getSanityClient = (): SanityClient =>
  createCachedClient(baseConfig, "__sanityClient");

export const getSanityPreviewClient = (): SanityClient =>
  createCachedClient(withToken(), "__sanityPreviewClient");

export { groq };
