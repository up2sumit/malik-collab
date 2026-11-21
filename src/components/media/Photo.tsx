import Image from "next/image";
import { photos, type PhotoSlot } from "@/lib/photos";
import { Scene, type SceneVariant } from "./Scene";

interface PhotoProps {
  slot: PhotoSlot;
  /** Vector fallback used when no real photo is registered for the slot. */
  scene: SceneVariant;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Per-slot object-position for the real photo, e.g. "50% 30%". Keeps the subject in frame when cropped. */
  focal?: string;
}

/** A photograph (or its stand-in) that fills its positioned parent. */
export function Photo({ slot, scene, className, sizes = "100vw", priority = false, focal = "50% 40%" }: PhotoProps) {
  const asset = photos[slot];
  return (
    <div className={`grain absolute inset-0 overflow-hidden ${className ?? ""}`} data-photo-slot={slot} data-photo-real={asset ? "true" : "false"}>
      {asset ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
          style={{ objectPosition: focal }}
        />
      ) : (
        <Scene variant={scene} />
      )}
    </div>
  );
}
