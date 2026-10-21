import AnimatedText from "@/components/decor/animated-text";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";

// 7:00 AM. The sun is coming up, and the first texts of the day type
// themselves in.
type MorningSceneProps = {
  time: string;
  label: string;
  greeting: string;
  title: string;
  messages: string[];
  scrollHint: string;
};

const STEP = 1.5; // seconds between messages
const TYPING = 0.9; // how long the "…" shows before each message

const MorningScene = ({
  time,
  label,
  greeting,
  title,
  messages,
  scrollHint,
}: MorningSceneProps) => {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center px-5 pt-28 pb-24 text-center text-ink">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-ink-soft"
      >
        <span className="font-semibold tabular-nums">{time}</span>
        <span aria-hidden className="opacity-50">
          ·
        </span>
        {label}
      </motion.p>

      <motion.p
        className="font-script text-[clamp(3.5rem,10vw,8rem)] leading-none text-lilac-deep drop-shadow-[0_2px_20px_rgb(255_255_255/0.8)]"
        initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, delay: 0.4 }}
      >
        {greeting}
      </motion.p>

      <AnimatedText
        as="h2"
        id="morning-heading"
        text={title}
        delay={1}
        className="mt-5 max-w-4xl font-serif text-[clamp(1.9rem,4.6vw,3.75rem)] leading-tight font-semibold text-balance"
      />

      {/* The morning texts */}
      <motion.ol
        className="mt-12 flex w-full max-w-md flex-col items-end gap-2"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        aria-label="Morning messages"
      >
        {messages.map((m, i) => (
          <motion.li
            key={i}
            className="origin-bottom-right rounded-3xl rounded-br-md bg-linear-to-br from-sky-deep to-lilac-deep px-5 py-3 text-left text-[1.05rem] text-white shadow-float"
            variants={{
              hidden: {
                opacity: 0,
                scale: 0.6,
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
              },
              show: {
                opacity: 1,
                scale: 1,
                height: "auto",
                paddingTop: 12,
                paddingBottom: 12,
                transition: {
                  delay: 2 + i * STEP + TYPING,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                },
              },
            }}
          >
            {m}
          </motion.li>
        ))}
        <motion.li
          aria-hidden
          className="glass flex gap-1 rounded-3xl rounded-br-md px-4 py-3"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: messages.flatMap(() => [1, 1, 0.4]).concat(0),
              transition: {
                delay: 2,
                duration: messages.length * STEP + 0.2,
              },
            },
          }}
        >
          {[0, 1, 2].map((d) => (
            <motion.span
              key={d}
              className="size-2 rounded-full bg-ink-soft"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }}
            />
          ))}
        </motion.li>
      </motion.ol>

      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-1 text-sm text-ink-soft"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 2 + messages.length * STEP }}
      >
        {scrollHint}
        <ChevronDownIcon className="size-5 animate-bounce-soft" aria-hidden />
      </motion.div>
    </div>
  );
};

export default MorningScene;
