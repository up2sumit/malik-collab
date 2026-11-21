"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import type { ApplyKind, ApplyResponse } from "@/lib/schemas";

export const controlClass =
  "block w-full rounded-xl border border-ink/30 bg-paper px-4 py-3 text-base text-ink placeholder:text-muted/80 transition-colors focus:border-terracotta-deep focus:outline-none focus:ring-2 focus:ring-terracotta-deep/30 aria-[invalid=true]:border-terracotta-deep aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-terracotta-deep/20";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: (aria: { id: string; "aria-invalid": boolean; "aria-describedby": string | undefined }) => ReactNode;
}

/** Label + control + hint + error, wired together for assistive tech. */
export function Field({ id, label, hint, error, optional, className = "", children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-3 font-heading text-[0.9rem] font-bold">
        <span>{label}</span>
        {optional && <span className="text-xs font-medium text-muted">Optional</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && (
        <p id={hintId} className="mt-1.5 text-[0.8125rem] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-[0.8125rem] font-semibold text-clay">
          {error}
        </p>
      )}
    </div>
  );
}

type SubmitResult = { ok: true } | { ok: false; message: string; fieldErrors?: Record<string, string> };

/** Posts a validated payload and normalises every failure mode into a user-facing message. */
export function useApplySubmit(kind: ApplyKind) {
  const startedAt = useRef(0);
  const [pending, setPending] = useState(false);

  // Recorded on the client after mount so prerendering never reads the clock.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const submit = useCallback(
    async (values: object, honeypot: string = ""): Promise<SubmitResult> => {
      setPending(true);
      try {
        const response = await fetch(`/api/apply/${kind}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, website: honeypot, startedAt: startedAt.current || Date.now() - 10_000 }),
        });
        let data: ApplyResponse | null = null;
        try {
          data = (await response.json()) as ApplyResponse;
        } catch {
          data = null;
        }
        if (data?.ok) return { ok: true };
        if (data && !data.ok) return { ok: false, message: data.message, fieldErrors: data.fieldErrors };
        return { ok: false, message: "Something went wrong. Please try again." };
      } catch {
        return { ok: false, message: "We couldn't reach the server. Check your connection and try again." };
      } finally {
        setPending(false);
      }
    },
    [kind],
  );

  return { submit, pending };
}

/** Reads the honeypot value from the submitted form. Call synchronously, before any await. */
export function readHoneypot(event: React.BaseSyntheticEvent | undefined): string {
  // currentTarget is reset to null once React Hook Form has awaited validation, so use target.
  const target = event?.target;
  const form = target instanceof HTMLFormElement ? target : target instanceof Element ? target.closest("form") : null;
  if (!form) return "";
  const value = new FormData(form).get("website");
  return typeof value === "string" ? value : "";
}

/** Hidden from people and assistive tech; bots tend to fill it. */
export function Honeypot() {
  return (
    <div className="honeypot" aria-hidden="true">
      <label>
        Leave this field empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function ConsentField({ id, error, register }: { id: string; error?: string; register: object }) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[0.9rem] leading-snug">
        <input id={id} type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-terracotta-deep" aria-invalid={Boolean(error)} aria-describedby={errorId} {...register} />
        <span>
          I have read the{" "}
          <Link href="/privacy" className="font-semibold underline underline-offset-2">
            privacy notice
          </Link>{" "}
          and agree to be contacted about this request.
        </span>
      </label>
      {error && (
        <p id={errorId} className="mt-1.5 text-[0.8125rem] font-semibold text-clay">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-xl border border-terracotta-deep/50 bg-terracotta-deep/10 px-4 py-3 text-[0.9375rem] font-semibold text-ink">
      {message}
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button type="submit" className="btn w-full sm:w-auto" disabled={pending} aria-disabled={pending}>
      {pending ? "Sending…" : children}
      {!pending && <Icon name="arrow" size={18} className="arrow" />}
    </button>
  );
}

export function SuccessPanel({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div ref={ref} tabIndex={-1} role="status" className="shape-leaf bg-forest p-8 text-paper outline-none sm:p-10">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper text-forest">
        <Icon name="check" size={24} />
      </span>
      <h2 className="t-h3 mt-5">{title}</h2>
      <div className="mt-3 text-paper/90">{children}</div>
    </div>
  );
}
