"use client";
import { useState } from "react";
import { MessagesProps } from "./Messages";
import { useChatRoomChannel } from "@/hooks/message";
import { BroadcastEvent } from "@/constants/chat-broadcast";

export const ChatInput = ({ chatroomId }: MessagesProps) => {
  const [message, setMessage] = useState("");
  const { perform } = useChatRoomChannel(chatroomId);

  const submitMessage = () => {
    if (message.trim() === "") return;
    perform(BroadcastEvent.Message, {
      content: message.trimEnd(),
      chat_room_id: chatroomId,
      message_type: "1",
    });

    setMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      // Allow multi-line input with Ctrl+Enter or Cmd+Enter
      e.preventDefault();
      submitMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 border-t border-base-300">
        <div className="card-body gap-4">
          <textarea
            className="w-full textarea textarea-border max-w-none resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力"
          />
          <div className="card-actions grid grid-cols-1">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={!message.trim()}
            >
              送信
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
