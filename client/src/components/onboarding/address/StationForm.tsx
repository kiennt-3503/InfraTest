import React, { useEffect, useRef, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { lang } from "@/assets/lang/ja";
import { UseFormReturn } from "react-hook-form";
import { SubmitFirstAddressValues } from "@/hooks/useOnBoarding";
import { useGetLocation } from "@/hooks/useGetLocation";
import { MultiSelect } from "@/components/ui/multiselect";
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const StationForm = ({
  form,
}: {
  form: UseFormReturn<SubmitFirstAddressValues>;
}) => {
  const {
    setRegionId,
    setPrefectureId,
    setDistrictId,
    regionsQuery,
    prefecturesQuery,
    stationsQuery,
    regionId,
    prefectureId,
  } = useGetLocation(form);

  const regionDropdownRef = useRef<HTMLDivElement>(null);
  const prefDropdownRef = useRef<HTMLDivElement>(null);

  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isPrefDropdownOpen, setIsPrefDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownRefs = [regionDropdownRef, prefDropdownRef];

      let clickedOutsideAll = true;

      for (const ref of dropdownRefs) {
        if (ref.current && ref.current.contains(event.target as Node)) {
          clickedOutsideAll = false;
          break;
        }
      }

      if (clickedOutsideAll) {
        setIsRegionDropdownOpen(false);
        setIsPrefDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <FormField
        control={form.control}
        name="stationNameForm.stationRegion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {lang.popup.region}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div
                ref={regionDropdownRef}
                className="relative w-full max-w-lg ml-2"
              >
                <button
                  type="button"
                  className="btn w-full justify-between bg-base-100 text-base-content border border-base-300"
                  onClick={() => {
                    setIsRegionDropdownOpen((prev) => !prev);
                    setIsPrefDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">
                      {regionsQuery.data?.find(
                        (region) =>
                          region.id.toString() === field.value?.toString()
                      )?.region_name || "地域を選択"}
                    </span>

                    {field.value && (
                      <XCircle
                        className="w-4 h-4 ml-2 text-gray-400 hover:text-error cursor-pointer shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRegionId("");
                          setPrefectureId(undefined);
                          setDistrictId(undefined);
                          field.onChange("");
                          setIsRegionDropdownOpen(false);
                        }}
                      />
                    )}
                  </div>
                </button>

                {isRegionDropdownOpen && (
                  <ul className="absolute mt-2 z-[100] menu p-2 shadow bg-base-100 text-base-content rounded-box w-full border border-base-300">
                    <li>
                      <a
                        className="pointer-events-none text-base-content/40 cursor-not-allowed"
                        tabIndex={-1}
                      >
                        地域を選択
                      </a>
                    </li>
                    {regionsQuery.data?.map((region) => (
                      <li key={region.id}>
                        <a
                          onClick={() => {
                            setRegionId(region.id.toString());
                            setPrefectureId(undefined);
                            setDistrictId(undefined);
                            field.onChange(region.id.toString());
                            setIsRegionDropdownOpen(false);
                          }}
                        >
                          {region.region_name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="stationNameForm.stationPrefecture"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {lang.popup.prefecture}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div
                ref={prefDropdownRef}
                className="relative w-full max-w-lg ml-2"
              >
                <button
                  type="button"
                  className="btn w-full justify-between bg-base-100 text-base-content border border-base-300"
                  onClick={() => {
                    setIsPrefDropdownOpen((prev) => !prev);
                    setIsRegionDropdownOpen(false);
                  }}
                  disabled={!regionId}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={cn(
                        "truncate",
                        !regionId && "text-base-content/40"
                      )}
                    >
                      {prefecturesQuery.data?.find(
                        (pref) => pref.id.toString() === field.value?.toString()
                      )?.prefecture_name || "都道府県を選択"}
                    </span>

                    {field.value && (
                      <XCircle
                        className="w-4 h-4 ml-2 text-gray-400 hover:text-error cursor-pointer shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrefectureId("");
                          setDistrictId(undefined);
                          field.onChange("");
                          setIsPrefDropdownOpen(false);
                        }}
                      />
                    )}
                  </div>
                </button>

                {isPrefDropdownOpen && (
                  <ul className="absolute mt-2 z-[100] menu p-2 shadow bg-base-100 text-base-content rounded-box w-full border border-base-300">
                    <li>
                      <a
                        className="pointer-events-none text-base-content/40 cursor-not-allowed"
                        tabIndex={-1}
                      >
                        都道府県を選択
                      </a>
                    </li>
                    {prefecturesQuery.data?.map((pref) => (
                      <li key={pref.id}>
                        <a
                          onClick={() => {
                            setPrefectureId(pref.id.toString());
                            setDistrictId(undefined);
                            field.onChange(pref.id.toString());
                            setIsPrefDropdownOpen(false);
                          }}
                        >
                          {pref.prefecture_name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="stationNameForm.stationName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {lang.popup.station}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <MultiSelect
                options={(stationsQuery.data ?? []).map((station) => ({
                  label: station.station_name,
                  value: station.id.toString(),
                }))}
                className="w-full max-w-lg ml-2"
                onValueChange={field.onChange}
                value={field.value}
                placeholder="駅名を選択"
                maxCount={3}
                disabled={!prefectureId}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default StationForm;
