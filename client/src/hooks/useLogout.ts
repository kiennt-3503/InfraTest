"use client";

import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/useToast";
import { logout } from "@/apis/auth";

import { ROUTERS } from "@/constants/common";
import { ToastStatus } from "@/constants/toast";
import { lang } from "@/assets/lang/ja";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";

export const useLogout = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { showToast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: (token: string) => logout(token),
    onSuccess: () => {
      showToast(lang.logout.success, ToastStatus.SUCCESS);
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    clearAuth();
    localStorage.removeItem("token");
    router.replace(ROUTERS.LANDING);

    if (token) logoutMutation.mutate(token);
  };

  return {
    handleLogout,
  };
};
