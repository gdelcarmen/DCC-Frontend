import { createMapStore } from "../../lib/map/store";

const buildMockAgencies = () => [
  {
    id: "agency-austin",
    name: "Austin Police Department",
    jurisdiction: "Austin, Texas",
    coordinates: { lat: 30.2672, lng: -97.7431 },
    permissionReceived: true,
    engagementTypes: ["Bias-Free Policing", "Data Analytics"]
  },
  {
    id: "agency-sac",
    name: "Sacramento County Sheriff",
    jurisdiction: "Sacramento County, California",
    coordinates: { lat: 38.5816, lng: -121.4944 },
    permissionReceived: true,
    engagementTypes: ["Policy Assessment"]
  },
  {
    id: "agency-miami",
    name: "Miami-Dade Police",
    jurisdiction: "Miami-Dade County, Florida",
    coordinates: { lat: 25.7617, lng: -80.1918 },
    permissionReceived: false,
    engagementTypes: ["Bias-Free Policing"]
  }
];

describe("map store filters", () => {
  it("returns agencies that match combined engagement and jurisdiction filters", () => {
    const store = createMapStore(buildMockAgencies());

    store.setEngagementFilters(["Data Analytics"]);
    store.setJurisdictionFilters(["Texas"]);

    const visibleAgencies = store.getVisibleAgencies();

    expect(visibleAgencies).toHaveLength(1);
    expect(visibleAgencies[0].id).toBe("agency-austin");
  });

  it("excludes agencies without permission unless explicitly included", () => {
    const store = createMapStore(buildMockAgencies());

    const initialVisible = store.getVisibleAgencies().map((agency: { id: string }) => agency.id);
    expect(initialVisible).toEqual(["agency-austin", "agency-sac"]);

    store.setIncludeUnpermissioned(true);
    const visibleWithOverride = store.getVisibleAgencies().map((agency: { id: string }) => agency.id);
    expect(visibleWithOverride).toEqual(["agency-austin", "agency-sac", "agency-miami"]);
  });

  it("reports empty state metadata when no agencies match current filters", () => {
    const store = createMapStore(buildMockAgencies());

    store.setEngagementFilters(["Innovation & Training"]);

    expect(store.getVisibleAgencies()).toHaveLength(0);
    const status = store.getStatus();
    expect(status.hasResults).toBe(false);
    expect(status.emptyReason).toMatch(/no agencies/i);
  });
});
