
// src/stores/chatStore.ts

import { create } from "zustand";
import { Channel } from "@rails/actioncable";

type ChannelMap = Record<string, Channel>; // roomId → channel

interface ChannelsStore {
  channels: ChannelMap;
  setChannel: (roomId: string, channel: Channel) => void;
  getChannel: (roomId: string) => Channel;
  removeChannel: (roomId: string) => void;
}

export const useChannelsStore = create<ChannelsStore>((set, get) => ({
  channels: {},

  setChannel: (roomId: string, channel: Channel) => {
    set((state) => ({
      channels: { ...state.channels, [roomId]: channel },
    }));
  },

  getChannel: (roomId) => get().channels[roomId],

  removeChannel: (roomId) =>
    set((state) => {
      const { [roomId]: removeChannel, ...rest } = state.channels;
      removeChannel?.unsubscribe();
      return { channels: rest };
    }),
}));
