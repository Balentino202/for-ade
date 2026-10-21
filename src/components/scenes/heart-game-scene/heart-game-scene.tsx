import SparkleBurst from "@/components/decor/sparkle-burst";
import SceneShell from "@/components/scenes/scene-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { HeartIcon, PlayIcon, RotateCcwIcon, TimerIcon } from "lucide-react";
import FloatingHeart from "./floating-heart";
import { useHeartGameSceneViewModel } from "./use-heart-game-scene-view-model";

// 2:14 PM — "Catch my hearts", a tiny love game.
const HeartGameScene = () => {
  const vm = useHeartGameSceneViewModel();
  const isPlaying = vm.phase === "playing";

  return (
    <SceneShell {...vm.copy} tone="day" headingId="heart-game-heading">
      <div
        ref={vm.arenaRef}
        className={cn(
          "glass relative mx-auto h-[min(58dvh,580px)] w-full max-w-5xl overflow-hidden rounded-[2.5rem] select-none",
          isPlaying && "touch-none"
        )}
      >
        {/* Score + timer */}
        <div className="absolute inset-x-0 top-0 z-20 p-4 sm:p-5">
          <div className="flex items-center justify-between text-ink">
            <motion.span
              key={vm.score}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 rounded-full bg-white/75 px-4 py-1.5 font-semibold shadow-sm"
              aria-live="polite"
            >
              <HeartIcon
                className="size-4 text-lilac-deep"
                fill="currentColor"
                strokeWidth={0}
              />
              {vm.score} {vm.copy.scoreLabel}
            </motion.span>
            <span className="flex items-center gap-2 rounded-full bg-white/75 px-4 py-1.5 font-semibold tabular-nums shadow-sm">
              <TimerIcon className="size-4 text-sky-deep" />
              {vm.timeLeft}s
            </span>
          </div>
          {isPlaying && (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/50">
              <motion.div
                key={vm.roundKey}
                className="h-full rounded-full bg-linear-to-r from-sky to-lilac"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{
                  duration: vm.copy.durationSeconds,
                  ease: "linear",
                }}
              />
            </div>
          )}
        </div>

        {/* The hearts */}
        {vm.hearts.map((heart) => (
          <FloatingHeart
            key={heart.id}
            heart={heart}
            reducedMotion={vm.reducedMotion}
            onCatch={(x, y) => vm.catchHeart(heart.id, x, y)}
            onMiss={() => vm.miss(heart.id)}
          />
        ))}

        {/* "+1 smile" pops where she tapped */}
        <AnimatePresence>
          {vm.pops.map((pop) => (
            <motion.span
              key={pop.id}
              aria-hidden
              className={cn(
                "pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 font-hand text-3xl whitespace-nowrap",
                pop.isGold ? "text-[#c98a12]" : "text-ink"
              )}
              style={{ left: `${pop.x}%`, top: `${pop.y}%` }}
              initial={{ opacity: 1, y: 0, scale: 0.6 }}
              animate={{ opacity: 0, y: -60, scale: 1.1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <span className="relative">
                <SparkleBurst burstKey={pop.id} />
                {pop.label}
              </span>
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Start + result screens */}
        <AnimatePresence mode="wait">
          {vm.phase === "idle" && (
            <motion.div
              key="idle"
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.span
                aria-hidden
                animate={{ scale: [1, 1.15, 1, 1.2, 1] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                <HeartIcon
                  className="size-24 text-lilac-deep drop-shadow-[0_0_30px_rgb(200_162_200/0.9)]"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </motion.span>
              <Button size="xl" onClick={vm.start}>
                <PlayIcon /> {vm.copy.startLabel}
              </Button>
            </motion.div>
          )}

          {vm.phase === "done" && (
            <motion.div
              key="done"
              className="absolute inset-0 z-30 flex items-center justify-center bg-white/30 p-5 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative max-w-xl rounded-[2rem] bg-white/85 p-8 text-center text-ink shadow-float sm:p-10"
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 14 }}
                aria-live="polite"
              >
                <SparkleBurst burstKey={vm.roundKey} />
                <p className="font-serif text-7xl leading-none font-semibold text-lilac-deep tabular-nums">
                  {vm.score}
                </p>
                <p className="mt-4 font-script text-5xl text-ink">
                  {vm.resultTitle}
                </p>
                <p className="mt-4 font-hand text-[1.9rem] leading-tight text-ink-soft">
                  {vm.resultText}
                </p>
                <Button size="lg" className="mt-8" onClick={vm.start}>
                  <RotateCcwIcon /> {vm.copy.playAgainLabel}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
};

export default HeartGameScene;
