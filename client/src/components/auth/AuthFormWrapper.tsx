"use client";

import { useEffect } from "react";
import { Path, useForm } from "react-hook-form";
import { z, ZodTypeAny } from "zod";

// import useLinkVerifyCode from "@/hooks/verifycode/useLinkVerifyCode";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "../ui/form";

interface AuthFormWrapperProps<T extends ZodTypeAny> {
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (data: z.infer<T>) => void;
  mode: "signup" | "login";
  isLoading: boolean;
}

export function AuthFormWrapper<T extends ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  mode,
  isLoading,
}: AuthFormWrapperProps<T>) {
  // const { link: linkGetCode } = useLinkVerifyCode();

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { register, formState: { errors } } = form;

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <img style={{ transform: "rotate(15deg)" }} className="transition-transform duration-300 hover:rotate-12 mb-[-15px] w-[150px]" src="https://en.sun-asterisk.com/wp-content/themes/basetemplate/assets/images/sustainability/susti-sunbear.svg" alt="Sun bear" />
            <div className="scale-125 card bg-base-100 card-border border-base-300 card-sm overflow-hidden">
              <div className="border-base-300 border-b border-dashed">
                <div className="flex items-center gap-2 p-4">
                  <div className="grow">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 opacity-40">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"></path>
                      </svg>{mode === 'signup' ? 'Sun*タッチに会員登録' : 'Sun*タッチにログイン'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body gap-4 w-[300px]" >
                <div className="flex flex-col gap-1">
                  <label className="input input-border flex max-w-none items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"></path>
                    </svg>
                    <input type="text" className="grow" placeholder="ユーザー名" {...register("username" as Path<z.infer<T>>)}
                    />
                  </label>
                  {errors.username && (
                    <span className="text-base-content/60 flex items-center gap-2 px-1 text-[0.6875rem]">
                      <span className="status status-error inline-block"></span>{errors.username.message?.toString()}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="input input-border flex max-w-none items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                      <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd"></path>
                    </svg>
                    <input type="password" className="grow" placeholder="パスワード" {...register("password" as Path<z.infer<T>>)} />
                  </label>
                  {errors.password && (
                    <span className="text-base-content/60 flex items-center gap-2 px-1 text-[0.6875rem]">
                      <span className="status status-error inline-block"></span>{errors.password.message?.toString()}</span>
                  )}
                </div>
                {mode === "signup" && <div className="flex flex-col gap-1">
                  <label className="input input-border flex max-w-none items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                      <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd"></path>
                    </svg>
                    <input type="password" className="grow" placeholder="確認用のパスワード" {...register("confirmPassword" as Path<z.infer<T>>)}
                    />
                  </label>
                  {errors.confirmPassword && (
                    <span className="text-base-content/60 flex items-center gap-2 px-1 text-[0.6875rem]">
                      <span className="status status-error inline-block"></span>{errors.confirmPassword.message?.toString()}</span>
                  )}
                </div>}
                <div className="flex flex-col gap-1">
                  <label className="input input-border flex max-w-none items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                      <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd"></path>
                    </svg>
                    <input type="password" className="grow" placeholder="秘密キー" {...register("verify_code" as Path<z.infer<T>>)} />
                  </label>
                  {errors.verify_code && (
                    <span className="text-base-content/60 flex items-center gap-2 px-1 text-[0.6875rem]">
                      <span className="status status-error inline-block"></span>{errors.verify_code.message?.toString()}</span>
                  )}
                  <div className="mt-[15px] alert alert-dash max-sm:alert-vertical alert-warning text-xs font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"></path>
                    </svg>
                    <a className="link" target="_blank" href="https://sun-jp.slack.com/archives/C086NLDTABA/p1747201586961409">秘密キー確認</a>
                  </div>
                </div>
                <div className="card-actions items-center gap-6">
                  <button className="btn btn-primary" disabled={isLoading} type="submit">{mode === 'signup' ? '登録' : 'ログイン'}</button>
                  <a href={mode === 'signup' ? 'login' : 'signup'} className="link">{mode === 'signup' ? 'ログイン画面へ' : '会員登録画面へ'}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
