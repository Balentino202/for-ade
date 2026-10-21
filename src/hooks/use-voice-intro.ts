import { assetUrl } from "@/lib/asset-url";
import type { VoiceLine } from "@/model/frontend/experience-content";
import { useCallback, useEffect, useRef, useState } from "react";

// Plays the spoken intro line by line and reports which line is being
// said (for the subtitles). One <audio> element is reused for every line
// on purpose: phones only allow audio that started from a tap, and an
// element that has played once may keep playing new lines afterwards.

// If a line hasn't started after this long (slow network, blocked
// audio), move on rather than leave her waiting in silence.
const LINE_TIMEOUT_MS = 6000;
const GAP_MS = 350;

export const useVoiceIntro = (lines: VoiceLine[]) => {
  const [lineIndex, setLineIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onDoneRef = useRef<() => void>(() => undefined);
  const timers = useRef<number[]>([]);
  const indexRef = useRef(-1);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    if (lines.length === 0) return;
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = assetUrl(lines[0].audio);
    audioRef.current = audio;
    return () => {
      clearTimers();
      audio.pause();
      audioRef.current = null;
    };
  }, [lines]);

  const finish = useCallback(() => {
    clearTimers();
    audioRef.current?.pause();
    indexRef.current = -1;
    setLineIndex(-1);
    const done = onDoneRef.current;
    onDoneRef.current = () => undefined;
    done();
  }, []);

  const playLine = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      if (!audio || index >= lines.length) {
        finish();
        return;
      }
      clearTimers();
      indexRef.current = index;
      setLineIndex(index);

      const next = () => {
        if (indexRef.current !== index) return;
        timers.current.push(
          window.setTimeout(() => playLine(index + 1), GAP_MS)
        );
      };
      audio.onended = next;
      audio.onerror = next;
      timers.current.push(
        window.setTimeout(() => {
          if (audio.paused) next();
        }, LINE_TIMEOUT_MS)
      );

      const src = assetUrl(lines[index].audio);
      if (!audio.src.endsWith(src)) audio.src = src;
      audio.currentTime = 0;
      audio.play().catch(next);
    },
    [lines, finish]
  );

  /** Call from her tap. `onDone` runs after the last line (or a skip). */
  const start = useCallback(
    (onDone: () => void) => {
      if (lines.length === 0) {
        onDone();
        return;
      }
      onDoneRef.current = onDone;
      playLine(0);
    },
    [lines, playLine]
  );

  return {
    isSpeaking: lineIndex >= 0,
    currentLine: lineIndex >= 0 ? lines[lineIndex] : null,
    lineIndex,
    start,
    skip: finish,
  };
};
