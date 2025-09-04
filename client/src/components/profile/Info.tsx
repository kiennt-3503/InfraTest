"use client";

import { useState } from "react";
import { lang } from "@/assets/lang/ja";
import Avatar from "../avatar/avatar";
import useProfile from "@/hooks/useProfile";
import useVerifyEmail from "@/hooks/useVerifyEmail";
import { useAuthStore } from "@/stores/authStore";
import { queryClient } from "@/lib/queryClient";

export const Info = () => {
  const { profileDefaultValues } = useProfile();
  const user = useAuthStore((s) => s.user);
  const [isVerifying, setIsVerifying] = useState(false);

  const { isLoadingVerify, handleLoginWithGoogle } = useVerifyEmail({
    onComplete: async () => {
      setIsVerifying(true);
      await queryClient.invalidateQueries({ queryKey: ["verifyToken"] });
      setIsVerifying(false);
    },
  });

  return (
    <div className="col-span-3 shadow-md rounded-tr-2xl rounded-br-2xl h-screen">
      <div className="m-8 border rounded-2xl">
        <Avatar />
        <hr className="my-6 border-[#E5E7EB]" />
        <div className="flex flex-row justify-between mb-3 p-2">
          <p>{lang.profile.info.address}</p>
          <p>{user?.username}</p>
        </div>
        <hr className="my-6 border-[#E5E7EB]" />
        <div className="flex flex-col m-4">
          <div className="flex flex-row justify-between">
            <p>{lang.profile.info.name}</p>
            <p>{profileDefaultValues.fullname}</p>
          </div>
          <hr className="my-6 border-[#E5E7EB]" />
          <div className="flex justify-between w-full gap-2 items-center">
            <p className="whitespace-nowrap">{lang.profile.info.mail}</p>
            <div className="text-right break-all flex-grow">
              {user?.email ? (
                (() => {
                  const [username, domain] = user.email.split("@");
                  return (
                    <div className="text-right leading-tight break-words">
                      <p>{username}</p>
                      <p>@{domain}</p>
                    </div>
                  );
                })()
              ) : (
                <button
                  className="btn btn-outline btn-primary w-fit"
                  onClick={handleLoginWithGoogle}
                  disabled={isLoadingVerify}
                >
                  {(isLoadingVerify || isVerifying) && (
                    <span className="loading loading-spinner mr-2" />
                  )}
                  Googleでログイン
                </button>
              )}
            </div>
          </div>
          <hr className="my-6 border-[#E5E7EB]" />
          <div className="flex flex-row justify-between">
            <p>{lang.profile.info.phoneNumber}</p>
            <p>{profileDefaultValues.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
