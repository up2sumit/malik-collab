import type { Metadata } from "next";
import { CreatorForm } from "@/components/forms/CreatorForm";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Apply as a creator",
  description: "Tell us about your sport and your content. We review every application and introduce creators to brands that fit.",
  alternates: { canonical: "/apply" },
};

const expect = [
  "Applications take about five minutes.",
  "We review your links and your recent work.",
  "If it is a good fit, we reply by email to talk about next steps.",
];

export default function ApplyPage() {
  return (
    <>
      <PageHero eyebrow="Creator application" title={<>Tell us about your <span className="serif-em text-terracotta">sport</span></>} lead="Share a little about who you are and what you make. We read every application." />
      <section className="pb-24 pt-6 lg:pt-10">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-16">
          <aside aria-labelledby="expect-title">
            <h2 id="expect-title" className="t-h3">
              What to expect
            </h2>
            <ul className="mt-5 space-y-4">
              {expect.map((line) => (
                <li key={line} className="flex gap-3 text-muted">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-clay" />
                  {line}
                </li>
              ))}
            </ul>
          </aside>
          <div className="shape-soft border border-line bg-paper p-5 sm:p-10">
            <CreatorForm />
          </div>
        </div>
      </section>
    </>
  );
}
