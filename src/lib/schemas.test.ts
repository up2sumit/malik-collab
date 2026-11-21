import { describe, expect, it } from "vitest";
import { brandFormSchema, brandSchema, creatorFormSchema, creatorSchema } from "./schemas";

const creator = {
  name: "Alex Rivera",
  email: "alex@example.com",
  sport: "running",
  contentType: "vlog",
  instagram: "@alexruns",
  youtube: "",
  portfolio: "",
  intro: "I film long trail runs and write up what I learn about pacing and gear.",
  consent: true,
} as const;

const brand = {
  contactName: "Sam Lee",
  workEmail: "sam@brand.example",
  company: "Trail Co",
  collabType: "campaign",
  description: "A spring campaign for a new trail shoe aimed at first-time trail runners.",
  budget: "unspecified",
  timeline: "flexible",
  consent: true,
} as const;

const firstIssue = (result: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }) =>
  result.error?.issues[0];

describe("creatorFormSchema", () => {
  it("accepts a valid application", () => {
    expect(creatorFormSchema.safeParse(creator).success).toBe(true);
  });

  it("requires at least one link to the creator's work", () => {
    const result = creatorFormSchema.safeParse({ ...creator, instagram: "" });
    expect(result.success).toBe(false);
    expect(firstIssue(result)?.path).toEqual(["portfolio"]);
  });

  it.each([["@alexruns"], ["alexruns"], ["https://instagram.com/alexruns"], ["alex.runs_1"]])("accepts instagram %s", (instagram) => {
    expect(creatorFormSchema.safeParse({ ...creator, instagram }).success).toBe(true);
  });

  it.each([["not a handle!"], ["javascript:alert(1)"], ["@" + "a".repeat(40)]])("rejects instagram %s", (instagram) => {
    expect(creatorFormSchema.safeParse({ ...creator, instagram }).success).toBe(false);
  });

  it.each([["javascript:alert(1)"], ["ftp://example.com"], ["nodots"], ["http://"]])("rejects portfolio link %s", (portfolio) => {
    expect(creatorFormSchema.safeParse({ ...creator, portfolio }).success).toBe(false);
  });

  it("accepts a portfolio link without a protocol", () => {
    expect(creatorFormSchema.safeParse({ ...creator, instagram: "", portfolio: "example.com/work" }).success).toBe(true);
  });

  it("rejects short introductions and bad emails", () => {
    expect(creatorFormSchema.safeParse({ ...creator, intro: "too short" }).success).toBe(false);
    expect(creatorFormSchema.safeParse({ ...creator, email: "nope" }).success).toBe(false);
  });

  it("rejects unknown sports and missing consent", () => {
    expect(creatorFormSchema.safeParse({ ...creator, sport: "quidditch" }).success).toBe(false);
    expect(creatorFormSchema.safeParse({ ...creator, consent: false }).success).toBe(false);
  });

  it("trims whitespace", () => {
    const result = creatorFormSchema.safeParse({ ...creator, name: "  Alex Rivera  " });
    expect(result.success && result.data.name).toBe("Alex Rivera");
  });
});

describe("creatorSchema (server)", () => {
  it("requires the timing field and rejects a filled honeypot", () => {
    expect(creatorSchema.safeParse(creator).success).toBe(false);
    expect(creatorSchema.safeParse({ ...creator, startedAt: 1, website: "" }).success).toBe(true);
    expect(creatorSchema.safeParse({ ...creator, startedAt: 1, website: "http://spam" }).success).toBe(false);
  });
});

describe("brand schemas", () => {
  it("accepts a valid enquiry", () => {
    expect(brandFormSchema.safeParse(brand).success).toBe(true);
    expect(brandSchema.safeParse({ ...brand, startedAt: 1 }).success).toBe(true);
  });

  it("rejects bad enums and short descriptions", () => {
    expect(brandFormSchema.safeParse({ ...brand, collabType: "other" }).success).toBe(false);
    expect(brandFormSchema.safeParse({ ...brand, budget: "a lot" }).success).toBe(false);
    expect(brandFormSchema.safeParse({ ...brand, description: "short" }).success).toBe(false);
  });

  it("enforces upper length bounds", () => {
    expect(brandFormSchema.safeParse({ ...brand, description: "x".repeat(2001) }).success).toBe(false);
    expect(brandFormSchema.safeParse({ ...brand, company: "x".repeat(121) }).success).toBe(false);
  });
});
