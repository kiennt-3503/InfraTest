"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SustiImage from "../../../public/assets/images/susti-sunbear.svg";

export default function LandingPage() {
  useEffect(() => {
    const messages = Array.from(document.querySelectorAll(".one-chat"));
    const shownMessages: HTMLElement[] = [];
    let currentIndex = 0;
    const delay = 2000;

    function showEndMessage() {
      const chat = document.getElementById("animated_chat");
      const end = document.getElementById("end_description");
      if (!chat || !end) return;

      chat.classList.add("hidden");
      end.classList.remove("hidden");
      end.classList.add("animate-bounce");
      end.style.animationDuration = "0.5s";
      end.style.animationIterationCount = "0.5";
    }

    function showNextMessage() {
      if (currentIndex >= messages.length) {
        setTimeout(showEndMessage, 5000);
        return;
      }

      const msg = messages[currentIndex] as HTMLElement;
      msg.classList.remove("hidden");
      msg.classList.add("animate-bounce");
      msg.style.animationDuration = "0.1s";
      msg.style.animationIterationCount = "0.5";
      shownMessages.push(msg);

      for (let i = 0; i < shownMessages.length - 1; i++) {
        const m = shownMessages[i];
        if (i <= shownMessages.length - 6) {
          m.classList.add("hidden");
        } else {
          m.style.opacity = `${0.8 - (shownMessages.length - i) * 0.1}`;
          m.classList.remove("animate-bounce");
        }
      }

      currentIndex++;
      setTimeout(showNextMessage, delay);
    }

    const skipBtn = document.getElementById("skip_btn");
    skipBtn?.addEventListener("click", () => {
      showEndMessage();
    });

    showNextMessage();
  }, []);

  return (
    <div className="bg-base-100 min-h-screen">
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        id="animated_chat"
      >
        <div className="w-[500px]">
          {[
            [
              "chat-start",
              "くま",
              "最近ずっとフルリモートで働いてるから、会社の人とあまり関わりがなくて…ちょっと寂しいんだよね。",
            ],
            [
              "chat-end",
              "たっちゃん",
              "ああ、分かるよ。その気持ち。でも、Sun*の社員なら「Sun*タッチ」っていうサービス使ってみたらどう？",
            ],
            ["chat-start", "くま", "Sun*タッチ？それって何？"],
            [
              "chat-end",
              "たっちゃん",
              "Sun*社員専用のサービスで、自分の住んでる地域の近くにいる同僚を探して、気軽にチャットしたりできるんだよ。",
            ],
            [
              "chat-start",
              "くま",
              "えー、面白そう！でも…個人情報とか漏れたりしない？自分の居場所をあまり広く知られたくないな。。。",
            ],
            [
              "chat-end",
              "たっちゃん",
              "大丈夫だよ。完全匿名でも使えるし、チャットの内容もちゃんと暗号化されてるから、セキュリティもバッチリ。",
            ],
            [
              "chat-start",
              "くま",
              "そうなんだ！それなら安心だね。なんかワクワクしてきた！今すぐ使ってみたい！",
            ],
            ["chat-end", "たっちゃん", "5秒待って。。。"],
          ].map(([type, user, text], i) => (
            <div key={i} className={`hidden one-chat chat ${type}`}>
              <div className="chat-image avatar">
                <div
                  className={`w-8 rounded-full ${
                    type === "chat-end" ? "opacity-0" : ""
                  }`}
                >
                  <Image
                    src={SustiImage}
                    alt={user}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="chat-header">{user}</div>
              <div className="chat-bubble chat-bubble-neutral break-keep">
                {text}
              </div>
            </div>
          ))}
        </div>
        <button id="skip_btn" className="btn btn-outline btn-sm mt-6 mx-auto">
          スキップ
        </button>
      </div>

      <div
        id="end_description"
        className="hidden flex items-center justify-center min-h-screen"
      >
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={SustiImage}
            alt="Sun* Bear"
            width={150}
            height={150}
            style={{ transform: "rotate(15deg)" }}
            className="transition-transform duration-300 hover:rotate-12 mb-[-55px]"
          />
          <div className="card bg-base-100 card-border border-base-300 from-base-content/5 bg-linear-to-bl to-50%">
            <div className="card-body gap-4 text-xl">
              <div className="flex items-center gap-2 pb-2">
                <span className="text-alert">●</span>{" "}
                フルリモートで全然出社してないけど、社内の人ともっと仲良くなりたい
              </div>
              <div className="flex items-center gap-2 pb-2">
                <span className="text-alert">●</span>{" "}
                近くに住んでるSun*メンバーで、気が合いそうな人っているのかな？
              </div>
              <div className="font-bold divider">なら、SUN*タッチ</div>
              <div className="flex items-center gap-2 pb-2">
                <span className="text-success">●</span>{" "}
                同じ最寄り駅や市区町村に住んでるSun*メンバーとチャットで交流できる
              </div>
              <div className="flex items-center gap-2 pb-2">
                <span className="text-success">●</span> Sun*メンバー限定、
                <span className="text-xl font-bold">完全匿名</span>
                で利用できて安心
              </div>
              <Link href="signup" className="btn btn-accent text-xl">
                登録
              </Link>

              <Link href="login" className="btn text-xl">
                アカウトを持っている
              </Link>
              <div className="flex justify-center">
                <Link href="/" className="link">
                  もう1回説明を見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
