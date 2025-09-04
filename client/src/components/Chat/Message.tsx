import React, { useState } from "react";
import TextAvatar from "../avatar/TextAvatar";
import { Message } from "@/types/message";
import { useAvatarSetting } from "@/hooks/useAvatarSetting";
import UserProfileModal from "../profile/UserProfileModal";
import { ChatRoom } from "@/types/chatroom";

export const ChatMessage = ({
  message,
  currentUserId,
  setSelectedChatroom,
}: {
  message: Message;
  currentUserId: number | undefined;
  setSelectedChatroom: (chatroom: ChatRoom) => void;
}) => {
  const isSender = message.sender.id === currentUserId;
  const senderAvatarSetting = useAvatarSetting(message.sender, false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isSender ? (
        <div className="one-chat chat chat-end">
          <div className="chat-header">{message.sender.username}</div>
          <div className="chat-bubble chat-bubble-neutral bg-success whitespace-pre-line">
            {message.content}
          </div>
        </div>
      ) : (
        <div className="one-chat chat chat-start">
          <div className="chat-image avatar">
            <div
              className="w-8 rounded-full cursor-pointer"
              onClick={handleOpenModal}
            >
              <TextAvatar
                avatarContent={senderAvatarSetting.avatarContent}
                backgroundColor={senderAvatarSetting.bgColor}
                textColor={senderAvatarSetting.textColor}
                fontSize={1.3}
              />
            </div>
          </div>
          <div className="chat-header">{message.sender.username}</div>
          <div className="chat-bubble chat-bubble-neutral whitespace-pre-line">
            {message.content}
          </div>
        </div>
      )}

      {isModalOpen && (
        <UserProfileModal
          isOpen={isModalOpen}
          memberId={message.sender.id}
          onClose={handleCloseModal}
          setSelectedChatroom={setSelectedChatroom}
        />
      )}
    </>
  );
};
