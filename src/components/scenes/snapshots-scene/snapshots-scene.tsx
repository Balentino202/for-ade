import SceneShell from "@/components/scenes/scene-shell";
import { motion } from "framer-motion";
import FoldedNote from "./folded-note";
import MediaViewer from "./media-viewer";
import Polaroid from "./polaroid";
import { useSnapshotsSceneViewModel } from "./use-snapshots-scene-view-model";

// Slight, hand-placed tilts so the board looks pinned up by hand.
const TILTS = [-4, 3, -2, 5, -3, 2, -5, 4];

// 12:30 PM — a scrapbook of her photos and the little things I notice.
const SnapshotsScene = () => {
  const vm = useSnapshotsSceneViewModel();

  return (
    <SceneShell {...vm.copy} tone="day" headingId="snapshots-heading">
      <ul className="mx-auto flex max-w-6xl flex-wrap items-start justify-center gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12">
        {vm.board.map((entry, i) => {
          const tilt = TILTS[i % TILTS.length];
          return (
            <motion.li
              key={entry.item.id}
              className="relative w-[calc(50%-0.5rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
              initial={{ opacity: 0, y: -80, rotate: tilt * 4, scale: 1.1 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt, scale: 1 }}
              whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 13,
                delay: (i % 4) * 0.12,
              }}
            >
              {/* tape */}
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rotate-[-3deg] bg-white/55 shadow-sm backdrop-blur-sm"
              />
              {entry.kind === "media" ? (
                <Polaroid
                  item={entry.item}
                  isMissing={vm.isMissing(entry.item.id)}
                  onOpen={() => vm.view(entry.item.id)}
                  onError={() => vm.markFailed(entry.item.id)}
                />
              ) : (
                <FoldedNote
                  text={entry.item.text}
                  frontLabel={vm.copy.noteFrontLabel}
                  index={i}
                  isOpen={vm.isNoteOpen(entry.item.id)}
                  onToggle={() => vm.toggleNote(entry.item.id)}
                />
              )}
            </motion.li>
          );
        })}
      </ul>
      <MediaViewer item={vm.viewing} onClose={vm.closeViewer} />
    </SceneShell>
  );
};

export default SnapshotsScene;
