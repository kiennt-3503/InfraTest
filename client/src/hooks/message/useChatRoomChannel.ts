// src/hooks/message/useChat.ts
import { useChannelsStore } from "@/stores/channelsStore";
import { ChatPayload } from "@/types/chat";

export const useChatRoomChannel = (roomId: string) => {
  const channel = useChannelsStore((state) => state.getChannel(roomId));

  const perform = (action: string, data?: ChatPayload) => {
    if (channel) {
      channel.perform(action, {
        content: data?.content,
      });
    } else {
      console.warn("[ActionCable] Not connected to channel or chatRoomId is missing. Message not sent:", data?.content);
    }
  };

  return { perform };
}
