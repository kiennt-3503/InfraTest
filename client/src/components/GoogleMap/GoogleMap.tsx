"use client";
import React, { useEffect } from "react";
import {
  Map as GoogleMapComponent,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { envVariables } from "@/configs";
import { GoogleMapProps, TOKYO_LOCATION } from "../../types/googlemap";
import { ChatRoomMap } from "@/types/chatroom";
import { useGoogleMapInfo } from "@/hooks/useGoogleMapInfo";
import { useMapStore } from "@/stores/mapStore";
import MarkerClustererComponent from "./MarkerClusterer";

const GoogleMap = ({
  mapClassName,
  defaultZoom = 10,
  currentLocation,
  style,
  center,
  mapId = envVariables.GOOGLE_MAPS_MAP_ID,
  defaultCenter = TOKYO_LOCATION,
  isShowCurrentLocation = false,
  onClick = () => {},
  chatPins = [],
  // isShowSearchForm = true,
  onMapInfoChange,
  enableClustering = true,
  clusterMaxZoom = 13,
  clusterGridSize = 60,
  clusterData = [],
  ...restProps
}: GoogleMapProps) => {
  const map = useMap();
  const setMap = useMapStore((s) => s.setMap);
  const mapInfo = useGoogleMapInfo();

  useEffect(() => {
    if (onMapInfoChange) {
      onMapInfoChange(mapInfo);
    }
  }, [mapInfo, onMapInfoChange]);

  useEffect(() => {
    if (map) {
      setMap(map);
    }
  }, [map, setMap]);

  return (
    <div className="relative w-full h-full">
      <GoogleMapComponent
        className={mapClassName}
        style={{ width: "100%", height: "100%", ...style }}
        defaultZoom={defaultZoom}
        center={center}
        defaultCenter={defaultCenter}
        mapId={mapId}
        mapTypeId={"roadmap"}
        onClick={onClick}
        streetViewControl={false}
        {...restProps}
      >
        {/* {isShowSearchForm && (
          <SearchForm controlPosition={ControlPosition.TOP_CENTER} />
        )} */}

        {isShowCurrentLocation && currentLocation && (
          <AdvancedMarker position={currentLocation} />
        )}

        {enableClustering && clusterData.length > 0 && (
          <MarkerClustererComponent
            chatPins={clusterData.map((pin: ChatRoomMap) => ({
              id: String(pin.id),
              position: pin.coordinates,
            }))}
            maxZoom={clusterMaxZoom}
            gridSize={clusterGridSize}
          />
        )}

        {chatPins.length > 0 &&
          mapInfo?.zoom !== undefined &&
          mapInfo.zoom >= clusterMaxZoom && (
            <>
              {chatPins.map((pinData, index) => (
                <AdvancedMarker
                  key={pinData.id || index}
                  position={pinData.position}
                  onClick={pinData.onClick}
                  clickable={pinData.clickable}
                >
                  {pinData.children}
                </AdvancedMarker>
              ))}
            </>
          )}
      </GoogleMapComponent>
    </div>
  );
};

export default GoogleMap;
