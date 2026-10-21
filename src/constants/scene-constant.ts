// The scenes of the day, top to bottom. Design-only settings (tone and
// sky colours) live here; all words live in `src/data.ts`.
export enum SceneConstant {
  morning = "morning",
  notifications = "notifications",
  snapshots = "snapshots",
  heartGame = "heart-game",
  thisOrThat = "this-or-that",
  letter = "letter",
  wishes = "wishes",
  goodnight = "goodnight",
}

export const SCENE_ORDER: SceneConstant[] = [
  SceneConstant.morning,
  SceneConstant.notifications,
  SceneConstant.snapshots,
  SceneConstant.heartGame,
  SceneConstant.thisOrThat,
  SceneConstant.letter,
  SceneConstant.wishes,
  SceneConstant.goodnight,
];

/** "day" scenes use dark ink text; "night" scenes use light text. */
export type SceneTone = "day" | "night";

export const SCENE_TONE: Record<SceneConstant, SceneTone> = {
  [SceneConstant.morning]: "day",
  [SceneConstant.notifications]: "day",
  [SceneConstant.snapshots]: "day",
  [SceneConstant.heartGame]: "day",
  [SceneConstant.thisOrThat]: "day",
  [SceneConstant.letter]: "day",
  [SceneConstant.wishes]: "night",
  [SceneConstant.goodnight]: "night",
};

/**
 * Sky gradient (top, bottom) when each scene is centred on screen. The
 * backdrop blends between these as she scrolls: her sky blue through
 * the day, lilac at golden hour, deep violet at night.
 */
export const SKY_COLORS: Record<SceneConstant, [string, string]> = {
  [SceneConstant.morning]: ["#a7dcf7", "#fde3d8"],
  [SceneConstant.notifications]: ["#80c9f1", "#d8f0ff"],
  [SceneConstant.snapshots]: ["#62b9ec", "#cbedff"],
  [SceneConstant.heartGame]: ["#6fc0ee", "#dcd9fb"],
  [SceneConstant.thisOrThat]: ["#8ec9ee", "#e4d5f5"],
  [SceneConstant.letter]: ["#b896d2", "#f9cbb7"],
  [SceneConstant.wishes]: ["#1d1950", "#3d2e72"],
  [SceneConstant.goodnight]: ["#0b0922", "#211a4b"],
};
