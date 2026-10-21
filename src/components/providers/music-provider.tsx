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
const FADE_STEP_MS = 50;
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
    // The button shows what's really happening, not what we hoped for.
    const onPlaying = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("canplay", onReady);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", fallBackFromFile);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", fallBackFromFile);
      audioRef.current = null;
    };
  }, [mode, fallBackFromFile]);

  // Fades with a timer, not animation frames: frame timestamps can be a
  // hair *earlier* than the fade's start, which produced a negative
  // volume — browsers reject that with an error, the fade died at 0, and
  // the song "played" silently until she paused and played again.
  const fadeTo = useCallback((to: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current !== null) window.clearInterval(fadeRef.current);
    const from = audio.volume;
    const start = performance.now();
    const setVolume = (v: number) => {
      audio.volume = Math.min(1, Math.max(0, v));
    };
    fadeRef.current = window.setInterval(() => {
      const t = Math.min(1, Math.max(0, (performance.now() - start) / FADE_MS));
      setVolume(from + (to - from) * t);
      if (t >= 1) {
        if (fadeRef.current !== null) window.clearInterval(fadeRef.current);
        fadeRef.current = null;
        onDone?.();
      }
    }, FADE_STEP_MS);
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
    if (fadeRef.current !== null) window.clearInterval(fadeRef.current);
    audio.volume = 0;
    audio
      .play()
      .then(() => {
        setIsAvailable(true);
        fadeTo(targetVolume);
      })
      .catch(() => {
        // Blocked (no tap yet): make sure it isn't left silent for later.
        audio.volume = targetVolume;
      });
  }, [mode, fadeTo, targetVolume]);

  const stopPlayback = useCallback(() => {
    if (mode === "spotify") {
      spotifyRef.current?.pause();
      return;
    }
    fadeTo(0, () => audioRef.current?.pause());
  }, [mode, fadeTo]);

  const play = useCallback(() => {
    setHasStarted(true);
    wantsPlayRef.current = true;
    startPlayback();
  }, [startPlayback]);

  const prime = useCallback(() => {
    const audio = audioRef.current;
    if (mode !== "file" || !audio || !audio.paused) return;
    audio.muted = true;
    audio
      .play()
      .then(() => {
        // If she (or the intro) already asked for music meanwhile, keep it.
        if (wantsPlayRef.current) return;
        audio.pause();
        audio.currentTime = 0;
      })
      .catch(() => undefined)
      .finally(() => {
        audio.muted = false;
      });
  }, [mode]);

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
      prime,
      pause,
      // Follow what's actually audible: if the browser blocked the first
      // attempt, her first tap must start the music, not "pause" it.
      toggle: () => (isPlaying ? pause() : play()),
      spotifyMountRef: setSpotifyEl,
    }),
    [mode, isAvailable, isPlaying, hasStarted, play, prime, pause]
  );

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
};

export default MusicProvider;
