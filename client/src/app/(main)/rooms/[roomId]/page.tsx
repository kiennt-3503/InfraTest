"use client";
import { useContext, use, useCallback } from "react";
import { ChatContext } from "../layout";
import { useEffect } from "react";
import { useChatRoomsStore } from "@/stores/chatRoomsStore";
import { ChatRoom } from "@/types/chatroom";
import { useMapStore } from "@/stores/mapStore";
import { useRouter } from "next/navigation";
import ChatRoomDetail from "@/components/Chat/ChatRoomDetail";
import ChatShow from "@/components/Chat/ChatShow";
import LoadingChatRoomDetail from "@/components/Chat/LoadingChatRoomDetail";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const { getRoomById, isLoading: isChatRoomLoading } = useChatRoomsStore();
  const foundRoom = getRoomById(roomId);
  const map = useMapStore((s) => s.map);
  const router = useRouter();

  const {
    setSelectedChatroom = () => {},
    toggleSidebar = () => {},
    selectedChatroom = null,
    isShowSidebar = false,
    detailLoading = false,
    chatroomDetail = null,
    handleCloseDetail = () => {},
    handleJoinSuccess = () => {},
  } = useContext(ChatContext) ?? {};

  const handleSelectChatroom = useCallback(
    (chat: ChatRoom) => {
      setSelectedChatroom(chat);
      toggleSidebar();


      if(chat?.room_type != 'direct')
        if (map && chat.coordinates) {
          const lat = chat.coordinates.lat;
          const lng = chat.coordinates.lng;

          if (!isNaN(lat) && !isNaN(lng)) {
            map.panTo({ lat, lng });
            map.setZoom(16);
          } else {
            console.warn("Invalid coordinates:", chat.coordinates);
          }
        }
      
    },
    [setSelectedChatroom, toggleSidebar, map]
  );

  useEffect(() => {
    if (isChatRoomLoading) return;

    if (foundRoom) {
      handleSelectChatroom(foundRoom);
      return;
    }

    if (detailLoading) return;

    if (chatroomDetail) {
      setSelectedChatroom(null);
    } else {
      router.push("/rooms");
    }
  }, [
    foundRoom,
    isChatRoomLoading,
    router,
    chatroomDetail,
    detailLoading,
    handleSelectChatroom,
    setSelectedChatroom,
  ]);

  return (
    <>
      {selectedChatroom ? (
        <ChatShow
          selectedChatroom={selectedChatroom}
          setSelectedChatroom={setSelectedChatroom}
          isShow={isShowSidebar}
          handleCloseDetail={handleCloseDetail}
        />
      ) : detailLoading && !chatroomDetail?.current_user_has_joined ? (
        <LoadingChatRoomDetail handleCloseDetail={handleCloseDetail} />
      ) : chatroomDetail ? (
        <ChatRoomDetail
          chatroom={chatroomDetail}
          onJoinSuccess={handleJoinSuccess}
          onClose={handleCloseDetail}
        />
      ) : null}
    </>
  );
}
