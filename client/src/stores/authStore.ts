import { create } from "zustand";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isVerify: boolean;
  isLoading: boolean;
  setAuth: (
    user: User,
    token: string,
    isVerify: boolean,
    callback?: () => void
  ) => void;
  setUserAvatarSettings: (
    avatarContent: string,
    bgColor: string,
    textColor: string
  ) => void;
  setVerified: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isVerify: false,
  isLoading: true,
  setAuth: (user, token, isVerify, callback) => {
    set({
      user,
      token,
      isVerify,
      isLoading: false,
    });
    if (callback) callback();
  },

  setUserAvatarSettings: (avatarContent, bgColor, textColor) => {
    set((state) => {
      if (!state.user) return {};
      return {
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            avatarSettings: {
              avatarContent,
              bgColor,
              textColor,
            },
          },
        },
      };
    });
  },

  setVerified: () => {
    set({ isVerify: true });
  },
  clearAuth: () => {
    set({
      user: null,
      token: null,
      isVerify: false,
      isLoading: false,
    });
  },
}));
