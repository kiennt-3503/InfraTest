"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

const CompleteStep = () => {
  const router = useRouter();
  const { setVerified } = useAuthStore();

  return (
    <div className="flex flex-col justify-between h-full px-6 py-8 text-center">
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="text-5xl">🎉</div>
        <h2 className="text-3xl font-bold text-primary">
          設定が完了しました！
        </h2>
        <p className="text-base-content/80 text-base leading-relaxed font-medium">
          Sun*タッチの初期設定が完了しました。
          <br />
          これからは、地域や勤務先を通じてメンバーとつながることができます。
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="btn btn-primary"
          onClick={() => {
            setVerified();
            router.push("/");
          }}
        >
          ホームへ進む
        </button>
      </div>
    </div>
  );
};

export default CompleteStep;
