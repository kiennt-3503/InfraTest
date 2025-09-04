"use client";

import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { Info } from "lucide-react";
import { lang } from "@/assets/lang/ja";
import StationForm from "@/components/onboarding/address/StationForm";
import { useSubmitFirstAddress } from "@/hooks/useOnBoarding";

const AddressStep = ({ onComplete }: { onComplete: () => void }) => {
  const { form, onSubmit, isLoading } = useSubmitFirstAddress({ onComplete });
  const [activeTab, setActiveTab] = useState<"place" | "station">("station");

  return (
    <div className="h-full overflow-auto">
      <div className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
        <Info className="w-4 h-4 mt-0.5" />
        {lang.popup.infoMessage}
      </div>

      <div role="tablist" className="tabs tabs-border mb-4">
        {/* <a
          role="tab"
          className={`tab ${activeTab === "place" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("place")}
        >
          {lang.popup.placeSection}
        </a> */}
        <a
          role="tab"
          className={`tab ${activeTab === "station" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("station")}
        >
          {lang.popup.stationSection}
        </a>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* {activeTab === "place" && <PlaceForm form={form} />} */}
          {activeTab === "station" && <StationForm form={form} />}

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="btn btn-neutral"
              disabled={isLoading}
            >
              {lang.popup.submit}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddressStep;
