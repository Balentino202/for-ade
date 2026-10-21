import SceneShell from "@/components/scenes/scene-shell";
import { AnimatePresence, motion } from "framer-motion";
import Envelope from "./envelope";
import LetterPaper from "./letter-paper";
import {
  useLetterSceneViewModel,
  type LetterSceneProps,
} from "./use-letter-scene-view-model";

// 6:47 PM — golden hour, and an envelope that opens into a letter.
const LetterScene = (props: LetterSceneProps) => {
  const vm = useLetterSceneViewModel(props);

  return (
    <SceneShell {...vm.copy} tone="day" headingId="letter-heading">
      <AnimatePresence mode="wait" initial={false}>
        {vm.isEnvelopeVisible ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <Envelope
              isOpening={vm.isOpening}
              hint={vm.copy.envelopeHint}
              onOpen={vm.openEnvelope}
            />
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <LetterPaper
              letter={vm.letter}
              myName={vm.myName}
              onFoldBack={vm.foldBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
};

export default LetterScene;
