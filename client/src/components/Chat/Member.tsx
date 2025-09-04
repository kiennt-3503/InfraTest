import { useState } from "react";
import Image from "next/image";
import DefaultImage from "@/public/avatar_user.svg";
import UserProfileModal from "../profile/UserProfileModal";
import { ChatRoom } from "@/types/chatroom";

type MemberProps = {
  member: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  setSelectedChatroom: (chatroom: ChatRoom) => void;
};

export const Member = ({ member, setSelectedChatroom }: MemberProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch profile using react-query
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <li
        key={member.id}
        className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={handleOpenModal} // Open modal on click
      >
        {/* Avatar */}
        <div className="w-10 h-10 flex-shrink-0">
          <Image
            src={member.avatarUrl || DefaultImage}
            alt={member.username}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        {/* Name */}
        <span className="text-sm font-medium">{member.username}</span>
      </li>

      {isModalOpen && (
        <UserProfileModal
          isOpen={isModalOpen}
          memberId={member.id}
          onClose={handleCloseModal}
          setSelectedChatroom={setSelectedChatroom}
        />
      )}
    </>
  );
};
