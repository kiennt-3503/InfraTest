"use client";

import useVerifyEmail from "@/hooks/useVerifyEmail";

const EmailStep = ({ onComplete }: { onComplete: () => void }) => {
  const { isLoadingVerify, handleLoginWithGoogle, handleSkip } = useVerifyEmail({
    onComplete,
  });

  return (
    <div className="flex flex-col justify-between h-full px-6 py-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">メールアドレスを入力（任意）</h2>
        <p className="text-base-content/70 text-sm leading-relaxed">
          このシステムはプライバシーを尊重しており、個人のメールアドレスを提供する必要はありません。
          <br />
          ただし、パスワードを忘れた場合、メールアドレスを登録していないとアカウントを復旧する手段がありません。
          <br />
          個人のメールアドレスの共有に問題がない場合は、ぜひご提供ください。
          <br />※ メールアドレスの公開範囲は設定から変更可能です。
        </p>
        <button
          className="btn btn-outline btn-primary w-full"
          onClick={handleLoginWithGoogle}
          disabled={isLoadingVerify}
        >
          Googleでログイン
        </button>
      </div>
      <div className="mt-6 flex justify-between">
        <button className="btn btn-ghost" onClick={handleSkip}>
          スキップ
        </button>
      </div>
    </div>
  );
};

export default EmailStep;
