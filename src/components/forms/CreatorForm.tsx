"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { contentTypes, creatorFormSchema, sportOptions, type CreatorInput } from "@/lib/schemas";
import { ConsentField, controlClass, Field, FormError, Honeypot, SubmitButton, SuccessPanel, readHoneypot, useApplySubmit } from "./form-kit";

/** DOM order. Used to focus the first invalid field deterministically. */
const FIELD_ORDER: readonly (keyof CreatorInput)[] = ["name", "email", "sport", "contentType", "instagram", "youtube", "portfolio", "intro", "consent"];

export function CreatorForm() {
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { submit, pending } = useApplySubmit("creator");

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<CreatorInput>({
    resolver: zodResolver(creatorFormSchema),
    mode: "onTouched",
    shouldFocusError: false,
    defaultValues: { name: "", email: "", sport: undefined, contentType: undefined, instagram: "", youtube: "", portfolio: "", intro: "", consent: false },
  });

  const focusFirstError = (fields: Partial<Record<keyof CreatorInput, unknown>>) => {
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
      const applied: Partial<Record<keyof CreatorInput, true>> = {};
      for (const [key, message] of Object.entries(result.fieldErrors)) {
        if ((FIELD_ORDER as readonly string[]).includes(key)) {
          setError(key as keyof CreatorInput, { type: "server", message });
          applied[key as keyof CreatorInput] = true;
        }
      }
      focusFirstError(applied);
    }
  }, (errors) => focusFirstError(errors));

  if (done) {
    return (
      <SuccessPanel title="Application received">
        <p>Thank you. We&rsquo;ve received your application and will review it. If it&rsquo;s a good fit, we&rsquo;ll reply to the email you provided.</p>
      </SuccessPanel>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2" aria-label="Creator application">
      <Honeypot />
      <Field id="c-name" label="Full name" error={errors.name?.message}>
        {(a) => <input {...a} type="text" autoComplete="name" className={controlClass} {...register("name")} />}
      </Field>
      <Field id="c-email" label="Email" error={errors.email?.message}>
        {(a) => <input {...a} type="email" autoComplete="email" inputMode="email" className={controlClass} {...register("email")} />}
      </Field>
      <Field id="c-sport" label="Main sport" error={errors.sport?.message}>
        {(a) => (
          <select {...a} className={controlClass} defaultValue="" {...register("sport")}>
            <option value="" disabled>
              Choose a sport
            </option>
            {sportOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field id="c-type" label="Content type" error={errors.contentType?.message}>
        {(a) => (
          <select {...a} className={controlClass} defaultValue="" {...register("contentType")}>
            <option value="" disabled>
              Choose a type
            </option>
            {contentTypes.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field id="c-ig" label="Instagram" optional hint="A handle like @yourname, or a profile link." error={errors.instagram?.message}>
        {(a) => <input {...a} type="text" autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="@yourname" className={controlClass} {...register("instagram")} />}
      </Field>
      <Field id="c-yt" label="YouTube" optional error={errors.youtube?.message}>
        {(a) => <input {...a} type="url" inputMode="url" autoComplete="off" placeholder="https://youtube.com/@yourchannel" className={controlClass} {...register("youtube")} />}
      </Field>
      <Field id="c-portfolio" label="Portfolio or website" optional hint="Add at least one link to your work above or here." error={errors.portfolio?.message} className="sm:col-span-2">
        {(a) => <input {...a} type="url" inputMode="url" autoComplete="url" placeholder="https://" className={controlClass} {...register("portfolio")} />}
      </Field>
      <Field id="c-intro" label="Tell us about your content" hint="What you make, who it is for, and what you would like to collaborate on. 40 characters minimum." error={errors.intro?.message} className="sm:col-span-2">
        {(a) => <textarea {...a} rows={6} maxLength={1200} className={`${controlClass} resize-y`} {...register("intro")} />}
      </Field>
      <div className="sm:col-span-2">
        <ConsentField id="c-consent" error={errors.consent?.message} register={register("consent")} />
      </div>
      <div className="grid gap-4 sm:col-span-2">
        <FormError message={formError} />
        <div>
          <SubmitButton pending={pending}>Send application</SubmitButton>
        </div>
      </div>
    </form>
  );
}
