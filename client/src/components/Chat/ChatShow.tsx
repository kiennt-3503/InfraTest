import React, { useEffect } from "react";
import { ChatShowProps } from "@/types/chatroom";
import { Messages } from "./Messages";
import { ChatInput } from "./ChatInput";
import { useRoomsStore } from "@/stores/roomsStore";
import { getChatroomIcon } from "@/utils/getChatroomIcon";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMarkChatRoomAsRead } from "@/hooks/message/useMarkChatRoomAsRead";
import { useChatroomDetail } from "@/hooks/useChatroomDetail";
import { Member } from "./Member";
import { useAuthStore } from "@/stores/authStore";

const ChatShow = ({
  selectedChatroom,
  setSelectedChatroom,
  handleCloseDetail,
}: ChatShowProps) => {
  const { mutate: markAsRead } = useMarkChatRoomAsRead();
  const router = useRouter();
  const { chatroom: chatRoom } = useChatroomDetail({
    chatroomId: selectedChatroom.id,
  });
  const [isShowMemberList, setIsShowMemberList] = React.useState(false);
  const { user: currentUser } = useAuthStore();

  const { markAsReaded } = useRoomsStore();
  useEffect(() => {
    if (selectedChatroom?.id) {
      markAsRead(Number(selectedChatroom.id));
    }
  }, [selectedChatroom?.id, markAsRead]);

  const handleClose = () => {
    markAsRead(Number(selectedChatroom.id));
    if (isShowMemberList) {
      setIsShowMemberList(false);
    } else {
      handleCloseDetail();
      router.push("/rooms");
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      if (selectedChatroom.id) {
        markAsRead(Number(selectedChatroom.id));
        // markAsReaded(chatroom.id);
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [markAsRead, markAsReaded, selectedChatroom.id]);

  const handleShowMembersList = () => {
    setIsShowMemberList(!isShowMemberList);
  };

  const getChatroomTitle = (): string => {
    if (selectedChatroom.room_type === "direct") {
      const otherMember = selectedChatroom.chat_room_members?.find(
        (member) => member.id !== currentUser?.id
      );
      return otherMember?.username || "Unknown User";
    }

    return `${selectedChatroom.room_name || "Unnamed Room"} (${
      selectedChatroom.members_count || 0
    }人)`;
  };

  return (
    <div className="flex flex-col rounded-none bg-base-100 w-full">
      <div className="flex items-center gap-2 p-4 border-b border-base-300 border-dashed">
        <div className="flex items-center gap-2 text-sm font-medium w-full">
          <div className="btn btn-square btn-danger" onClick={handleClose}>
            ←
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleShowMembersList}
          >
            <span className="text-xl flex gap-1">
              {getChatroomTitle()}
              <Image
                src={getChatroomIcon(selectedChatroom.chatroom_location_type)}
                alt="chatroom icon"
                width={20}
                height={20}
              />
            </span>
          </div>
        </div>
      </div>

      {isShowMemberList ? (
        <>
          {chatRoom?.members?.map((member) => (
            <Member
              key={member.id}
              member={member}
              setSelectedChatroom={setSelectedChatroom}
            />
          ))}
        </>
      ) : (
        <>
          <Messages
            chatroomId={selectedChatroom?.id}
            setSelectedChatroom={setSelectedChatroom}
          />
          <ChatInput
            chatroomId={selectedChatroom?.id}
            setSelectedChatroom={setSelectedChatroom}
          />
        </>
      )}
    </div>
  );
};

export default ChatShow;
