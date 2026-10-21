import { motion } from "framer-motion";
import { HeartIcon } from "lucide-react";

// A little folded note. Tap to unfold (flip) and read it.
type FoldedNoteProps = {
  text: string;
  frontLabel: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
};

const PAPERS = [
  "from-lilac-light to-[#f3e9fb]",
  "from-sky-light to-[#e6f5ff]",
  "from-[#fde3d8] to-[#fff1ea]",
];

const FoldedNote = ({
  text,
  frontLabel,
  index,
  isOpen,
  onToggle,
}: FoldedNoteProps) => {
  const paper = PAPERS[index % PAPERS.length];

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isOpen}
      aria-label={isOpen ? text : `${frontLabel}: a note`}
      className="block aspect-square w-full cursor-pointer [perspective:1000px] focus-visible:outline-none [&:focus-visible>span]:ring-4 [&:focus-visible>span]:ring-lilac-deep"
    >
      <motion.span
        className="preserve-3d relative block size-full"
        animate={{ rotateY: isOpen ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 14 }}
      >
        <span
          aria-hidden
          className={`backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br ${paper} p-5 shadow-float`}
        >
          {/* folded corner */}
          <span className="absolute top-0 right-0 size-10 bg-linear-to-bl from-white/90 to-black/5 [clip-path:polygon(0_0,100%_100%,0_100%)]" />
          <HeartIcon
            className="size-8 text-lilac-deep"
            fill="currentColor"
            strokeWidth={0}
          />
          <span className="font-hand text-2xl text-ink sm:text-3xl">
            {frontLabel}
          </span>
        </span>
        <span
          aria-hidden
          className={`backface-hidden absolute inset-0 flex [transform:rotateY(180deg)] items-center justify-center bg-linear-to-br ${paper} p-3.5 shadow-float sm:p-6`}
        >
          <span className="font-hand text-[1.15rem] leading-[1.15] text-ink sm:text-[clamp(1.5rem,2.4vw,2rem)] sm:leading-tight">
            {text}
          </span>
        </span>
      </motion.span>
    </button>
  );
};

export default FoldedNote;
