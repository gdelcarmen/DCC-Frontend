export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapAgency {
  id: string;
  name: string;
  jurisdiction: string;
  coordinates: MapCoordinates;
  engagementTypes: string[];
  permissionReceived: boolean;
  [key: string]: unknown;
}

export interface MapStoreStatus {
  total: number;
  visible: number;
  hasResults: boolean;
  emptyReason?: string;
}
