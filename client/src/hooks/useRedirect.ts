"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/authStore";

type UseRedirectByAuthOptions = {
  when: "authenticated" | "unauthenticated";
  redirectTo: string;
};

export const useRedirectByAuth = ({
  when,
  redirectTo,
}: UseRedirectByAuthOptions) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const isAuthenticated = !!user;

    const shouldRedirect =
      (when === "authenticated" && isAuthenticated) ||
      (when === "unauthenticated" && !isAuthenticated);

    const justLoggedOut = sessionStorage.getItem("logout");

    if (shouldRedirect && !justLoggedOut) {
      setHasRedirected(true);
      router.replace(redirectTo);
    }

    if (justLoggedOut) {
      sessionStorage.removeItem("logout");
    }

    setIsChecking(false);
  }, [user, isLoading, when, redirectTo, router]);

  return {
    isLoading: isLoading || isChecking,
    hasRedirected,
  };
};

export const useProtectPageIfUnVerified = (skip = false): boolean => {
  const router = useRouter();
  const { isVerify, isLoading, token } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (skip || isLoading) return;

    if (!token) {
      router.replace("/landing");
      return;
    }

    if (isVerify === false) {
      router.replace("/onboarding");
    } else {
      setChecking(false);
    }
  }, [isVerify, isLoading, router, skip, token]);

  return isLoading || checking;
};

export const useProtectPageIfVerified = (): boolean => {
  const router = useRouter();
  const { isVerify, isLoading } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (isVerify === true) {
      router.replace("/");
    } else {
      setChecking(false);
    }
  }, [isVerify, isLoading, router]);

  return isLoading || checking;
};
