"use client";

import { useEffect, useRef, useContext, useMemo } from "react";
import { ChatMessage } from "./Message";
import { useQuery } from "@tanstack/react-query";
import { getMessagesByChatRoomId } from "@/apis/chat";
import { useAuthStore } from "@/stores/authStore";
import { ActionCableContext } from "@/providers/ActionCableProvider";
import { IsTyping } from "./IsTyping";
import { useChannelsStore } from "@/stores/channelsStore";
import { Message } from "@/types/message";
import { useRoomsStore } from "@/stores/roomsStore";
import { ChatRoom } from "@/types/chatroom";

export interface MessagesProps {
  chatroomId: string;
  setSelectedChatroom: (chatroom: ChatRoom) => void;
}

export interface IncomingMessageData {
  id: number;
  content: string;
  created_at: string;
  message_type: string | null;
  sender: {
    id: number;
    username: string;
  };
  username: string;
}

export const Messages = ({
  chatroomId,
  setSelectedChatroom,
}: MessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const cable = useContext(ActionCableContext);
  const { user: currentUser } = useAuthStore();
  const { setChannel, getChannel } = useChannelsStore();
  const { addMessage, setMessages, rooms } = useRoomsStore();

  // Get messages and typing state from store
  const room = rooms[chatroomId];
  const messages = useMemo(() => room?.messages || [], [room?.messages]);
  const isTyping = useMemo(() => room?.isTyping || false, [room?.isTyping]);

  // Fetch messages on mount or chatroomId change
  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["chatRooms", chatroomId],
    queryFn: () => getMessagesByChatRoomId(chatroomId),
    enabled: !!chatroomId,
  });

  useEffect(() => {
    if (!isLoading && messagesData) {
      setMessages(chatroomId, messagesData);
    }
  }, [messagesData, isLoading, setMessages, chatroomId]);

  // Setup ActionCable subscription
  useEffect(() => {
    if (!cable || getChannel(chatroomId)) return;

    const chnl = cable.subscriptions.create(
      { channel: "ChatRoomChannel", room_id: chatroomId },
      {
        connected: () => {
          console.info(`RoomsChannel connected! chatroomId: ${chatroomId}`);
        },
        disconnected: () => {
          console.warn(
            `RoomsChannel for chatroomId ${chatroomId} has been closed.`
          );
        },
        received: async (data: IncomingMessageData) => {
          const { getCurrentActivePath, getActiveTabs } = await import(
            "@/utils/tab-manager"
          );
          const newMessage: Message = {
            ...data,
            createdAt: data.created_at,
            messageType: data.message_type,
            isSender: data.sender.id === currentUser?.id,
          };

          // Determine if the message should be marked as read
          const activePath = getCurrentActivePath();
          const activeTabs = getActiveTabs();

          const isAnyTabActiveInRoom =
            !!activePath &&
            activeTabs.length > 0 &&
            activePath.includes(`${chatroomId}`);

          const isReaded = newMessage.isSender || isAnyTabActiveInRoom;
          addMessage(chatroomId, newMessage, isReaded);
        },
      }
    );

    setChannel(chatroomId, chnl);
  }, [cable, chatroomId, setChannel, getChannel, addMessage, currentUser?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {isLoading ? (
        <p className="text-gray-400 flex items-center justify-center h-full">
          読み込み中...
        </p>
      ) : (
        messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            currentUserId={currentUser?.id}
            setSelectedChatroom={setSelectedChatroom}
          />
        ))
      )}
      {isTyping && (
        <div className="text-gray-500 text-sm text-center mt-4">
          <IsTyping username={currentUser?.username || "ユーザー名"} />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
