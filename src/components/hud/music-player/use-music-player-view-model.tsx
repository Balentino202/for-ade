import { useMusic } from "@/components/providers/music-context";

// ViewModel for MusicPlayer — a thin adapter over the music context.
// Only used for the audio-file mode; Spotify has its own dock.
export const useMusicPlayerViewModel = () => {
  const music = useMusic();
  return {
    isVisible: music.mode === "file" && music.isAvailable,
    isPlaying: music.isPlaying,
    /** Story started but no sound yet (e.g. the phone blocked autoplay). */
    needsTap: music.hasStarted && !music.isPlaying,
    title: music.track?.title ?? "",
    artist: music.track?.artist ?? "",
    toggle: music.toggle,
  };
};
