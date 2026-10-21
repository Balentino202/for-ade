import { useCallback, useEffect, useState } from "react";

// Real full screen (no address bar or browser buttons) via the
// Fullscreen API. Works on Android phones and computers. iPhones don't
// allow it for websites — there, "Add to Home Screen" opens the site
// full screen instead (see the manifest in index.html).

type WebkitDocument = Document & {
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type WebkitElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

const doc = () => document as WebkitDocument;

const currentFullscreenElement = () =>
  doc().fullscreenElement ?? doc().webkitFullscreenElement ?? null;

export const useFullscreen = () => {
  const [isSupported] = useState(
    () => !!(doc().fullscreenEnabled || doc().webkitFullscreenEnabled)
  );
  const [isFullscreen, setIsFullscreen] = useState(
    () => currentFullscreenElement() !== null
  );

  useEffect(() => {
    const onChange = () => setIsFullscreen(currentFullscreenElement() !== null);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // Must be called straight from a tap/click — browsers require that.
  const enter = useCallback(() => {
    if (!isSupported || currentFullscreenElement()) return;
    const el = document.documentElement as WebkitElement;
    try {
      const result = el.requestFullscreen
        ? el.requestFullscreen({ navigationUI: "hide" })
        : el.webkitRequestFullscreen?.();
      // Refusal is fine — the site still works in the normal browser view.
      Promise.resolve(result).catch(() => undefined);
    } catch {
      // Same as above.
    }
  }, [isSupported]);

  const exit = useCallback(() => {
    if (!currentFullscreenElement()) return;
    const result = doc().exitFullscreen
      ? doc().exitFullscreen()
      : doc().webkitExitFullscreen?.();
    Promise.resolve(result).catch(() => undefined);
  }, []);

  return {
    isSupported,
    isFullscreen,
    enter,
    toggle: () => (currentFullscreenElement() ? exit() : enter()),
  };
};
