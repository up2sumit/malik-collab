import Link from "next/link";
import { nav, site } from "@/lib/site";
import { sports } from "@/lib/sports";
import { CopyrightYear } from "./CopyrightYear";
import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="on-dark bg-forest-deep text-paper">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 text-paper">
            <LogoMark />
            <span className="font-heading text-xl font-extrabold tracking-tight">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/75">{site.tagline}. Real partnerships between the people who play, and the brands that back them.</p>
        </div>

        <nav aria-label="Explore">
          <h2 className="t-eyebrow text-amber-light">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-u">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Sports">
          <h2 className="t-eyebrow text-amber-light">Sports</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {sports.slice(0, 6).map((sport) => (
              <li key={sport.slug}>
                <Link href={`/sports/${sport.slug}`} className="link-u">
                  {sport.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Get involved">
          <h2 className="t-eyebrow text-amber-light">Get involved</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/apply" className="link-u">
                Apply as a creator
              </Link>
            </li>
            <li>
              <Link href="/partner" className="link-u">
                Partner with us
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="link-u">
                Privacy notice
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-paper/15">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-paper/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {site.name}. All rights reserved.
          </p>
          <p>Brand names and photographs belong to their respective owners.</p>
        </div>
      </div>
    </footer>
  );
}
