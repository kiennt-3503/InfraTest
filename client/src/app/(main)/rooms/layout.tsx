"use client";

import { useEffect, useState, createContext } from "react";
import { useRoomsStore } from "@/stores/roomsStore";
import { ROOM_READ_KEY } from "@/utils/room-read-sync";
import { Loading } from "@/components/ui/loading";
import {
  useRedirectByAuth,
  useProtectPageIfUnVerified,
} from "@/hooks/useRedirect";
import { BoundsCoordinates, ChatPin } from "@/types/googlemap";
import { useChatroomMap } from "@/hooks/useChatroomMap";
import { useChatroomDetail } from "@/hooks/useChatroomDetail";
import { ChatRoom } from "@/types/chatroom";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileFormWrapper } from "@/components/profile/ProfileFormWrapper";
import Image from "next/image";
import DefaultImage from "@/public/avatar_user.svg";
import useToggle from "@/hooks/useToggle";
import GoogleMapWrapper from "@/components/GoogleMap/GoogleMapWrapper";
import useProfile from "@/hooks/useProfile";
import { useChatRoomsStore } from "@/stores/chatRoomsStore";

export const ChatContext = createContext<{
  selectedChatroom: ChatRoom | null;
  setSelectedChatroom: React.Dispatch<React.SetStateAction<ChatRoom | null>>;
  isShowSidebar?: boolean;
  toggleSidebar: () => void;
  detailLoading?: boolean;
  showDetail?: boolean;
  chatroomDetail?: ChatRoom | null;
  handleCloseDetail: () => void;
  handleJoinSuccess?: (updatedChatroom: ChatRoom) => void;
} | null>(null);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { setRoomReaded, rooms } = useRoomsStore();
  const [selectedChatroom, setSelectedChatroom] = useState<ChatRoom | null>(
    null
  );
  const [selectedChatroomId, setSelectedChatroomId] = useState<string | null>(
    null
  );
  const [isShowSidebar, toggleSidebar] = useToggle(false);
  const [showDetail, setShowDetail] = useState(false);

  const [bounds, setBounds] = useState<BoundsCoordinates>();
  const [zoom, setZoom] = useState<number>(16);
  const { chatRoomMaps } = useChatroomMap({ bounds, zoom });
  const router = useRouter();
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const { profileSchema, profileDefaultValues, onSubmit, isLoading } =
    useProfile();
  const { addChatRoom } = useChatRoomsStore();

  const { chatroom: chatroomDetail, loading: detailLoading } =
    useChatroomDetail({
      chatroomId: selectedChatroomId,
    });

  const { isLoading: isLoadingAuth, hasRedirected } = useRedirectByAuth({
    when: "unauthenticated",
    redirectTo: "/landing",
  });

  const shouldSkipVerifyCheck = isLoadingAuth || hasRedirected;

  const isLoadingVerify = useProtectPageIfUnVerified(shouldSkipVerifyCheck);

  useEffect(() => {
    void import("@/utils/tab-manager");
  }, []);

  // Handle when chatroom detail is loaded
  useEffect(() => {
    if (chatroomDetail && showDetail) {
      // If user has already joined, go directly to chat
      if (chatroomDetail.current_user_has_joined) {
        setSelectedChatroom(chatroomDetail);
        setShowDetail(false);
        setSelectedChatroomId(null);
        if (!isShowSidebar) {
          toggleSidebar();
        }
      }
    }
  }, [chatroomDetail, showDetail, isShowSidebar, toggleSidebar]);

  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key !== ROOM_READ_KEY || !e.newValue) return;

      const newState: Record<string, boolean> = JSON.parse(e.newValue);

      Object.entries(newState).forEach(([roomId, isRead]) => {
        const existing = rooms[roomId];
        if (existing?.isReaded !== isRead) {
          setRoomReaded(roomId, isRead);
        }
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorageChange);
      return () => window.removeEventListener("storage", onStorageChange);
    }
    return;
  }, [rooms, setRoomReaded]);

  if (isLoadingAuth || isLoadingVerify) {
    return <Loading />;
  }

  const handleClickChatPin = (id: string) => {
    setSelectedChatroomId(id);
    setShowDetail(true);
    router.push(`/rooms/${id}`);
  };

  const handleJoinSuccess = (updatedChatroom: ChatRoom) => {
    addChatRoom(updatedChatroom);
    setShowDetail(false);
    setSelectedChatroomId(null);
    if (!isShowSidebar) {
      toggleSidebar();
    }
  };

  const handleCloseDetail = () => {
    router.push("/rooms");
    setShowDetail(false);
    setSelectedChatroom(null);
  };

  const mapChatPins = (): ChatPin[] => {
    return chatRoomMaps.map((pin) => ({
      id: String(pin.id),
      position: pin.coordinates,
      clickable: true,
      onClick: () => handleClickChatPin(String(pin.id)),
      children: (
        <div className="chat-pin">
          <Image
            width={40}
            height={40}
            src={DefaultImage}
            alt="Conversation icon"
            style={{
              border: "3px solid white",
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      ),
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        selectedChatroom,
        setSelectedChatroom,
        detailLoading,
        chatroomDetail,
        handleCloseDetail,
        isShowSidebar,
        toggleSidebar,
        handleJoinSuccess,
        showDetail,
      }}
    >
      <div className="grid grid-cols-[7fr_minmax(500px,3fr)] h-[calc(100vh-64px)]">
          <GoogleMapWrapper
            chatPins={mapChatPins()}
            mapTypeControl={false}
            enableClustering={zoom < 13}
            clusterMaxZoom={13}
            clusterGridSize={50}
            onMapInfoChange={({ bounds, zoom }) => {
              setBounds(bounds);
              if (zoom !== undefined) setZoom(zoom);
            }}
            clusterData={chatRoomMaps}
          />
        <div className="flex h-screen">
          {tab === "profile" ? (
            <ProfileFormWrapper
              schema={profileSchema}
              defaultValues={profileDefaultValues}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          ) : (
            <>
              {children}
            </>
          )}
        </div>
      </div>
    </ChatContext.Provider>
  );
}
