import { motion } from "framer-motion";
import { HeartIcon, SparkleIcon } from "lucide-react";

// Hearts and sparkles drifting down behind the finale. Positions are
// fixed so the scene looks composed rather than random.
const DROPS = [
  { left: "4%", size: 18, delay: 0, duration: 9, sky: true },
  { left: "12%", size: 12, delay: 2.5, duration: 11, sky: false },
  { left: "20%", size: 22, delay: 5, duration: 10, sky: false },
  { left: "29%", size: 10, delay: 1.2, duration: 12, sky: true },
  { left: "37%", size: 16, delay: 6.5, duration: 9.5, sky: false },
  { left: "46%", size: 12, delay: 3.4, duration: 11.5, sky: true },
  { left: "54%", size: 20, delay: 0.6, duration: 10.5, sky: false },
  { left: "62%", size: 11, delay: 4.2, duration: 12, sky: true },
  { left: "70%", size: 17, delay: 7.4, duration: 9, sky: false },
  { left: "78%", size: 13, delay: 2, duration: 11, sky: true },
  { left: "86%", size: 21, delay: 5.6, duration: 10, sky: false },
  { left: "94%", size: 12, delay: 3, duration: 12.5, sky: true },
];

const HeartRain = () => {
  return (
    <div
      aria-hidden
      className="motion-decor pointer-events-none absolute inset-0 overflow-hidden"
    >
      {DROPS.map((d, i) => {
        const Icon = i % 3 === 2 ? SparkleIcon : HeartIcon;
        return (
          <motion.span
            key={i}
            className={
              d.sky ? "absolute top-0 text-sky" : "absolute top-0 text-lilac"
            }
            style={{ left: d.left }}
            initial={{ y: "-10vh", opacity: 0, rotate: -15 }}
            animate={{
              y: "110vh",
              opacity: [0, 0.8, 0.8, 0],
              rotate: 20,
              x: [0, 18, -12, 6],
            }}
            transition={{
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Icon
              width={d.size}
              height={d.size}
              fill="currentColor"
              strokeWidth={0}
              className="drop-shadow-[0_0_8px_currentColor]"
            />
          </motion.span>
        );
      })}
    </div>
  );
};

export default HeartRain;
