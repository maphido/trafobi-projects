"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { COUNTRIES } from "@/lib/constants";

interface ProfileData {
  id: string;
  email: string;
  fullName: string;
  institution: string | null;
  country: string | null;
  bio: string | null;
  experience: string | null;
  expertise: string[] | null;
  availableAsExpert: boolean;
}

export function ProfileForm({ user }: { user: ProfileData }) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "de" | "en";

  const [fullName, setFullName] = useState(user.fullName);
  const [institution, setInstitution] = useState(user.institution || "");
  const [country, setCountry] = useState(user.country || "");
  const [bio, setBio] = useState(user.bio || "");
  const [experience, setExperience] = useState(user.experience || "");
  const [expertiseText, setExpertiseText] = useState(
    (user.expertise || []).join(", ")
  );
  const [availableAsExpert, setAvailableAsExpert] = useState(
    user.availableAsExpert
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const expertise = expertiseText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          institution: institution || null,
          country: country || null,
          bio: bio || null,
          experience: experience || null,
          expertise,
          availableAsExpert,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setMessage({ type: "success", text: t("saved") });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : t("saveError"),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      <p className="mb-6 text-sm text-gray-500">{user.email}</p>

      {message && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
            {t("fullName")} *
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={100}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="institution"
              className="mb-1 block text-sm font-medium"
            >
              {t("institution")}
            </label>
            <input
              id="institution"
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              maxLength={200}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="mb-1 block text-sm font-medium"
            >
              {t("country")}
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">--</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c[locale]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="mb-1 block text-sm font-medium">
            {t("bio")}
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={5000}
            placeholder={t("bioHint")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="experience"
            className="mb-1 block text-sm font-medium"
          >
            {t("experience")}
          </label>
          <textarea
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows={3}
            maxLength={5000}
            placeholder={t("experienceHint")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="expertise"
            className="mb-1 block text-sm font-medium"
          >
            {t("expertise")}
          </label>
          <input
            id="expertise"
            type="text"
            value={expertiseText}
            onChange={(e) => setExpertiseText(e.target.value)}
            placeholder={t("expertiseHint")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {expertiseText && (
            <div className="mt-2 flex flex-wrap gap-1">
              {expertiseText
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
          <input
            id="availableAsExpert"
            type="checkbox"
            checked={availableAsExpert}
            onChange={(e) => setAvailableAsExpert(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div>
            <label
              htmlFor="availableAsExpert"
              className="block text-sm font-medium"
            >
              {t("availableAsExpert")}
            </label>
            <p className="mt-0.5 text-xs text-gray-500">
              {t("availableAsExpertHint")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !fullName.trim()}
          className="rounded-lg bg-gradient-to-r from-primary to-primary-dark px-6 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "..." : tCommon("save")}
        </button>
      </div>
    </div>
  );
}
