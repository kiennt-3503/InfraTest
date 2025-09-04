"use client";

import { useClickOutside } from "@/hooks/useClickOutside";
import { useLogout } from "@/hooks/useLogout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAvatarSetting } from "@/hooks/useAvatarSetting";
import useToggle from "@/hooks/useToggle";
import TextAvatar from "@/components/avatar/TextAvatar";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { handleLogout } = useLogout();
  const [isMenuOpen, toggleMenu, , closeMenu] = useToggle(false);
  const { avatarContent, bgColor, textColor } = useAvatarSetting();

  const menuRef = useClickOutside(() => {
    closeMenu();
  });

   const handleClickProfileTab = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'profile');
    router.push(`${pathname}?${params.toString()}`);
    closeMenu();
  };

  return (
    <>
      <div
        id="avatar"
        className="cursor-pointer absolute top-5 left-5 z-50"
        onClick={toggleMenu}
      >
        <div
          className="w-10 h-10 rounded-full shadow-lg transition-transform duration-300 hover:rotate-12 ring-2 ring-green-500 ring-offset-2 ring-offset-base-100 cursor-pointer"
        >
          <TextAvatar
            avatarContent={avatarContent}
            backgroundColor={bgColor}
            textColor={textColor}
            fontSize={1.5}
          />
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="user_menu"
          ref={menuRef}
          className="absolute left-5 top-18 z-50"
        >
          <div className="card bg-base-100 card-border border-base-300">
            <ul className="menu w-full">
              <li
                // Todo: Fix this line to use the correct path "/"
                onClick={() => {
                  router.push("/rooms");
                  closeMenu();
                }}
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 opacity-30"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l8.25-7.5L19.5 12M4.5 10.5v9.75a.75.75 0 0 0 .75.75H9.75a.75.75 0 0 0 .75-.75V15a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75V10.5"
                    />
                  </svg>
                  マップ
                </span>
              </li>
              <li
                onClick={handleClickProfileTab}
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 opacity-30"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  プロフィール
                </span>
              </li>

              <li onClick={handleLogout}>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 opacity-30"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>
                  ログアウト
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
