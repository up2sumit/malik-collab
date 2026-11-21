import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { Icon } from "@/components/ui/Icon";
import { Ridge, ridges, WaveTop } from "@/components/ui/Wave";

export function ClosingCta() {
  return (
    <section aria-labelledby="cta-title" className="on-dark relative bg-forest text-paper">
      <WaveTop fill="var(--color-forest)" variant="a" />

      {/* Landscape silhouette, clipped to the section */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Ridge points={ridges.closing} height={160} className="absolute inset-x-0 bottom-0 h-40 w-full text-forest-deep/70" />
      </div>

      <div className="wrap relative grid items-center gap-10 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 lg:py-28">
        <div>
          <h2 id="cta-title" className="t-h2">
            Ready to create something <span className="serif-em text-amber">bigger?</span>
          </h2>
          <p className="t-lead mt-5 max-w-lg text-paper/85">Join a community of sports creators and brands building meaningful collaborations.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/apply" className="btn btn-light">
              Apply as a Creator <Icon name="arrow" size={18} className="arrow" />
            </Link>
            <Link href="/partner" className="btn btn-outline-light">
              <Icon name="mail" size={18} /> Contact Us
            </Link>
          </div>
        </div>

        <div className="shape-leaf relative aspect-[16/10] overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
          <Photo slot="closing-group" scene="group" sizes="(min-width: 1024px) 45vw, 92vw" />
        </div>
      </div>
    </section>
  );
}
