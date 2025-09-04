"use client";

import { Loading } from "@/components/ui/loading";
import {
  useProtectPageIfVerified,
  useRedirectByAuth,
} from "@/hooks/useRedirect";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isLoading: isLoadingAuth } = useRedirectByAuth({
    when: "unauthenticated",
    redirectTo: "/landing",
  });

  const isLoadingVerify = useProtectPageIfVerified();

  const isLoading = isLoadingAuth || isLoadingVerify;

  if (isLoading) return <Loading />;

  return children;
}
