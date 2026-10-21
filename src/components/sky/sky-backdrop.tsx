import StarField from "@/components/decor/star-field";
import { SCENE_ORDER, SKY_COLORS } from "@/constants/scene-constant";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useState } from "react";
import Cloud from "./cloud";

// The whole sky, fixed behind the page and driven by scroll progress.
// `stops` are the scroll positions (0–1) where each scene is centred,
// so every scene gets exactly its own sky — morning blue, golden-hour
// lilac, then night — with smooth blends in between.
type SkyBackdropProps = {
  progress: MotionValue<number>;
  stops: number[];
};

const TOPS = SCENE_ORDER.map((s) => SKY_COLORS[s][0]);
const BOTTOMS = SCENE_ORDER.map((s) => SKY_COLORS[s][1]);

const CLOUDS = [
  { top: "12%", width: 260, duration: "95s", delay: "-20s", opacity: 0.95 },
  { top: "24%", width: 170, duration: "70s", delay: "-55s", opacity: 0.8 },
  { top: "38%", width: 320, duration: "120s", delay: "-80s", opacity: 0.7 },
  { top: "8%", width: 140, duration: "60s", delay: "-5s", opacity: 0.75 },
  { top: "55%", width: 220, duration: "105s", delay: "-40s", opacity: 0.55 },
];

// Per-scene values, in SCENE_ORDER: morning, notifications, snapshots,
// heart game, this-or-that, letter (golden hour), wishes (night),
// goodnight. Keep one value per scene when adding or removing scenes.
const SUN_X = ["14%", "30%", "45%", "58%", "70%", "84%", "92%", "92%"];
const SUN_Y = ["58%", "26%", "12%", "14%", "24%", "64%", "115%", "115%"];
const SUN_OPACITY = [1, 1, 1, 1, 1, 1, 0, 0];
const GOLDEN = [0.35, 0, 0, 0, 0.15, 1, 0.2, 0];
const MOON_Y = ["125%", "125%", "125%", "125%", "125%", "95%", "11%", "11%"];
const MOON_OPACITY = [0, 0, 0, 0, 0, 0.2, 1, 1];
const CLOUD_OPACITY = [0.9, 1, 1, 1, 0.9, 0.6, 0.04, 0];
const STAR_OPACITY = [0, 0, 0, 0, 0, 0.12, 1, 1];

const SkyBackdrop = ({ progress, stops }: SkyBackdropProps) => {
  const top = useTransform(progress, stops, TOPS);
  const bottom = useTransform(progress, stops, BOTTOMS);
  const background = useMotionTemplate`linear-gradient(to bottom, ${top}, ${bottom})`;

  const sunX = useTransform(progress, stops, SUN_X);
  const sunY = useTransform(progress, stops, SUN_Y);
  const sunOpacity = useTransform(progress, stops, SUN_OPACITY);
  const golden = useTransform(progress, stops, GOLDEN);
  const moonY = useTransform(progress, stops, MOON_Y);
  const moonOpacity = useTransform(progress, stops, MOON_OPACITY);
  const cloudOpacity = useTransform(progress, stops, CLOUD_OPACITY);
  const starOpacity = useTransform(progress, stops, STAR_OPACITY);

  // Only animate the star canvas while stars can actually be seen.
  const [starsVisible, setStarsVisible] = useState(false);
  useMotionValueEvent(starOpacity, "change", (v) => setStarsVisible(v > 0.01));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ background }} />

      {/* Warm glow along the horizon at sunrise and golden hour */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_bottom,rgb(249_203_183/0.9),rgb(200_162_200/0.35)_45%,transparent_75%)]"
        style={{ opacity: golden }}
      />

      <motion.div className="absolute inset-0" style={{ opacity: starOpacity }}>
        <StarField active={starsVisible} />
      </motion.div>

      {/* Sun */}
      <motion.div
        className="absolute size-[min(30vw,200px)] -translate-x-1/2 -translate-y-1/2"
        style={{ left: sunX, top: sunY, opacity: sunOpacity }}
      >
        <div className="absolute -inset-[60%] rounded-full bg-[radial-gradient(circle,rgb(255_247_220/0.75),rgb(255_236_200/0.25)_40%,transparent_70%)]" />
        <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffffff,#fff4d4_55%,#ffe3b8)] shadow-[0_0_80px_30px_rgb(255_240_210/0.6)]" />
      </motion.div>

      {/* Moon */}
      <motion.div
        className="absolute right-[3%] size-[min(12vw,150px)] -translate-y-1/2 sm:right-[10%]"
        style={{ top: moonY, opacity: moonOpacity }}
      >
        <div className="absolute -inset-[70%] rounded-full bg-[radial-gradient(circle,rgb(230_211_245/0.35),transparent_65%)]" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fffdf5,#efe6fb_60%,#d9c8ef)] shadow-[0_0_60px_10px_rgb(230_211_245/0.45)]">
          <span className="absolute top-[28%] left-[30%] size-[14%] rounded-full bg-lilac/25" />
          <span className="absolute top-[55%] left-[55%] size-[20%] rounded-full bg-lilac/20" />
          <span className="absolute top-[62%] left-[24%] size-[9%] rounded-full bg-lilac/25" />
        </div>
      </motion.div>

      <motion.div
        className="motion-decor absolute inset-0"
        style={{ opacity: cloudOpacity }}
      >
        {CLOUDS.map((c, i) => (
          <Cloud key={i} {...c} />
        ))}
      </motion.div>
    </div>
  );
};

export default SkyBackdrop;
