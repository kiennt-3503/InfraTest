import Image from "next/image";
import DefaultImage from "@/public/avatar_user.svg";
import { ChatRoom } from "@/types/chatroom";
// import { useRoomsStore } from "@/stores/roomsStore";
import { getChatroomIcon } from "@/utils/getChatroomIcon";
import { useAuthStore } from "@/stores/authStore";
import TextAvatar from "../avatar/TextAvatar";
import { useAvatarSetting } from "@/hooks/useAvatarSetting";

interface ChatItemProps {
  chat: ChatRoom;
  selectedChat?: ChatRoom | null;
  handleSelectChatroom: (chat: ChatRoom) => void;
}

export default function ChatItem({
  chat,
  handleSelectChatroom,
}: ChatItemProps) {
  // const room = useRoomsStore((state) => state.rooms[chat.id]);
  // const [isReaded, setIsReaded] = useState<boolean>(room?.isReaded || true);
  // const [lastMessage, setLastMessage] = useState<string>(() => {
  //   const lastMessageObj =
  //     room?.messages && room.messages.length > 0
  //       ? room.messages[room.messages.length - 1]
  //       : chat.last_message;
  //   return typeof lastMessageObj === "string"
  //     ? lastMessageObj
  //     : lastMessageObj?.content || "メッセージはありません";
  // });

  // useEffect(() => {
  //   if (!room) return;

  //   setIsReaded(room.isReaded);
  //   const lastMessageObj =
  //     room.messages && room.messages.length > 0
  //       ? room.messages[room.messages.length - 1]
  //       : chat.last_message;
  //   setLastMessage(
  //     typeof lastMessageObj === "string"
  //       ? lastMessageObj
  //       : lastMessageObj?.content || "メッセージはありません"
  //   );
  // }, [room, chat]);
  const { user: currentUser } = useAuthStore();

  const otherMember = (chat.chat_room_members ?? []).find(
    (member) => member.id !== currentUser?.id
  );

  const getChatroomTitle = (): string => {
    if (chat.room_type === "direct") {
      return otherMember?.username || "Unknown User";
    }

    return `${chat.room_name || "Unnamed Room"} (${chat.members_count || 0}人)`;
  };

  const senderAvatarSetting = useAvatarSetting(
    otherMember
      ? {
          id: otherMember.id,
          username: otherMember.username,
        }
      : undefined,
    false
  );

  const getAvatarOfChatItem = () => {
    if (chat.room_type === "direct") {
      return (
        <TextAvatar
          avatarContent={senderAvatarSetting.avatarContent}
          backgroundColor={senderAvatarSetting.bgColor}
          textColor={senderAvatarSetting.textColor}
          fontSize={1.3}
        />
      );
    } else {
      return (
        <Image
          src={DefaultImage}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
      );
    }
  };

  return (
    <div
      key={chat?.id}
      onClick={() => handleSelectChatroom(chat)}
      className="cursor-pointer flex justify-between items-center min-w-full border-2 timeline-box transition-transform duration-300 ease-in-out hover:scale-105 rounded-lg border-base-300"
    >
      <div className="flex items-center gap-2">
        <div className="relative avatar">
          <div className="w-8 rounded-full">{getAvatarOfChatItem()}</div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold flex items-center gap-1">
            {getChatroomTitle()}
            {chat.chatroom_location_type !== "User" && (
              <Image
                src={getChatroomIcon(chat.chatroom_location_type)}
                alt="chatroom icon"
                width={16}
                height={16}
              />
            )}
          </span>
          <div
            className={`break-normal break-words ${
              (chat?.unread_messages_count ?? 0) > 0 ? "font-bold" : ""
            }`}
          >
            {chat.last_message?.content || "メッセージはありません"}
          </div>
        </div>
      </div>

      {chat.unread_messages_count != 0 && (
        <div className="badge badge-sm badge-neutral">
          {chat.unread_messages_count}
        </div>
      )}
    </div>
  );
}
