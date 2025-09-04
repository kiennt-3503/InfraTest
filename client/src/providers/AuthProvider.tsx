"use client";

import { ReactNode, useEffect } from "react";
import { verifyToken } from "@/apis/auth";
import { useAuthStore } from "@/stores/authStore";
import { snakeToCamel } from "@/utils/snake-to-camel";
import { User } from "@/types";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          clearAuth();
          return;
        }

        const res = await verifyToken();
        if (res?.user) {
          setAuth(snakeToCamel(res.user) as User, token, res.is_verify);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      }
    };

    run();
  }, [setAuth, clearAuth]);

  return <>{children}</>;
};
