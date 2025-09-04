export interface Coordinates {
  lat: number;
  lng: number;
}

export type Prefecture = {
  id: number;
  name: string;
};

export type District = {
  id: number;
  name: string;
  prefectureId: number;
  prefectureName: string;
};
export interface RegionResponse {
  id: number;
  region_name: string;
}

export interface PrefectureResponse {
  id: number;
  prefecture_name: string;
}

export interface SectionResponse {
  id: number;
  section_name: string;
}

export interface DistrictResponse {
  id: number;
  district_name: string;
}

export interface TownResponse {
  id: number;
  town_name: string;
}

export interface StationResponse {
  id: number;
  station_name: string;
}
