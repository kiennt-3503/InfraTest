"use client";

import { useState, useCallback, useEffect, useContext } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getChatRoomsByUserId } from "@/apis/chat";
import { ChatRoom, ChatRoomUpdatePayload } from "@/types/chatroom";
import { Loading } from "../ui/loading";
import ChatListItem from "./ChatListItem";
import { useMapStore } from "@/stores/mapStore";
import { ActionCableContext } from "@/providers/ActionCableProvider";

interface ChatListProps {
  selectedChat: ChatRoom | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<ChatRoom | null>>;
  isShow: boolean;
  toggleSidebar: () => void;
}

export default function ChatList({
  selectedChat,
  isShow,
  setSelectedChat,
  toggleSidebar,
}: ChatListProps) {
  const [search] = useState("");
  const map = useMapStore((s) => s.map);
  const cable = useContext(ActionCableContext);
  const { user } = useAuthStore();

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const { data: chatRoomsData, isLoading } = useQuery({
    queryKey: ["chatRooms", user?.id],
    queryFn: () => getChatRoomsByUserId(user?.id.toString() || ""),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (chatRoomsData) {
      setChatRooms(chatRoomsData);
    }
  }, [chatRoomsData]);

  useEffect(() => {
    if (!cable || !user?.id) return;

    const subscription = cable.subscriptions.create(
      { channel: "ChatRoomsListChannel" },
      {
        received: (data: ChatRoomUpdatePayload) => {
          setChatRooms((prevRooms) => {
            const others = prevRooms.filter((r) => r.id !== data.chat_room_id);

            const updatedRoom: ChatRoom = {
              id: data.chat_room_id,
              room_name: data.room_name || "",
              last_message: data.last_message,
              updated_at: data.updated_at,
              unread_messages_count: data.unread_messages_count,
              members_count: data.members_count,
            };

            return [updatedRoom, ...others];
          });
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [cable, user?.id]);

  const filteredChats =
    chatRooms
      ?.filter((chat) => {
        const lowerSearch = search.toLowerCase();
        const chatName = chat.room_name?.toLowerCase() || "";
        return chatName.includes(lowerSearch);
      })
      .sort(
        (a, b) =>
          new Date(b.updated_at || 0).getTime() -
          new Date(a.updated_at || 0).getTime()
      ) || [];

  const handleSelectChatroom = useCallback(
    (chat: ChatRoom) => {
      setSelectedChat(chat);

      if (!isShow) {
        toggleSidebar();
      }

      if (map && chat.coordinates) {
        map.panTo({
          lat: chat.coordinates.lat,
          lng: chat.coordinates.lng,
        });
        map.setZoom(16);
      }
    },
    [setSelectedChat, toggleSidebar, map, isShow]
  );

  return (
    <div className="flex flex-col h-screen rounded-none bg-base-100 w-full">
      <div className="flex items-center gap-2 p-4 border-b border-base-300 border-dashed">
        <div className="flex items-center gap-2 text-sm font-medium w-full">
          <span className="text-xl">やり取り一覧</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <Loading />
        ) : filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              selectedChat={selectedChat}
              handleSelectChatroom={handleSelectChatroom}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">
            やり取りがありません。
          </div>
        )}
      </div>
    </div>
  );
}
