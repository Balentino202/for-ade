import { content } from "@/data";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ViewModel for LetterScene.
//   closed  → sealed envelope
//   opening → flap lifts and the paper slides up (animation only)
//   open    → the full letter is shown
export type LetterPhase = "closed" | "opening" | "open";

export type LetterSceneProps = {
  /** Bumped by "Read the note again" to open the letter from elsewhere. */
  openSignal: number;
};

const OPENING_MS = 1300;

export const useLetterSceneViewModel = ({ openSignal }: LetterSceneProps) => {
  const copy = content.letter;
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<LetterPhase>("closed");
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    []
  );

  useEffect(() => {
    if (openSignal > 0) setPhase("open");
  }, [openSignal]);

  const openEnvelope = () => {
    if (phase !== "closed") return;
    if (prefersReducedMotion) {
      setPhase("open");
      return;
    }
    setPhase("opening");
    timer.current = window.setTimeout(() => setPhase("open"), OPENING_MS);
  };

  return {
    copy,
    letter: copy.content,
    myName: content.myName.trim(),
    isEnvelopeVisible: phase !== "open",
    isOpening: phase === "opening",
    openEnvelope,
    foldBack: () => setPhase("closed"),
  };
};
