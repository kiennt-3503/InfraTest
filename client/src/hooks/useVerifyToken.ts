import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { verifyToken } from "@/apis/auth";
import { User } from "@/types";
import { snakeToCamel } from "@/utils/snake-to-camel";

export const useVerifyToken = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["verifyToken", token],
    queryFn: () => verifyToken(),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setAuth(snakeToCamel(data.user) as User, token!, data.is_verify);
    }
  }, [data, setAuth, token]);

  useEffect(() => {
    if (isError) {
      clearAuth();
      localStorage.removeItem("token");
    }
  }, [isError, clearAuth]);

  return {
    isLoading,
    user: data?.user ?? null,
    isVerify: data?.is_verify,
  };
};
