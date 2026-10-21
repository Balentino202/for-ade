import { content } from "@/data";
import { assetUrl } from "@/lib/asset-url";
import {
  loadSpotifyIframeApi,
  spotifyUriFromUrl,
  type SpotifyController,
} from "@/lib/spotify-embed";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  MusicContext,
  type MusicController,
  type MusicMode,
} from "./music-context";

// Owns the background music. Prefers an audio file (seamless, with
// fade in/out); if that file is missing, falls back to the official
// Spotify player. Either way the song loops forever and nothing else on
// the site makes sound, so it plays non-stop unless she pauses it.
const FADE_MS = 1200;
// How close to the end a pause counts as "the track finished".
const LOOP_EDGE_MS = 1500;

const track = content.music;
const spotifyUri = track?.spotifyUrl
  ? spotifyUriFromUrl(track.spotifyUrl)
  : null;
const initialMode: MusicMode = !track
  ? "none"
  : track.src
    ? "file"
    : spotifyUri
      ? "spotify"
      : "none";

const MusicProvider = ({ children }: { children: ReactNode }) => {
  const targetVolume = track?.volume ?? 0.45;

  const [mode, setMode] = useState<MusicMode>(initialMode);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [spotifyEl, setSpotifyEl] = useState<HTMLDivElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spotifyRef = useRef<SpotifyController | null>(null);
  const fadeRef = useRef<number | null>(null);
  // Whether she wants music on (false only after she pauses it herself).
  const wantsPlayRef = useRef(false);

  const fallBackFromFile = useCallback(() => {
    setIsAvailable(false);
    setIsPlaying(false);
    setMode(spotifyUri ? "spotify" : "none");
  }, []);

  // ── Audio file mode ────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "file" || !track?.src) return;
    const audio = new Audio();
    audio.src = assetUrl(track.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    const onReady = () => setIsAvailable(true);
    audio.addEventListener("canplay", onReady);
    audio.addEventListener("error", fallBackFromFile);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("error", fallBackFromFile);
      audioRef.current = null;
    };
  }, [mode, fallBackFromFile]);

  const fadeTo = useCallback((to: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / FADE_MS, 1);
      audio.volume = from + (to - from) * t;
      if (t < 1) fadeRef.current = requestAnimationFrame(step);
      else {
        fadeRef.current = null;
        onDone?.();
      }
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  // ── Spotify mode ───────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "spotify" || !spotifyUri || !spotifyEl) return;
    let cancelled = false;
    let controller: SpotifyController | null = null;
    // The API replaces the element it's given, so give it a child.
    const host = document.createElement("div");
    spotifyEl.appendChild(host);

    loadSpotifyIframeApi()
      .then((api) => {
        if (cancelled) return;
        api.createController(
          host,
          { uri: spotifyUri, width: "100%", height: 80 },
          (c) => {
            controller = c;
            spotifyRef.current = c;
            setIsAvailable(true);
            c.addListener("playback_update", (e) => {
              const { isPaused, position, duration } = e.data;
              // The embed stops at the end of the track — start it again
              // so the song never ends.
              const ended =
                isPaused && duration > 0 && position >= duration - LOOP_EDGE_MS;
              if (ended && wantsPlayRef.current) {
                c.seek(0);
                c.resume();
                return;
              }
              setIsPlaying(!isPaused);
              // Her own taps on the Spotify player count as her choice.
              wantsPlayRef.current = !isPaused;
            });
            if (wantsPlayRef.current) c.play();
          }
        );
      })
      .catch(() => setMode("none"));

    return () => {
      cancelled = true;
      controller?.destroy();
      spotifyRef.current = null;
      spotifyEl.replaceChildren();
    };
  }, [mode, spotifyEl]);

  // ── Shared controls ────────────────────────────────────────────────
  const startPlayback = useCallback(() => {
    if (mode === "spotify") {
      spotifyRef.current?.play();
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => {
        setIsAvailable(true);
        setIsPlaying(true);
        fadeTo(targetVolume);
      })
      .catch(() => setIsPlaying(false));
  }, [mode, fadeTo, targetVolume]);

  const stopPlayback = useCallback(() => {
    if (mode === "spotify") {
      spotifyRef.current?.pause();
      return;
    }
    setIsPlaying(false);
    fadeTo(0, () => audioRef.current?.pause());
  }, [mode, fadeTo]);

  const play = useCallback(() => {
    setHasStarted(true);
    wantsPlayRef.current = true;
    startPlayback();
  }, [startPlayback]);

  const pause = useCallback(() => {
    wantsPlayRef.current = false;
    stopPlayback();
  }, [stopPlayback]);

  const value = useMemo<MusicController>(
    () => ({
      track,
      mode,
      isAvailable,
      isPlaying,
      hasStarted,
      play,
      pause,
      // Follow what's actually audible: if the browser blocked the first
      // attempt, her first tap must start the music, not "pause" it.
      toggle: () => (isPlaying ? pause() : play()),
      spotifyMountRef: setSpotifyEl,
    }),
    [mode, isAvailable, isPlaying, hasStarted, play, pause]
  );

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
};

export default MusicProvider;
