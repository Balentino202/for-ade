import { AnimatePresence, motion } from "framer-motion";
import { HeartIcon, SparkleIcon } from "lucide-react";

// A small one-shot burst of hearts and sparkles. Change `burstKey` to
// replay it; `0` renders nothing.
const PARTICLES = [
  { x: -56, y: -40, heart: true },
  { x: -30, y: -70, heart: false },
  { x: 0, y: -84, heart: true },
  { x: 32, y: -68, heart: false },
  { x: 58, y: -38, heart: true },
  { x: -48, y: 8, heart: false },
  { x: 50, y: 10, heart: false },
];

type SparkleBurstProps = {
  burstKey: number;
};

const SparkleBurst = ({ burstKey }: SparkleBurstProps) => {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <AnimatePresence>
        {burstKey > 0 && (
          <span key={burstKey} className="absolute">
            {PARTICLES.map((p, i) => {
              const Icon = p.heart ? HeartIcon : SparkleIcon;
              return (
                <motion.span
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-lilac-light"
                  initial={{ x: 0, y: 0, scale: 0.2, opacity: 0 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    scale: [0.2, 1, 0.8],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.9,
                    ease: "easeOut",
                    delay: i * 0.02,
                  }}
                >
                  <Icon
                    width={p.heart ? 14 : 12}
                    height={p.heart ? 14 : 12}
                    fill="currentColor"
                    strokeWidth={p.heart ? 0 : 1.5}
                  />
                </motion.span>
              );
            })}
          </span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default SparkleBurst;
