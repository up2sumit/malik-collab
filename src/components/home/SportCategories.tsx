import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { Icon, sportIcon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { sports } from "@/lib/sports";

const FEATURED = 6;

export function SportCategories() {
  const featured = sports.slice(0, FEATURED);
  return (
    <section aria-labelledby="categories-title" className="section pb-24 pt-6 lg:pb-36 lg:pt-10">
      <div className="wrap">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="categories-title" className="t-h2 flex items-center justify-center gap-4">
            <span aria-hidden="true" className="hidden h-px w-10 bg-terracotta-deep sm:block" />
            Explore Sports Categories
            <span aria-hidden="true" className="hidden h-px w-10 bg-terracotta-deep sm:block" />
          </h2>
          <p className="mt-4 text-muted">A diverse community of sports creators, from the court to the trail.</p>
        </Reveal>

        <Reveal delay={80}>
          <ul className="no-scrollbar bleed mt-10 flex snap-x gap-3 overflow-x-auto pb-3 pt-1 lg:mx-0 lg:grid lg:grid-cols-7 lg:items-end lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
            {featured.map((sport, i) => (
              <li key={sport.slug} className="w-[44vw] max-w-[12rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
                <Link
                  href={`/sports/${sport.slug}`}
                  className={`group relative block overflow-hidden shape-soft ${i % 2 === 0 ? "aspect-[3/4]" : "aspect-[3/3.7]"} ${i % 3 === 1 ? "shape-leaf-alt" : ""}`}
                >
                  <Photo
                    slot={`sport-${sport.slug}`}
                    scene={sport.slug}
                    sizes="(min-width: 1024px) 14vw, 44vw"
                    className="transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3.5 text-paper">
                    <span className="flex items-center gap-2 font-heading text-[0.9rem] font-bold">
                      <Icon name={sportIcon(sport.slug)} size={18} />
                      {sport.name}
                    </span>
                    <Icon name="arrow-up-right" size={16} className="translate-y-1 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100" />
                  </span>
                </Link>
              </li>
            ))}
            <li className="w-[44vw] max-w-[12rem] shrink-0 snap-start self-center lg:w-auto lg:max-w-none">
              <Link
                href="/collaborations"
                className="group flex aspect-[3/3.7] flex-col items-start justify-center gap-3 rounded-[1.25rem] border border-dashed border-terracotta-deep/60 p-4 font-heading font-bold transition-colors hover:bg-sand"
              >
                <span className="text-[0.95rem]">View all sports</span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-deep text-paper">
                  <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
