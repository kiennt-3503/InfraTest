import { useEffect, useRef, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/hooks/useToast";

import { ToastStatus } from "@/constants/toast";

import { verifyEmail } from "@/apis/emailVerify";

import { auth, googleProvider } from "@/lib/firebase";
import { useAuthStore } from "@/stores/authStore";

type UseVerifyEmailProps = {
  onComplete?: () => void;
};

const useVerifyEmail = ({ onComplete }: UseVerifyEmailProps) => {
  const { showToast } = useToast();
  const user = useAuthStore((s) => s.user);
  const hasCalledComplete = useRef(false);
  const [googleEmail, setGoogleEmail] = useState<string>("");
  const mutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      showToast("メールアドレスが確認されました", ToastStatus.SUCCESS);
      if (googleEmail && user) {
        useAuthStore.setState({
          user: {
            ...user,
            email: googleEmail,
          },
        });
      }
      onComplete?.();
    },
    onError: (error: Error) => {
      showToast(error.message, ToastStatus.ERROR);
    },
  });

  const loginWithGoogle = (id_token: string, email: string) => {
    if (!user || !user.username) {
      showToast("ユーザー名が見つかりません", ToastStatus.ERROR);
      return;
    }
    setGoogleEmail(email);
    mutation.mutate({ id_token, username: user.username });
  };

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const idToken = await result.user.getIdToken();
      const email = result.user.email || "";

      loginWithGoogle(idToken, email);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "auth/popup-closed-by-user"
      ) {
        return;
      }

      console.error("Google login failed:", error);
    }
  };

  const handleSkip = () => {
    onComplete?.();
  };

  useEffect(() => {
    if (user?.email && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onComplete?.();
    }
  }, [user, onComplete]);

  return {
    loginWithGoogle,
    isLoadingVerify: mutation.isPending,
    handleLoginWithGoogle,
    handleSkip,
  };
};

export default useVerifyEmail;
