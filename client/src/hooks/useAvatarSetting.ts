import { useAuthStore } from "@/stores/authStore";
import { avatarParams } from "@/constants";
import { User } from "@/types/user";
import { Sender } from "@/types/message";

export const useAvatarSetting = (
  user?: User | Sender,
  useAuthenticatedUser: boolean = true,
) => {
  const { user: storeUser } = useAuthStore();
  const effectiveUser = useAuthenticatedUser ? storeUser : user;

  const avatarContent =
    effectiveUser?.profile?.avatarSettings?.avatarContent?.charAt(0)?.toUpperCase() ??
    effectiveUser?.username?.charAt(0)?.toUpperCase() ??
    avatarParams.defaultSetup.avatarContent.charAt(0).toUpperCase();

  const bgColor =
    effectiveUser?.profile?.avatarSettings?.bgColor ??
    avatarParams.defaultSetup.bgColor;

  const textColor =
    effectiveUser?.profile?.avatarSettings?.textColor ??
    avatarParams.defaultSetup.textColor;

  return { avatarContent, bgColor, textColor };
};
