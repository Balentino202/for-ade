import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Reveals text word by word as it scrolls into view, each word rising
// out of a soft blur. The whole sentence is also rendered once for
// screen readers.
const EMOJI = /\p{Extended_Pictographic}/u;

type AnimatedTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
};

const AnimatedText = ({
  text,
  as = "p",
  id,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
}: AnimatedTextProps) => {
  const Tag = motion[as];
  const words = text.split(" ");

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            // Emoji keep their own colours instead of the gradient fill.
            className={cn(
              "inline-block whitespace-pre",
              !EMOJI.test(word) && wordClassName
            )}
            variants={{
              hidden: { opacity: 0, y: "0.5em", filter: "blur(10px)" },
              show: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </span>
    </Tag>
  );
};

export default AnimatedText;
