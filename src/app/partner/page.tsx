import type { Metadata } from "next";
import Link from "next/link";
import { BrandForm } from "@/components/forms/BrandForm";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { resources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partner with us",
  description: "Brief us on your campaign. We propose creators who fit your audience and goals, and agree the plan in writing before anything is made.",
  alternates: { canonical: "/partner" },
};

export default function PartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Brand enquiry"
        title={<>Start a <span className="serif-em text-terracotta">partnership</span></>}
        lead="Tell us what you want to achieve. A short brief is enough to begin, and you can also use this form for a general question."
      />
      <section className="pb-24 pt-6 lg:pt-10">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-16">
          <aside aria-labelledby="brief-title">
            <h2 id="brief-title" className="t-h3">
              Helpful to include
            </h2>
            <ul className="mt-5 space-y-3">
              {resources.brand.items.slice(0, 5).map((line) => (
                <li key={line} className="flex gap-3 text-[0.95rem] text-muted">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-clay" />
                  {line}
                </li>
              ))}
            </ul>
            <Link href="/resources" className="link-u mt-6 inline-block font-heading font-bold">
              See the full brief template
            </Link>
          </aside>
          <div className="shape-soft border border-line bg-paper p-5 sm:p-10" id="enquiry">
            <BrandForm />
          </div>
        </div>
      </section>
    </>
  );
}
