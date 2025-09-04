"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type TabType = {
  label: string;
  href: string;
};

export const TabNavigation = ({
  tab,
  index,
}: {
  tab: TabType;
  index: number;
}) => {
  const pathname = usePathname();
  const isActive = pathname !== "/" ? pathname === tab.href : index === 0;

  return (
    <Link
      role="tab"
      href={tab.href}
      prefetch={false}
      className={cn("tab", isActive && "tab-active")}
    >
      {tab.label}
    </Link>
  );
};
