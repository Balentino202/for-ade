import type { SceneTone } from "@/constants/scene-constant";
import { cn } from "@/lib/utils";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";

// Small corner button to go (back) into full screen.
type FullscreenButtonProps = {
  isFullscreen: boolean;
  tone: SceneTone;
  onToggle: () => void;
};

const FullscreenButton = ({
  isFullscreen,
  tone,
  onToggle,
}: FullscreenButtonProps) => {
  const Icon = isFullscreen ? Minimize2Icon : Maximize2Icon;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
      title={isFullscreen ? "Exit full screen" : "Full screen"}
      className={cn(
        "flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-700 focus-visible:ring-2 focus-visible:ring-lilac-deep focus-visible:outline-none",
        tone === "night" ? "glass-night text-starlight" : "glass text-ink"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

export default FullscreenButton;
