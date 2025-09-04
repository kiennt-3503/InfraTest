// src/types/chat.ts

import { BroadcastEvent } from "@/constants/chat-broadcast";

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  online?: boolean;
  selected?: boolean;
  unreadCount?: number;
}

export interface Message {
  id: string;
  text: string;
  time: string;
  isOwnMessage: boolean;
  sender: {
    id: string;
    name: string;
  };
}

export interface ChatPayload {
  chat_room_id?: string;
  content: string;
  message_type?: string;
}

export interface ChatBroadcast {
  type: BroadcastEvent;
  content?: string;
  user: string;
  id: number;
  timestamp?: string;
}
