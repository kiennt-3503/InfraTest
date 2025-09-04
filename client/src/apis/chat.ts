import { GET, POST, PUT } from "@/lib/api";
import { ChatRoom } from "@/types/chatroom";
import {
  CreateMessageRequest,
  CreateMessageResponse,
  MessageResponse,
} from "@/types/message";
import { toMessagesType } from "@/utils/snake-to-camel";

export const getChatRoomsByUserId = (userId: string) =>
  GET<ChatRoom[]>(`/api/v1/chat_rooms/${userId}/by_user`);

export const getMessagesByChatRoomId = async (chat_room_id: string) => {
  const response = await GET<MessageResponse[]>(`/api/v1/messages`, {
    params: { chat_room_id },
  });
  return toMessagesType(response);
};

export const createMessage = (
  receiver_id: string,
  content: string,
  message_type: string,
  chat_room_id: string
) => {
  const body = {
    receiver_id,
    content,
    message_type,
    chat_room_id,
  };

  return POST<CreateMessageResponse, CreateMessageRequest>(
    `/api/v1/messages`,
    body
  );
};

export const getMembersOfChatRoom = (chat_room_id: string) => {
  return GET<string[]>(`/api/v1/chat_rooms/${chat_room_id}/members`);
};

export const markChatRoomAsRead = (chatRoomId: number) =>
  PUT<{ success: boolean }, object>(
    `/api/v1/chat_rooms/${chatRoomId}/mark_read`,
    {}
  );
