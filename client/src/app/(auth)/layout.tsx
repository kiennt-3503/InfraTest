"use client";

import { Loading } from "@/components/ui/loading";
import { useRedirectByAuth } from "@/hooks/useRedirect";
import { AuthLayout } from "@/layouts/AuthLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading } = useRedirectByAuth({
    when: "authenticated",
    redirectTo: "/",
  });

  if (isLoading) return <Loading />;

  return <AuthLayout>{children}</AuthLayout>;
}
