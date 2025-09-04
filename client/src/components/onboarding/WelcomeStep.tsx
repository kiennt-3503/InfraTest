import Logo from "../logo";

type WelcomeStepProps = {
  onClick: () => void;
};

const WelcomeStep = ({ onClick }: WelcomeStepProps) => {
  return (
    <div className="h-full overflow-auto px-6 py-8">
      <div className="flex flex-col justify-between">
        <div className="space-y-6 max-w-xl mx-auto text-center">
          <div className="flex justify-center">
            <Logo size="small" className="w-20 h-20" />
          </div>

          <h2 className="text-3xl font-bold text-primary">
            Sun*タッチへようこそ
          </h2>
          <p className="text-base-content/80 text-base leading-relaxed font-medium">
            Sun*タッチは、社内のメンバーと「住所」や「勤務地」を通じて
            気軽につながり、交流するための社内チャットアプリです。
          </p>

          <ul className="text-base-content/80 space-y-2 text-base leading-loose text-left list-disc list-inside mx-auto w-fit">
            <li>同じ地域の人と自動的にチャットルームでつながる</li>
            <li>匿名プロフィールで気軽にやりとり</li>
            <li>リモートでも、一体感を感じられる社内ネットワーク</li>
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="btn btn-accent" onClick={onClick}>
            次へ
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;
