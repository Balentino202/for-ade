import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";

// Plays a polaroid's video only while it's on screen. Phones struggle
// (and heat up) decoding six videos at once; this keeps it to the one
// or two she can actually see.
export const usePolaroidVideo = () => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const isVisible = useInView(ref, { amount: 0.25 });

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (isVisible) {
      // Blocked autoplay (e.g. iPhone Low Power Mode) just leaves the
      // poster image showing.
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isVisible]);

  return ref;
};
