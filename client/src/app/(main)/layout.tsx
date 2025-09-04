"use client";

import { useEffect } from "react";

import { MainLayout } from "@/layouts/MainLayout";
import { useRoomsStore } from "@/stores/roomsStore";
import { ROOM_READ_KEY } from "@/utils/room-read-sync";
import { Loading } from "@/components/ui/loading";
import {
  useRedirectByAuth,
  useProtectPageIfUnVerified,
} from "@/hooks/useRedirect";
import { PushNotificationPrompt } from "@/components/prompt/PushNotificationPrompt";
import { useSyncChatRoomsStore } from "@/hooks/useSyncChatRoomsStore";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { setRoomReaded, rooms } = useRoomsStore();
  useSyncChatRoomsStore()

  const { isLoading: isLoadingAuth, hasRedirected } = useRedirectByAuth({
    when: "unauthenticated",
    redirectTo: "/landing",
  });

  const shouldSkipVerifyCheck = isLoadingAuth || hasRedirected;

  const isLoadingVerify = useProtectPageIfUnVerified(shouldSkipVerifyCheck);

  useEffect(() => {
    void import("@/utils/tab-manager");
  }, []);

  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key !== ROOM_READ_KEY || !e.newValue) return;

      const newState: Record<string, boolean> = JSON.parse(e.newValue);

      Object.entries(newState).forEach(([roomId, isRead]) => {
        const existing = rooms[roomId];
        if (existing?.isReaded !== isRead) {
          setRoomReaded(roomId, isRead);
        }
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorageChange);
      return () => window.removeEventListener("storage", onStorageChange);
    }
    return;
  }, [rooms, setRoomReaded]);

  if (isLoadingAuth || isLoadingVerify) {
    return <Loading />;
  }

  return (
    <MainLayout>
      {children}
      <PushNotificationPrompt
        publicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!}
      />
    </MainLayout>
  );
}
