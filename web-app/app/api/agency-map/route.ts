import { NextResponse } from "next/server";
import { createMapStore, buildAgencyGeoJSON } from "../../../lib/map";
import { getBiasFreePolicingContent } from "../../../lib/queries/compliance";

type RequestFilters = {
  engagement: string[];
  jurisdiction: string[];
  includeUnpermissioned: boolean;
  search: string;
};

const parseFilters = (request: Request): RequestFilters => {
  const url = new URL(request.url);
  const engagement = url.searchParams.getAll("engagement").flatMap((value) => value.split(","));
  const jurisdiction = url
    .searchParams
    .getAll("jurisdiction")
    .flatMap((value) => value.split(","));
  const includeUnpermissioned =
    url.searchParams.get("includeUnpermissioned") === "true" ||
    url.searchParams.get("includeUnpermissioned") === "1";
  const search = url.searchParams.get("search") ?? "";

  return {
    engagement: engagement.filter(Boolean),
    jurisdiction: jurisdiction.filter(Boolean),
    includeUnpermissioned,
    search
  };
};

const RATE_LIMIT_WINDOW_MS = 1_000;
const MAX_REQUESTS_PER_WINDOW = 30;
const rateLimitCache =
  (globalThis as unknown as { __agencyMapRateLimit?: Map<string, { count: number; timestamp: number }> })
    .__agencyMapRateLimit || new Map<string, { count: number; timestamp: number }>();

if (!(globalThis as unknown as { __agencyMapRateLimit?: Map<string, { count: number; timestamp: number }> })
  .__agencyMapRateLimit) {
  (globalThis as unknown as { __agencyMapRateLimit?: Map<string, { count: number; timestamp: number }> })
    .__agencyMapRateLimit = rateLimitCache;
}

const checkRateLimit = (key: string): boolean => {
  const now = Date.now();
  const entry = rateLimitCache.get(key);

  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW_MS) {
    rateLimitCache.set(key, { count: 1, timestamp: now });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count += 1;
  return true;
};

export async function GET(request: Request): Promise<Response> {
  const clientIdentifier = request.headers.get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(clientIdentifier)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const filters = parseFilters(request);
  const content = await getBiasFreePolicingContent();
  const store = createMapStore(content.map.agencies);

  store.setEngagementFilters(filters.engagement);
  store.setJurisdictionFilters(filters.jurisdiction);
  store.setIncludeUnpermissioned(filters.includeUnpermissioned);
  store.setSearchTerm(filters.search);

  const agencies = store.getVisibleAgencies();
  const geojson = buildAgencyGeoJSON(content.map.agencies, {
    includeUnpermissioned: filters.includeUnpermissioned
  });

  const status = store.getStatus();

  return NextResponse.json({
    status,
    agencies,
    geojson
  });
}
