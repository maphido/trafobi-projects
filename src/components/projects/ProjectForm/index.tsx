"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useProjectForm } from "@/hooks/useProjectForm";
import { FormProgress } from "./FormProgress";
import { StepAboutYou } from "./StepAboutYou";
import { StepBasics } from "./StepBasics";
import { StepStory } from "./StepStory";
import { StepResults } from "./StepResults";
import { StepLinks } from "./StepLinks";

export function ProjectForm() {
  const t = useTranslations("submit");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const {
    data,
    step,
    saving,
    submitting,
    error,
    setField,
    nextStep,
    prevStep,
    saveDraft,
    submitForReview,
    dispatch,
  } = useProjectForm();

  async function handleSubmit() {
    const success = await submitForReview();
    if (success) {
      router.push("/dashboard");
    }
  }

  const steps = [
    <StepAboutYou key={0} data={data} setField={setField} />,
    <StepBasics key={1} data={data} setField={setField} />,
    <StepStory key={2} data={data} setField={setField} />,
    <StepResults key={3} data={data} setField={setField} />,
    <StepLinks
      key={4}
      data={data}
      onAddLink={() => dispatch({ type: "ADD_LINK" })}
      onRemoveLink={(index: number) => dispatch({ type: "REMOVE_LINK", index })}
      onUpdateLink={(index: number, field: "url" | "label", value: string) =>
        dispatch({ type: "UPDATE_LINK", index, field, value })
      }
    />,
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      <FormProgress
        currentStep={step}
        onStepClick={(s) => dispatch({ type: "SET_STEP", step: s })}
      />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {steps[step]}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:invisible"
        >
          {tCommon("back")}
        </button>

        <div className="flex gap-2">
          <button
            onClick={saveDraft}
            disabled={saving}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {saving ? "..." : t("saveDraft")}
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {tCommon("next")}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !data.title}
              className="rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "..." : t("submitReview")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
