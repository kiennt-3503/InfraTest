import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { login } from "@/apis/auth";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/stores/authStore";

import { ToastStatus } from "@/constants/toast";
import { ROUTERS } from "@/constants/common";
import { VERIFY_CODE_REGEX } from "@/constants/regex";
import { lang } from "@/assets/lang/ja";
import { snakeToCamel } from "@/utils/snake-to-camel";
import { User } from "@/types";

const requiredMessage = (field: string) =>
  `${field}${lang.signup.field.validate.required_field}`;

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: requiredMessage(lang.signup.field.label.username) }),
  password: z
    .string()
    .min(1, { message: requiredMessage(lang.signup.field.label.password) })
    .refine((val) => val.length >= 10, {
      message: lang.signup.field.validate.password_too_short
    }),
  verify_code: z
    .string()
    .regex(VERIFY_CODE_REGEX, lang.signup.field.validate.invalid_verify_code),
});

const loginDefaultValues = {
  username: "",
  password: "",
  verify_code: "",
};

const useLogin = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      showToast("ログイン成功", ToastStatus.SUCCESS);
      setAuth(snakeToCamel(data.user) as User, data.token, data.is_verify);
      localStorage.setItem("token", data.token);
      router.push(ROUTERS.HOMEPAGE);
    },
    onError: (error: Error) => {
      showToast(error.message || "ログイン失敗", ToastStatus.ERROR);
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  return {
    isLoading: loginMutation.isPending,
    onSubmit,
    loginSchema,
    loginDefaultValues,
  };
};

export default useLogin;
