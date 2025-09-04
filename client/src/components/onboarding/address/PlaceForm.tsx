import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { lang } from "@/assets/lang/ja";
import { useGetLocation } from "@/hooks/useGetLocation";
import { UseFormReturn } from "react-hook-form";
import { SubmitFirstAddressValues } from "@/hooks/useOnBoarding";

const PlaceForm = ({
  form,
}: {
  form: UseFormReturn<SubmitFirstAddressValues>;
}) => {
  const {
    setRegionId,
    setPrefectureId,
    setDistrictId,
    setSectionId,
    regionsQuery,
    prefecturesQuery,
    sectionsQuery,
    districtsQuery,
    townsQuery,
    regionId,
    prefectureId,
    sectionId,
    districtId,
  } = useGetLocation(form);

  return (
    <>
      <FormLabel>{lang.popup.postalCode}</FormLabel>
      <div className="flex items-center gap-1 ml-2">
        <FormField
          control={form.control}
          name="placeForm.postCodeFirst"
          render={({ field }) => (
            <FormItem className="w-20">
              <FormControl>
                <Input placeholder="000" maxLength={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="text-muted-foreground">-</span>
        <FormField
          control={form.control}
          name="placeForm.postCodeSecond"
          render={({ field }) => (
            <FormItem className="w-24">
              <FormControl>
                <Input placeholder="0000" maxLength={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="placeForm.region"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {lang.popup.region}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <select
                className="select select-bordered w-full max-w-xs ml-2"
                value={field.value || ""}
                onChange={(e) => {
                  const selected = e.target.value;
                  setRegionId(selected);
                  setPrefectureId(undefined);
                  setDistrictId(undefined);
                  field.onChange(selected);
                }}
              >
                <option value="">地域を選択</option>
                {regionsQuery.data?.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.region_name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="placeForm.prefecture"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {lang.popup.prefecture}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <select
                className="select select-bordered w-full max-w-xs ml-2"
                value={field.value ?? ""}
                onChange={(e) => {
                  const selected = e.target.value;
                  setPrefectureId(selected);
                  setDistrictId(undefined);
                  field.onChange(selected);
                }}
                disabled={!regionId}
              >
                <option value="" disabled>
                  {prefecturesQuery.isLoading
                    ? "読み込み中..."
                    : "都道府県を選択"}
                </option>
                {(prefecturesQuery || []).data?.map((pref) => (
                  <option key={pref.id} value={pref.id}>
                    {pref.prefecture_name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="placeForm.section"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {lang.popup.section}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <select
                className="select select-bordered w-full max-w-xs ml-2"
                value={field.value || ""}
                onChange={(e) => {
                  const selected = e.target.value;
                  setSectionId(selected);
                  setDistrictId(undefined);
                  field.onChange(selected);
                }}
                disabled={!prefectureId}
              >
                <option value="" disabled>
                  {sectionsQuery.isLoading ? "読み込み中..." : "区画を選択"}
                </option>
                {sectionsQuery.data?.map((pref) => (
                  <option key={pref.id} value={pref.id}>
                    {pref.section_name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="placeForm.district"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {lang.popup.district}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <select
                className="select select-bordered w-full max-w-xs ml-2"
                value={field.value || ""}
                onChange={(e) => {
                  const selected = e.target.value;
                  setDistrictId(selected);
                  field.onChange(selected);
                }}
                disabled={!sectionId}
              >
                <option value="" disabled>
                  {districtsQuery.isLoading ? "読み込み中..." : "区を選択"}
                </option>
                {districtsQuery.data?.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.district_name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="placeForm.town"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{lang.popup.town}</FormLabel>
            <FormControl>
              <select
                className="select select-bordered w-full max-w-xs ml-2"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                disabled={!districtId}
              >
                <option value="" disabled>
                  {townsQuery.isLoading ? "読み込み中..." : "町を選択"}
                </option>
                {townsQuery.data?.map((town) => (
                  <option key={town.id} value={town.id}>
                    {town.town_name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="placeForm.streetAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{lang.popup.streetAddress}</FormLabel>
            <FormControl>
              <Input
                className="w-full max-w-xs ml-2"
                placeholder="1-1-1"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PlaceForm;
