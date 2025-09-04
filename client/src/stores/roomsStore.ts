// src/stores/roomsStore.ts

import { create } from "zustand";
import { Message } from "@/types/message";
import { setRoomRead } from "@/utils/room-read-sync";

type RoomState = {
  messages: Message[];
  isTyping: boolean;
  isReaded: boolean;
};

type RoomsMap = Record<string, RoomState>;

interface RoomsStore {
  rooms: RoomsMap;
  addMessage: (roomId: string, message: Message, isReaded: boolean) => void;
  removeMessage: (roomId: string, messageId: string) => void;
  setMessages: (roomId: string, messages: Message[]) => void;
  clearMessages: (roomId: string) => void;
  setTyping: (roomId: string, isTyping: boolean) => void;
  markAsReaded: (roomId: string) => void;
  getLastMessage: (roomId: string) => Message | undefined;
  setRoomReaded: (roomId: string, isReaded: boolean) => void;
}

export const useRoomsStore = create<RoomsStore>((set, get) => ({
  rooms: {},
  addMessage: (roomId, message, isReaded) =>
    set((state) => {
      const prevRoom = state.rooms[roomId] || { messages: [], isTyping: false, isReaded: false };
      const updatedMessages = [...prevRoom.messages, message].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const output = {
        ...state.rooms,
        [roomId]: {
          ...prevRoom,
          messages: updatedMessages,
          isReaded,
        },
      };
      setRoomRead(roomId, isReaded);
      return { rooms: output };
    }),
  removeMessage: (roomId, messageId) =>
    set((state) => {
      const prevRoom = state.rooms[roomId];
      if (!prevRoom) return { rooms: state.rooms };
      const filteredMessages = prevRoom.messages.filter((msg) => String(msg.id) !== String(messageId));
      return {
        rooms: {
          ...state.rooms,
          [roomId]: {
            ...prevRoom,
            messages: filteredMessages,
          },
        },
      };
    }),
  setMessages: (roomId, messages) =>
    set((state) => ({
      rooms: {
        ...state.rooms,
        [roomId]: {
          messages: [...messages].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
          isTyping: false,
          isReaded: true,
        },
      },
    })),
  clearMessages: (roomId) =>
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [roomId]: _, ...rest } = state.rooms;
      return { rooms: rest };
    }),
  setTyping: (roomId, isTyping) =>
    set((state) => ({
      rooms: {
        ...state.rooms,
        [roomId]: {
          ...(state.rooms[roomId] || { messages: [], isReaded: true, isTyping: false }),
          isTyping,
        },
      },
    })),
  markAsReaded: (roomId) => {
    setRoomRead(roomId, true);
    return set((state) => ({
      rooms: {
        ...state.rooms,
        [roomId]: {
          ...(state.rooms[roomId] || { messages: [], isTyping: false, isReaded: false }),
          isReaded: true,
        },
      },
    }));
  },
  getLastMessage: (roomId: string) => {
    const room = get().rooms[roomId];
    return room && room.messages.length > 0 ? room.messages[room.messages.length - 1] : undefined;
  },
  setRoomReaded: (roomId, isReaded) => {
    setRoomRead(roomId, isReaded);
    return set((state) => ({
      rooms: {
        ...state.rooms,
        [roomId]: {
          ...(state.rooms[roomId] || { messages: [], isTyping: false, isReaded: true }),
          isReaded,
        },
      },
    }));
  },
}));
