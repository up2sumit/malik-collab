import { WaveTop } from "@/components/ui/Wave";
import { stories } from "@/lib/content";
import { showDemoContent } from "@/lib/site";
import { StoriesPanel } from "./StoriesPanel";

export function Stories() {
  // Never ship sample testimonials to production by accident.
  const visible = stories.filter((s) => !s.demo || showDemoContent());
  if (visible.length === 0) return null;

  return (
    <section aria-labelledby="stories-title" className="on-dark relative bg-terracotta-deep">
      <WaveTop fill="var(--color-terracotta-deep)" variant="b" />
      <StoriesPanel stories={visible} />
    </section>
  );
}
