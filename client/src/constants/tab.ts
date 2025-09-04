import { lang } from "@/assets/lang/ja";
import { home, address, hobby, setting } from "@/public";

export type ProfileTab = {
  label: string;
  href: string;
  icon: string;
};
export const tabs = [
  { label: "マップ", href: "/" },
  { label: "プロフィール", href: "/profile" },
];

export const profileTabs: ProfileTab[] = [
  {
    label: lang.profile.profileTabs.basicInfo.title,
    href: "/",
    icon: home,
  },
  {
    label: lang.profile.profileTabs.address,
    href: "/address",
    icon: address,
  },
  {
    label: lang.profile.profileTabs.hobby,
    href: "/hobby",
    icon: hobby,
  },
  {
    label: lang.profile.profileTabs.setting,
    href: "/setting",
    icon: setting,
  },
];
