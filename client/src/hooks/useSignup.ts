import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { signup } from "@/apis/auth";
import { useToast } from "./useToast";
import { useAuthStore } from "@/stores/authStore";

import { ToastStatus } from "@/constants/toast";
import { EMAIL_REGEX, VERIFY_CODE_REGEX } from "@/constants/regex";
import { ROUTERS } from "@/constants/common";
import { lang } from "@/assets/lang/ja";
import { snakeToCamel } from "@/utils/snake-to-camel";
import { User } from "@/types";

const requiredMessage = (field: string) =>
  `${field}${lang.signup.field.validate.required_field}`;

const defaultValues = {
  username: "",
  password: "",
  confirmPassword: "",
  mail: "",
  verify_code: "",
};

const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: requiredMessage(lang.signup.field.label.username) }),
    password: z
      .string()
      .min(1, { message: requiredMessage(lang.signup.field.label.password) })
      .refine((val) => val.length >= 10, {
        message: lang.signup.field.validate.password_too_short
      }),
    confirmPassword: z.string().min(1, {
      message: requiredMessage(lang.signup.field.label.confirmPassword),
    }),
    mail: z
      .string()
      .trim()
      .refine((val) => val === "" || EMAIL_REGEX.test(val), {
        message: lang.signup.field.validate.invalid_mail,
      })
      .optional(),
    verify_code: z
      .string()
      .min(1, {
        message: requiredMessage(lang.signup.field.label.verify_code),
      })
      .regex(VERIFY_CODE_REGEX, lang.signup.field.validate.invalid_verify_code),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: lang.signup.field.validate.password_not_match,
  });

export const useSignup = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  const registerMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      showToast("登録成功", ToastStatus.SUCCESS);
      setAuth(snakeToCamel(data.user) as User, data.token, data.is_verify);
      localStorage.setItem("token", data.token);
      router.push(ROUTERS.HOMEPAGE);
    },
    onError: (error: Error) => {
      showToast(error.message, ToastStatus.ERROR);
    },
  });

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    const { confirmPassword, mail, ...rest } = values;

    registerMutation.mutate({
      ...rest,
      password_confirmation: confirmPassword,
      email: mail || undefined,
    });
  };

  return {
    isLoading: registerMutation.isPending,
    signupSchema,
    defaultValues,
    onSubmit,
  };
};
