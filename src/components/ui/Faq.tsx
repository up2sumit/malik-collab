import { Reveal } from "./Reveal";

interface FaqProps {
  items: readonly { q: string; a: string }[];
  title?: string;
}

/** Native <details> gives keyboard and screen-reader behaviour for free. */
export function Faq({ items, title = "Common questions" }: FaqProps) {
  return (
    <section aria-labelledby="faq-title" className="section bg-cream">
      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-16">
        <Reveal>
          <h2 id="faq-title" className="t-h2">
            {title}
          </h2>
        </Reveal>
        <div className="border-t border-line">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 font-heading text-[1.0625rem] font-bold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="relative h-5 w-5 shrink-0">
                  <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-terracotta-deep" />
                  <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-terracotta-deep transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-prose pb-5 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
