import { assetUrl } from "@/lib/asset-url";
import type { SnapshotMedia } from "@/model/frontend/experience-content";
import { FilmIcon, ImageIcon, PlayIcon } from "lucide-react";
import { usePolaroidVideo } from "./use-polaroid-video";

// One polaroid on the board: a looping muted video or a photo, with a
// handwritten caption. In development, a missing file shows a hint.
type PolaroidProps = {
  item: SnapshotMedia;
  isMissing: boolean;
  onOpen: () => void;
  onError: () => void;
};

const Polaroid = ({ item, isMissing, onOpen, onError }: PolaroidProps) => {
  const videoRef = usePolaroidVideo();
  const MissingIcon = item.type === "video" ? FilmIcon : ImageIcon;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open: ${item.caption}`}
      className="group block w-full cursor-pointer bg-white p-3 pb-0 text-left shadow-float focus-visible:ring-4 focus-visible:ring-lilac-deep focus-visible:outline-none"
    >
      <span className="relative block aspect-[3/4] overflow-hidden bg-sky-light">
        {isMissing ? (
          <span className="flex size-full flex-col items-center justify-center gap-2 bg-linear-to-br from-sky-light to-lilac-light p-4 text-center text-ink">
            <MissingIcon className="size-8 text-lilac-deep" strokeWidth={1.4} />
            <span className="text-xs font-medium">
              Add <code>public{item.src}</code>
            </span>
            <span className="text-[0.65rem] text-ink-soft">
              Only visible while developing
            </span>
          </span>
        ) : item.type === "video" ? (
          <>
            <video
              ref={videoRef}
              src={assetUrl(item.src)}
              poster={item.poster && assetUrl(item.poster)}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              loop
              muted
              playsInline
              preload="metadata"
              onError={onError}
            />
            <span className="absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-white/80 text-ink">
              <PlayIcon className="ml-0.5 size-3.5" fill="currentColor" />
            </span>
          </>
        ) : (
          <img
            src={assetUrl(item.src)}
            alt={item.caption}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={onError}
            draggable={false}
          />
        )}
      </span>
      <span className="block py-3 text-center font-hand text-2xl text-ink">
        {item.caption}
      </span>
    </button>
  );
};

export default Polaroid;
