import SceneShell from "@/components/scenes/scene-shell";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { SparkleIcon } from "lucide-react";
import { heartArc, heartPath, heartStars } from "./heart-geometry";
import { useWishSceneViewModel } from "./use-wish-scene-view-model";

// 9:30 PM — tap the stars to draw a heart in the night sky.
const WishScene = () => {
  const vm = useWishSceneViewModel();
  const stars = heartStars(vm.total);

  return (
    <SceneShell {...vm.copy} tone="night" headingId="wishes-heading">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="relative aspect-[10/9] w-[min(92vw,620px)]">
          <svg
            aria-hidden
            viewBox="0 0 100 90"
            className="absolute inset-0 size-full overflow-visible"
          >
            <defs>
              <linearGradient id="wish-heart" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#bfe6ff" />
                <stop offset="55%" stopColor="#c8a2c8" />
                <stop offset="100%" stopColor="#8a64b8" />
              </linearGradient>
              <filter
                id="wish-glow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* The heart fills with light once every star is lit */}
            <motion.path
              d={heartPath}
              fill="url(#wish-heart)"
              filter="url(#wish-glow)"
              initial={false}
              animate={
                vm.isComplete
                  ? { opacity: [0, 0.85, 0.6], scale: [0.9, 1.04, 1] }
                  : { opacity: 0, scale: 0.9 }
              }
              style={{ transformOrigin: "50% 50%" }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />

            {/* Constellation lines, following the curve of the heart */}
            {stars.map((_, i) => {
              const arc = heartArc(i, stars.length);
              const on = vm.isLit(i) && vm.isLit((i + 1) % stars.length);
              return (
                <g key={i}>
                  <path
                    d={arc}
                    fill="none"
                    stroke="rgb(230 211 245 / 0.2)"
                    strokeWidth={0.35}
                    strokeDasharray="1 1.6"
                  />
                  <motion.path
                    d={arc}
                    fill="none"
                    stroke="#e6d3f5"
                    strokeWidth={0.6}
                    strokeLinecap="round"
                    filter="url(#wish-glow)"
                    initial={false}
                    animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Her name, glowing inside the finished heart */}
          <AnimatePresence>
            {vm.isComplete && vm.name && (
              <motion.p
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[38%] text-center font-script text-[clamp(3.5rem,14vw,6.5rem)] leading-none text-white drop-shadow-[0_0_24px_rgb(230_211_245/0.95)]"
                initial={{ opacity: 0, scale: 0.6, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.4, delay: 0.9, ease: "easeOut" }}
              >
                {vm.name}
              </motion.p>
            )}
          </AnimatePresence>

          <ul>
            {stars.map((p, i) => {
              const lit = vm.isLit(i);
              const isLast = vm.lastIndex === i;
              return (
                <li
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.x}%`, top: `${(p.y / 90) * 100}%` }}
                >
                  <motion.button
                    type="button"
                    onClick={() => vm.light(i)}
                    aria-pressed={lit}
                    aria-label={`Star ${i + 1}${lit ? `: ${vm.copy.items[i]}` : ""}`}
                    className="relative flex size-12 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-sky focus-visible:outline-none"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, type: "spring" }}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {!lit && (
                      <span className="absolute inset-2 animate-pulse-ring rounded-full bg-sky/30" />
                    )}
                    <motion.span
                      animate={
                        lit
                          ? {
                              scale: isLast ? [1, 1.9, 1.3] : 1.3,
                              rotate: isLast ? [0, 90] : 0,
                            }
                          : { scale: [0.8, 1, 0.8], opacity: [0.6, 1, 0.6] }
                      }
                      transition={
                        lit
                          ? { duration: 0.7 }
                          : { duration: 2 + (i % 3) * 0.4, repeat: Infinity }
                      }
                    >
                      <SparkleIcon
                        className={cn(
                          "size-6 transition-colors duration-500",
                          lit
                            ? "text-white drop-shadow-[0_0_10px_#e6d3f5]"
                            : "text-sky-light/80"
                        )}
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    </motion.span>
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-4 text-sm tracking-[0.25em] text-haze uppercase tabular-nums">
          {vm.litCount} / {vm.total}
        </p>

        <div className="mt-6 min-h-36 text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {vm.isComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.6 }}
              >
                <p className="font-script text-6xl text-dream">
                  {vm.copy.completeTitle}
                </p>
                <p className="mt-3 font-serif text-2xl text-starlight/90 italic">
                  {vm.copy.completeText}
                </p>
              </motion.div>
            ) : vm.lastWish ? (
              <motion.p
                key={vm.lastWish}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.5 }}
                className="max-w-xl font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-snug text-starlight italic text-balance"
              >
                {vm.lastWish}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </SceneShell>
  );
};

export default WishScene;
