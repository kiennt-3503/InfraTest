import { useToast } from "@/hooks/useToast";
import { registerPush } from "@/utils";
import React, { useState } from "react";

interface Props {
  publicKey: string;
}

export const PushNotificationPrompt: React.FC<Props> = ({ publicKey }) => {
  const { showToast } = useToast();
  const [visible, setVisible] = useState(
    () => Notification.permission === "default"
  );

  const handleAgree = async () => {
    setVisible(false);
    await registerPush(publicKey, showToast);
  };

  const handleDecline = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-2">
          🔔 通知をオンにしませんか？
        </h2>
        <p className="text-gray-700 mb-4">
          大切なお知らせや最新情報を見逃さないように、通知をオンにすることをおすすめします。
          <br />
          ぜひ通知を許可して、最新の情報をいち早く受け取りましょう！
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            onClick={handleDecline}
          >
            拒否する
          </button>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleAgree}
          >
            許可する
          </button>
        </div>
      </div>
    </div>
  );
};
