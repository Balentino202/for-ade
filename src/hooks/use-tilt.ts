import { useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";

// Gentle 3D tilt that follows the pointer. Returns motion values to put
// on a `motion.*` element's `style`, plus the pointer handlers.
export const useTilt = (maxDegrees = 10) => {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springX = useSpring(px, { stiffness: 200, damping: 18 });
  const springY = useSpring(py, { stiffness: 200, damping: 18 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxDegrees, maxDegrees]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxDegrees, -maxDegrees]);
  const glareX = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["0%", "100%"]);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return { rotateX, rotateY, glareX, glareY, onPointerMove, onPointerLeave };
};
