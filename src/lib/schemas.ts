import { z } from "zod";
import { sportSlugs } from "./sports";

/* Shared by the browser (react-hook-form) and the route handlers, so the rules
   cannot drift apart. */

export const contentTypes = [
  ["analysis", "Analysis and commentary"],
  ["tutorial", "Tutorials and coaching"],
  ["reviews", "Gear and product reviews"],
  ["vlog", "Vlogs and storytelling"],
  ["highlights", "Highlights and action"],
  ["other", "Something else"],
] as const;

export const collabTypes = [
  ["sponsored", "Sponsored content"],
  ["campaign", "Creator campaign"],
  ["product", "Product storytelling"],
  ["video", "Video collaboration"],
  ["activation", "Creator-led activation"],
  ["longterm", "Long-term partnership"],
  ["general", "A general question"],
] as const;

export const budgetRanges = [
  ["unspecified", "Prefer not to say"],
  ["under-1k", "Under 1,000"],
  ["1k-5k", "1,000 – 5,000"],
  ["5k-20k", "5,000 – 20,000"],
  ["20k-plus", "20,000+"],
] as const;

export const timelines = [
  ["asap", "As soon as possible"],
  ["1-3-months", "Within 1–3 months"],
  ["3-6-months", "In 3–6 months"],
  ["flexible", "Flexible"],
] as const;

const keys = <T extends readonly (readonly [string, string])[]>(list: T) =>
  list.map(([key]) => key) as unknown as [T[number][0], ...T[number][0][]];

export const sportOptions = [
  ...sportSlugs.map((s) => [s, s.charAt(0).toUpperCase() + s.slice(1)] as const),
  ["other", "Another sport"] as const,
];

const text = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const email = z
  .string()
  .trim()
  .max(120, "Email must be 120 characters or fewer.")
  .pipe(z.email("Enter a valid email address."));

/** Accepts "example.com/x" or "https://example.com/x" and requires http(s). */
function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

const optionalUrl = z
  .string()
  .trim()
  .max(300, "That link is too long.")
  .refine((v) => v === "" || isHttpUrl(v), "Enter a valid link, for example https://example.com.");

const optionalHandleOrUrl = z
  .string()
  .trim()
  .max(300, "That is too long.")
  .refine(
    (v) => v === "" || /^@?[A-Za-z0-9._]{1,30}$/.test(v) || isHttpUrl(v),
    "Enter a handle like @yourname or a profile link.",
  );

const consent = z.boolean().refine((v) => v === true, "Please confirm you have read the privacy notice.");

/** Fields every public form carries for spam protection. */
const spamFields = {
  /** Honeypot: real people never see or fill this. */
  website: z.string().max(0).optional(),
  /** Unix ms when the form was first shown. Used for a minimum-time check. */
  startedAt: z.number().int().positive(),
};

const creatorFields = {
  name: text(2, 80, "Name"),
  email,
  sport: z.enum(keys(sportOptions), "Choose your main sport."),
  contentType: z.enum(keys(contentTypes), "Choose a content type."),
  instagram: optionalHandleOrUrl,
  youtube: optionalUrl,
  portfolio: optionalUrl,
  intro: text(40, 1200, "Introduction"),
  consent,
};

const hasLink = (v: { instagram: string; youtube: string; portfolio: string }) =>
  v.instagram !== "" || v.youtube !== "" || v.portfolio !== "";
const linkIssue = {
  path: ["portfolio"],
  message: "Add at least one link to your work: Instagram, YouTube or a portfolio.",
};

const brandFields = {
  contactName: text(2, 80, "Name"),
  workEmail: email,
  company: text(2, 120, "Company"),
  collabType: z.enum(keys(collabTypes), "Choose a collaboration type."),
  description: text(40, 2000, "Description"),
  budget: z.enum(keys(budgetRanges)),
  timeline: z.enum(keys(timelines)),
  consent,
};

/** Browser-side schemas: what the visitor fills in. */
export const creatorFormSchema = z.object(creatorFields).refine(hasLink, linkIssue);
export const brandFormSchema = z.object(brandFields);

/** Server-side schemas: the same rules plus the spam-control fields. */
export const creatorSchema = z.object({ ...creatorFields, ...spamFields }).refine(hasLink, linkIssue);
export const brandSchema = z.object({ ...brandFields, ...spamFields });

export type CreatorInput = z.input<typeof creatorFormSchema>;
export type CreatorData = z.output<typeof creatorSchema>;
export type BrandInput = z.input<typeof brandFormSchema>;
export type BrandData = z.output<typeof brandSchema>;

export type ApplyKind = "creator" | "brand";

export type ApplyResponse =
  | { ok: true }
  | {
      ok: false;
      code: "validation" | "rate_limited" | "too_fast" | "forbidden" | "not_configured" | "delivery_failed" | "bad_request";
      message: string;
      fieldErrors?: Record<string, string>;
    };

export function labelFor(list: readonly (readonly [string, string])[], key: string): string {
  return list.find(([k]) => k === key)?.[1] ?? key;
}
