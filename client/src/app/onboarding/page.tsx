"use client";

import { Fragment, useState } from "react";

import AddressStep from "@/components/onboarding/AddressStep";
import CompleteStep from "@/components/onboarding/CompleteStep";
import EmailStep from "@/components/onboarding/EmailStep";
import WelcomeStep from "@/components/onboarding/WelcomeStep";

const steps = [
  {
    label: "はじめに",
    value: "welcome",
  },
  {
    label: "メールアドレス（任意）",
    value: "email",
  },
  {
    label: "住所の入力",
    value: "address",
  },
  {
    label: "完了",
    value: "complete",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStepStep] = useState(0);

  const next = () => {
    if (currentStep < 3) setCurrentStepStep(currentStep + 1);
  };

  return (
    <div className="bg-root fixed inset-0 z-0 flex items-center justify-center">
      <div className="card grid w-full max-w-5xl grid-cols-3 overflow-hidden bg-white shadow-sm h-[70vh]">
        <div className="bg-card-left col-span-1 p-6 text-white">
          <h2 className="mb-4 text-xl font-bold">Sun*タッチ</h2>

          <ul className="steps steps-vertical">
            {steps.map((step, i) => (
              <Fragment key={step.value}>
                <li
                  data-content="✓"
                  className={`step ${i <= currentStep ? "step-accent" : ""}`}
                >
                  <div className="flex items-center justify-between whitespace-nowrap">
                    <span
                      className={`${
                        currentStep === i
                          ? "font-bold text-gray-300"
                          : "text-zinc-600"
                      }`}
                    >
                      {step.label}
                    </span>
                    {currentStep === i && (
                      <span className="text-gray-300 ml-30">→</span>
                    )}
                  </div>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
        <div className="col-span-2 bg-white p-10 h-[70vh]">
          {currentStep === 0 && <WelcomeStep onClick={next} />}
          {currentStep === 1 && <EmailStep onComplete={next} />}
          {currentStep === 2 && <AddressStep onComplete={next} />}
          {currentStep === 3 && <CompleteStep />}
        </div>
      </div>
    </div>
  );
}
