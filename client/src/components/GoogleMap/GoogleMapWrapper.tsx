import React from "react";
import { envVariables } from "@/configs";
import { APIProvider } from "@vis.gl/react-google-maps";
import { GoogleMapProps } from "@/types/googlemap";
import GoogleMap from "./GoogleMap";

const GoogleMapWrapper = ({
  onMapInfoChange,
  clusterData,
  ...props
}: GoogleMapProps) => {
  return (
    <APIProvider
      apiKey={envVariables.GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <GoogleMap
        {...props}
        onMapInfoChange={onMapInfoChange}
        clusterData={clusterData}
      />
    </APIProvider>
  );
};

export default GoogleMapWrapper;
