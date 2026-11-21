import type { Metadata } from "next";
import { CtaBand } from "@/components/ui/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { resources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description: "A media-kit checklist for creators, a brief template for brands and our content guidelines.",
  alternates: { canonical: "/resources" },
};

const blocks = [resources.creator, resources.brand, resources.guidelines] as const;

export default function ResourcesPage() {
  return (
    <>
      <PageHero eyebrow="Resources" title={<>Practical tools for better <span className="serif-em text-terracotta">partnerships</span></>} lead="Checklists we use ourselves. Use them whether or not you work with us." />
      <section aria-label="Resources" className="section bg-cream pt-6">
        <div className="wrap grid gap-10 lg:grid-cols-3">
          {blocks.map((block, i) => (
            <Reveal key={block.title} delay={i * 80} className="shape-soft border border-line bg-paper p-7">
              <h2 className="t-h3">{block.title}</h2>
              <ul className="mt-5 space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.95rem] text-muted">
                    <Icon name="check" size={18} className="mt-1 shrink-0 text-clay" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand title="Ready when you are" body="Use the checklist, then tell us about your work or your campaign." primary={{ href: "/apply", label: "Apply as a Creator" }} secondary={{ href: "/partner", label: "Partner With Us" }} />
    </>
  );
}
