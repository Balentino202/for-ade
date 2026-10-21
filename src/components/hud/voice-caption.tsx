import { AnimatePresence, motion } from "framer-motion";
import { AudioLinesIcon } from "lucide-react";

// Subtitles for the voice intro, near the bottom of the screen, plus a
// small Skip button.
type VoiceCaptionProps = {
  text: string | null;
  lineKey: number;
  skipLabel: string;
  onSkip: () => void;
};

const VoiceCaption = ({
  text,
  lineKey,
  skipLabel,
  onSkip,
}: VoiceCaptionProps) => {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-50 flex flex-col items-center gap-3 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="glass flex max-w-xl items-center gap-3 rounded-3xl px-5 py-4 shadow-float"
            aria-live="polite"
          >
            <motion.span
              aria-hidden
              className="shrink-0 text-lilac-deep"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AudioLinesIcon className="size-5" />
            </motion.span>
            <AnimatePresence mode="wait">
              <motion.p
                key={lineKey}
                className="font-serif text-xl leading-snug font-semibold text-ink sm:text-2xl"
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.35 }}
              >
                {text}
              </motion.p>
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="pointer-events-auto cursor-pointer rounded-full bg-white/60 px-4 py-1.5 text-xs font-medium text-ink-soft backdrop-blur focus-visible:ring-2 focus-visible:ring-lilac-deep focus-visible:outline-none"
          >
            {skipLabel}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceCaption;
