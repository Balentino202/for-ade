import TapHearts from "@/components/decor/tap-hearts";
import FullscreenButton from "@/components/hud/fullscreen-button";
import MusicPlayer from "@/components/hud/music-player";
import SceneDots from "@/components/hud/scene-dots";
import SpotifyDock from "@/components/hud/spotify-dock";
import StoryClock from "@/components/hud/story-clock";
import GoodnightScene from "@/components/scenes/goodnight-scene";
import HeartGameScene from "@/components/scenes/heart-game-scene";
import LetterScene from "@/components/scenes/letter-scene";
import LockScreen from "@/components/scenes/lock-screen";
import MorningScene from "@/components/scenes/morning-scene";
import NotificationsScene from "@/components/scenes/notifications-scene";
import SnapshotsScene from "@/components/scenes/snapshots-scene";
import ThisOrThatScene from "@/components/scenes/this-or-that-scene";
import WishScene from "@/components/scenes/wish-scene";
import SkyBackdrop from "@/components/sky/sky-backdrop";
import { SceneConstant } from "@/constants/scene-constant";
import { AnimatePresence, motion } from "framer-motion";
import { useExperienceViewModel } from "./use-experience-view-model";

// The one screen of the site: a single day, morning to midnight, told
// as one long scroll under a sky that changes with it.
const ExperienceView = () => {
  const vm = useExperienceViewModel();
  const { content } = vm;

  return (
    <>
      <SkyBackdrop progress={vm.progress} stops={vm.stops} />
      <TapHearts />
      <SpotifyDock />

      <AnimatePresence>
        {!vm.isUnlocked && (
          <motion.div
            key="lock"
            className="relative z-50"
            exit={{ y: "-100%", opacity: 0.6 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          >
            <LockScreen
              {...content.lockScreen}
              showHint={vm.showSoundHint}
              onUnlock={vm.unlock}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {vm.isUnlocked && (
        <motion.header
          className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="pointer-events-auto">
            <StoryClock
              time={vm.clockTime}
              label={vm.clockLabel}
              tone={vm.tone}
            />
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <MusicPlayer tone={vm.tone} />
            {vm.canFullscreen && (
              <FullscreenButton
                isFullscreen={vm.isFullscreen}
                tone={vm.tone}
                onToggle={vm.toggleFullscreen}
              />
            )}
          </div>
        </motion.header>
      )}
      {vm.isUnlocked && (
        <SceneDots
          scenes={vm.sceneDots}
          activeId={vm.activeScene}
          tone={vm.tone}
          onSelect={vm.goToScene}
        />
      )}

      <main aria-hidden={!vm.isUnlocked}>
        <section
          id={SceneConstant.morning}
          ref={vm.registerScene(SceneConstant.morning)}
          aria-labelledby="morning-heading"
        >
          {vm.isUnlocked && (
            <MorningScene {...content.morning} greeting={vm.morningGreeting} />
          )}
        </section>
        <section
          id={SceneConstant.notifications}
          ref={vm.registerScene(SceneConstant.notifications)}
          aria-labelledby="notifications-heading"
        >
          <NotificationsScene />
        </section>
        <section
          id={SceneConstant.snapshots}
          ref={vm.registerScene(SceneConstant.snapshots)}
          aria-labelledby="snapshots-heading"
        >
          <SnapshotsScene />
        </section>
        <section
          id={SceneConstant.heartGame}
          ref={vm.registerScene(SceneConstant.heartGame)}
          aria-labelledby="heart-game-heading"
        >
          <HeartGameScene />
        </section>
        <section
          id={SceneConstant.thisOrThat}
          ref={vm.registerScene(SceneConstant.thisOrThat)}
          aria-labelledby="this-or-that-heading"
        >
          <ThisOrThatScene />
        </section>
        <section
          id={SceneConstant.letter}
          ref={vm.registerScene(SceneConstant.letter)}
          aria-labelledby="letter-heading"
        >
          <LetterScene openSignal={vm.letterOpenSignal} />
        </section>
        <section
          id={SceneConstant.wishes}
          ref={vm.registerScene(SceneConstant.wishes)}
          aria-labelledby="wishes-heading"
        >
          <WishScene />
        </section>
        <section
          id={SceneConstant.goodnight}
          ref={vm.registerScene(SceneConstant.goodnight)}
          aria-labelledby="goodnight-heading"
        >
          <GoodnightScene
            {...content.goodnight}
            heading={vm.goodnightHeading}
            myName={vm.myName}
            daysTogetherText={vm.daysTogetherText}
            replyHref={vm.replyHref}
            onReplay={vm.replayDay}
            onReadAgain={vm.readLetterAgain}
          />
        </section>
      </main>
    </>
  );
};

export default ExperienceView;
