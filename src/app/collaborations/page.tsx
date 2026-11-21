import type { Metadata } from "next";
import Link from "next/link";
import { Showcase } from "@/components/home/Showcase";
import { Photo } from "@/components/media/Photo";
import { CtaBand } from "@/components/ui/CtaBand";
import { Icon, sportIcon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { sports } from "@/lib/sports";

export const metadata: Metadata = {
  title: "Collaborations",
  description: "Explore sports categories and featured creator collaborations.",
  alternates: { canonical: "/collaborations" },
};

export default function CollaborationsPage() {
  return (
    <>
      <PageHero eyebrow="Collaborations" title={<>Every sport has a <span className="serif-em text-terracotta">story</span></>} lead="Browse by sport to see what creators and brands are making together." />

      <section aria-labelledby="sports-title" className="pb-20">
        <div className="wrap">
          <h2 id="sports-title" className="sr-only">
            Sports categories
          </h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {sports.map((sport, i) => (
              <li key={sport.slug} className={i % 3 === 0 ? "md:translate-y-6" : ""}>
                <Link href={`/sports/${sport.slug}`} className="group relative block aspect-[3/4] overflow-hidden shape-soft">
                  <Photo slot={`sport-${sport.slug}`} scene={sport.slug} sizes="(min-width: 768px) 22vw, 46vw" className="transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105" />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4 text-paper">
                    <span className="flex items-center gap-2 font-heading text-lg font-bold">
                      <Icon name={sportIcon(sport.slug)} size={20} />
                      {sport.name}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] text-paper/85">{sport.short}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Showcase />
      <CtaBand title="Want to be featured here?" body="Apply as a creator, or brief us as a brand." primary={{ href: "/apply", label: "Apply as a Creator" }} secondary={{ href: "/partner", label: "Partner With Us" }} />
    </>
  );
}
