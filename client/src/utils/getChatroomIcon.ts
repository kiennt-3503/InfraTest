import { StaticImageData } from "next/image";
import { district, town, station } from "@/public";
import { ChatroomLocationType } from "@/constants/chatroom";
import DefaultImage from "@/public/avatar_user.svg";

/**
 * Get chatroom icon based on chatroom location type
 * @param chatroomLocationType - The type of chatroom location (District, Town, Station)
 * @returns StaticImageData - The appropriate SVG image
 */
export const getChatroomIcon = (
  chatroomLocationType?: string
): StaticImageData => {
  switch (chatroomLocationType) {
    case ChatroomLocationType.District:
      return district;
    case ChatroomLocationType.Town:
      return town;
    case ChatroomLocationType.Station:
      return station;
    default:
      return DefaultImage;
  }
};
