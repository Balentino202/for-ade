import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Wherever she taps or clicks, a few tiny hearts pop out. Bursts clean
// themselves up after the animation, and at most a handful exist at once.
export type TapBurst = { id: number; x: number; y: number };

const LIFETIME_MS = 1100;
const MAX_BURSTS = 6;

export const useTapHearts = () => {
  const prefersReducedMotion = useReducedMotion();
  const [bursts, setBursts] = useState<TapBurst[]>([]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let nextId = 1;
    const onPointerDown = (e: PointerEvent) => {
      const burst = { id: nextId++, x: e.clientX, y: e.clientY };
      setBursts((prev) => [...prev.slice(-(MAX_BURSTS - 1)), burst]);
      window.setTimeout(
        () => setBursts((prev) => prev.filter((b) => b.id !== burst.id)),
        LIFETIME_MS
      );
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [prefersReducedMotion]);

  return { bursts };
};
