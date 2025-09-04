// src/providers/ActionCableProvider.ts

"use client";

import { createContext, useEffect, useState } from "react";
import { Cable, createConsumer } from "@rails/actioncable";
import { extractHostPort } from "@/utils";
import { useAuthStore } from "@/stores/authStore";

const ActionCableContext = createContext<Cable | null>(null);

const ActionCableProvider = ({ children }: { children: React.ReactNode }) => {
  const [cable, setCable] = useState<Cable | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const hostWithPort = extractHostPort(API_URL || "");

    if (!token) {
      return;
    }

    const protocol = API_URL?.startsWith("https") ? "wss" : "ws";
    const baseUrl = `${protocol}://${hostWithPort}/cable`;

    if (!baseUrl) {
      console.error("NEXT_PUBLIC_API_URL is not defined!");
      return;
    }

    if (typeof window !== "undefined" && !cable) {
      const url = `${baseUrl}?token=${encodeURIComponent(token)}`;
      setCable(createConsumer(url));
    }
  }, [cable, token]);

  return (
    <ActionCableContext.Provider value={cable}>
      {children}
    </ActionCableContext.Provider>
  );
};

export { ActionCableContext, ActionCableProvider };
