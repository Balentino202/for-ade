import { assetUrl } from "@/lib/asset-url";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HeadphonesIcon, HeartIcon } from "lucide-react";

// The opening: her phone's lock screen at 7:00 AM — her photo as the
// wallpaper — with a single notification waiting. Tapping it "unlocks"
// the day. Full screen on phones; on bigger screens it sits inside a
// phone frame so the portrait photo is never awkwardly cropped.
type LockScreenProps = {
  wallpaper?: string;
  clock: string;
  dateLabel: string;
  appName: string;
  notificationTitle: string;
  notificationBody: string;
  hint: string;
  showHint: boolean;
  onUnlock: () => void;
};

const LockScreen = ({
  wallpaper,
  clock,
  dateLabel,
  appName,
  notificationTitle,
  notificationBody,
  hint,
  showHint,
  onUnlock,
}: LockScreenProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-linear-to-br from-lilac-deep via-lilac to-sky">
      {/* Bigger screens: her photo, softly blurred, fills the whole screen
          behind the phone so nothing looks empty. */}
      {wallpaper && (
        <img
          src={assetUrl(wallpaper)}
          alt=""
          aria-hidden
          className="absolute inset-0 hidden size-full scale-110 object-cover object-[50%_60%] blur-2xl brightness-90 saturate-125 sm:block"
        />
      )}
      {/* Dreamy sky-blue and lilac glows */}
      <div
        aria-hidden
        className={cn("absolute inset-0", wallpaper && "sm:opacity-60")}
      >
        <div className="absolute -top-1/4 -left-1/4 size-[80vmax] rounded-full bg-sky/40 blur-[120px]" />
        <div className="absolute -right-1/4 -bottom-1/3 size-[70vmax] rounded-full bg-lilac-light/50 blur-[120px]" />
      </div>

      <motion.div
        className="absolute inset-0 overflow-hidden text-white sm:relative sm:inset-auto sm:aspect-[9/19.5] sm:h-[min(90dvh,860px)] sm:rounded-[3.2rem] sm:border-[10px] sm:border-ink sm:shadow-[0_50px_120px_-30px_rgb(27_30_75/0.7)]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* Wallpaper */}
        {wallpaper ? (
          <motion.img
            src={assetUrl(wallpaper)}
            alt=""
            className="absolute inset-0 size-full object-cover object-[50%_60%]"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-b from-lilac-deep via-lilac to-sky" />
        )}
        {/* Soft shading so the clock and notification stay readable */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-ink/60 via-ink/10 via-45% to-ink/50"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-br from-sky/15 to-lilac/25 mix-blend-soft-light"
        />

        {/* Dynamic island (phone frame only) */}
        <div className="absolute top-3 left-1/2 z-10 hidden h-7 w-28 -translate-x-1/2 rounded-full bg-ink sm:block" />

        <div className="relative flex h-full flex-col items-center px-5 sm:px-4">
          <motion.div
            className="mt-[max(10dvh,calc(env(safe-area-inset-top)+2rem))] text-center drop-shadow-[0_2px_12px_rgb(0_0_0/0.35)] sm:mt-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p className="text-lg font-medium">{dateLabel}</p>
            <p className="text-[clamp(5.5rem,24vw,7.5rem)] leading-none font-extralight tracking-tight tabular-nums">
              {clock}
            </p>
          </motion.div>

          <motion.button
            type="button"
            onClick={onUnlock}
            className="mt-6 w-full max-w-md cursor-pointer rounded-3xl bg-ink/35 p-4 text-left shadow-[0_20px_60px_-20px_rgb(0_0_0/0.5)] backdrop-blur-xl focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:outline-none"
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 1.3,
              type: "spring",
              stiffness: 160,
              damping: 16,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="flex gap-3"
              animate={{ rotate: [0, -1.5, 1.5, -1, 0] }}
              transition={{
                delay: 3.2,
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 4,
              }}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-sky to-lilac-deep shadow-md">
                <HeartIcon
                  className="size-5"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2 text-xs font-medium tracking-wide uppercase opacity-80">
                  <span className="truncate">{appName}</span>
                  <span className="normal-case">now</span>
                </span>
                <span className="mt-0.5 block text-base font-semibold">
                  {notificationTitle}
                </span>
                <span className="block text-[0.95rem] opacity-90">
                  {notificationBody}
                </span>
              </span>
            </motion.span>
          </motion.button>

          <div
            className={cn(
              "mt-auto mb-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-4 drop-shadow-[0_2px_8px_rgb(0_0_0/0.4)]"
            )}
          >
            {showHint && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.95 }}
                transition={{ delay: 2.2 }}
                className="flex items-center gap-2 text-sm"
              >
                <HeadphonesIcon className="size-4" aria-hidden /> {hint}
              </motion.p>
            )}
            <span aria-hidden className="h-1.5 w-32 rounded-full bg-white/80" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LockScreen;
