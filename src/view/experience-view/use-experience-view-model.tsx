import { useMusic } from "@/components/providers/music-context";
import {
  SCENE_ORDER,
  SCENE_TONE,
  SceneConstant,
} from "@/constants/scene-constant";
import { content } from "@/data";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

// ViewModel for the whole day:
//   • the lock screen gate (her tap also starts the music)
//   • where each scene sits on the page, so the sky can blend exactly
//     between them as she scrolls
//   • which scene is on screen (drives the clock + dots)
//   • jumping around: replay the day, read the note again

const SCENE_COPY = {
  [SceneConstant.morning]: content.morning,
  [SceneConstant.notifications]: content.notifications,
  [SceneConstant.snapshots]: content.snapshots,
  [SceneConstant.heartGame]: content.heartGame,
  [SceneConstant.thisOrThat]: content.thisOrThat,
  [SceneConstant.letter]: content.letter,
  [SceneConstant.wishes]: content.wishes,
  [SceneConstant.goodnight]: content.goodnight,
};

const evenStops = SCENE_ORDER.map((_, i) => i / (SCENE_ORDER.length - 1));

// "{days} days of talking…" — or null when no start date is set.
const daysTogetherText = (() => {
  const { talkingSince, talkingSinceText } = content.goodnight;
  if (!talkingSince) return null;
  const start = new Date(`${talkingSince}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;
  const days = Math.max(
    1,
    Math.floor((Date.now() - start.getTime()) / 86_400_000)
  );
  return talkingSinceText.replace("{days}", days.toLocaleString());
})();

// wa.me link that opens WhatsApp with her reply ready — or null.
const replyHref = (() => {
  const digits = content.goodnight.replyWhatsAppNumber.replace(/\D/g, "");
  if (!digits) return null;
  const text = encodeURIComponent(content.goodnight.replyMessage);
  return `https://wa.me/${digits}?text=${text}`;
})();

const withName = (template: string, fallback: string) => {
  const name = content.herNickname.trim();
  return name ? template.replace("{name}", name) : fallback;
};

export const useExperienceViewModel = () => {
  const music = useMusic();
  const fullscreen = useFullscreen();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeScene, setActiveScene] = useState(SceneConstant.morning);
  const [stops, setStops] = useState<number[]>(evenStops);
  const [letterOpenSignal, setLetterOpenSignal] = useState(0);

  const sceneEls = useRef<Partial<Record<SceneConstant, HTMLElement>>>({});
  const refCallbacks = useRef<
    Partial<Record<SceneConstant, (el: HTMLElement | null) => void>>
  >({});

  // Stable callback ref per scene.
  const registerScene = (id: SceneConstant) => {
    if (!refCallbacks.current[id]) {
      refCallbacks.current[id] = (el) => {
        if (el) sceneEls.current[id] = el;
        else delete sceneEls.current[id];
      };
    }
    return refCallbacks.current[id];
  };

  // No scrolling behind the lock screen.
  useEffect(() => {
    document.documentElement.style.overflow = isUnlocked ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isUnlocked]);

  // Measure where each scene is centred, as a 0–1 scroll position.
  const measure = useCallback(() => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    let prev = -1;
    const next = SCENE_ORDER.map((id) => {
      const el = sceneEls.current[id];
      const centre = el
        ? el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2
        : 0;
      const value = Math.max(Math.min(centre / scrollable, 1), prev + 0.0001);
      prev = value;
      return value;
    });
    setStops(next);
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Whichever scene crosses the middle of the screen is "now".
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveScene(entry.target.id as SceneConstant);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    Object.values(sceneEls.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToScene = (id: SceneConstant) => {
    sceneEls.current[id]?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const unlock = () => {
    // Her tap is what allows the browser to start audio and go full
    // screen, so both happen right here.
    fullscreen.enter();
    music.play();
    window.scrollTo({ top: 0 });
    setIsUnlocked(true);
  };

  const activeCopy = SCENE_COPY[activeScene];

  return {
    content,
    isUnlocked,
    unlock,
    showSoundHint: content.music !== null,
    canFullscreen: fullscreen.isSupported,
    isFullscreen: fullscreen.isFullscreen,
    toggleFullscreen: fullscreen.toggle,
    progress: scrollYProgress,
    stops,
    registerScene,
    activeScene,
    tone: SCENE_TONE[activeScene],
    clockTime: activeCopy.time,
    clockLabel: activeCopy.label,
    sceneDots: SCENE_ORDER.map((id) => ({
      id,
      time: SCENE_COPY[id].time,
      label: SCENE_COPY[id].label,
    })),
    goToScene: (id: string) => scrollToScene(id as SceneConstant),
    morningGreeting: withName(
      content.morning.greetingWithName,
      content.morning.greetingFallback
    ),
    goodnightHeading: withName(
      content.goodnight.headingWithName,
      content.goodnight.headingFallback
    ),
    myName: content.myName.trim(),
    daysTogetherText,
    replyHref,
    letterOpenSignal,
    readLetterAgain: () => {
      setLetterOpenSignal((n) => n + 1);
      scrollToScene(SceneConstant.letter);
    },
    replayDay: () => scrollToScene(SceneConstant.morning),
  };
};
