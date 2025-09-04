import { useAvatarSetting } from "@/hooks/useAvatarSetting";
import React from "react";
import TextAvatar from "../avatar/TextAvatar";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { createChatroomOnetoOne } from "@/apis/chatroom";
import { ChatRoom } from "@/types/chatroom";
import { useQuery } from "@tanstack/react-query";
import { getMemberProfile } from "@/apis/profile";

type Props = {
  isOpen: boolean;
  memberId: number | null;
  onClose: () => void;
  setSelectedChatroom: (chatroom: ChatRoom) => void;
};

export default function UserProfileModal({
  isOpen,
  memberId,
  onClose,
  setSelectedChatroom,
}: Props) {
  // Hooks must be called unconditionally
  const { user: currentUser } = useAuthStore();
  const router = useRouter();

  // Use a fallback value for `memberId` when it's null
  const { data: profile } = useQuery({
    queryKey: ["memberProfile", memberId],
    queryFn: () =>
      memberId !== null
        ? getMemberProfile(memberId)
        : Promise.reject("Invalid memberId"),
    enabled: isOpen && memberId !== null, // Only fetch when modal is open and memberId is valid
  });

  // Use a fallback for `profile` when it's undefined
  const senderAvatarSetting = useAvatarSetting(
    profile
      ? {
          id: 0, // Replace with an actual numeric id if available
          username: profile.username || "N/A",
        }
      : undefined,
    false
  );

  const handleCreateChatroom = async () => {
    try {
      if (currentUser?.id) {
        const chatroom = await createChatroomOnetoOne(
          currentUser.id,
          profile?.id ? parseInt(profile.id, 10) : 0
        );

        setSelectedChatroom(chatroom);

        if (chatroom?.id) {
          if (typeof window !== "undefined") {
            router.replace(`/rooms/${chatroom.id}`);
          }
        } else {
          alert("チャットルームの作成に失敗しました");
        }
      } else {
        alert("現在のユーザー情報が見つかりません");
      }
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました");
    } finally {
      onClose();
    }
  };

  // Return null if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative flex flex-col items-center justify-center">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="w-20 h-20 rounded-full cursor-pointer mb-4">
          <TextAvatar
            avatarContent={senderAvatarSetting.avatarContent}
            backgroundColor={senderAvatarSetting.bgColor}
            textColor={senderAvatarSetting.textColor}
            fontSize={3}
          />
        </div>

        <div className="flex flex-col gap-3 text-center text-lg">
          {[
            { label: "username", value: profile?.username },
            { label: "fullname", value: profile?.fullname },
            { label: "bio", value: profile?.bio },
            { label: "MBTI", value: profile?.mbti },
          ]
            .filter((item) => item.value) // Only include items with a value
            .map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[100px_1fr] gap-2 items-center justify-items-start"
              >
                <div className="badge badge-accent">{item.label}</div>
                <div className="text-left">{item.value}</div>
              </div>
            ))}
        </div>

        <div className="modal-action">
          {memberId != currentUser?.id && (
            <button className="btn" onClick={handleCreateChatroom}>
              チャットする
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
