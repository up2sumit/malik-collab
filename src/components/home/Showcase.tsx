import Link from "next/link";
import { ShowcaseGrid } from "@/components/media/ShowcaseGrid";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { showcase, type ShowcaseItem } from "@/lib/content";
import { showDemoContent } from "@/lib/site";

export function visibleShowcase(items: readonly ShowcaseItem[] = showcase): ShowcaseItem[] {
  return items.filter((item) => !item.demo || showDemoContent());
}

export function Showcase({ limit }: { limit?: number }) {
  const items = visibleShowcase().slice(0, limit);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="showcase-title" className="section bg-cream">
      <div className="wrap">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="t-eyebrow text-clay">Featured content</p>
            <h2 id="showcase-title" className="t-h2 mt-3 max-w-xl">
              Work worth <span className="serif-em text-terracotta">watching</span>
            </h2>
          </div>
          <Link href="/collaborations" className="link-u inline-flex items-center gap-2 self-start font-heading font-bold md:self-auto">
            See all collaborations <Icon name="arrow" size={18} />
          </Link>
        </Reveal>
        <ShowcaseGrid items={items} />
      </div>
    </section>
  );
}
