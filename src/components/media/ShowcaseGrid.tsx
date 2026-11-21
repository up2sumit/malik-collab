"use client";

import { useState } from "react";
import { Photo } from "@/components/media/Photo";
import { VideoModal } from "@/components/media/VideoModal";
import { Icon } from "@/components/ui/Icon";
import { platformLabel, type ShowcaseItem } from "@/lib/content";
import { getSport } from "@/lib/sports";
import { getYouTubeId } from "@/lib/youtube";

function Tile({ item, onPlay }: { item: ShowcaseItem; onPlay: (item: ShowcaseItem, id: string) => void }) {
  const sport = getSport(item.sport);
  const portrait = item.platform !== "youtube";
  const youtubeId = item.url ? getYouTubeId(item.url) : null;

  const body = (
    <>
      <div className={`relative overflow-hidden ${portrait ? "aspect-[9/14]" : "aspect-video"} ${portrait ? "shape-leaf" : "shape-soft"}`}>
        <Photo slot={`sport-${item.sport}`} scene={item.sport} sizes="(min-width: 1024px) 30vw, 50vw" className="transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105" />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        {item.url && (
          <span className="absolute left-1/2 top-1/2 inline-flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper/95 text-clay transition-transform duration-300 group-hover:scale-110">
            <Icon name={youtubeId ? "play" : "arrow-up-right"} size={22} />
          </span>
        )}
        {item.demo && (
          <span className="absolute left-3 top-3 rounded-full bg-paper px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-ink">Sample</span>
        )}
      </div>
      <div className="mt-3">
        <p className="t-eyebrow text-clay">
          {sport?.name} · {platformLabel[item.platform]}
        </p>
        <h3 className="mt-1 font-heading text-[1.0625rem] font-bold leading-snug">{item.title}</h3>
        <p className="text-sm text-muted">{item.creator}</p>
      </div>
    </>
  );

  if (youtubeId) {
    return (
      <button type="button" onClick={() => onPlay(item, youtubeId)} className="group block w-full text-left" aria-label={`Play video: ${item.title}`}>
        {body}
      </button>
    );
  }
  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block" aria-label={`${item.title} (opens in a new tab)`}>
        {body}
      </a>
    );
  }
  // Sample tile: nothing to open, so it is deliberately not interactive.
  return <div className="group block">{body}</div>;
}

export function ShowcaseGrid({ items }: { items: readonly ShowcaseItem[] }) {
  const [active, setActive] = useState<{ item: ShowcaseItem; id: string } | null>(null);

  return (
    <>
      <ul className="grid grid-cols-1 items-end gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1fr_1.6fr_1fr] lg:items-center">
        {items.map((item) => (
          <li key={item.id}>
            <Tile item={item} onPlay={(it, id) => setActive({ item: it, id })} />
          </li>
        ))}
      </ul>
      <VideoModal
        youtubeId={active?.id ?? null}
        title={active?.item.title ?? "Video"}
        portrait={active ? active.item.platform !== "youtube" : false}
        onClose={() => setActive(null)}
      />
    </>
  );
}
