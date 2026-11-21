# Before launch

Everything here is intentionally a placeholder. None of it should reach real visitors as-is.

## Content and brand
- [ ] **Brand name.** "SportCollab" comes from the design mockup. Confirm it is available and trademark-clear, then change `site.name` in `src/lib/site.ts`.
- [ ] **Photography.** All images are vector stand-ins. Register licensed photos in `src/lib/photos.ts` (see README, "Replacing images").
- [ ] **Stories.** The four stories in `src/lib/content.ts` are samples, hidden in production. Replace with real, approved stories and set `demo: false`.
- [ ] **Showcase.** The six tiles are samples. Add real public links and set `demo: false`.
- [ ] **Partner logos.** None are shown. Add confirmed partners only, with permission.
- [ ] **FAQ answers.** Several answers read "Replace this answer...": review time, payment policy, minimum budget, content ownership.
- [ ] **About page.** Principles only. Add the real team and story once you have them.

## Legal
- [ ] **Privacy notice** (`/privacy`) is a plain-language starting point with one placeholder section (retention and deletion route). Have it reviewed for your jurisdictions.
- [ ] Consider terms of service and a cookie notice if you add analytics or embeds beyond YouTube-nocookie.

## Infrastructure
- [ ] Create a Resend account, verify the sending domain, set `RESEND_API_KEY`, `SUBMISSIONS_TO_EMAIL`, `SUBMISSIONS_FROM_EMAIL`.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain.
- [ ] Replace the in-memory rate limiter with a shared store if traffic or abuse warrants it.
- [ ] Add an Open Graph image (`src/app/opengraph-image.*`) and favicon set.
- [ ] No log-in: the mockup's "Log In" link is intentionally omitted because there is no authentication.
