import type { Metadata } from "next";
import Link from "next/link";
import { BrandCollab } from "@/components/home/BrandCollab";
import { CtaBand } from "@/components/ui/CtaBand";
import { Faq } from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { brandFaq, brandProcess } from "@/lib/content";

export const metadata: Metadata = {
  title: "For brands",
  description: "Work with sports creators whose audiences already trust them. How a campaign runs, from brief to report.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return (
    <>
      <PageHero
        eyebrow="For brands"
        title={<>Partner with creators your audience already <span className="serif-em text-terracotta">trusts</span></>}
        lead="Share a brief and we will propose creators who fit your goals, your product and your audience, with the reasoning for each."
        actions={
          <>
            <Link href="/partner" className="btn">
              Start a Partnership <Icon name="arrow" size={18} className="arrow" />
            </Link>
            <Link href="/resources" className="btn btn-outline">
              Brief template
            </Link>
          </>
        }
      />

      <BrandCollab />

      <section aria-labelledby="process-title" className="section bg-sand">
        <div className="wrap">
          <Reveal>
            <p className="t-eyebrow text-clay">How a campaign runs</p>
            <h2 id="process-title" className="t-h2 mt-3 max-w-2xl">
              From brief to <span className="serif-em text-terracotta">report</span>
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {brandProcess.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 70} className="border-t-2 border-ink pt-5">
                <span className="font-heading text-sm font-bold tabular-nums text-clay">{step.n}</span>
                <h3 className="t-h3 mt-2">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] text-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Faq items={brandFaq} />
      <CtaBand title="Have a campaign in mind?" body="Send a short brief. We will come back with a shortlist and a plan." primary={{ href: "/partner", label: "Start a Partnership" }} />
    </>
  );
}
