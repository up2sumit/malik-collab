/**
 * Central site configuration.
 *
 * `name` is a placeholder taken from the design mockup. Confirm it is available
 * and trademark-clear before launch, then change it here (one place).
 */
export const site = {
  name: "SportCollab",
  tagline: "The sports creator collaboration platform",
  description:
    "Connect sports creators and brands for authentic collaborations: sponsored content, video partnerships and long-term campaigns across running, cycling, basketball, surfing and more.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en",
} as const;

/**
 * Demo content (sample stories, sample showcase tiles) is always shown in
 * development, but hidden in production unless explicitly enabled. This stops
 * invented testimonials from shipping to real visitors by accident.
 * Enable on a preview deployment with NEXT_PUBLIC_SHOW_DEMO_CONTENT=true.
 */
export function showDemoContent(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_SHOW_DEMO_CONTENT === "true"
  );
}

export const nav = [
  { href: "/creators", label: "For Creators" },
  { href: "/brands", label: "For Brands" },
  { href: "/collaborations", label: "Collaborations" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
] as const;
