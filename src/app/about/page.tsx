import type { Metadata } from "next";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "What we believe about sports content, creators and the brands that work with them.",
  alternates: { canonical: "/about" },
};

const principles = [
  { title: "Creators lead", body: "The best sports content comes from people who know the game. Our job is to protect their voice, not dilute it." },
  { title: "Fit before reach", body: "A smaller audience that cares beats a larger one that does not. We match on sport, values and content, then talk numbers." },
  { title: "Everything in writing", body: "Deliverables, dates, usage and payment are agreed before any work begins, so both sides know what good looks like." },
  { title: "Honest disclosure", body: "Sponsored work is labelled clearly. Audiences trust creators who are open about it, and so do we." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`About ${site.name}`}
        title={<>Sport is better when the people who play it are <span className="serif-em text-terracotta">heard</span></>}
        lead="We connect sports creators and the brands that back them, and we try to make that relationship fair, clear and good for the audience."
      />
      <section aria-labelledby="principles-title" className="section bg-cream pt-6">
        <div className="wrap">
          <h2 id="principles-title" className="t-h2 max-w-2xl">
            How we work
          </h2>
          <div className="mt-12 grid gap-x-16 border-t border-line md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 80} className="border-b border-line py-8">
                <h3 className="t-h3">{p.title}</h3>
                <p className="mt-2 max-w-md text-muted">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Let's make something together" body="Whether you create or you build a brand, we would like to hear from you." primary={{ href: "/apply", label: "Apply as a Creator" }} secondary={{ href: "/partner", label: "Partner With Us" }} />
    </>
  );
}
