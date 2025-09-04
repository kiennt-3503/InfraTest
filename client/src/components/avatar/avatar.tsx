import { useState } from "react";
import { Edit } from "lucide-react";
import { useUpdateAvatar } from '@/hooks';
import AvatarModal from "./AvatarModal";
import TextAvatar from "./TextAvatar";
import { useAvatarSetting } from "@/hooks/useAvatarSetting";

export default function Avatar() {

  const { updateAvatar } = useUpdateAvatar();
  const [isModalOpen, setModalOpen] = useState(false);
  const { avatarContent, bgColor, textColor } = useAvatarSetting();

  const [avatarState, setAvatarState] = useState(() => ({
    avatarContent: avatarContent,
    bgColor: bgColor,
    textColor: textColor,
  }));

  const handleChange = (data: { avatarContent: string; bgColor: string; textColor: string }) => {
    setAvatarState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleCloseModal = () => {
    setAvatarState({
      avatarContent: avatarContent,
      bgColor: bgColor,
      textColor: textColor,
    });
    setModalOpen(false);
  };

  const handleSaveAvatarSettings = () => {
    updateAvatar(
      avatarState,
      {
        onSuccess: () => {
          setModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="mb-10 flex justify-center">
      <div className="relative w-28 h-28">
        {/* Avatar */}
        <div
          className="w-full h-full rounded-full ring-2 ring-green-500 ring-offset-2 ring-offset-base-100 overflow-hidden cursor-pointer hover:opacity-80 transition"
          onClick={() => setModalOpen(true)}
        >
          <TextAvatar
            avatarContent={avatarState.avatarContent}
            backgroundColor={avatarState.bgColor}
            textColor={avatarState.textColor}
            onClick={() => setModalOpen(true)}
          />
        </div>

        {/* Edit icon */}
        <div
          className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100"
          onClick={() => setModalOpen(true)}
        >
          <Edit className="h-5 w-5 border-[#E5E7EB]" />
        </div>
      </div>
      <AvatarModal
        isOpen={isModalOpen}
        avatarContent={avatarState.avatarContent}
        bgColor={avatarState.bgColor}
        textColor={avatarState.textColor}
        handleCloseModal={handleCloseModal}
        handleSaveAvatarSettings={handleSaveAvatarSettings}
        onChange={handleChange}
      />
    </div>
  );
}
