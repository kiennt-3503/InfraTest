import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  getDistricts,
  getPrefectures,
  getRegions,
  getSections,
  getStations,
  getTowns,
} from "@/apis/location";
import { UseFormReturn } from "react-hook-form";
import { SubmitFirstAddressValues } from "./useOnBoarding";

export const useGetLocation = (
  form: UseFormReturn<SubmitFirstAddressValues>
) => {
  const [regionId, setRegionId] = useState<string | undefined>(undefined);
  const [prefectureId, setPrefectureId] = useState<string | undefined>(
    undefined
  );
  const [sectionId, setSectionId] = useState<string | undefined>(undefined);
  const [districtId, setDistrictId] = useState<string | undefined>(undefined);

  const regionsQuery = useQuery({
    queryKey: ["regions"],
    queryFn: getRegions,
  });

  const prefecturesQuery = useQuery({
    queryKey: ["prefectures", regionId],
    queryFn: () => getPrefectures(regionId!),
    enabled: !!regionId,
  });

  const sectionsQuery = useQuery({
    queryKey: ["sections", prefectureId],
    queryFn: () => getSections(prefectureId!),
    enabled: !!prefectureId,
  });

  const districtsQuery = useQuery({
    queryKey: ["districts", sectionId],
    queryFn: () => getDistricts(sectionId!),
    enabled: !!sectionId,
  });

  const townsQuery = useQuery({
    queryKey: ["towns", districtId],
    queryFn: () => getTowns(districtId!),
    enabled: !!districtId,
  });

  const stationsQuery = useQuery({
    queryKey: ["stations", prefectureId],
    queryFn: () => getStations(prefectureId!),
    enabled: !!prefectureId,
  });

  useEffect(() => {
    form.setValue("placeForm.prefecture", "");
    form.setValue("stationNameForm.stationPrefecture", "");
  }, [regionId, form]);

  useEffect(() => {
    form.setValue("placeForm.section", "");
  }, [prefectureId, form]);

  useEffect(() => {
    form.setValue("placeForm.district", "");
  }, [sectionId, form]);

  useEffect(() => {
    form.setValue("placeForm.town", "");
  }, [districtId, form]);

  return {
    regionId,
    setRegionId,
    prefectureId,
    setPrefectureId,
    sectionId,
    setSectionId,
    districtId,
    setDistrictId,

    regionsQuery,
    prefecturesQuery,
    sectionsQuery,
    districtsQuery,
    townsQuery,
    stationsQuery,
  };
};
