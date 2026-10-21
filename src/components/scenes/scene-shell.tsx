import AnimatedText from "@/components/decor/animated-text";
import type { SceneTone } from "@/constants/scene-constant";
import { cn } from "@/lib/utils";
import type { SceneCopy } from "@/model/frontend/experience-content";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Shared layout for every scene: a full-screen block with the time of
// day, a big heading that writes itself in, and the scene's content.
type SceneShellProps = Omit<SceneCopy, "time" | "label"> & {
  time: string;
  label: string;
  tone: SceneTone;
  headingId: string;
  children: ReactNode;
};

const SceneShell = ({
  time,
  label,
  title,
  subtitle,
  tone,
  headingId,
  children,
}: SceneShellProps) => {
  const isNight = tone === "night";

  return (
    <div
      className={cn(
        "flex min-h-dvh w-full flex-col items-center justify-center px-4 py-28 sm:px-10 sm:py-32",
        isNight ? "text-starlight" : "text-ink"
      )}
    >
      <header className="mb-10 max-w-4xl text-center sm:mb-14">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7 }}
          className={cn(
            "mx-auto mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium tracking-wide",
            isNight ? "glass-night text-lilac-light" : "glass text-ink-soft"
          )}
        >
          <span className="font-semibold tabular-nums">{time}</span>
          <span aria-hidden className="opacity-50">
            ·
          </span>
          <span>{label}</span>
        </motion.p>
        <AnimatedText
          as="h2"
          id={headingId}
          text={title}
          className="font-serif text-[clamp(2.6rem,7vw,6rem)] leading-[1.02] font-semibold text-balance"
          wordClassName={isNight ? "text-dream pb-[0.12em]" : "pb-[0.08em]"}
        />
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className={cn(
              "mt-5 text-base sm:text-lg",
              isNight ? "text-haze" : "text-ink-soft"
            )}
          >
            {subtitle}
          </motion.p>
        )}
      </header>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default SceneShell;
