import { content } from "@/data";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ViewModel for HeartGameScene — "Catch my hearts".
// Hearts float up through the arena; she taps them before they drift
// away. Golden hearts are rarer and worth 3. When time runs out she
// gets a message that depends on her score.

export type HeartKind = "sky" | "lilac" | "gold";

export type FloatingHeartData = {
  id: number;
  /** Horizontal position, % of the arena width. */
  x: number;
  /** Only used for reduced motion, where hearts fade in place. */
  y: number;
  size: number;
  /** Seconds to float from bottom to top. */
  duration: number;
  drift: number;
  kind: HeartKind;
};

export type HeartPop = {
  id: number;
  x: number;
  y: number;
  label: string;
  isGold: boolean;
};

export type GamePhase = "idle" | "playing" | "done";

const SPAWN_MS = 470;
const TICK_MS = 200;
const POP_MS = 900;

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

export const useHeartGameSceneViewModel = () => {
  const copy = content.heartGame;
  const prefersReducedMotion = useReducedMotion() ?? false;

  const [phase, setPhase] = useState<GamePhase>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(copy.durationSeconds);
  const [hearts, setHearts] = useState<FloatingHeartData[]>([]);
  const [pops, setPops] = useState<HeartPop[]>([]);
  const [roundKey, setRoundKey] = useState(0);

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);
  const nextId = useRef(1);
  const catches = useRef(0);

  const clearTimers = () => {
    timers.current.forEach((t) => {
      window.clearInterval(t);
      window.clearTimeout(t);
    });
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const spawnHeart = () => {
    const roll = Math.random();
    const kind: HeartKind =
      roll < 0.12 ? "gold" : roll < 0.56 ? "sky" : "lilac";
    const heart: FloatingHeartData = {
      id: nextId.current++,
      x: randomBetween(6, 88),
      y: randomBetween(15, 80),
      size: kind === "gold" ? randomBetween(36, 44) : randomBetween(38, 60),
      duration:
        kind === "gold" ? randomBetween(2.6, 3.4) : randomBetween(3.4, 5.6),
      drift: randomBetween(10, 26),
      kind,
    };
    setHearts((prev) => [...prev, heart]);
  };

  const finish = () => {
    clearTimers();
    setHearts([]);
    setPhase("done");
  };

  const start = () => {
    clearTimers();
    catches.current = 0;
    setScore(0);
    setHearts([]);
    setPops([]);
    setTimeLeft(copy.durationSeconds);
    setRoundKey((k) => k + 1);
    setPhase("playing");

    const endAt = Date.now() + copy.durationSeconds * 1000;
    spawnHeart();
    timers.current.push(window.setInterval(spawnHeart, SPAWN_MS));
    timers.current.push(
      window.setInterval(() => {
        const remaining = endAt - Date.now();
        setTimeLeft(Math.max(0, Math.ceil(remaining / 1000)));
        if (remaining <= 0) finish();
      }, TICK_MS)
    );
  };

  const catchHeart = (id: number, clientX: number, clientY: number) => {
    const heart = hearts.find((h) => h.id === id);
    if (!heart || phase !== "playing") return;
    setHearts((prev) => prev.filter((h) => h.id !== id));

    const isGold = heart.kind === "gold";
    setScore((s) => s + (isGold ? 3 : 1));

    const rect = arenaRef.current?.getBoundingClientRect();
    const words = copy.popWords;
    const pop: HeartPop = {
      id,
      x: rect ? ((clientX - rect.left) / rect.width) * 100 : heart.x,
      y: rect ? ((clientY - rect.top) / rect.height) * 100 : 50,
      label: isGold ? "+3 golden" : words[catches.current++ % words.length],
      isGold,
    };
    setPops((prev) => [...prev, pop]);
    timers.current.push(
      window.setTimeout(
        () => setPops((prev) => prev.filter((p) => p.id !== pop.id)),
        POP_MS
      )
    );
  };

  const miss = (id: number) =>
    setHearts((prev) => prev.filter((h) => h.id !== id));

  // Highest tier she reached.
  const result =
    [...copy.results]
      .sort((a, b) => b.minScore - a.minScore)
      .find((r) => score >= r.minScore) ?? copy.results[0];

  return {
    copy,
    phase,
    score,
    timeLeft,
    roundKey,
    hearts,
    pops,
    arenaRef,
    reducedMotion: prefersReducedMotion,
    resultTitle: result?.title ?? "",
    resultText: result?.text.replace("{score}", String(score)) ?? "",
    start,
    catchHeart,
    miss,
  };
};
