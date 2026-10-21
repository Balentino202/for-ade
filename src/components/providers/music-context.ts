import type { MusicTrack } from "@/model/frontend/experience-content";
import { createContext, useContext } from "react";

/**
 * "file"    — an audio file from public/media plays in the background.
 * "spotify" — the official Spotify player is shown instead.
 * "none"    — no music configured (or nothing could load).
 */
export type MusicMode = "file" | "spotify" | "none";

export type MusicController = {
  track: MusicTrack | null;
  mode: MusicMode;
  /** False until the music is confirmed playable. */
  isAvailable: boolean;
  isPlaying: boolean;
  /** Set once the story has started, so players can appear. */
  hasStarted: boolean;
  play: () => void;
  /**
   * Call from a tap when the music will start *later* (after the voice
   * intro): phones only allow audio that was first started by a tap, so
   * this starts it silently and pauses it straight away.
   */
  prime: () => void;
  pause: () => void;
  toggle: () => void;
  /** Where the Spotify player mounts (only used in "spotify" mode). */
  spotifyMountRef: (el: HTMLDivElement | null) => void;
};

export const MusicContext = createContext<MusicController | null>(null);

export const useMusic = (): MusicController => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside <MusicProvider>");
  return ctx;
};
