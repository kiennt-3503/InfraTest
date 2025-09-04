import { GET, POST } from "@/lib/api";
import {
  AutoJoinByLocationRespone,
  ChatRoomMapResponse,
  ChatRoom,
} from "@/types/chatroom";
import { Coordinates } from "@/types/location";

export const getChatroomMap = (
  ne: Coordinates,
  sw: Coordinates,
  zoom: number
) =>
  GET<ChatRoomMapResponse[]>("/api/v1/chat_rooms/by_area", {
    params: {
      south_west_lng: sw.lng.toString(),
      south_west_lat: sw.lat.toString(),
      north_east_lng: ne.lng.toString(),
      north_east_lat: ne.lat.toString(),
      zoom: zoom.toString(),
    },
  });

export const currentUserJoinChatRoom = () =>
  POST<AutoJoinByLocationRespone, void>(
    "/api/v1/chat_rooms/auto_join_by_location"
  );

export const getChatroomDetail = (chatroomId: string) =>
  GET<ChatRoom>(`/api/v1/chat_rooms/${chatroomId}/detail`);

export const joinChatroom = (chatroomId: string, message: string) =>
  POST<ChatRoom, { welcome_msg: string }>(
    `/api/v1/chat_rooms/${chatroomId}/join`,
    {
      welcome_msg: message,
    }
  );

export const createChatroomOnetoOne = (currentUserid: number, userId: number) =>
  POST<
    ChatRoom,
    {
      room_type: string;
      chatroom_location_type: string;
      chatroom_location_id: number;
      user_ids: number[];
    }
  >(`/api/v1/chat_rooms/create`, {
    room_type: "direct",
    chatroom_location_type: "User",
    chatroom_location_id: userId,
    user_ids: [userId,currentUserid]
  });
