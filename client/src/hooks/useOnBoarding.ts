import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { useToast } from "./useToast";
import { ToastStatus } from "@/constants/toast";
import { lang } from "@/assets/lang/ja";
import { useForm } from "react-hook-form";
import { createUserLocation } from "@/apis/address";
import { useAuthStore } from "@/stores/authStore";
import { ChatroomLocationType } from "@/constants/chatroom";

const defaultValues = {
  placeForm: {
    postCodeFirst: "",
    postCodeSecond: "",
    region: "",
    prefecture: "",
    section: "",
    district: "",
    town: "",
    streetAddress: "",
    isResident: false,
  },
  stationNameForm: {
    stationRegion: "",
    stationPrefecture: "",
    stationName: [],
  },
};

const placeFormSchema = z.object({
  postCodeFirst: z.string(),
  postCodeSecond: z.string(),
  region: z.string().min(1, { message: lang.popup.validation.region }),
  prefecture: z.string().min(1, { message: lang.popup.validation.prefecture }),
  section: z.string().min(1, { message: lang.popup.validation.section }),
  district: z.string().min(1, { message: lang.popup.validation.district }),
  town: z.string().optional(),
  streetAddress: z.string().optional(),
  isResident: z.boolean().optional(),
});

const stationNameFormSchema = z.object({
  stationPrefecture: z
    .string()
    .min(1, { message: lang.popup.validation.prefecture }),
  stationRegion: z.string().min(1, { message: lang.popup.validation.district }),
  stationName: z
    .array(z.string().min(1, { message: lang.popup.validation.station }))
    .min(1, { message: lang.popup.validation.station }),
});

const firstSetupSchema = z.object({
  placeForm: placeFormSchema.optional(),
  stationNameForm: stationNameFormSchema.optional(),
});

export type SubmitFirstAddressValues = z.infer<typeof firstSetupSchema>;

type UseSubmitFirstAddressProps = {
  onComplete: () => void;
};

export const useSubmitFirstAddress = ({
  onComplete,
}: UseSubmitFirstAddressProps) => {
  const { showToast } = useToast();
  const user = useAuthStore((s) => s.user);

  const firstSetupMutation = useMutation({
    mutationFn: createUserLocation,
    onSuccess: () => {
      showToast("セットアップ完了", ToastStatus.SUCCESS);
      onComplete?.();
    },
    onError: (error: Error) => {
      showToast(error.message, ToastStatus.ERROR);
    },
  });

  const onSubmit = (values: SubmitFirstAddressValues) => {
    const { stationNameForm } = values;

    const stationValid =
      stationNameForm &&
      stationNameFormSchema.safeParse(stationNameForm).success;

    // if (placeValid) {
    //   const payload = {
    //     address_line: placeForm.streetAddress,
    //     district_id: Number(placeForm.district),
    //     town_id: placeForm.town ? Number(placeForm.town) : undefined,
    //   };
    //   firstSetupMutation.mutate({
    //     user_location_type: "address",
    //     data: payload,
    //     is_live: true,
    //   });
    //   currentUserJoinChatRoomMutation.mutate();
    // } else

    if (!user?.id) {
      throw new Error("User ID is missing");
    }

    if (stationValid) {
      firstSetupMutation.mutate({
        user_id: user.id,
        location_type: ChatroomLocationType.Station,
        location_ids: stationNameForm.stationName.map((id) => Number(id)),
        is_live: true,
      });
    } else {
      showToast("入力内容が不十分です", ToastStatus.ERROR);
    }
  };

  const form = useForm<SubmitFirstAddressValues>({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return {
    isLoading: firstSetupMutation.isPending,
    firstSetupSchema,
    defaultValues,
    onSubmit,
    form,
  };
};
