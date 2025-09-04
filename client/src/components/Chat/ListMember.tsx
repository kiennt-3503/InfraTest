"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getMembersOfChatRoom } from "@/apis/chat";
import { Button } from "../ui/button";
import { lang } from "@/assets/lang/ja";
import defaultAvatar from "@/public/avatar_user.svg";

const ListMember = ({ chatRoomId }: { chatRoomId: number }) => {
  const { data: members, isLoading } = useQuery({
    queryKey: ["chatRoomMembers", chatRoomId],
    queryFn: () => getMembersOfChatRoom(chatRoomId.toString()),
    enabled: !!chatRoomId,
  });

  if (isLoading) {
    return <div className="p-4 text-sm text-gray-400">読み込み中...</div>;
  }

  if (!members || members.length === 0) {
    return <div className="p-4 text-sm text-gray-400">メンバーがいません</div>;
  }

  return (
    <div className="flex-1 p-4 overflow-hidden">
      <ul className="flex flex-col gap-2 overflow-y-auto h-full">
        {members.map((username, index) => (
          <li key={index} className="flex items-center py-2">
            <div className="border relative w-8 h-8 rounded-full mr-2">
              <Image
                src={defaultAvatar}
                alt={username}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="flex-grow text-sm">{username}</span>
            <Button
              className="text-white text-xs font-semibold cursor-pointer"
              variant="default"
              size="sm"
            >
              {lang.chatroom.action.chat}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListMember;
