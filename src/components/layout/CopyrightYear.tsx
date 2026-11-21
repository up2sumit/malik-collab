import { cacheLife } from "next/cache";

/**
 * The current year changes at midnight on 1 January, so it is cached for days
 * instead of being recomputed on every render. Reading the clock in a normal
 * server component would break prerendering under Cache Components.
 */
export async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
