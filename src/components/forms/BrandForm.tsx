"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { brandFormSchema, budgetRanges, collabTypes, timelines, type BrandInput } from "@/lib/schemas";
import { ConsentField, controlClass, Field, FormError, Honeypot, SubmitButton, SuccessPanel, readHoneypot, useApplySubmit } from "./form-kit";

/** DOM order. Used to focus the first invalid field deterministically. */
const FIELD_ORDER: readonly (keyof BrandInput)[] = ["contactName", "workEmail", "company", "collabType", "description", "budget", "timeline", "consent"];

export function BrandForm() {
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { submit, pending } = useApplySubmit("brand");

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<BrandInput>({
    resolver: zodResolver(brandFormSchema),
    mode: "onTouched",
    shouldFocusError: false,
    defaultValues: { contactName: "", workEmail: "", company: "", collabType: undefined, description: "", budget: "unspecified", timeline: "flexible", consent: false },
  });

  const focusFirstError = (fields: Partial<Record<keyof BrandInput, unknown>>) => {
    const first = FIELD_ORDER.find((key) => key in fields);
    if (first) setFocus(first);
  };

  const onSubmit = handleSubmit(async (values, event) => {
    const honeypot = readHoneypot(event);
    setFormError(null);
    const result = await submit(values, honeypot);
    if (result.ok) {
      setDone(true);
      return;
    }
    setFormError(result.message);
    if (result.fieldErrors) {
      const applied: Partial<Record<keyof BrandInput, true>> = {};
      for (const [key, message] of Object.entries(result.fieldErrors)) {
        if ((FIELD_ORDER as readonly string[]).includes(key)) {
          setError(key as keyof BrandInput, { type: "server", message });
          applied[key as keyof BrandInput] = true;
        }
      }
      focusFirstError(applied);
    }
  }, (errors) => focusFirstError(errors));

  if (done) {
    return (
      <SuccessPanel title="Enquiry received">
        <p>Thank you. We&rsquo;ve received your enquiry and will reply to your work email.</p>
      </SuccessPanel>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2" aria-label="Brand enquiry">
      <Honeypot />
      <Field id="b-name" label="Your name" error={errors.contactName?.message}>
        {(a) => <input {...a} type="text" autoComplete="name" className={controlClass} {...register("contactName")} />}
      </Field>
      <Field id="b-email" label="Work email" error={errors.workEmail?.message}>
        {(a) => <input {...a} type="email" autoComplete="email" inputMode="email" className={controlClass} {...register("workEmail")} />}
      </Field>
      <Field id="b-company" label="Company" error={errors.company?.message}>
        {(a) => <input {...a} type="text" autoComplete="organization" className={controlClass} {...register("company")} />}
      </Field>
      <Field id="b-type" label="Collaboration type" error={errors.collabType?.message}>
        {(a) => (
          <select {...a} className={controlClass} defaultValue="" {...register("collabType")}>
            <option value="" disabled>
              Choose a type
            </option>
            {collabTypes.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field id="b-desc" label="Tell us about the campaign" hint="Goal, audience, sport and anything we should know. 40 characters minimum." error={errors.description?.message} className="sm:col-span-2">
        {(a) => <textarea {...a} rows={6} maxLength={2000} className={`${controlClass} resize-y`} {...register("description")} />}
      </Field>
      <Field id="b-budget" label="Budget range" optional error={errors.budget?.message}>
        {(a) => (
          <select {...a} className={controlClass} {...register("budget")}>
            {budgetRanges.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field id="b-timeline" label="Expected timeline" optional error={errors.timeline?.message}>
        {(a) => (
          <select {...a} className={controlClass} {...register("timeline")}>
            {timelines.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <div className="sm:col-span-2">
        <ConsentField id="b-consent" error={errors.consent?.message} register={register("consent")} />
      </div>
      <div className="grid gap-4 sm:col-span-2">
        <FormError message={formError} />
        <div>
          <SubmitButton pending={pending}>Send enquiry</SubmitButton>
        </div>
      </div>
    </form>
  );
}
