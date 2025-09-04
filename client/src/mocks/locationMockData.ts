import { District, Prefecture } from "@/types/location";

export const prefecturesMock: Prefecture[] = [
  { id: 1, name: "北海道" },
  { id: 2, name: "青森県" },
  { id: 3, name: "岩手県" },
  { id: 4, name: "宮城県" },
  { id: 5, name: "秋田県" },
];

export const districtsMock: District[] = [
  { id: 1, name: "札幌市", prefectureId: 1, prefectureName: "北海道" },
  { id: 2, name: "青森市", prefectureId: 2, prefectureName: "青森県" },
  { id: 3, name: "盛岡市", prefectureId: 3, prefectureName: "岩手県" },
  { id: 4, name: "仙台市", prefectureId: 4, prefectureName: "宮城県" },
  { id: 5, name: "秋田市", prefectureId: 5, prefectureName: "秋田県" },
];
