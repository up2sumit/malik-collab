"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, sportIcon } from "@/components/ui/Icon";
import type { Story } from "@/lib/content";

/**
 * Scroll-snap carousel. Native scrolling gives touch swipe and momentum for free;
 * buttons and arrow keys drive the same scroller. No autoplay.
 */
export function StoriesPanel({ stories }: { stories: readonly Story[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(stories.length > 1);

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-slide]");
    const step = first ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth;
    setIndex(Math.min(stories.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, [stories.length]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  const go = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-slide]");
    const step = (first?.offsetWidth ?? el.clientWidth) + parseFloat(getComputedStyle(el).columnGap || "0");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="wrap section grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2.15fr)] lg:gap-12">
      <div>
        <p className="t-eyebrow text-paper">Creator stories</p>
        <h2 id="stories-title" className="t-h2 mt-3 text-paper">
          Stories from our community
        </h2>
        <p className="mt-4 max-w-sm text-paper">Hear from the creators who have built partnerships through the platform.</p>

        <div className="mt-8 flex items-center gap-4">
          <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-paper/70 text-paper transition-colors hover:bg-paper hover:text-clay disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-paper" onClick={() => go(-1)} disabled={!canPrev} aria-label="Previous story">
            <Icon name="chevron-left" size={20} />
          </button>
          <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-paper/70 text-paper transition-colors hover:bg-paper hover:text-clay disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-paper" onClick={() => go(1)} disabled={!canNext} aria-label="Next story">
            <Icon name="chevron-right" size={20} />
          </button>
          <p className="font-heading text-sm font-bold tabular-nums text-paper" aria-live="polite">
            {pad(index + 1)} <span className="font-medium">/ {pad(stories.length)}</span>
          </p>
        </div>
      </div>

      <div role="group" aria-roledescription="carousel" aria-labelledby="stories-title" className="min-w-0">
        <div
          ref={scroller}
          role="group"
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label="Slides. Use the left and right arrow keys to move between stories."
          className="no-scrollbar bleed flex snap-x snap-mandatory gap-4 overflow-x-auto py-2 lg:mx-0 lg:px-0 lg:[mask-image:linear-gradient(to_right,black_90%,transparent)]"
        >
          {stories.map((story, i) => (
            <div
              key={story.id}
              data-slide
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${stories.length}`}
              className="w-[min(21rem,82vw)] shrink-0 snap-start"
            >
              <figure className="shape-soft flex h-full flex-col bg-paper p-6 text-ink shadow-[0_18px_40px_-26px_rgba(35,20,10,0.6)]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage/30 text-forest">
                    <Icon name={sportIcon(story.sport.toLowerCase())} size={22} />
                  </span>
                  <figcaption className="leading-tight">
                    <span className="block font-heading text-[0.95rem] font-bold">{story.name}</span>
                    <span className="text-[0.8125rem] text-muted">{story.sport} creator</span>
                  </figcaption>
                </div>
                <blockquote className="mt-5 flex-1 text-[0.975rem] leading-relaxed">
                  <span aria-hidden="true" className="serif-em mr-1 text-3xl leading-none text-terracotta">“</span>
                  {story.quote}
                </blockquote>
                {story.demo && (
                  <p className="mt-5 inline-flex w-fit items-center rounded-full bg-sand px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-ink">
                    Sample story · replace before launch
                  </p>
                )}
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
