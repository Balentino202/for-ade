import { content } from "@/data";
import { useEffect, useRef, useState } from "react";

// ViewModel for ThisOrThatScene. She picks one side of each pair, sees a
// little reaction, and the next pair slides in. At the end she can copy
// (or share) her answers to send them herself — nothing is sent or
// stored by the site.
export type Side = "a" | "b";

const ADVANCE_MS = 1400;
const COPIED_MS = 2600;

export const useThisOrThatSceneViewModel = () => {
  const copy = content.thisOrThat;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Side>>({});
  const [pendingSide, setPendingSide] = useState<Side | null>(null);
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => timers.current.forEach((t) => window.clearTimeout(t)),
    []
  );

  const isDone = index >= copy.pairs.length;
  const pair = isDone ? null : copy.pairs[index];

  const choose = (side: Side) => {
    if (!pair || pendingSide) return;
    setPendingSide(side);
    setAnswers((prev) => ({ ...prev, [pair.id]: side }));
    timers.current.push(
      window.setTimeout(() => {
        setPendingSide(null);
        setIndex((i) => i + 1);
      }, ADVANCE_MS)
    );
  };

  const picks = copy.pairs
    .filter((p) => answers[p.id])
    .map((p) => (answers[p.id] === "a" ? p.a : p.b));

  const share = async () => {
    const text = `${copy.shareIntro}\n${picks.map((p) => `• ${p}`).join("\n")}`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      timers.current.push(window.setTimeout(() => setCopied(false), COPIED_MS));
    } catch {
      // She closed the share sheet, or clipboard access was refused.
    }
  };

  const playAgain = () => {
    setAnswers({});
    setIndex(0);
    setCopied(false);
  };

  return {
    copy,
    pair,
    index,
    total: copy.pairs.length,
    isDone,
    pendingSide,
    reaction:
      pair && pendingSide
        ? pendingSide === "a"
          ? pair.reactionA
          : pair.reactionB
        : null,
    picks,
    copied,
    choose,
    share,
    playAgain,
  };
};
