import React from "react";
import { ControlPosition, MapEvent } from "@vis.gl/react-google-maps";
import { Coordinates } from "./location";
import { useGoogleMapInfo } from "@/hooks/useGoogleMapInfo";
import { ChatRoomMap } from "./chatroom";

export type ChatPin = {
  id?: string;
  position: Coordinates;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  clickable?: boolean;
  children?: React.ReactNode;
};

export type GoogleMapProps = {
  mapClassName?: string;
  style?: React.CSSProperties;
  defaultZoom?: number;
  zoom?: number;
  center?: Coordinates;
  defaultCenter?: Coordinates;
  currentLocation?: Coordinates;
  isShowCurrentLocation?: boolean;
  isShowSearchForm?: boolean;
  gestureHandling?: "greedy" | "cooperative" | "none" | "auto";
  disableDefaultUI?: boolean;
  mapTypeControl?: boolean;
  zoomControl?: boolean;
  streetViewControl?: boolean;
  fullscreenControl?: boolean;
  onClick?: (e: MapEvent) => void;
  mapId?: string;
  chatPins?: ChatPin[];
  onMapInfoChange?: (info: ReturnType<typeof useGoogleMapInfo>) => void;
  enableClustering?: boolean;
  clusterMaxZoom?: number;
  clusterGridSize?: number;
  clusterData?: ChatRoomMap[];
};

export type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  // TODO: add action autocomplete
};

export const TOKYO_LOCATION: Coordinates = {
  lat: 35.47617086607749,
  lng: 139.63087521188123,
};

export type BoundsCoordinates = {
  ne: Coordinates;
  sw: Coordinates;
};

export type GoogleMapInfo = {
  zoom?: number;
  bounds?: BoundsCoordinates;
  center?: Coordinates;
};
