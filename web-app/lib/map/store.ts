import type { MapAgency, MapStoreStatus } from "./types";

export interface MapStore {
  setEngagementFilters(filters: string[]): void;
  setJurisdictionFilters(filters: string[]): void;
  setIncludeUnpermissioned(include: boolean): void;
  setSearchTerm(term: string): void;
  getVisibleAgencies(): MapAgency[];
  getStatus(): MapStoreStatus;
  getFilters(): {
    engagement: string[];
    jurisdiction: string[];
    includeUnpermissioned: boolean;
    searchTerm: string;
  };
}

const normalizeText = (value: string): string => value.trim().toLowerCase();

const matchesJurisdiction = (jurisdiction: string, filters: Set<string>): boolean => {
  if (!filters.size) {
    return true;
  }

  const normalizedJurisdiction = normalizeText(jurisdiction);
  for (const filter of filters) {
    if (normalizedJurisdiction.includes(filter)) {
      return true;
    }
  }
  return false;
};

const matchesEngagementTypes = (engagementTypes: string[], filters: Set<string>): boolean => {
  if (!filters.size) {
    return true;
  }
  const normalizedTypes = engagementTypes.map(normalizeText);
  return Array.from(filters).every((filter) => normalizedTypes.includes(filter));
};

const matchesSearchTerm = (agency: MapAgency, term: string): boolean => {
  if (!term) {
    return true;
  }
  const haystack = `${agency.name} ${agency.jurisdiction}`.toLowerCase();
  return haystack.includes(term);
};

const filterAgencies = (
  agencies: MapAgency[],
  {
    engagementFilters,
    jurisdictionFilters,
    includeUnpermissioned,
    searchTerm
  }: {
    engagementFilters: Set<string>;
    jurisdictionFilters: Set<string>;
    includeUnpermissioned: boolean;
    searchTerm: string;
  }
): MapAgency[] => {
  return agencies.filter((agency) => {
    if (!includeUnpermissioned && !agency.permissionReceived) {
      return false;
    }

    if (!matchesJurisdiction(agency.jurisdiction, jurisdictionFilters)) {
      return false;
    }

    if (!matchesEngagementTypes(agency.engagementTypes, engagementFilters)) {
      return false;
    }

    if (!matchesSearchTerm(agency, searchTerm)) {
      return false;
    }

    return true;
  });
};

export const createMapStore = (agencies: MapAgency[]): MapStore => {
  const sanitizedAgencies = agencies.map((agency) => ({
    ...agency,
    engagementTypes: agency.engagementTypes ?? [],
    permissionReceived: Boolean(agency.permissionReceived)
  }));

  const engagementFilters = new Set<string>();
  const jurisdictionFilters = new Set<string>();
  let includeUnpermissioned = false;
  let searchTerm = "";
  let cachedVisible: MapAgency[] | null = null;

  const invalidate = () => {
    cachedVisible = null;
  };

  const getVisibleAgenciesInternal = (): MapAgency[] => {
    if (!cachedVisible) {
      cachedVisible = filterAgencies(sanitizedAgencies, {
        engagementFilters,
        jurisdictionFilters,
        includeUnpermissioned,
        searchTerm
      });
    }
    return cachedVisible;
  };

  return {
    setEngagementFilters(filters: string[]) {
      engagementFilters.clear();
      filters
        .filter(Boolean)
        .map(normalizeText)
        .forEach((value) => engagementFilters.add(value));
      invalidate();
    },
    setJurisdictionFilters(filters: string[]) {
      jurisdictionFilters.clear();
      filters
        .filter(Boolean)
        .map(normalizeText)
        .forEach((value) => jurisdictionFilters.add(value));
      invalidate();
    },
    setIncludeUnpermissioned(include: boolean) {
      includeUnpermissioned = include;
      invalidate();
    },
    setSearchTerm(term: string) {
      searchTerm = normalizeText(term);
      invalidate();
    },
    getVisibleAgencies() {
      return getVisibleAgenciesInternal();
    },
    getStatus() {
      const visible = getVisibleAgenciesInternal();
      const status: MapStoreStatus = {
        total: sanitizedAgencies.length,
        visible: visible.length,
        hasResults: visible.length > 0
      };

      if (!status.hasResults) {
        if (engagementFilters.size || jurisdictionFilters.size || searchTerm) {
          status.emptyReason =
            "No agencies match the selected filters. Try clearing some filters to broaden your results.";
        } else {
          status.emptyReason = "No agencies are available yet. Please check back soon.";
        }
      }

      return status;
    },
    getFilters() {
      return {
        engagement: Array.from(engagementFilters),
        jurisdiction: Array.from(jurisdictionFilters),
        includeUnpermissioned,
        searchTerm
      };
    }
  };
};
