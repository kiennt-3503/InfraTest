export interface CreateMessageResponse {
  id: number;
  message: string;
  chat_room_id: number;
  content: string;
}

export interface CreateMessageRequest {
  receiver_id: string;
  content: string;
  message_type: string;
  chat_room_id: string;
}

export interface Sender {
  id: number;
  username: string;
  profile?: {
    avatarSettings?: {
      avatarContent?: string;
      bgColor?: string;
      textColor?: string;
    };
  };
}

export interface SenderResponse {
  id: number;
  username: string;
  profile?: {
    avatar_settings?: {
      avatar_content?: string;
      bg_color?: string;
      text_color?: string;
    };
  };
}

export interface Message {
  id: number;
  isSender: boolean;
  messageType: string | null;
  sender: Sender;
  content: string;
  createdAt: string;
}

export interface MessageResponse {
  id: number;
  is_sender: boolean;
  message_type: string | null;
  sender: SenderResponse;
  content: string;
  created_at: string;
}
