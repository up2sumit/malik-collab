import { Reveal } from "@/components/ui/Reveal";
import { WaveTop } from "@/components/ui/Wave";
import { steps } from "@/lib/content";
import { StepArt } from "./StepArt";

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="relative bg-sand">
      <WaveTop fill="var(--color-sand)" variant="a" />
      <div className="wrap section grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:gap-10">
        <Reveal>
          <p className="t-eyebrow text-clay">How it works</p>
          <h2 id="how-title" className="t-h2 mt-3">
            From passion to <span className="serif-em text-terracotta">partnership</span>
          </h2>
          <p className="mt-4 max-w-sm text-muted">A simple path from creator to collaboration.</p>
        </Reveal>

        <div className="relative">
          <ol className="grid gap-0 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, i) => (
              <li key={step.n} className="relative pb-10 pl-16 last:pb-0 lg:pb-0 lg:pl-0">
                {i < steps.length - 1 && (
                  <>
                    <span aria-hidden="true" className="absolute bottom-0 left-[1.15rem] top-10 w-px border-l border-dashed border-terracotta-deep/45 lg:hidden" />
                    <svg
                      className="pointer-events-none absolute left-[3.75rem] top-0 hidden h-11 w-[calc(100%-4.5rem)] text-clay/50 lg:block"
                      viewBox="0 0 200 44"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M0 22 C40 2 70 2 100 22 S160 42 200 22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </>
                )}
                <span className="absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-terracotta-deep font-heading text-sm font-extrabold text-paper lg:static lg:mb-4 lg:h-11 lg:w-11">
                  {step.n}
                </span>
                <Reveal delay={i * 110} className="lg:text-left">
                  <StepArt art={step.art} className="mb-3 h-24 w-32 lg:mb-5 lg:h-28 lg:w-36" />
                  <h3 className="t-h3">{step.title}</h3>
                  <p className="mt-2 max-w-[20rem] text-[0.95rem] text-muted">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
