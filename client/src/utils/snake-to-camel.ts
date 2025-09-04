// utils/snakeToCamel.ts
import { MessageResponse, Message, SenderResponse, Sender } from "@/types/message";

export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export const snakeToCamel = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
        toCamelCase(key),
        snakeToCamel(value),
      ])
    );
  }
  return obj;
}
const toSenderType = (senderResponse: SenderResponse): Sender => {
  const senderProfile = senderResponse.profile;
  const avatarSettings = senderProfile?.avatar_settings;

  return {
    id: senderResponse.id,
    username: senderResponse.username,
    profile: senderProfile
      ? {
          avatarSettings: avatarSettings
            ? {
                avatarContent: avatarSettings.avatar_content,
                bgColor: avatarSettings.bg_color,
                textColor: avatarSettings.text_color,
              }
            : undefined,
        }
      : undefined,
  };
};

const toMessageType = (messageResponse: MessageResponse): Message => {
  return {
    id: messageResponse.id,
    isSender: messageResponse.is_sender,
    messageType: messageResponse.message_type,
    sender: toSenderType(messageResponse.sender),
    content: messageResponse.content,
    createdAt: messageResponse.created_at,
  };
};

export const toMessagesType = (messagesResponse: MessageResponse[]): Message[] => {
  return messagesResponse.map(toMessageType);
}
