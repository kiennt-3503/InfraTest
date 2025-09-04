import React from 'react';
import ColorInput from './ColorInput';
import TextAvatar from './TextAvatar';
import AvatarModalButton from './AvatarModalButton';

type AvatarModalProps = {
  isOpen: boolean;
  avatarContent: string;
  bgColor: string;
  textColor: string;
  handleCloseModal: () => void;
  handleSaveAvatarSettings: () => void;
  onChange: (data: { avatarContent: string; bgColor: string; textColor: string }) => void;
};

const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  avatarContent,
  bgColor,
  textColor,
  handleCloseModal,
  handleSaveAvatarSettings,
  onChange,
}) => {
  const handleColorChange = (color: string, type: 'bgColor' | 'textColor') => {
    if (type === 'bgColor') {
      onChange({ avatarContent, bgColor: color, textColor });
    } else {
      onChange({ avatarContent, bgColor, textColor: color });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 space-y-4 w-80 shadow-lg flex w-auto gap-6">
        <div className="relative w-28 h-28 m-4">
          <div
            className="w-full h-full rounded-full ring-2 ring-green-500 ring-offset-2 ring-offset-base-100 overflow-hidden cursor-pointer hover:opacity-80 transition"
          >
            <TextAvatar
              avatarContent={avatarContent}
              backgroundColor={bgColor}
              textColor={textColor}
            />
          </div>
        </div>
        <div className='px-6 pt-4 w-[360px] h-[330px]'>
          <h2 className="text-lg font-semibold text-[#7b1e1e] mb-4">アバターをカスタマイズ</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-[#7b1e1e] mb-1">テキスト:</label>
              <input
                type="text"
                maxLength={1}
                value={avatarContent}
                onChange={(e) => onChange({ avatarContent: e.target.value, bgColor, textColor })}
                className="w-full border p-2 rounded"
              />
            </div>
            {/* Validation message */}
            {avatarContent.trim().length === 0 && (
              <div className="text-red-500 text-xs mt-1">テキストを入力してください。</div>
            )}

            <ColorInput
              label="背景色"
              value={bgColor}
              handleColorChange={(color) => handleColorChange(color, 'bgColor')}
            />

            <ColorInput
              label="テキストカラー"
              value={textColor}
              handleColorChange={(color) => handleColorChange(color, 'textColor')}
            />
          </div>

          <div className="flex justify-between space-x-2 mt-6">
            <div className="mt-6 flex justify-start space-x-4">
              <AvatarModalButton
                label="保存"
                color="bg-yellow-400"
                hoverColor="bg-yellow-500"
                onClick={avatarContent.trim().length === 0 ? () => {} : handleSaveAvatarSettings}
                disabled={avatarContent.trim().length === 0}
                isPreventDefault
                isStopPropagation
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <AvatarModalButton
                label="閉じる"
                color="bg-gray-100"
                hoverColor="bg-[#7b1e1e]"
                onClick={handleCloseModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
