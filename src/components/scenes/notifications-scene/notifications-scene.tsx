import SparkleBurst from "@/components/decor/sparkle-burst";
import SceneShell from "@/components/scenes/scene-shell";
import { Button } from "@/components/ui/button";
import type { NotificationIcon } from "@/model/frontend/experience-content";
import { AnimatePresence, motion } from "framer-motion";
import {
  BatteryLowIcon,
  BellIcon,
  CloudSunIcon,
  HeartIcon,
  HourglassIcon,
  MapPinIcon,
  MusicIcon,
  StickyNoteIcon,
  type LucideIcon,
} from "lucide-react";
import { useNotificationsSceneViewModel } from "./use-notifications-scene-view-model";

const ICONS: Record<NotificationIcon, { Icon: LucideIcon; tile: string }> = {
  cloud: { Icon: CloudSunIcon, tile: "from-sky to-sky-deep" },
  hourglass: { Icon: HourglassIcon, tile: "from-lilac to-lilac-deep" },
  bell: { Icon: BellIcon, tile: "from-peach to-[#f08ba0]" },
  battery: { Icon: BatteryLowIcon, tile: "from-[#9be7b5] to-[#3fb27f]" },
  map: { Icon: MapPinIcon, tile: "from-sky-light to-sky" },
  note: { Icon: StickyNoteIcon, tile: "from-[#ffe9a8] to-[#f5c451]" },
  music: { Icon: MusicIcon, tile: "from-[#f9a8c9] to-[#e25d95]" },
  heart: { Icon: HeartIcon, tile: "from-lilac-light to-lilac-deep" },
};

// 9:41 AM — a phone that keeps getting suspiciously relevant alerts.
const NotificationsScene = () => {
  const vm = useNotificationsSceneViewModel();

  return (
    <SceneShell {...vm.copy} tone="day" headingId="notifications-heading">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        {/* The phone */}
        <motion.div
          className="relative w-[min(92vw,400px)] rounded-[3.2rem] bg-ink p-3 shadow-[0_40px_100px_-30px_rgb(27_30_75/0.6)]"
          initial={{ opacity: 0, y: 60, rotate: -4 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
        >
          <div className="relative h-[min(68dvh,640px)] overflow-hidden rounded-[2.6rem] bg-linear-to-b from-lilac via-lilac-light to-sky-light">
            <div
              aria-hidden
              className="absolute -top-20 -left-16 size-72 rounded-full bg-sky/60 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -right-16 bottom-0 size-72 rounded-full bg-lilac/60 blur-3xl"
            />
            <div className="absolute top-3 left-1/2 h-7 w-28 -translate-x-1/2 rounded-full bg-ink" />
            <p className="relative pt-14 text-center text-6xl font-extralight text-white tabular-nums drop-shadow">
              9:41
            </p>

            <ol
              className="relative mt-6 flex flex-col gap-2.5 px-3"
              aria-live="polite"
              aria-label="Notifications"
            >
              <AnimatePresence initial={false}>
                {vm.notifications.map((n) => {
                  const { Icon, tile } = ICONS[n.icon];
                  return (
                    <motion.li
                      key={n.key}
                      layout
                      initial={{ opacity: 0, y: -50, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                      }}
                      className="flex gap-3 rounded-2xl bg-white/65 p-3 text-left text-ink shadow-sm backdrop-blur-xl"
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${tile} text-white`}
                      >
                        <Icon className="size-4.5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex justify-between text-[0.7rem] font-semibold tracking-wide text-ink-soft uppercase">
                          {n.app}
                          <span className="font-normal normal-case">now</span>
                        </span>
                        <span className="block text-[0.92rem] leading-snug">
                          {n.text}
                        </span>
                      </span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ol>
          </div>
        </motion.div>

        <div className="relative mt-10 flex min-h-16 items-center">
          <AnimatePresence mode="wait">
            {vm.allSeen ? (
              <motion.p
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md text-center font-hand text-3xl text-ink"
              >
                {vm.copy.allSeenNote}
              </motion.p>
            ) : (
              <motion.div
                key="button"
                className="relative"
                exit={{ opacity: 0 }}
              >
                <SparkleBurst burstKey={vm.burstKey} />
                <Button size="lg" onClick={vm.showAnother}>
                  <BellIcon /> {vm.copy.buttonLabel}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SceneShell>
  );
};

export default NotificationsScene;
