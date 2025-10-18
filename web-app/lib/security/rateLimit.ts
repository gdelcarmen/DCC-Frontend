import { createHmac } from "crypto";

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  reset: number;
  retryAfter: number;
}

export interface RateLimitOptions {
  limit?: number;
  windowMs?: number;
}

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __dccRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const getStore = (): Map<string, RateLimitEntry> => {
  if (!globalThis.__dccRateLimitStore) {
    globalThis.__dccRateLimitStore = new Map();
  }
  return globalThis.__dccRateLimitStore;
};

const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const hashIdentifier = (identifier: string, secret: string): string => {
  return createHmac("sha256", secret).update(identifier).digest("hex");
};

export const rateLimit = (
  key: string,
  options: RateLimitOptions = {}
): RateLimitResult => {
  const limit = Math.max(options.limit ?? DEFAULT_LIMIT, 1);
  const windowMs = Math.max(options.windowMs ?? DEFAULT_WINDOW_MS, 1000);
  const store = getStore();
  const now = Date.now();
  const existing = store.get(key);

  if (existing && existing.expiresAt > now) {
    if (existing.count >= limit) {
      const retryAfterSeconds = Math.ceil((existing.expiresAt - now) / 1000);
      return {
        limited: true,
        remaining: 0,
        reset: existing.expiresAt,
        retryAfter: retryAfterSeconds
      };
    }

    existing.count += 1;
    store.set(key, existing);
    return {
      limited: false,
      remaining: limit - existing.count,
      reset: existing.expiresAt,
      retryAfter: 0
    };
  }

  const entry: RateLimitEntry = {
    count: 1,
    expiresAt: now + windowMs
  };
  store.set(key, entry);

  return {
    limited: false,
    remaining: limit - 1,
    reset: entry.expiresAt,
    retryAfter: 0
  };
};

export const clearRateLimit = () => {
  getStore().clear();
};
