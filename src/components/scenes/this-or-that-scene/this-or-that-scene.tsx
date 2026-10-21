import SparkleBurst from "@/components/decor/sparkle-burst";
import SceneShell from "@/components/scenes/scene-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, RotateCcwIcon, SendIcon } from "lucide-react";
import {
  useThisOrThatSceneViewModel,
  type Side,
} from "./use-this-or-that-scene-view-model";

// 4:20 PM — a quick, silly "this or that".
const ThisOrThatScene = () => {
  const vm = useThisOrThatSceneViewModel();

  const choice = (side: Side, label: string) => {
    const isPicked = vm.pendingSide === side;
    const isOther = vm.pendingSide !== null && !isPicked;
    return (
      <motion.button
        type="button"
        onClick={() => vm.choose(side)}
        aria-pressed={isPicked}
        animate={{
          scale: isPicked ? 1.06 : isOther ? 0.92 : 1,
          opacity: isOther ? 0.45 : 1,
        }}
        whileHover={vm.pendingSide ? undefined : { y: -6 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className={cn(
          "relative flex min-h-40 flex-1 cursor-pointer items-center justify-center rounded-[2rem] p-6 font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-none font-semibold transition-colors focus-visible:ring-4 focus-visible:ring-lilac-deep focus-visible:outline-none sm:min-h-56",
          isPicked
            ? "bg-linear-to-br from-sky to-lilac text-ink shadow-float"
            : "glass text-ink"
        )}
      >
        {isPicked && <SparkleBurst burstKey={1} />}
        {isPicked && (
          <CheckIcon className="absolute top-5 right-5 size-6" aria-hidden />
        )}
        {label}
      </motion.button>
    );
  };

  return (
    <SceneShell {...vm.copy} tone="day" headingId="this-or-that-heading">
      <div className="mx-auto w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {vm.pair ? (
            <motion.div
              key={vm.pair.id}
              initial={{ opacity: 0, x: 80, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -80, rotate: -3 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <p className="mb-5 text-center text-sm tracking-[0.25em] text-ink-soft uppercase tabular-nums">
                {vm.index + 1} / {vm.total}
              </p>
              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                {choice("a", vm.pair.a)}
                <span className="glass mx-auto flex size-14 shrink-0 items-center justify-center rounded-full font-script text-3xl text-lilac-deep">
                  or
                </span>
                {choice("b", vm.pair.b)}
              </div>
              <div className="mt-8 min-h-10 text-center" aria-live="polite">
                <AnimatePresence>
                  {vm.reaction && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-hand text-4xl text-ink"
                    >
                      {vm.reaction}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="glass mx-auto max-w-2xl rounded-[2rem] p-8 text-center sm:p-12"
            >
              <p className="font-script text-6xl text-lilac-deep">
                {vm.copy.resultTitle}
              </p>
              <ul className="mt-6 flex flex-wrap justify-center gap-2">
                {vm.picks.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="rounded-full bg-white/80 px-4 py-1.5 font-medium text-ink"
                  >
                    {p}
                  </motion.li>
                ))}
              </ul>
              <p className="mt-6 font-hand text-3xl text-ink">
                {vm.copy.resultText}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" onClick={vm.share}>
                  <SendIcon /> {vm.copy.shareLabel}
                </Button>
                <Button size="lg" variant="glass" onClick={vm.playAgain}>
                  <RotateCcwIcon /> {vm.copy.playAgainLabel}
                </Button>
              </div>
              <p
                className="mt-4 min-h-6 text-sm text-ink-soft"
                aria-live="polite"
              >
                {vm.copied ? vm.copy.copiedLabel : ""}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
};

export default ThisOrThatScene;
