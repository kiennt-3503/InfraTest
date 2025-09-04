import { GET } from "@/lib/api";
import {
  DistrictResponse,
  PrefectureResponse,
  RegionResponse,
  SectionResponse,
  StationResponse,
  TownResponse,
} from "@/types/location";

export const getRegions = () =>
  GET<RegionResponse[]>("/api/v1/locations/regions");

export const getPrefectures = (region_id: string) =>
  GET<PrefectureResponse[]>("/api/v1/locations/prefectures", {
    params: {
      region_id,
    },
  });

export const getSections = (prefecture_id: string) =>
  GET<SectionResponse[]>("/api/v1/locations/sections", {
    params: {
      prefecture_id,
    },
  });

export const getDistricts = (section_id: string) =>
  GET<DistrictResponse[]>("/api/v1/locations/districts", {
    params: {
      section_id,
    },
  });

export const getTowns = (district_id: string) =>
  GET<TownResponse[]>("/api/v1/locations/towns", {
    params: {
      district_id,
    },
  });

export const getStations = (prefecture_id: string) =>
  GET<StationResponse[]>("/api/v1/locations/stations", {
    params: {
      prefecture_id,
    },
  });
