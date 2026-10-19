"use client";

import Image from "next/image";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import Checkbox from "@/app/components/elements/form/Checkbox";
import FormButton from "@/app/components/elements/form/FormButton";
import RadioGroup from "@/app/components/elements/form/RadioGroup";
import SelectField, {
  type SelectOption,
} from "@/app/components/elements/form/SelectField";
import TextField from "@/app/components/elements/form/TextField";
import plateauLocations from "@/data/plateau-locations.json";

type Step = 1 | 2 | 3;

type PersonalDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vin: string;
  nin: string;
  gender: string;
};

type LocationDetails = {
  lgaId: number | null;
  wardId: number | null;
  pollingUnitId: number | null;
};

type SecurityDetails = {
  password: string;
  referralCode: string;
  consent: boolean;
  volunteer: string;
};

type ErrorField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "vin"
  | "nin"
  | "lgaId"
  | "wardId"
  | "pollingUnitId"
  | "password"
  | "consent";

const steps = [
  { number: 1, label: "Personal" },
  { number: 2, label: "Location" },
  { number: 3, label: "Security" },
] as const;

const genderOptions: SelectOption[] = [
  { id: "prefer-not-to-say", name: "Prefer not to say", label: "Prefer not to say" },
  { id: "male", name: "Male", label: "Male" },
  { id: "female", name: "Female", label: "Female" },
  { id: "other", name: "Other", label: "Other" },
];

const consentText =
  "I consent to the City Boy Movement collecting and processing my personal data (including my contact and location details) for membership, mobilisation and electoral organising, in accordance with the Nigeria Data Protection Act 2023. I understand I can withdraw this consent at any time from my profile.";

const themeListeners = new Set<() => void>();

function getThemeSnapshot(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  const storedTheme = window.localStorage.getItem("cbm-theme");
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeToTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  themeListeners.add(callback);
  mediaQuery.addEventListener("change", callback);
  window.addEventListener("storage", callback);

  return () => {
    themeListeners.delete(callback);
    mediaQuery.removeEventListener("change", callback);
    window.removeEventListener("storage", callback);
  };
}

export default function Home() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => "light",
  );
  const [step, setStep] = useState<Step>(1);
  const [personal, setPersonal] = useState<PersonalDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vin: "",
    nin: "",
    gender: "Prefer not to say",
  });
  const [location, setLocation] = useState<LocationDetails>({
    lgaId: null,
    wardId: null,
    pollingUnitId: null,
  });
  const [security, setSecurity] = useState<SecurityDetails>({
    password: "",
    referralCode: "",
    consent: false,
    volunteer: "Maybe later",
  });
  const [errors, setErrors] = useState<Partial<Record<ErrorField, string>>>({});
  const [submissionNotice, setSubmissionNotice] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("cbm-theme", nextTheme);
    themeListeners.forEach((listener) => listener());
  };

  const lgaOptions: SelectOption[] = plateauLocations.lgas.map((lga) => ({
    id: lga.id,
    name: lga.name,
    code: lga.code,
    label: `${lga.name} · ${lga.code}`,
  }));
  const selectedLga = plateauLocations.lgas.find(
    (lga) => lga.id === location.lgaId,
  );
  const wardOptions: SelectOption[] =
    selectedLga?.wards.map((ward) => ({
      id: ward.id,
      name: ward.name,
      code: ward.code,
      label: `${ward.name} · ${ward.code}`,
    })) ?? [];
  const selectedWard = selectedLga?.wards.find(
    (ward) => ward.id === location.wardId,
  );
  const pollingUnitOptions: SelectOption[] =
    selectedWard?.pollingUnits.map((unit) => ({
      id: unit.id,
      name: unit.name,
      code: unit.code,
      label: unit.code.startsWith("31-")
        ? `${unit.code.slice(-3)} · ${unit.name} · ${unit.code}`
        : unit.name,
    })) ?? [];

  const updatePersonal = (field: keyof PersonalDetails, value: string) => {
    setPersonal((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmissionNotice("");
  };

  const clearError = (field: ErrorField) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmissionNotice("");
  };

  const resetForm = () => {
    setStep(1);
    setPersonal({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      vin: "",
      nin: "",
      gender: "Prefer not to say",
    });
    setLocation({ lgaId: null, wardId: null, pollingUnitId: null });
    setSecurity({
      password: "",
      referralCode: "",
      consent: false,
      volunteer: "Maybe later",
    });
    setErrors({});
    setFormKey((key) => key + 1);
  };

  const submitRegistration = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...personal, ...location, ...security }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      resetForm();
      setSubmissionNotice(
        "Registration successful! Welcome to the City Boy Movement.",
      );
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionNotice("");
    setSubmitError("");
    if (isSubmitting) return;

    if (step === 1) {
      const nextErrors: Partial<Record<ErrorField, string>> = {};
      const phone = personal.phone.replace(/[\s()-]/g, "");

      if (!personal.firstName.trim()) {
        nextErrors.firstName = "Enter your first name.";
      }
      if (!personal.lastName.trim()) {
        nextErrors.lastName = "Enter your last name.";
      }
      if (personal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) {
        nextErrors.email = "Enter a valid email address.";
      }
      if (!/^(?:0[789]\d{9}|\+234[789]\d{9})$/.test(phone)) {
        nextErrors.phone = "Enter a valid Nigerian mobile number.";
      }
      if (personal.vin && !/^\d{19,20}$/.test(personal.vin.replace(/\s/g, ""))) {
        nextErrors.vin = "VIN must contain 19 or 20 digits.";
      }
      if (!/^\d{11}$/.test(personal.nin)) {
        nextErrors.nin = "NIN must contain 11 digits.";
      }

      setErrors(nextErrors);
      if (Object.keys(nextErrors).length === 0) {
        setStep(2);
      }
      return;
    }

    if (step === 2) {
      const nextErrors: Partial<Record<ErrorField, string>> = {};
      if (location.lgaId === null) nextErrors.lgaId = "Select your LGA.";
      if (location.wardId === null) nextErrors.wardId = "Select your ward.";
      if (location.pollingUnitId === null) {
        nextErrors.pollingUnitId = "Select your polling unit.";
      }

      setErrors(nextErrors);
      if (Object.keys(nextErrors).length === 0) {
        setStep(3);
      }
      return;
    }

    const nextErrors: Partial<Record<ErrorField, string>> = {};
    if (security.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }
    if (!security.consent) {
      nextErrors.consent = "Consent is required to continue.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      void submitRegistration();
    }
  };

  const firstStepComplete =
    personal.firstName.trim() !== "" &&
    personal.lastName.trim() !== "" &&
    personal.phone.trim() !== "" &&
    personal.nin.trim() !== "";
  const secondStepComplete =
    location.lgaId !== null &&
    location.wardId !== null &&
    location.pollingUnitId !== null;

  return (
    <main data-theme={theme} className="min-h-screen bg-[#F7F7F9] px-4 py-6 font-sans text-[#171717] transition-colors duration-300 dark:bg-[#020402] dark:text-slate-100 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 flex items-center justify-between gap-3 sm:mb-8 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              src="/logos/city-boy.png"
              alt="City Boy Movement"
              width={120}
              height={120}
              priority
              className="h-12 w-12 object-contain transition duration-200 hover:scale-105 dark:invert sm:h-13 sm:w-13"
            />
            <Image
              src="/logos/apc.png"
              alt="All Progressives Congress"
              width={120}
              height={90}
              priority
              className="h-12 w-12 object-contain transition duration-200 hover:scale-105 sm:h-13 sm:w-13"
            />
            <Image
              src="/logos/renewed-hope.png"
              alt="Renewed Hope"
              width={160}
              height={80}
              priority
              className="h-14.5 w-20 object-contain transition duration-200 hover:scale-105 sm:h-16 sm:w-[5.6rem]"
            />
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={theme === "dark"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#00E58E]/60 hover:text-[#02BC75] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00E58E]/20 disabled:cursor-wait dark:border-slate-700 dark:bg-[#101512] dark:text-slate-300 dark:hover:text-[#00E58E]"
          >
            {theme === "dark" ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="size-2.5"
              >
                <circle cx="12" cy="12" r="4" />
                <path
                  strokeLinecap="round"
                  d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-2.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            )}
          </button>
        </header>

        <section className="overflow-hidden rounded-2xl border-slate-200/80 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)] transition-colors duration-300 dark:border-slate-800 dark:bg-[#080d0a] sm:rounded-lg">
          <div className="border-b border-slate-100 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8 dark:border-slate-800">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#02BC75]">
              Membership registration
            </p>
            <h1 className="font-display font-semibold tracking-tight text-[#171717] dark:text-white sm:text-2xl">
              Join City Boy Movement
            </h1>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Register as a member — lead your ward, shape Nigeria&apos;s future.
            </p>

            <nav
              aria-label="Registration progress"
              className="mt-6 grid grid-cols-3"
            >
              {steps.map(({ number, label }, index) => {
                const isComplete = number < step;
                const isCurrent = number === step;

                return (
                  <div
                    key={label}
                    aria-current={isCurrent ? "step" : undefined}
                    className="relative flex flex-col items-center gap-2"
                  >
                    {index < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`absolute left-1/2 top-4 h-0.5 w-full transition-colors duration-300 ${
                          number < step ? "bg-[#02BC75]" : "bg-slate-100 dark:bg-slate-700"
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-300 ${
                        isComplete
                          ? "border-[#02BC75] bg-[#00E58E] text-[#020402]"
                          : isCurrent
                            ? "border-[#02BC75] bg-white text-[#02BC75] ring-4 ring-[#00E58E]/15 dark:bg-[#101512]"
                              : "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-[#101512] dark:text-slate-500"
                      }`}
                    >
                      {isComplete ? "✓" : number}
                    </span>
                    <span
                      className={`relative z-10 text-xs font-medium transition-colors duration-200 ${
                        isCurrent || isComplete
                          ? "text-[#171717] dark:text-slate-100"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </nav>
          </div>

          <form
            key={formKey}
            onSubmit={handleFormSubmit}
            className="px-5 py-6 sm:px-8 sm:py-8"
          >
            <div className="mb-6">
              <h2 className="font-display text-xl font-semibold tracking-tight text-[#171717] dark:text-white">
                {step === 1
                  ? "Create your member account"
                  : step === 2
                    ? "Select your location"
                    : "Set your password"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {step === 1
                  ? "Step 1 of 3 — Your personal details"
                  : step === 2
                    ? "Step 2 of 3 — State, LGA & Ward"
                    : "Step 3 of 3 — Secure your account"}
              </p>
            </div>

            {step === 1 && (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    requiredField
                    fieldId="first-name"
                    inputLabel="First Name"
                    inputPlaceholder="Chinedu"
                    autoComplete="given-name"
                    hasError={errors.firstName}
                    preloadValue={personal.firstName}
                    returnFieldValue={(value) => updatePersonal("firstName", value)}
                  />
                  <TextField
                    requiredField
                    fieldId="last-name"
                    inputLabel="Last Name"
                    inputPlaceholder="Okafor"
                    autoComplete="family-name"
                    hasError={errors.lastName}
                    preloadValue={personal.lastName}
                    returnFieldValue={(value) => updatePersonal("lastName", value)}
                  />
                </div>

                <TextField
                  fieldId="email"
                  inputLabel="Email (optional)"
                  inputPlaceholder="you@example.com"
                  inputType="email"
                  autoComplete="email"
                  hasError={errors.email}
                  preloadValue={personal.email}
                  returnFieldValue={(value) => updatePersonal("email", value)}
                />

                <div>
                  <TextField
                    requiredField
                    fieldId="phone"
                    inputLabel="Phone Number"
                    inputPlaceholder="+234 801 234 5678"
                    inputType="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    hasError={errors.phone}
                    preloadValue={personal.phone}
                    returnFieldValue={(value) => updatePersonal("phone", value)}
                  />
                  <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Used to sign you in and to reach you. Nigerian mobile number,
                    0803... or +234803...
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <TextField
                      fieldId="vin"
                      inputLabel="Voter's Card VIN (optional)"
                      inputPlaceholder="19 or 20-digit VIN"
                      inputMode="numeric"
                      hasError={errors.vin}
                      preloadValue={personal.vin}
                      returnFieldValue={(value) => updatePersonal("vin", value)}
                    />
                    <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Your Voter Identification Number from your INEC card.
                    </p>
                  </div>
                  <div>
                    <TextField
                      requiredField
                      fieldId="nin"
                      inputLabel="National Identification Number (NIN)"
                      inputPlaceholder="Enter your 11-digit NIN"
                      inputMode="numeric"
                      hasError={errors.nin}
                      preloadValue={personal.nin}
                      returnFieldValue={(value) => updatePersonal("nin", value)}
                    />
                    <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Enter your 11-digit National Identification Number.
                    </p>
                  </div>
                </div>

                <SelectField
                  fieldId="gender"
                  inputLabel="Gender"
                  titleField="label"
                  selectOptions={genderOptions}
                  preSelected={personal.gender}
                  preSelectedLabel="name"
                  returnFieldValue={(option) =>
                    updatePersonal("gender", option.name)
                  }
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="rounded-xl border border-[#00E58E]/30 bg-[#00E58E]/8 p-4">
                  <p className="text-sm font-semibold text-[#171717] dark:text-white">
                    Plateau State, Nigeria
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    Choose your local government area, ward, and polling unit.
                    Only Plateau locations are shown.
                  </p>
                </div>

                <SelectField
                  fieldId="lga"
                  inputLabel="Local Government Area"
                  requiredField
                  titleField="label"
                  selectOptions={lgaOptions}
                  hasError={errors.lgaId}
                  preSelected={location.lgaId ?? undefined}
                  preSelectedLabel="id"
                  returnFieldValue={(option) => {
                    setLocation({
                      lgaId: Number(option.id),
                      wardId: null,
                      pollingUnitId: null,
                    });
                    setErrors((current) => ({
                      ...current,
                      lgaId: undefined,
                      wardId: undefined,
                      pollingUnitId: undefined,
                    }));
                    setSubmissionNotice("");
                  }}
                />

                <SelectField
                  key={location.lgaId ?? "ward"}
                  fieldId="ward"
                  inputLabel="Ward"
                  requiredField
                  titleField="label"
                  selectOptions={wardOptions}
                  disabled={location.lgaId === null}
                  hasError={errors.wardId}
                  preSelected={location.wardId ?? undefined}
                  preSelectedLabel="id"
                  returnFieldValue={(option) => {
                    setLocation((current) => ({
                      ...current,
                      wardId: Number(option.id),
                      pollingUnitId: null,
                    }));
                    setErrors((current) => ({
                      ...current,
                      wardId: undefined,
                      pollingUnitId: undefined,
                    }));
                    setSubmissionNotice("");
                  }}
                />

                <SelectField
                  key={location.wardId ?? "polling-unit"}
                  fieldId="polling-unit"
                  inputLabel="Polling Unit"
                  requiredField
                  titleField="label"
                  selectOptions={pollingUnitOptions}
                  disabled={location.wardId === null}
                  hasError={errors.pollingUnitId}
                  preSelected={location.pollingUnitId ?? undefined}
                  preSelectedLabel="id"
                  returnFieldValue={(option) => {
                    setLocation((current) => ({
                      ...current,
                      pollingUnitId: Number(option.id),
                    }));
                    clearError("pollingUnitId");
                  }}
                />

                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Your ward determines your membership zone and task assignments.
                  If your polling unit is not listed, you can add it later from
                  your profile.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <TextField
                  requiredField
                  fieldId="password"
                  inputLabel="Password"
                  inputPlaceholder="Minimum 8 characters"
                  inputType="password"
                  autoComplete="new-password"
                  hasError={errors.password}
                  preloadValue={security.password}
                  returnFieldValue={(value) => {
                    setSecurity((current) => ({ ...current, password: value }));
                    clearError("password");
                  }}
                />

                <div>
                  <TextField
                    fieldId="referral-code"
                    inputLabel="Referral Code (optional)"
                    inputPlaceholder="e.g. CBMGO12ABC"
                    autoComplete="off"
                    preloadValue={security.referralCode}
                    returnFieldValue={(value) =>
                      setSecurity((current) => ({
                        ...current,
                        referralCode: value,
                      }))
                    }
                  />
                  <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Have a friend&apos;s referral code? Enter it to earn bonus points.
                  </p>
                </div>

                <a
                  href="https://d28p3mwclk983x.cloudfront.net/public/CBM-Handbook.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:border-[#00E58E]/60 hover:bg-[#00E58E]/6 dark:border-slate-700 dark:bg-[#101512] dark:hover:bg-[#00E58E]/10"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#171717] dark:text-slate-100">
                      CBM Movement Handbook
                    </span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                      Download and read our handbook before joining
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-lg text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#02BC75] dark:text-slate-500"
                  >
                    ↗
                  </span>
                </a>

                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#101512]">
                  <p className="text-sm font-medium text-[#171717] dark:text-slate-100">
                    By registering, you agree to:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-[#02BC75]" aria-hidden="true">✓</span>
                      <span>City Boy Movement Terms of Service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#02BC75]" aria-hidden="true">✓</span>
                      <span>Privacy Policy and data usage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#02BC75]" aria-hidden="true">✓</span>
                      <span>City Boy Movement Code of Conduct</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-[#101512]">
                  <Checkbox
                    CheckboxLabel={consentText}
                    isChecked={security.consent}
                    hasError={Boolean(errors.consent)}
                    checkboxToggleFunction={() => {
                      setSecurity((current) => ({
                        ...current,
                        consent: !current.consent,
                      }));
                      clearError("consent");
                    }}
                  />
                  {errors.consent && (
                    <p className="ml-7 mt-2 text-xs text-red-600" role="alert">
                      {errors.consent}
                    </p>
                  )}
                </div>

                <RadioGroup
                  inputLabel="Would you like to volunteer?"
                  items={[
                    { label: "Yes" },
                    { label: "No" },
                    { label: "Maybe later" },
                  ]}
                  inline
                  preSelectedIndex={
                    security.volunteer === "Yes"
                      ? 0
                      : security.volunteer === "No"
                        ? 1
                        : 2
                  }
                  returnSelected={(item) =>
                    setSecurity((current) => ({
                      ...current,
                      volunteer: item.label,
                    }))
                  }
                />
                <p className="-mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Optional — you are joining as a member either way.
                </p>
              </div>
            )}

            {submissionNotice && (
              <p
                className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200"
                role="status"
              >
                {submissionNotice}
              </p>
            )}
            {submitError && (
              <p
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200"
                role="alert"
              >
                {submitError}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              {step > 1 && (
                <FormButton
                  buttonLabel="Back"
                  buttonAction={() => {
                    setSubmissionNotice("");
                    setErrors({});
                    setStep(step === 3 ? 2 : 1);
                  }}
                  variant="secondary"
                />
              )}
              <FormButton
                buttonLabel={
                  step === 3
                    ? isSubmitting
                      ? "Creating account..."
                      : "Create Account"
                    : "Continue"
                }
                type="submit"
                disabled={
                  step === 1
                    ? !firstStepComplete
                    : step === 2
                      ? !secondStepComplete
                      : security.password.length < 8 || isSubmitting
                }
              />
            </div>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <a
                className="font-semibold text-[#02BC75] transition-colors duration-200 hover:text-[#01975E]"
                href="https://cbmnigeria.org/login"
              >
                Sign in
              </a>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
