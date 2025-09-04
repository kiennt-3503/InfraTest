"use client";

import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { FormFieldWrapper } from "../form/FormFieldWrapper";
import { lang } from "@/assets/lang/ja";
import { GenderOption } from "@/constants/profile";
import Avatar from "../avatar/avatar";
import { useAuthStore } from "@/stores/authStore";
import useVerifyEmail from "@/hooks/useVerifyEmail";

interface ProfileFormWrapperProps<T extends ZodTypeAny> {
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (data: z.infer<T>) => void;
  isLoading: boolean;
}

export function ProfileFormWrapper<T extends ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  isLoading,
}: ProfileFormWrapperProps<T>) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const profileFrameRef = useRef<HTMLDivElement>(null);
  const { isLoadingVerify, handleLoginWithGoogle } = useVerifyEmail({});
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleCloseProfile = () => router.push("/");

  const handleSubmit = form.handleSubmit((data) => {
    if (profileFrameRef.current) {
      profileFrameRef.current.scrollTop = 0;
    }
    onSubmit(data);
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <div 
      ref={profileFrameRef}
      className="flex flex-col h-screen rounded-none bg-base-100 w-full relative overflow-y-auto"
    >
      <div className="flex items-center gap-2 p-4 border-b border-base-300 border-dashed">
        <div className="flex items-center gap-2 text-sm font-medium w-full">
          <span className="text-xl">
            {lang.profile.profileTabs.basicInfo.title}
          </span>
        </div>
        <X className="cursor-pointer" onClick={handleCloseProfile} />
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit}
          className="px-12 py-12 flex-1"
        >
          {/* Basic info form */}
          <div className="mb-6 -space-y-4">
            <Avatar />

            <div className="flex flex-row justify-between mb-10">
              <p>{lang.profile.info.username}</p>
              <p>{user?.username}</p>
            </div>

            <div className="flex justify-between w-full gap-2 items-center mb-10">
              <p className="whitespace-nowrap">{lang.profile.info.mail}</p>
              <div className="text-right break-all flex-grow">
                {user?.email ? (
                  <p className="text-right leading-tight break-words">
                    {user.email}
                  </p>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline btn-primary w-fit"
                    onClick={handleLoginWithGoogle}
                    disabled={isLoadingVerify}
                  >
                    {isLoadingVerify && (
                      <span className="loading loading-spinner mr-2" />
                    )}
                    メールアドレスを連携
                  </button>
                )}
              </div>
            </div>

            <FormFieldWrapper
              name="fullname"
              label={lang.profile.profileTabs.basicInfo.field.label.fullname}
              placeholder={lang.profile.profileTabs.basicInfo.field.placeholder.replace(
                "{field}",
                lang.profile.profileTabs.basicInfo.field.label.fullname
              )}
              isProfileForm={true}
            />

            <FormFieldWrapper
              name="fullnameKana"
              label={
                lang.profile.profileTabs.basicInfo.field.label.fullnameKana
              }
              placeholder={lang.profile.profileTabs.basicInfo.field.placeholder.replace(
                "{field}",
                lang.profile.profileTabs.basicInfo.field.label.fullnameKana
              )}
              isProfileForm={true}
            />

            <FormFieldWrapper
              name="phone"
              label={lang.profile.profileTabs.basicInfo.field.label.phone}
              placeholder={lang.profile.profileTabs.basicInfo.field.placeholder.replace(
                "{field}",
                lang.profile.profileTabs.basicInfo.field.label.phone
              )}
              isProfileForm={true}
              type="tel"
            />

            <FormFieldWrapper
              name="dateOfBirth"
              label={lang.profile.profileTabs.basicInfo.field.label.dateOfBirth}
              placeholder="YYYY"
              type="date"
              isProfileForm={true}
            />

            <FormFieldWrapper
              name="gender"
              label={lang.profile.profileTabs.basicInfo.field.label.gender}
              placeholder={lang.profile.profileTabs.basicInfo.field.placeholder.replace(
                "{field}",
                lang.profile.profileTabs.basicInfo.field.label.gender
              )}
              type="select"
              options={GenderOption}
              isProfileForm={true}
            />

            <FormFieldWrapper
              name="biography"
              label={lang.profile.profileTabs.basicInfo.field.label.biography}
              placeholder={lang.profile.profileTabs.basicInfo.field.placeholder.replace(
                "{field}",
                lang.profile.profileTabs.basicInfo.field.label.biography
              )}
              type="textarea"
              isProfileForm={true}
            />
          </div>

          {/* Button submit basic info */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn bg-[#1A77F2] text-white w-60 h-12"
            >
              {isLoading && <span className="loading loading-spinner"></span>}
              {lang.profile.profileTabs.saveButton}
            </button>
          </div>
        </form>
        {isLoading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50 pointer-events-none">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
      </FormProvider>
    </div>
  );
}
