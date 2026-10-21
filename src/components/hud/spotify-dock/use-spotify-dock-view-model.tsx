import { useMusic } from "@/components/providers/music-context";
import { useEffect, useState } from "react";

// ViewModel for SpotifyDock.
// Phones often don't let a website start music by itself, so the player
// stays open — with a "tap play" prompt — until the song is actually
// playing. Only then does it tuck itself away into a spinning record.
const AUTO_COLLAPSE_MS = 6000;
const AUTOPLAY_GRACE_MS = 2500;

export const useSpotifyDockViewModel = () => {
  const music = useMusic();
  const [isExpanded, setIsExpanded] = useState(true);
  const [graceOver, setGraceOver] = useState(false);

  useEffect(() => {
    if (!music.hasStarted) return;
    const timer = window.setTimeout(
      () => setGraceOver(true),
      AUTOPLAY_GRACE_MS
    );
    return () => window.clearTimeout(timer);
  }, [music.hasStarted]);

  useEffect(() => {
    if (!music.isPlaying) return;
    const timer = window.setTimeout(
      () => setIsExpanded(false),
      AUTO_COLLAPSE_MS
    );
    return () => window.clearTimeout(timer);
  }, [music.isPlaying]);

  return {
    // Rendered (hidden) from the start so the player is loaded by the
    // time she taps; only shown once the story begins.
    isRendered: music.mode === "spotify",
    isShown: music.hasStarted,
    isExpanded,
    isPlaying: music.isPlaying,
    /** The browser blocked autoplay — she needs to press play once. */
    needsTap: graceOver && music.isAvailable && !music.isPlaying,
    title: music.track?.title ?? "",
    artist: music.track?.artist ?? "",
    mountRef: music.spotifyMountRef,
    expand: () => setIsExpanded(true),
    collapse: () => setIsExpanded(false),
  };
};
