import { assetUrl } from "@/lib/asset-url";
import type { SnapshotMedia } from "@/model/frontend/experience-content";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { createPortal } from "react-dom";

// Full-screen viewer for one photo or video. Rendered into <body> so no
// transformed ancestor can trap it. Videos loop silently so the song
// keeps playing underneath without interruption.
type MediaViewerProps = {
  item: SnapshotMedia | null;
  onClose: () => void;
};

const MediaViewer = ({ item, onClose }: MediaViewerProps) => {
  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          key={item.id}
          role="dialog"
          aria-modal="true"
          aria-label={item.caption}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-ink/80 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white p-3 pb-0 shadow-2xl"
            initial={{ scale: 0.85, rotate: -3, y: 30 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            {item.type === "video" ? (
              <video
                src={assetUrl(item.src)}
                poster={item.poster && assetUrl(item.poster)}
                className="max-h-[78dvh] max-w-[88vw] bg-black"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={assetUrl(item.src)}
                alt={item.caption}
                className="max-h-[78dvh] max-w-[88vw] object-contain"
              />
            )}
            <p className="py-3 text-center font-hand text-3xl text-ink">
              {item.caption}
            </p>
          </motion.div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="flex cursor-pointer items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-ink focus-visible:ring-4 focus-visible:ring-lilac focus-visible:outline-none"
          >
            <XIcon className="size-4" /> Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MediaViewer;
