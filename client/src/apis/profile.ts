import { GET, PUT } from "@/lib/api";
import { BasicInfoBody, BasicInfoResponse } from "@/types/profile";

export const getBasicInfo = () => GET<BasicInfoResponse>("/api/v1/profiles");

export const updateBasicInfo = (body: BasicInfoBody) =>
  PUT<BasicInfoResponse, BasicInfoBody>("/api/v1/profiles", body);

export const getMemberProfile = (user_id: number) =>
  GET<BasicInfoResponse>(`/api/v1/profiles/${user_id}`);
