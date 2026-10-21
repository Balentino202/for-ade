import { motion } from "framer-motion";
import { HeartIcon } from "lucide-react";

// Pure envelope illustration. `isOpening` drives the flap + paper.
type EnvelopeProps = {
  isOpening: boolean;
  hint: string;
  onOpen: () => void;
};

const ease = [0.4, 0, 0.2, 1] as const;

const Envelope = ({ isOpening, hint, onOpen }: EnvelopeProps) => {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onOpen}
        disabled={isOpening}
        aria-label="Open the envelope and read the letter"
        className="group relative mt-20 aspect-[7/5] w-[min(88vw,540px)] cursor-pointer rounded-2xl focus-visible:ring-2 focus-visible:ring-lilac-deep focus-visible:ring-offset-8 focus-visible:ring-offset-transparent focus-visible:outline-none disabled:cursor-default"
      >
        {/* Halo */}
        <span
          aria-hidden
          className="absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgb(135_206_235/0.35),rgb(200_162_200/0.2)_45%,transparent_70%)] blur-2xl transition-opacity duration-700 group-hover:opacity-100 sm:opacity-80"
        />
        <motion.span
          className="absolute inset-0 block [perspective:1200px]"
          animate={
            isOpening
              ? { y: 0, rotate: 0 }
              : { y: [0, -10, 0], rotate: [-1, 1, -1] }
          }
          transition={
            isOpening
              ? { duration: 0.3 }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* Back of the envelope */}
          <span className="absolute inset-0 rounded-2xl bg-lilac-deep shadow-glow" />

          {/* The letter peeking out */}
          <motion.span
            className="paper absolute inset-x-6 top-4 bottom-4 rounded-lg shadow-lg"
            initial={false}
            animate={{ y: isOpening ? "-45%" : "0%" }}
            transition={{ duration: 0.9, delay: isOpening ? 0.45 : 0, ease }}
          >
            <span className="absolute inset-x-8 top-8 flex flex-col gap-3">
              <span className="h-2.5 w-1/3 rounded-full bg-lilac/60" />
              <span className="h-2 w-full rounded-full bg-sky/40" />
              <span className="h-2 w-5/6 rounded-full bg-sky/40" />
              <span className="h-2 w-2/3 rounded-full bg-sky/40" />
            </span>
          </motion.span>

          {/* Front pocket (V shape) */}
          <span
            className="absolute inset-0 rounded-2xl bg-linear-to-b from-lilac-light to-lilac"
            style={{
              clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)",
            }}
          />

          {/* Flap */}
          <motion.span
            className="absolute inset-x-0 top-0 h-[56%] origin-top"
            initial={false}
            animate={{
              rotateX: isOpening ? 180 : 0,
              zIndex: isOpening ? -1 : 20,
            }}
            transition={{
              rotateX: { duration: 0.6, ease },
              zIndex: { delay: isOpening ? 0.3 : 0 },
            }}
          >
            <span
              className="absolute inset-0 rounded-t-2xl bg-linear-to-b from-sky-light to-sky"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />
          </motion.span>

          {/* Wax seal */}
          <motion.span
            className="absolute top-[56%] left-1/2 z-30 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-lilac-light shadow-glow ring-4 ring-white/40"
            initial={false}
            animate={{ scale: isOpening ? 0 : 1, opacity: isOpening ? 0 : 1 }}
            transition={{ duration: 0.25 }}
          >
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-lilac/40" />
            <HeartIcon
              className="relative size-7 transition-transform duration-300 group-hover:scale-125"
              fill="currentColor"
              strokeWidth={0}
            />
          </motion.span>
        </motion.span>
      </button>

      <p className="mt-12 text-base text-ink-soft" aria-live="polite">
        {isOpening ? "Opening…" : hint}
      </p>
    </div>
  );
};

export default Envelope;
