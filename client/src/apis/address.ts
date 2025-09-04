import { POST } from "@/lib/api";
import { UserLocationBody, UserLocationResponse } from "@/types/userLocation";

export const createUserLocation = (body: UserLocationBody) =>
  POST<UserLocationResponse, UserLocationBody>(
    "/api/v1/user_locations/location",
    body
  );
