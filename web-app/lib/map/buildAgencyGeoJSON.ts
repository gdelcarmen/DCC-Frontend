import type { MapAgency } from "./types";

export interface GeoJSONFeature<TProperties = Record<string, unknown>> {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: TProperties;
}

export interface GeoJSONFeatureCollection<TProperties = Record<string, unknown>> {
  type: "FeatureCollection";
  features: Array<GeoJSONFeature<TProperties>>;
}

export interface AgencyFeatureProperties {
  id: string;
  name: string;
  jurisdiction: string;
  engagementTypes: string[];
  permissionReceived: boolean;
  [key: string]: unknown;
}

const isValidCoordinate = (value: number): boolean => Number.isFinite(value);

export const buildAgencyGeoJSON = (
  agencies: MapAgency[],
  options: { includeUnpermissioned?: boolean } = {}
): GeoJSONFeatureCollection<AgencyFeatureProperties> => {
  const includeUnpermissioned = Boolean(options.includeUnpermissioned);

  const features = agencies
    .filter((agency) => {
      if (!includeUnpermissioned && !agency.permissionReceived) {
        return false;
      }
      return (
        isValidCoordinate(agency.coordinates?.lat ?? NaN) &&
        isValidCoordinate(agency.coordinates?.lng ?? NaN)
      );
    })
    .map<GeoJSONFeature<AgencyFeatureProperties>>((agency) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [agency.coordinates.lng, agency.coordinates.lat]
      },
      properties: {
        id: agency.id,
        name: agency.name,
        jurisdiction: agency.jurisdiction,
        engagementTypes: agency.engagementTypes ?? [],
        permissionReceived: Boolean(agency.permissionReceived)
      }
    }));

  return {
    type: "FeatureCollection",
    features
  };
};
