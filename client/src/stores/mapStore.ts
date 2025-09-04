import { create } from "zustand";

type MapStore = {
  map: google.maps.Map | null;
  setMap: (map: google.maps.Map) => void;
};

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));
