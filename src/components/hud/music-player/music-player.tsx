import type { SceneTone } from "@/constants/scene-constant";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useMusicPlayerViewModel } from "./use-music-player-view-model";

// Small glass pill: animated equaliser + track name + play/pause. Hidden
// entirely until the music file is confirmed to exist.
const BARS = [0, 0.25, 0.5, 0.15];

const MusicPlayer = ({ tone }: { tone: SceneTone }) => {
  const vm = useMusicPlayerViewModel();
  const isNight = tone === "night";

  return (
    <AnimatePresence>
      {vm.isVisible && (
        <motion.button
          type="button"
          onClick={vm.toggle}
          aria-label={vm.isPlaying ? `Pause ${vm.title}` : `Play ${vm.title}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn(
            "flex h-11 cursor-pointer items-center gap-3 rounded-full pr-4 pl-1.5 text-left transition-colors duration-700 focus-visible:ring-2 focus-visible:ring-lilac-deep focus-visible:outline-none",
            isNight ? "glass-night text-starlight" : "glass text-ink"
          )}
        >
          <span className="relative flex size-8 items-center justify-center rounded-full bg-linear-to-br from-sky to-lilac text-midnight">
            {vm.needsTap && (
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-lilac" />
            )}
            {vm.isPlaying ? (
              <PauseIcon className="size-3.5" fill="currentColor" />
            ) : (
              <PlayIcon className="ml-0.5 size-3.5" fill="currentColor" />
            )}
          </span>
          <span aria-hidden className="flex h-4 items-end gap-0.5">
            {BARS.map((delay, i) => (
              <span
                key={i}
                className={cn(
                  "h-full w-0.5 origin-bottom rounded-full",
                  isNight ? "bg-sky-light" : "bg-lilac-deep"
                )}
                style={{
                  animation: vm.isPlaying
                    ? `eq 0.9s ease-in-out ${delay}s infinite alternate`
                    : "none",
                  transform: vm.isPlaying ? undefined : "scaleY(0.25)",
                }}
              />
            ))}
          </span>
          <span className="hidden max-w-40 min-w-0 md:block">
            <span className="block truncate text-xs font-medium">
              {vm.title}
            </span>
            <span className="block truncate text-[0.7rem] opacity-70">
              {vm.artist}
            </span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default MusicPlayer;
