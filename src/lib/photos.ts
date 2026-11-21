import type { SceneVariant } from "@/components/media/Scene";

export interface PhotoAsset {
  /** Path under /public, e.g. "/photos/hero-portrait.webp". */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type PhotoSlot =
  | "hero-portrait"
  | "hero-cycling"
  | "hero-basketball"
  | "hero-surfing"
  | "closing-group"
  | `sport-${SceneVariant}`;

/**
 * Register real, licensed photographs here, keyed by slot. Any slot with no
 * entry falls back to the vector scene so layouts never break.
 *
 * Example:
 *   "hero-portrait": { src: "/photos/hero-portrait.webp", alt: "A trail runner smiling at sunrise", width: 1600, height: 2000 },
 *
 * See README.md → "Replacing images" for sizing and licensing guidance.
 */
export const photos: Partial<Record<PhotoSlot, PhotoAsset>> = {};
