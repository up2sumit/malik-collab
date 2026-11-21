import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Photo } from "@/components/media/Photo";
import { CtaBand } from "@/components/ui/CtaBand";
import { Faq } from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { creatorBenefits, creatorCriteria, creatorFaq } from "@/lib/content";

export const metadata: Metadata = {
  title: "For creators",
  description: "Turn your passion for sport into real opportunities. What creators get, what we look for, and how to apply.",
  alternates: { canonical: "/creators" },
};

export default function CreatorsPage() {
  return (
    <>
      <PageHero
        eyebrow="For creators"
        title={<>Built for creators who take their sport <span className="serif-em text-terracotta">seriously</span></>}
        lead="You bring the voice and the knowledge. We bring introductions to brands that fit, and a clear process once you are talking."
        actions={
          <>
            <Link href="/apply" className="btn">
              Apply as a Creator <Icon name="arrow" size={18} className="arrow" />
            </Link>
            <Link href="/resources" className="btn btn-outline">
              Media-kit checklist
            </Link>
          </>
        }
        aside={
          <div className="shape-leaf relative aspect-[5/4] overflow-hidden">
            <Photo slot="sport-running" scene="running" priority sizes="(min-width: 1024px) 40vw, 92vw" />
          </div>
        }
      />

      <section aria-labelledby="benefits-title" className="section bg-cream pt-6">
        <div className="wrap">
          <Reveal>
            <h2 id="benefits-title" className="t-h2 max-w-2xl">
              What you get
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-x-16 border-t border-line md:grid-cols-2">
            {creatorBenefits.map((b, i) => (
              <Reveal key={b.title} delay={(i % 2) * 80} className="border-b border-line py-8">
                <h3 className="t-h3">{b.title}</h3>
                <p className="mt-2 max-w-md text-muted">{b.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <section aria-labelledby="criteria-title" className="section bg-cream">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <h2 id="criteria-title" className="t-h2">
              What we look <span className="serif-em text-terracotta">for</span>
            </h2>
            <p className="t-lead mt-5 max-w-md text-muted">We care about the quality and honesty of your work far more than the size of your following.</p>
          </Reveal>
          <ul className="space-y-5">
            {creatorCriteria.map((c, i) => (
              <Reveal as="li" key={c} delay={i * 60} className="flex gap-4 border-b border-line pb-5">
                <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-paper">
                  <Icon name="check" size={16} />
                </span>
                <span className="text-[1.0625rem]">{c}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Faq items={creatorFaq} />
      <CtaBand title="Ready to apply?" body="It takes about five minutes. Tell us about your sport and share a few links to your work." primary={{ href: "/apply", label: "Apply as a Creator" }} />
    </>
  );
}
