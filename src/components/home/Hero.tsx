import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Parallax } from "@/components/ui/Parallax";
import { Ridge, ridges } from "@/components/ui/Wave";
import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pb-20 pt-[calc(var(--header-h)+2rem)] lg:pb-28 lg:pt-[calc(var(--header-h)+3.5rem)]">
      {/* Background: soft landscape ridge */}
      <Ridge points={ridges.hero} height={220} className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-sage/25 lg:h-56" />

      <div className="wrap relative grid items-center gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto]">
        <div className="relative z-10 lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="t-eyebrow fade-up flex items-center gap-3 text-ink/80" style={{ "--d": "0ms" } as React.CSSProperties}>
            <span aria-hidden="true" className="h-px w-8 bg-terracotta-deep" />
            {hero.eyebrow}
          </p>

          <h1 id="hero-title" className="t-hero mt-5">
            {hero.titleLines.map((line, i) => (
              <span className="line" key={line}>
                <span style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
                  {line}
                  {i === hero.titleLines.length - 1 && (
                    <>
                      {" "}
                      <em className="serif-em text-terracotta">{hero.titleEmphasis}</em>
                    </>
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p className="t-lead fade-up mt-6 max-w-[34rem] text-muted" style={{ "--d": "420ms" } as React.CSSProperties}>
            {hero.lead}
          </p>

          <div className="fade-up mt-8 flex flex-wrap gap-3" style={{ "--d": "540ms" } as React.CSSProperties}>
            <Link href="/apply" className="btn">
              Apply as a Creator <Icon name="arrow" size={18} className="arrow" />
            </Link>
            <Link href="/partner" className="btn btn-outline">
              Partner With Us
            </Link>
          </div>
        </div>

        {/* Photo collage */}
        <div className="relative mx-auto w-full max-w-[34rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
          <div className="relative aspect-[5/6] sm:aspect-[6/5] lg:aspect-[7/6]">
            <Parallax speed={0.06} className="absolute left-[10%] top-0 aspect-square h-[72%]">
              <div className="h-full w-full rounded-full bg-amber/45" />
            </Parallax>

            <div
              className="mask-in shape-leaf absolute bottom-0 left-0 h-[93%] w-[50%] overflow-hidden shadow-[0_24px_50px_-28px_rgba(35,43,39,0.55)]"
              style={{ "--d": "200ms" } as React.CSSProperties}
            >
              <Photo slot="hero-portrait" scene="hero" priority sizes="(min-width: 1024px) 28vw, 50vw" />
            </div>

            <div className="mask-in shape-leaf-alt absolute right-0 top-[2%] h-[33%] w-[43%] overflow-hidden" style={{ "--d": "320ms" } as React.CSSProperties}>
              <Photo slot="hero-cycling" scene="cycling" sizes="(min-width: 1024px) 20vw, 43vw" />
            </div>
            <div className="mask-in shape-soft absolute right-[9%] top-[38%] h-[27%] w-[38%] overflow-hidden" style={{ "--d": "420ms" } as React.CSSProperties}>
              <Photo slot="hero-basketball" scene="basketball" sizes="(min-width: 1024px) 18vw, 38vw" />
            </div>
            <div className="mask-in shape-leaf absolute bottom-0 right-0 h-[30%] w-[45%] overflow-hidden" style={{ "--d": "520ms" } as React.CSSProperties}>
              <Photo slot="hero-surfing" scene="surfing" sizes="(min-width: 1024px) 21vw, 45vw" />
            </div>
          </div>
        </div>

        <ul className="relative z-10 grid grid-cols-3 gap-3 sm:max-w-xl lg:col-start-1 lg:row-start-2 lg:self-start">
          {hero.highlights.map((item) => (
            <li key={item.label} className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-terracotta-deep/40 text-clay">
                <Icon name={item.icon as IconName} size={20} />
              </span>
              <span className="font-heading text-[0.8125rem] font-semibold leading-tight tracking-tight">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
