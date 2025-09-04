"use client";

import { z } from "zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBasicInfo, updateBasicInfo } from "@/apis/profile";
import { useToast } from "./useToast";
import { ToastStatus } from "@/constants/toast";

export const profileSchema = z.object({
  fullname: z.string().optional(),
  fullnameKana: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.number().optional(),
  biography: z.string().optional(),
});

const useProfile = () => {
  const { showToast } = useToast();

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["basicInfomations"],
    queryFn: getBasicInfo,
  });

  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: updateBasicInfo,
    onSuccess: () => {
      showToast("プロフィールが正常に更新されました", ToastStatus.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["basicInfomations"] });
    },
    onError: (error: Error) => {
      showToast(error.message || "基本情報の更新失敗", ToastStatus.ERROR);
    },
  });

  const profileDefaultValues = {
    fullname: profileData?.fullname || "",
    fullnameKana: profileData?.fullname_kana || "",
    username: "",
    phone: profileData?.phone?.toString() || "",
    dateOfBirth: profileData?.birthday
      ? new Date(profileData.birthday)
      : undefined,
    gender: profileData?.gender ?? undefined,
    biography: profileData?.bio || "",
  };

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    const formattedValues = {
      profile: {
        fullname: values.fullname,
        fullname_kana: values.fullnameKana,
        phone: values.phone,
        bio: values.biography,
        gender: values.gender,
        birthday: values.dateOfBirth
          ? values.dateOfBirth.toISOString().split("T")[0]
          : undefined,
      },
    };

    updateProfileMutation.mutate(formattedValues);
  };

  return {
    isLoading: isLoadingProfile || updateProfileMutation.isPending,
    onSubmit,
    profileSchema,
    profileDefaultValues,
  };
};

export default useProfile;
