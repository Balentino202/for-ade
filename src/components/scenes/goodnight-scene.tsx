import AnimatedText from "@/components/decor/animated-text";
import Flourish from "@/components/decor/flourish";
import HeartRain from "@/components/decor/heart-rain";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  MailOpenIcon,
  MessageCircleHeartIcon,
  SunriseIcon,
} from "lucide-react";

// 11:59 PM — the moon is up, and the last thought of the day.
type GoodnightSceneProps = {
  time: string;
  label: string;
  title: string;
  heading: string;
  message: string;
  signature: string;
  myName: string;
  replayLabel: string;
  readAgainLabel: string;
  daysTogetherText: string | null;
  replyHref: string | null;
  replyLabel: string;
  onReplay: () => void;
  onReadAgain: () => void;
};

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 20, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.6 },
  transition: { duration: 1, delay },
});

const GoodnightScene = ({
  time,
  label,
  title,
  heading,
  message,
  signature,
  myName,
  replayLabel,
  readAgainLabel,
  daysTogetherText,
  replyHref,
  replyLabel,
  onReplay,
  onReadAgain,
}: GoodnightSceneProps) => {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-5 py-28 text-center text-starlight">
      <HeartRain />

      <motion.p
        {...reveal(0)}
        className="glass-night relative mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-lilac-light"
      >
        <span className="font-semibold tabular-nums">{time}</span>
        <span aria-hidden className="opacity-50">
          ·
        </span>
        {label}
      </motion.p>

      <motion.p {...reveal(0.2)} className="relative text-lg text-haze">
        {title}
      </motion.p>

      <AnimatedText
        as="h2"
        id="goodnight-heading"
        text={heading}
        delay={0.5}
        stagger={0.12}
        className="relative mt-4 font-serif text-[clamp(3rem,9vw,8rem)] leading-[0.98] font-semibold text-balance"
        wordClassName="text-dream pb-[0.12em]"
      />

      <motion.p
        {...reveal(1.2)}
        className="relative mx-auto mt-8 max-w-3xl font-serif text-[clamp(1.4rem,2.6vw,2.2rem)] leading-snug text-starlight/90 italic text-pretty"
      >
        {message}
      </motion.p>

      {daysTogetherText && (
        <motion.p
          {...reveal(1.5)}
          className="glass-night relative mt-8 rounded-full px-5 py-2 text-sm text-lilac-light sm:text-base"
        >
          {daysTogetherText}
        </motion.p>
      )}

      <motion.footer {...reveal(1.8)} className="relative mt-12">
        <Flourish className="mb-4 text-lilac-light" />
        <p className="text-sm tracking-[0.25em] text-haze uppercase">
          {signature}
        </p>
        {myName && (
          <p className="mt-2 font-script text-6xl text-lilac-light">{myName}</p>
        )}
      </motion.footer>

      <motion.div
        {...reveal(2.3)}
        className="relative mt-12 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center"
      >
        {replyHref && (
          <Button asChild size="xl" variant="dream">
            <a href={replyHref} target="_blank" rel="noopener noreferrer">
              <MessageCircleHeartIcon /> {replyLabel}
            </a>
          </Button>
        )}
        <Button
          size="xl"
          variant={replyHref ? "glass-night" : "dream"}
          onClick={onReplay}
        >
          <SunriseIcon /> {replayLabel}
        </Button>
        <Button size="xl" variant="glass-night" onClick={onReadAgain}>
          <MailOpenIcon /> {readAgainLabel}
        </Button>
      </motion.div>
    </div>
  );
};

export default GoodnightScene;
