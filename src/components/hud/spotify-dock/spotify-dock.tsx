import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDownIcon, MusicIcon, PlayIcon } from "lucide-react";
import { useSpotifyDockViewModel } from "./use-spotify-dock-view-model";

// Floating home for the official Spotify player (bottom-left). The
// player element is never unmounted while collapsed — only visually
// tucked away — so the song keeps playing.
const SpotifyDock = () => {
  const vm = useSpotifyDockViewModel();
  if (!vm.isRendered) return null;

  return (
    <motion.aside
      aria-label={`Now playing: ${vm.title} by ${vm.artist}`}
      className={cn(
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-40",
        !vm.isShown && "pointer-events-none"
      )}
      initial={false}
      animate={{ opacity: vm.isShown ? 1 : 0, y: vm.isShown ? 0 : 30 }}
      transition={{ duration: 0.6, delay: vm.isShown ? 1 : 0 }}
    >
      {/* Collapsed: a little spinning record */}
      {!vm.isExpanded && (
        <motion.button
          type="button"
          onClick={vm.expand}
          aria-label={`Show music player (${vm.title})`}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative flex size-14 cursor-pointer items-center justify-center rounded-full shadow-float focus-visible:ring-4 focus-visible:ring-lilac-deep focus-visible:outline-none"
        >
          {!vm.isPlaying && (
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-lilac/60" />
          )}
          <motion.span
            className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,#1b1e4b_0_2px,#2a2d63_2px_4px)]"
            animate={{ rotate: vm.isPlaying ? 360 : 0 }}
            transition={
              vm.isPlaying
                ? { duration: 4, repeat: Infinity, ease: "linear" }
                : { duration: 0.3 }
            }
          />
          <span className="relative flex size-6 items-center justify-center rounded-full bg-linear-to-br from-sky to-lilac text-ink">
            <MusicIcon className="size-3" />
          </span>
        </motion.button>
      )}

      {/* Expanded: the Spotify player itself */}
      <div
        className={cn(
          "glass w-[min(calc(100vw-2rem),360px)] overflow-hidden rounded-3xl p-2 shadow-float transition-all duration-500",
          !vm.isExpanded &&
            "pointer-events-none absolute bottom-0 left-0 h-0 w-0 opacity-0"
        )}
        aria-hidden={!vm.isExpanded}
      >
        <div className="flex items-center justify-between px-2 pb-1.5 text-xs font-medium text-ink-soft">
          {vm.needsTap ? (
            <motion.span
              className="flex items-center gap-1.5 text-sm font-semibold text-ink"
              animate={{ opacity: [1, 0.55, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              Tap
              <span className="flex size-5 items-center justify-center rounded-full bg-ink text-white">
                <PlayIcon className="ml-px size-2.5" fill="currentColor" />
              </span>
              to play our song
            </motion.span>
          ) : (
            <span>Our song</span>
          )}
          <button
            type="button"
            onClick={vm.collapse}
            aria-label="Hide music player"
            tabIndex={vm.isExpanded ? 0 : -1}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full hover:bg-white/50 focus-visible:ring-2 focus-visible:ring-lilac-deep focus-visible:outline-none"
          >
            <ChevronDownIcon className="size-4" />
          </button>
        </div>
        <div
          ref={vm.mountRef}
          className="h-20 overflow-hidden rounded-2xl [&_iframe]:rounded-2xl"
        />
      </div>
    </motion.aside>
  );
};

export default SpotifyDock;
