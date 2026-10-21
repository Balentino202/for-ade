// Shapes for everything editable in `src/data.ts`. Keeping them typed
// means a typo in the data file shows up as a build error instead of a
// blank card on her screen.

/** Every scene of the day shares this header. */
export type SceneCopy = {
  /** The time on the story clock, e.g. "7:00 AM". */
  time: string;
  /** A one- or two-word name for this part of the day. */
  label: string;
  title: string;
  subtitle?: string;
};

export type MusicTrack = {
  /**
   * Path to an audio file inside `public/`, e.g. "/media/our-song.mp3".
   * Plays as seamless background music. If it's missing, the Spotify
   * player is used instead (when `spotifyUrl` is set).
   */
  src?: string;
  /** A Spotify track link, shown as the official Spotify player. */
  spotifyUrl?: string;
  title: string;
  artist: string;
  /** 0–1. Background music should sit gently under everything. */
  volume?: number;
};

export type VoiceLine = {
  /** Shown on screen as a subtitle while it's spoken. */
  text: string;
  /** Path inside `public/`, e.g. "/media/voice-1.m4a". */
  audio: string;
};

export type NotificationIcon =
  | "cloud"
  | "hourglass"
  | "bell"
  | "battery"
  | "map"
  | "note"
  | "music"
  | "heart";

export type PhoneNotification = {
  app: string;
  icon: NotificationIcon;
  text: string;
};

export type SnapshotMedia = {
  id: string;
  type: "video" | "photo";
  /** Path inside `public/`, e.g. "/media/video-1.mp4". */
  src: string;
  /** Optional still image shown while a video loads. */
  poster?: string;
  caption: string;
};

export type NoticeNote = {
  id: string;
  text: string;
};

export type ThisOrThatPair = {
  id: string;
  a: string;
  b: string;
  reactionA: string;
  reactionB: string;
};

export type HeartGameResult = {
  /** The lowest score that earns this message. */
  minScore: number;
  title: string;
  /** `{score}` is replaced with her score. */
  text: string;
};

export type LetterContent = {
  greeting: string;
  paragraphs: string[];
  signOff: string;
};

export type ExperienceContent = {
  herNickname: string;
  myName: string;
  siteTitle: string;

  music: MusicTrack | null;

  /** Spoken right after she taps in; the song starts when it finishes. */
  voiceIntro: {
    lines: VoiceLine[];
    skipLabel: string;
  } | null;

  lockScreen: {
    /** Optional photo used as the lock-screen wallpaper. */
    wallpaper?: string;
    clock: string;
    dateLabel: string;
    appName: string;
    notificationTitle: string;
    notificationBody: string;
    hint: string;
  };

  morning: SceneCopy & {
    /** `{name}` is replaced with her nickname. */
    greetingWithName: string;
    greetingFallback: string;
    messages: string[];
    scrollHint: string;
  };

  notifications: SceneCopy & {
    buttonLabel: string;
    /** How many notifications are already on screen when she arrives. */
    initialCount: number;
    items: PhoneNotification[];
    allSeenNote: string;
  };

  snapshots: SceneCopy & {
    media: SnapshotMedia[];
    noteFrontLabel: string;
    notes: NoticeNote[];
  };

  heartGame: SceneCopy & {
    startLabel: string;
    durationSeconds: number;
    scoreLabel: string;
    /** Little words that pop up when she catches a heart. */
    popWords: string[];
    results: HeartGameResult[];
    playAgainLabel: string;
  };

  thisOrThat: SceneCopy & {
    pairs: ThisOrThatPair[];
    resultTitle: string;
    resultText: string;
    shareLabel: string;
    shareIntro: string;
    copiedLabel: string;
    playAgainLabel: string;
  };

  letter: SceneCopy & {
    envelopeHint: string;
    content: LetterContent;
  };

  wishes: SceneCopy & {
    /** One wish per star; the stars form a heart. 6–10 works best. */
    items: string[];
    completeTitle: string;
    completeText: string;
  };

  goodnight: SceneCopy & {
    headingWithName: string;
    headingFallback: string;
    message: string;
    signature: string;
    replayLabel: string;
    readAgainLabel: string;
    /** "YYYY-MM-DD"; empty hides the day counter. */
    talkingSince: string;
    talkingSinceText: string;
    /** Digits only, international format; empty hides the button. */
    replyWhatsAppNumber: string;
    replyLabel: string;
    replyMessage: string;
  };
};
