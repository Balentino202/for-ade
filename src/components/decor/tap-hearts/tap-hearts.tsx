import { motion } from "framer-motion";
import { HeartIcon } from "lucide-react";
import { useTapHearts } from "./use-tap-hearts";

const SPREAD = [
  { x: -26, y: -40, sky: true },
  { x: 0, y: -54, sky: false },
  { x: 26, y: -40, sky: true },
  { x: -14, y: -24, sky: false },
  { x: 16, y: -22, sky: false },
];

const TapHearts = () => {
  const { bursts } = useTapHearts();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      {bursts.map((b) => (
        <span key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
          {SPREAD.map((p, i) => (
            <motion.span
              key={i}
              className={
                p.sky ? "absolute text-white" : "absolute text-lilac-deep"
              }
              initial={{ x: -6, y: -6, scale: 0.3, opacity: 1 }}
              animate={{ x: p.x - 6, y: p.y - 6, scale: 1, opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.03 }}
            >
              <HeartIcon
                className="size-3 drop-shadow-[0_0_6px_currentColor]"
                fill="currentColor"
                strokeWidth={0}
              />
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  );
};

export default TapHearts;
