import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { WaveTop } from "@/components/ui/Wave";
import { partnershipTypes, partners } from "@/lib/content";

export function BrandCollab() {
  return (
    <section aria-labelledby="brands-title" className="relative bg-cream">
      <WaveTop fill="var(--color-cream)" variant="c" />
      <div className="wrap section grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="t-eyebrow text-clay">Brand collaborations</p>
          <h2 id="brands-title" className="t-h2 mt-3">
            Where creativity <span className="serif-em text-terracotta">meets</span> opportunity
          </h2>
          <p className="t-lead mt-5 max-w-md text-muted">
            Work with sports creators whose audiences already trust them. We help you find the right fit, agree a clear brief and keep the result honest.
          </p>
          <Link href="/partner" className="btn mt-8">
            Start a Partnership <Icon name="arrow" size={18} className="arrow" />
          </Link>
        </Reveal>

        <ol className="border-t border-line">
          {partnershipTypes.map((item, i) => (
            <li key={item.title} className="border-b border-line">
              <Reveal delay={i * 50} className="grid grid-cols-[3rem_1fr] gap-x-4 py-6 sm:grid-cols-[4rem_1fr]">
                <span className="font-heading text-sm font-bold tabular-nums text-clay">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="t-h3">{item.title}</h3>
                  <p className="mt-1.5 max-w-prose text-[0.975rem] text-muted">{item.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      {partners.length > 0 && (
        <div className="wrap pb-20">
          <p className="t-eyebrow text-center text-muted">Trusted by</p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {partners.map((p) => (
              <li key={p.name}>
                <Image src={p.logoSrc} alt={p.name} width={p.width} height={p.height} className="h-8 w-auto opacity-80" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
