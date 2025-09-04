// src/stores/roomsStore.ts

import { create } from "zustand";
import { ChatRoom } from "@/types/chatroom";

interface ChatRoomsStore {
  chatRoomsData: ChatRoom[];
  isLoading: boolean;
  removeRoom: (roomId: string) => void;
  setChatRooms: (rooms: ChatRoom[]) => void;
  addChatRoom: (room: ChatRoom) => void;
  clearChatRooms: () => void;
  getRoomById: (roomId: string) => ChatRoom | undefined;
  setIsLoading: (isLoading: boolean) => void;
}

export const useChatRoomsStore = create<ChatRoomsStore>((set, get) => ({
  chatRoomsData: [],
  isLoading: false,

  removeRoom: (roomId: string) =>
    set((state) => ({
      chatRoomsData: state.chatRoomsData.filter((room) => room.id !== roomId),
    })),

  setChatRooms: (chatRoomsData: ChatRoom[]) => set(() => {
    return { chatRoomsData: chatRoomsData };
  }),

  addChatRoom: (room: ChatRoom) =>
    set((state) => ({
      chatRoomsData: [...state.chatRoomsData, room],
    })),

  getRoomById: (roomId: string) => {
    const { chatRoomsData } = get();
    return chatRoomsData.find((room) => room.id == roomId);
  },

  clearChatRooms: () => set({ chatRoomsData: [] }),

  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
