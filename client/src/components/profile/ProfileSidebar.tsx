"use client";

import { ProfileTab, profileTabs } from "@/constants/tab";
import Icon from "../icon";
import { useRouter } from "next/navigation";

export const ProfileSidebar = () => {
  const router = useRouter();

  const handleChangeTab = (tab: ProfileTab) => {
    router.push(`/profile${tab.href}`);
  };
  return (
    <div className="col-span-2 shadow-md rounded-tr-2xl rounded-br-2xl h-screen">
      <ul className="menu rounded-box w-full gap-2">
        {profileTabs.map((tab) => (
          <div key={tab.href} onClick={() => handleChangeTab(tab)}>
            <li>
              <a>
                <Icon path={tab.icon} />
                {tab.label}
              </a>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};
