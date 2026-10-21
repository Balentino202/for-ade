// Minimal typed wrapper around Spotify's official iFrame API
// (https://developer.spotify.com/documentation/embeds/references/iframe-api).
// Only the parts this site uses are typed.

export type SpotifyPlaybackUpdate = {
  data: {
    isPaused: boolean;
    isBuffering: boolean;
    /** Milliseconds. */
    position: number;
    /** Milliseconds. */
    duration: number;
  };
};

export type SpotifyController = {
  play: () => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  destroy: () => void;
  addListener: (
    event: "ready" | "playback_update",
    cb: (e: SpotifyPlaybackUpdate) => void
  ) => void;
};

type SpotifyIFrameAPI = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width?: string | number; height?: number },
    callback: (controller: SpotifyController) => void
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
  }
}

const SCRIPT_SRC = "https://open.spotify.com/embed/iframe-api/v1";
let apiPromise: Promise<SpotifyIFrameAPI> | null = null;

export const loadSpotifyIframeApi = (): Promise<SpotifyIFrameAPI> => {
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      window.onSpotifyIframeApiReady = resolve;
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onerror = () => {
        apiPromise = null;
        reject(new Error("Spotify player could not load"));
      };
      document.body.appendChild(script);
    });
  }
  return apiPromise;
};

/** "https://open.spotify.com/track/ID?si=…" → "spotify:track:ID". */
export const spotifyUriFromUrl = (url: string): string | null => {
  const match = url.match(
    /open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([A-Za-z0-9]+)/
  );
  return match ? `spotify:${match[1]}:${match[2]}` : null;
};
