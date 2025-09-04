"use client";
import { useContext, useEffect } from "react";
import ChatList from "@/components/Chat/ChatList";
import { ChatContext } from "./layout";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const {
    selectedChatroom = null,
    setSelectedChatroom = () => {},
    isShowSidebar = false,
    toggleSidebar = () => {},
  } = useContext(ChatContext) ?? {};

  useEffect(() => {
    if (selectedChatroom && isShowSidebar) {
      router.push(`/rooms/${selectedChatroom.id}`);
    }
  }, [selectedChatroom, isShowSidebar, router]);

  return (
    <ChatList
      selectedChat={selectedChatroom}
      setSelectedChat={setSelectedChatroom}
      isShow={isShowSidebar}
      toggleSidebar={toggleSidebar}
    />
  );
}
