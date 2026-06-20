import { useRef } from "react";

/**
 * useSmoothScroll — Formerly handled JS wheel scroll hijacking.
 * Now a lightweight no-op returning a container ref, letting the browser
 * handle scrolling natively on the hardware-accelerated compositor thread.
 */
export function useSmoothScroll<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);
  return containerRef;
}
