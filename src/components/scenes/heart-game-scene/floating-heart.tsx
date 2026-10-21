import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HeartIcon } from "lucide-react";
import type { FloatingHeartData } from "./use-heart-game-scene-view-model";

// One heart drifting up through the arena. The outer layer rises; the
// inner layer sways, so the rise can report when it's finished.
type FloatingHeartProps = {
  heart: FloatingHeartData;
  reducedMotion: boolean;
  onCatch: (clientX: number, clientY: number) => void;
  onMiss: () => void;
};

const COLORS = {
  sky: "text-sky-deep drop-shadow-[0_0_14px_rgb(135_206_235/0.9)]",
  lilac: "text-lilac-deep drop-shadow-[0_0_14px_rgb(200_162_200/0.9)]",
  gold: "text-[#f6c453] drop-shadow-[0_0_18px_rgb(246_196_83/0.95)]",
};

const FloatingHeart = ({
  heart,
  reducedMotion,
  onCatch,
  onMiss,
}: FloatingHeartProps) => {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${heart.x}%`,
        top: reducedMotion ? `${heart.y}%` : undefined,
      }}
      initial={reducedMotion ? { opacity: 0 } : { top: "105%" }}
      animate={reducedMotion ? { opacity: [0, 1, 1, 0] } : { top: "-18%" }}
      transition={{
        duration: reducedMotion ? 1.8 : heart.duration,
        ease: "linear",
      }}
      onAnimationComplete={onMiss}
    >
      <motion.button
        type="button"
        tabIndex={-1}
        aria-label={heart.kind === "gold" ? "Golden heart" : "Heart"}
        onPointerDown={(e) => onCatch(e.clientX, e.clientY)}
        className="block cursor-pointer p-2"
        animate={
          reducedMotion ? undefined : { x: [0, heart.drift, -heart.drift, 0] }
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.15 }}
      >
        <HeartIcon
          className={cn(COLORS[heart.kind])}
          width={heart.size}
          height={heart.size}
          fill="currentColor"
          strokeWidth={0}
        />
      </motion.button>
    </motion.div>
  );
};

export default FloatingHeart;
