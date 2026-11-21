"use client";

import { useEffect } from "react";

/**
 * Sets `data-hydrated` on <html> once React has attached to the page.
 * Automated tests wait for it before interacting, so clicks are never lost on
 * controls that exist in the HTML but are not interactive yet.
 */
export function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);
  return null;
}
