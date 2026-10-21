import type { SceneTone } from "@/constants/scene-constant";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { MoonIcon, SunIcon } from "lucide-react";

// The little clock in the corner that ticks through her day.
type StoryClockProps = {
  time: string;
  label: string;
  tone: SceneTone;
};

const StoryClock = ({ time, label, tone }: StoryClockProps) => {
  const isNight = tone === "night";
  const Icon = isNight ? MoonIcon : SunIcon;

  return (
    <div
      className={cn(
        "flex h-11 items-center gap-3 rounded-full pr-5 pl-2 transition-colors duration-700",
        isNight ? "glass-night text-starlight" : "glass text-ink"
      )}
      aria-live="polite"
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-full",
          isNight ? "bg-lilac/30 text-lilac-light" : "bg-white/70 text-sky-deep"
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="relative h-5 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={time}
            className="block text-sm font-semibold tabular-nums"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {time}
            <span className="ml-2 hidden font-normal opacity-70 sm:inline">
              {label}
            </span>
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
};

export default StoryClock;
