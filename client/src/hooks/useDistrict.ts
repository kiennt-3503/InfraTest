import { useState, useEffect } from "react";
import { Prefecture, District } from "@/types/location";
import { districtsMock } from "@/mocks/locationMockData";
const useDistrict = (prefecture: Prefecture | null) => {
  const [districts, setDistricts] = useState<District[]>([]);

  // TODO: call API to get districts by prefecture or location etc.
  const fetchDistricts = (prefectureId: number) => {
    const data = districtsMock.filter(
      (district) => district.prefectureId === prefectureId
    );

    setDistricts(data);
  };

  useEffect(() => {
    if (!prefecture) {
      setDistricts([]);
      return;
    }

    fetchDistricts(prefecture.id);
  }, [prefecture]);

  return {
    districts,
  };
};

export default useDistrict;
