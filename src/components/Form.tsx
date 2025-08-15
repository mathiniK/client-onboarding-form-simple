"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { onboardingSchema, type OnboardingFormData } from "@/lib/validation";
import { parseServicePrefills } from "@/lib/prefills";
import Input from "@/components/Input";
import DateInput from "@/components/DateInput";
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { Alert } from "@/components/Alert";

export default function Form() {
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successSummary, setSuccessSummary] =
    useState<OnboardingFormData | null>(null);

  const defaultServices = useMemo(
    () =>
      parseServicePrefills(new URLSearchParams(searchParams?.toString() ?? "")),
    [searchParams]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      services: defaultServices,
      budgetUsd: undefined,
      projectStartDate: new Date().toISOString().slice(0, 10),
      acceptTerms: false,
    },
  });

  // Keep query param prefills if params change
  useEffect(() => {
    if (defaultServices.length) setValue("services", defaultServices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultServices.join(",")]);

  const services = watch("services");

  async function onSubmit(data: OnboardingFormData) {
    setServerError(null);
    setSuccessSummary(null);

    try {
      const url = process.env.NEXT_PUBLIC_ONBOARD_URL;
      if (!url) throw new Error("Missing NEXT_PUBLIC_ONBOARD_URL");

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Request failed with ${res.status}`);

      setSuccessSummary(data);
    } catch {
      setServerError(
        "Could not submit your details at the moment. Please check your connection and try again."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && <Alert kind="error">{serverError}</Alert>}
      {successSummary && (
        <Alert kind="success">
          <div className="space-y-1">
            <div className="font-medium">Submitted successfully!</div>
            <div className="text-sm">
              <div>
                <strong>Name:</strong> {successSummary.fullName}
              </div>
              <div>
                <strong>Email:</strong> {successSummary.email}
              </div>
              <div>
                <strong>Company:</strong> {successSummary.companyName}
              </div>
              <div>
                <strong>Services:</strong> {successSummary.services.join(", ")}
              </div>
              {typeof successSummary.budgetUsd !== "undefined" && (
                <div>
                  <strong>Budget (USD):</strong> {successSummary.budgetUsd}
                </div>
              )}
              <div>
                <strong>Start Date:</strong> {successSummary.projectStartDate}
              </div>
            </div>
          </div>
        </Alert>
      )}

      <Input
        id="fullName"
        label="Full name"
        placeholder="Ada Lovelace"
        {...register("fullName")}
        error={errors.fullName?.message}
      />
      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="ada@example.com"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        id="companyName"
        label="Company name"
        placeholder="Analytical Engines Ltd"
        {...register("companyName")}
        error={errors.companyName?.message}
      />

      {/* Services as checkbox group */}
      <div>
        <CheckboxGroup
          id="services"
          legend="Services interested in"
          values={services}
          onChange={(next) =>
            setValue("services", next, { shouldValidate: true })
          }
          error={errors.services?.message}
        />
      </div>

      {/* Budget (optional integer) – normalize with setValueAs */}
      <Input
        id="budgetUsd"
        type="number"
        inputMode="numeric"
        step="1"
        label="Budget (USD) — optional"
        placeholder="50000"
        {...register("budgetUsd", {
          setValueAs: (v) => {
            // Handle "", null, and NaN -> undefined
            if (v === "" || v == null) return undefined;
            const n = typeof v === "string" ? Number(v) : v;
            return Number.isFinite(n) ? n : undefined;
          },
        })}
        error={errors.budgetUsd?.message}
      />

      <DateInput
        id="projectStartDate"
        label="Project start date"
        {...register("projectStartDate")}
        error={errors.projectStartDate?.message}
      />

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="checkbox"
            {...register("acceptTerms")}
          />
          <span>I accept the terms</span>
        </label>
        {errors.acceptTerms?.message && (
          <p className="error">{errors.acceptTerms.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="4"
            />
            <path
              d="M22 12a10 10 0 0 1-10 10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        )}
        {isSubmitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
