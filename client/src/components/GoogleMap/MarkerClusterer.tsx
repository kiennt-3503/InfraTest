"use client";
import React, { useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { MarkerClusterer, GridAlgorithm } from "@googlemaps/markerclusterer";
import { ChatPin } from "@/types/googlemap";
import "./MarkerClusterer.css";
import DefaultImage from "@/public/avatar_user.svg";

interface MarkerClustererProps {
  chatPins: ChatPin[];
  maxZoom?: number;
  gridSize?: number;
}

const MarkerClustererComponent: React.FC<MarkerClustererProps> = ({
  chatPins,
  maxZoom = 13,
  gridSize = 60,
}) => {
  const map = useMap();
  const markerLib = useMapsLibrary("marker");
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  // Effect to create marker instances when chatPins or markerLib changes
  useEffect(() => {
    if (!markerLib || !map) return;

    const newMarkers = chatPins.map((pin) => {
      // Create the main wrapper div for the marker
      const markerElement = document.createElement("div");
      markerElement.className = "chat-pin";
      markerElement.style.cursor = "pointer";
      markerElement.style.contentVisibility = "visible";
      markerElement.style.contain = "none";

      // Create an img element for the avatar
      const imgElement = document.createElement("img");
      imgElement.src = DefaultImage.src;
      imgElement.alt = "Conversation icon";
      imgElement.width = 40;
      imgElement.height = 40;
      imgElement.style.border = "3px solid white";
      imgElement.style.borderRadius = "50%";
      imgElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";

      // Append the image to the marker div
      markerElement.appendChild(imgElement);

      const marker = new markerLib.AdvancedMarkerElement({
        position: pin.position,
        content: markerElement,
      });

      marker.addListener("click", () => {
        if (pin.id) {
          const event = new CustomEvent("markerClick", {
            detail: { id: pin.id },
            bubbles: true,
          });
          window.dispatchEvent(event);
        }
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [chatPins, markerLib, map]);

  // Effect to manage the MarkerClusterer instance and its markers
  useEffect(() => {
    if (!map || markers.length === 0) return;

    const renderer = {
      render: (cluster: unknown) => {
        const {
          count,
          position,
          markers: clusterMarkers,
        } = cluster as {
          count: number;
          position: google.maps.LatLng | google.maps.LatLngLiteral;
          markers?: google.maps.marker.AdvancedMarkerElement[];
        };
        if (count <= 1 || !clusterMarkers || clusterMarkers.length <= 1) {
          if (clusterMarkers && clusterMarkers.length === 1) {
            const originalMarker = clusterMarkers[0];
            originalMarker.map = map;
            return originalMarker;
          }

          if (position) {
            // Create the main wrapper div for the marker
            const markerElement = document.createElement("div");
            markerElement.className = "chat-pin";
            markerElement.style.cursor = "pointer";
            markerElement.style.contentVisibility = "visible";
            markerElement.style.contain = "none";

            // Create an img element for the avatar
            const imgElement = document.createElement("img");
            imgElement.src = DefaultImage.src;
            imgElement.alt = "Conversation icon";
            imgElement.width = 40;
            imgElement.height = 40;
            imgElement.style.border = "3px solid white";
            imgElement.style.borderRadius = "50%";
            imgElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";

            // Append the image to the marker div
            markerElement.appendChild(imgElement);

            // We know markerLib is not null here because the parent useEffect already checked
            const singleMarker = new markerLib!.AdvancedMarkerElement({
              position,
              content: markerElement,
            });

            // Try to find the original marker's ID from chatPins if position matches
            const originalPin = chatPins.find(
              (pin) =>
                pin.position.lat === position.lat &&
                pin.position.lng === position.lng
            );

            if (originalPin?.id) {
              singleMarker.addListener("click", () => {
                const event = new CustomEvent("markerClick", {
                  detail: { id: originalPin.id },
                  bubbles: true,
                });
                window.dispatchEvent(event);
              });
            }

            return singleMarker;
          }
        }

        const CLUSTER_STYLES = {
          small: {
            className: "marker-cluster-small",
            size: 40,
            fontSize: 12,
            backgroundColor:
              "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            borderWidth: 2,
          },
          medium: {
            className: "marker-cluster-medium",
            size: 50,
            fontSize: 14,
            backgroundColor:
              "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            borderWidth: 3,
          },
          large: {
            className: "marker-cluster-large",
            size: 60,
            fontSize: 16,
            backgroundColor:
              "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            borderWidth: 3,
          },
          xlarge: {
            className: "marker-cluster-xlarge",
            size: 70,
            fontSize: 18,
            backgroundColor:
              "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
            borderWidth: 4,
          },
          xxlarge: {
            className: "marker-cluster-xxlarge",
            size: 80,
            fontSize: 20,
            backgroundColor:
              "linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)",
            borderWidth: 5,
          },
          xxxlarge: {
            className: "marker-cluster-xxxlarge",
            size: 90,
            fontSize: 22,
            backgroundColor:
              "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
            borderWidth: 6,
          },
        };

        const getClusterSize = (count: number) => {
          if (count >= 200) return "xxxlarge";
          if (count >= 100) return "xxlarge";
          if (count >= 50) return "xlarge";
          if (count >= 20) return "large";
          if (count >= 10) return "medium";
          return "small";
        };

        const clusterSize = getClusterSize(count);
        const style = CLUSTER_STYLES[clusterSize];

        // Create div directly without using innerHTML
        const div = document.createElement("div");
        div.className = `marker-cluster ${style.className}`;
        div.style.width = `${style.size}px`;
        div.style.height = `${style.size}px`;
        div.style.fontSize = `${style.fontSize}px`;
        div.style.background = style.backgroundColor;
        div.style.borderRadius = "50%";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "center";
        div.style.color = "white";
        div.style.fontWeight = "bold";
        div.style.border = `${style.borderWidth}px solid white`;
        div.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
        div.style.cursor = "pointer";
        div.style.contentVisibility = "visible";
        div.style.contain = "none";
        div.innerText = count.toString();

        const marker = new markerLib!.AdvancedMarkerElement({
          position,
          content: div,
        });

        marker.addListener("click", () => {
          map.setZoom(maxZoom + 1);
          map.setCenter(position);
        });

        return marker;
      },
    };

    const clusterer = new MarkerClusterer({
      map,
      markers,
      algorithm: new GridAlgorithm({
        maxZoom: maxZoom,
        gridSize,
      }),
      renderer,
      onClusterClick: (_event, cluster, map) => {
        map.setZoom(maxZoom + 1);
        map.setCenter(cluster.position);
      },
    });

    markers.forEach((marker) => {
      marker.map = null;
    });

    return () => {
      clusterer.clearMarkers();
      // Remove markers from map
      markers.forEach((marker) => {
        marker.map = null;
      });
    };
  }, [map, markers, maxZoom, gridSize, chatPins, markerLib]);

  return null;
};

export default MarkerClustererComponent;
