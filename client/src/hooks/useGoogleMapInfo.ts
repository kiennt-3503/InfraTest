import { useEffect, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { GoogleMapInfo } from "@/types/googlemap";

export const useGoogleMapInfo = (): GoogleMapInfo => {
  const map = useMap();

  const [mapInfo, setMapInfo] = useState<GoogleMapInfo>({
    zoom: undefined,
    bounds: undefined,
    center: undefined,
  });

  useEffect(() => {
    if (!map) return;

    const handleIdle = () => {
      const zoom = map.getZoom();
      const bounds = map.getBounds();
      const center = map.getCenter();

      setMapInfo({
        zoom: zoom ?? undefined,
        center: center ? { lat: center.lat(), lng: center.lng() } : undefined,
        bounds: bounds
          ? {
              ne: {
                lat: bounds.getNorthEast().lat(),
                lng: bounds.getNorthEast().lng(),
              },
              sw: {
                lat: bounds.getSouthWest().lat(),
                lng: bounds.getSouthWest().lng(),
              },
            }
          : undefined,
      });
    };

    google.maps.event.addListener(map, "idle", handleIdle);

    return () => {
      google.maps.event.clearListeners(map, "idle");
    };
  }, [map]);

  return mapInfo;
};
