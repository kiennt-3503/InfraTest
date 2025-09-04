import { Coordinates } from "./location";

export type Member = {
  id: number;
  username: string;
  avatar_url: string;
};

export type ChatRoom = {
  id: string;
  room_name?: string;
  members_count?: number;
  coordinates?: Coordinates;
  room_type?: string;
  current_user_has_joined?: boolean;
  chatroom_location_type?: string;
  unread_messages_count?: number;
  members?: Member[];
  last_message?: {
    content: string;
    created_at: string;
  };
  updated_at?: string;
  messages_count?: number;
  chat_room_members?: Member[];
};

export type ChatShowProps = {
  selectedChatroom: ChatRoom;
  setSelectedChatroom: (chatroom: ChatRoom) => void;
  isShow?: boolean;
  handleCloseDetail: () => void;
};

export type ChatRoomUpdatePayload = {
  chat_room_id: string;
  room_name?: string;
  last_message: {
    content: string;
    created_at: string;
  };
  updated_at: string;
  sender_name: string;
  unread_messages_count?: number;
  members_count?: number;
};

export type ChatRoomMapResponse = {
  id: number;
  room_name: string;
  coordinates: Coordinates;
  members_count: number;
};

export type ChatRoomMap = {
  id: number;
  room_name: string;
  coordinates: Coordinates;
  members_count: number;
};

export type AutoJoinByLocationRespone = {
  status: number;
  message: string;
};
