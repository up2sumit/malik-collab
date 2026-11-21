"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";

interface VideoModalProps {
  /** Validated 11-character YouTube id, or null when closed. */
  youtubeId: string | null;
  title: string;
  portrait: boolean;
  onClose: () => void;
}

/**
 * Accessible video dialog built on the native <dialog> element, which provides
 * the focus trap, Escape handling and inert background. The iframe only mounts
 * while open, so nothing loads or autoplays until a visitor asks for it.
 */
export function VideoModal({ youtubeId, title, portrait, onClose }: VideoModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = youtubeId !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop targets the <dialog> itself.
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-[95dvh] max-w-[95vw] overflow-visible bg-transparent p-0 backdrop:bg-ink/80"
    >
      {open && (
        <div className="relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="absolute -top-12 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink"
          >
            <Icon name="close" size={20} />
          </button>
          <div className={portrait ? "aspect-[9/16] h-[min(85dvh,52rem)] max-w-[92vw]" : "aspect-video w-[min(92vw,64rem)]"}>
            <iframe
              className="h-full w-full rounded-xl bg-ink"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      )}
    </dialog>
  );
}
