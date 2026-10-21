import { Button } from "@/components/ui/button";
import type { LetterContent } from "@/model/frontend/experience-content";
import { motion } from "framer-motion";
import { MailIcon } from "lucide-react";

type LetterPaperProps = {
  letter: LetterContent;
  myName: string;
  onFoldBack: () => void;
};

const line = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const LetterPaper = ({ letter, myName, onFoldBack }: LetterPaperProps) => {
  return (
    <div className="flex flex-col items-center">
      <motion.article
        className="paper relative w-full max-w-3xl overflow-hidden rounded-[2rem] px-7 py-12 text-midnight shadow-[0_40px_120px_-30px_rgb(135_206_235/0.6)] sm:px-16 sm:py-16"
        initial={{ rotateX: 12, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <span
          aria-hidden
          className="absolute -top-6 -right-4 font-script text-[10rem] leading-none text-lilac/25"
        >
          ♡
        </span>
        <motion.div
          className="relative"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.35, delayChildren: 0.3 }}
        >
          <motion.p
            variants={line}
            transition={{ duration: 0.7 }}
            className="mb-8 font-script text-5xl text-lilac-deep sm:text-6xl"
          >
            {letter.greeting}
          </motion.p>
          {letter.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              variants={line}
              transition={{ duration: 0.7 }}
              className="mb-5 font-serif text-xl leading-relaxed text-midnight/85 text-pretty sm:text-2xl"
            >
              {p}
            </motion.p>
          ))}
          <motion.div
            variants={line}
            transition={{ duration: 0.7 }}
            className="mt-10 text-right"
          >
            <p className="font-serif text-xl text-midnight/60 italic">
              {letter.signOff}
            </p>
            {myName && (
              <p className="mt-1 font-script text-5xl text-lilac-deep">
                {myName}
              </p>
            )}
          </motion.div>
        </motion.div>
      </motion.article>

      <Button variant="glass" className="mt-10" onClick={onFoldBack}>
        <MailIcon /> Fold it back into the envelope
      </Button>
    </div>
  );
};

export default LetterPaper;
