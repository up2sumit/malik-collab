import type { ReactNode } from "react";
import { Ridge, ridges } from "./Wave";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  actions?: ReactNode;
  /** Optional right-hand visual. */
  aside?: ReactNode;
  id?: string;
}

export function PageHero({ eyebrow, title, lead, actions, aside, id = "page-title" }: PageHeroProps) {
  return (
    <section aria-labelledby={id} className="relative overflow-hidden pb-14 pt-[calc(var(--header-h)+2.5rem)] lg:pb-20 lg:pt-[calc(var(--header-h)+4rem)]">
      <Ridge points={ridges.page} height={120} className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full text-sage/20" />
      <div className={`wrap relative grid items-center gap-10 ${aside ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14" : ""}`}>
        <div>
          <p className="t-eyebrow flex items-center gap-3 text-ink/80">
            <span aria-hidden="true" className="h-px w-8 bg-terracotta-deep" />
            {eyebrow}
          </p>
          <h1 id={id} className="t-hero mt-5 max-w-[18ch]">
            {title}
          </h1>
          {lead && <p className="t-lead mt-6 max-w-[38rem] text-muted">{lead}</p>}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}
