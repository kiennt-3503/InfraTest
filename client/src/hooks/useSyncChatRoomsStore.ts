import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getChatRoomsByUserId } from "@/apis/chat";
import { useQuery } from "@tanstack/react-query";
import { useChatRoomsStore } from "@/stores/chatRoomsStore";

type UseSyncChatRoomsStoreResult = {
  chatRoomsData: Awaited<ReturnType<typeof getChatRoomsByUserId>> | undefined;
  isLoading: boolean;
};

export const useSyncChatRoomsStore = (): UseSyncChatRoomsStoreResult => {
  const { user } = useAuthStore();
  const { setChatRooms, setIsLoading } = useChatRoomsStore();

  const { data: chatRoomsData, isLoading } = useQuery({
    queryKey: ["chatRooms", user?.id],
    queryFn: () => getChatRoomsByUserId(user?.id ? user.id.toString() : ""),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (chatRoomsData) {
      setChatRooms(chatRoomsData);
    }
  }, [chatRoomsData, setChatRooms]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  return {
    chatRoomsData,
    isLoading
  };
};
