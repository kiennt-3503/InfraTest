"use client";

import { useMutation } from "@tanstack/react-query";
import { updateBasicInfo } from "@/apis/profile";
import { BasicInfoResponse } from "@/types/profile";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/useToast";
import { ToastStatus } from "@/constants/toast";
import { messages } from "@/constants";

export const useUpdateAvatar = () => {
  const { setUserAvatarSettings } = useAuthStore();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: ({
      avatarContent,
      bgColor,
      textColor,
    }: { avatarContent: string; bgColor: string; textColor: string }) =>
      updateBasicInfo({
        profile: {
          avatar_settings: {
            avatar_content: avatarContent,
            bg_color: bgColor,
            text_color: textColor,
          },
        },
      }),
    onSuccess: (data: BasicInfoResponse) => {
      const { avatar_content, bg_color, text_color } = data.avatar_settings || {};
      setUserAvatarSettings(
        avatar_content || "",
        bg_color || "",
        text_color || ""
      );
      showToast(messages.avatar.updateSuccess, ToastStatus.SUCCESS);
    },
    onError: () => {
      showToast(messages.avatar.updateError, ToastStatus.ERROR);
    },
  });

  return {
    updateAvatar: mutation.mutate,
  }
};
