import React, { useEffect, useState, useContext } from "react";
import { ChatRoom } from "@/types/chatroom";
import { useChatroomDetail } from "@/hooks/useChatroomDetail";
import Image from "next/image";
import DefaultImage from "@/public/avatar_user.svg";
import { getChatroomIcon } from "@/utils/getChatroomIcon";
import { useChatRoomChannel } from "@/hooks/message";
import { BroadcastEvent } from "@/constants/chat-broadcast";
import { useChannelsStore } from "@/stores/channelsStore";
import { ActionCableContext } from "@/providers/ActionCableProvider";

interface ChatRoomDetailProps {
  chatroom: ChatRoom;
  onJoinSuccess: (updatedChatroom: ChatRoom) => void;
  onClose: () => void;
}

const ChatRoomDetail: React.FC<ChatRoomDetailProps> = ({
  chatroom,
  onJoinSuccess,
  onClose,
}) => {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const { handleJoinChatroom, isJoining, joinSuccess, joinedChatroom } =
    useChatroomDetail({
      chatroomId: chatroom.id,
    });

  const cable = useContext(ActionCableContext);
  const { setChannel, getChannel } = useChannelsStore();

  // Initialize channel for the chatroom
  const { perform } = useChatRoomChannel(chatroom.id);

  // Initialize ActionCable channel if not exists
  useEffect(() => {
    if (cable && !getChannel(chatroom.id)) {
      const chnl = cable.subscriptions.create(
        {
          channel: "ChatRoomChannel",
          room_id: chatroom.id,
        }
        // {
        //   connected: () => {
        //     console.log(`ChatRoomChannel connected for room ${chatroom.id}`);
        //   },
        //   disconnected: () => {
        //     console.log(`ChatRoomChannel disconnected for room ${chatroom.id}`);
        //   },
        //   received: (data: any) => {
        //     console.log("Received message data:", data);
        //   },
        // }
      );

      setChannel(chatroom.id, chnl);
    }
  }, [cable, chatroom.id, setChannel, getChannel]);

  // Handle join success
  useEffect(() => {
    if (joinSuccess && joinedChatroom) {
      const updatedChatroom = {
        ...chatroom,
        current_user_has_joined: true,
        members_count: joinedChatroom.members_count,
      };
      onJoinSuccess(updatedChatroom);

      if (welcomeMessage.trim()) {
        perform(BroadcastEvent.Message, {
          content: welcomeMessage,
        });
      }
    }
  }, [
    joinSuccess,
    joinedChatroom,
    chatroom,
    onJoinSuccess,
    welcomeMessage,
    perform,
  ]);

  const handleJoin = () => {
    if (welcomeMessage.trim() === "") return;
    handleJoinChatroom(chatroom.id, welcomeMessage);
  };

  return (
    <div className="flex flex-col rounded-none bg-base-100 w-full">
      <div className="flex items-center gap-2 p-4 border-b border-base-300 border-dashed">
        <div className="flex items-center gap-2 text-sm font-medium w-full">
          <div className="btn btn-square btn-danger" onClick={onClose}>
            ←
          </div>
          <Image
            src={DefaultImage}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl flex gap-1">
            {chatroom.room_name}（{chatroom.members_count}人）
            <Image
              src={getChatroomIcon(chatroom.chatroom_location_type)}
              alt="chatroom icon"
              width={20}
              height={20}
              className="inline-block"
            />
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <h2 className="mb-4 text-lg font-semibold">メンバー一覧</h2>
        {chatroom.members && chatroom.members.length > 0 ? (
          <ul className="space-y-1">
            {chatroom.members.map((member) => (
              <li
                key={member?.id}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 flex-shrink-0">
                  <Image
                    src={DefaultImage}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>

                {/* Name */}
                <span className="text-sm font-medium">{member.username}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            {chatroom.room_name}駅にはまだメンバーがいません
          </p>
        )}
      </div>

      <div className="border-t border-base-300">
        <div className="text-center px-4 mt-2">
          <p className="text-sm text-gray-600 mb-1">
            まだこのチャットルームに参加していません
          </p>
          <p className="text-xs text-gray-500 mb-2">
            参加時の最初のメッセージで自己紹介をしましょう！
            <br />
            {chatroom.room_name}
            駅での思い出や訪れる理由、お気に入りのスポットなどを教えてください。
            <br />
            他のメンバーとの会話のきっかけになります。
          </p>
        </div>

        <div className="px-4 pb-4">
          <textarea
            className="w-full textarea textarea-bordered max-w-none resize-none my-2"
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="例：はじめまして！この駅には〇〇の思い出があって... / よく〇〇で利用します..."
          />
          <div className="card-actions grid grid-cols-1">
            <button
              onClick={handleJoin}
              disabled={isJoining || welcomeMessage.trim() === ""}
              className="btn btn-danger"
            >
              {isJoining ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>参加中...</span>
                </div>
              ) : (
                "参加"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomDetail;
