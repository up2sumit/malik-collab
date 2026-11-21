import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { visibleShowcase } from "@/components/home/Showcase";
import { ShowcaseGrid } from "@/components/media/ShowcaseGrid";
import { Photo } from "@/components/media/Photo";
import { CtaBand } from "@/components/ui/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { getSport, sports } from "@/lib/sports";

export function generateStaticParams() {
  return sports.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sports/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const sport = getSport(slug);
  if (!sport) return {};
  return {
    title: `${sport.name} creators and collaborations`,
    description: sport.about,
    alternates: { canonical: `/sports/${sport.slug}` },
  };
}

export default async function SportPage({ params }: PageProps<"/sports/[slug]">) {
  const { slug } = await params;
  const sport = getSport(slug);
  if (!sport) notFound();

  const items = visibleShowcase().filter((i) => i.sport === sport.slug);

  return (
    <>
      <PageHero
        eyebrow={sport.short}
        title={<>{sport.name} <span className="serif-em text-terracotta">collaborations</span></>}
        lead={sport.about}
        actions={
          <>
            <Link href="/apply" className="btn">
              Apply as a Creator <Icon name="arrow" size={18} className="arrow" />
            </Link>
            <Link href="/partner" className="btn btn-outline">
              Partner With Us
            </Link>
          </>
        }
        aside={
          <div className="shape-leaf relative aspect-[5/4] overflow-hidden">
            <Photo slot={`sport-${sport.slug}`} scene={sport.slug} priority sizes="(min-width: 1024px) 40vw, 92vw" />
          </div>
        }
      />

      <section aria-label={`${sport.name} details`} className="section bg-cream pt-6">
        <div className="wrap grid gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <h2 className="t-h3">What we look for in {sport.name.toLowerCase()} creators</h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {sport.lookingFor.map((line) => (
                <li key={line} className="py-4 text-muted">
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="t-h3">Campaign ideas for brands</h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {sport.campaignIdeas.map((line) => (
                <li key={line} className="py-4 text-muted">
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {items.length > 0 && (
        <section aria-labelledby="sport-work" className="section bg-cream pt-0">
          <div className="wrap">
            <h2 id="sport-work" className="t-h2 mb-10">
              Featured {sport.name.toLowerCase()} content
            </h2>
            <ShowcaseGrid items={items} />
          </div>
        </section>
      )}

      <CtaBand title={`Work in ${sport.name.toLowerCase()}?`} body="Apply as a creator, or tell us about a campaign." primary={{ href: "/apply", label: "Apply as a Creator" }} secondary={{ href: "/partner", label: "Partner With Us" }} />
    </>
  );
}
