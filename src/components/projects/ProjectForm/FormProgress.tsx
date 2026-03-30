"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface FormProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function FormProgress({ currentStep, onStepClick }: FormProgressProps) {
  const t = useTranslations("submit");

  const steps = [
    t("stepBasics"),
    t("stepStory"),
    t("stepResults"),
    t("stepLinks"),
  ];

  return (
    <div className="mb-8 flex items-center justify-between">
      {steps.map((label, i) => (
        <button
          key={i}
          onClick={() => onStepClick(i)}
          className={cn(
            "flex flex-col items-center gap-1",
            i <= currentStep ? "cursor-pointer" : "cursor-default opacity-50"
          )}
          disabled={i > currentStep + 1}
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
              i === currentStep
                ? "bg-primary text-white"
                : i < currentStep
                  ? "bg-accent text-white"
                  : "bg-gray-200 text-gray-500"
            )}
          >
            {i < currentStep ? "✓" : i + 1}
          </div>
          <span className="hidden text-xs sm:block">{label}</span>
        </button>
      ))}
    </div>
  );
}
