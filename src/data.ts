import type { ExperienceContent } from "@/model/frontend/experience-content";

/* ==================================================================
   PERSONALISE EVERYTHING HERE
   ------------------------------------------------------------------
   "A Day With You on My Mind" — one day, morning to midnight.
   This is the only file you need to edit. Every word, song, photo and
   video on the website comes from here.

   • Text marked PLACEHOLDER is sample copy. Swap it for things that
     are genuinely true about her and the two of you. The more specific
     and real it is, the more it will mean.
   • Music, videos and photos go in `public/media/`. Refer to them here
     as "/media/<file name>".
   • Keep the quotes "…" around each piece of text.
   • Save the file and the browser updates automatically while
     `yarn dev` is running.
   ================================================================== */

export const content: ExperienceContent = {
  // ── Names ──────────────────────────────────────────────────────────
  // Leave empty ("") and the site says "you" instead.
  herNickname: "Ade",
  // Shown on the letter and the final signature, only once filled in.
  myName: "Ayomide",

  siteTitle: "A Day With You on My Mind",

  // ── Background music ───────────────────────────────────────────────
  // "Orekelewa" by Abefe — public/media/our-song.mp3. It starts when she
  // taps the notification on the lock screen, fades in gently, and loops
  // forever. A small pill at the top lets her pause it.
  // If the mp3 is ever missing, the Spotify player is used instead (on
  // phones that's usually only a 30-second preview).
  // Set `music: null` to turn music off completely.
  music: {
    src: "/media/our-song.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/0Jg8TctX4LJ5pWuENt0xuO?si=4e02abeaddbf45a5",
    title: "Orekelewa",
    artist: "Abefe",
    volume: 0.45,
  },

  // ── Voice intro ────────────────────────────────────────────────────
  // Right after she taps the notification, a voice says these lines (each
  // one appears on screen as a subtitle), then the song fades in.
  //
  // The voice files were made with the Mac's "Daniel" voice. It would
  // mean MUCH more in your own voice: record each line as a short voice
  // note, save them as voice-1.m4a … voice-5.m4a (or .mp3 — update the
  // paths below) in public/media/, and keep the `text` matching what you
  // say. Set `voiceIntro: null` to skip the voice entirely.
  voiceIntro: {
    lines: [
      { text: "For you, Ade.", audio: "/media/voice-1.m4a" },
      { text: "From Ayomide.", audio: "/media/voice-2.m4a" },
      {
        text: "I made you a little something today.",
        audio: "/media/voice-3.m4a",
      },
      {
        text: "So turn your sound up, take your time, and scroll slowly.",
        audio: "/media/voice-4.m4a",
      },
      {
        text: "This is what a day with you on my mind looks like.",
        audio: "/media/voice-5.m4a",
      },
    ],
    skipLabel: "Skip",
  },

  // ── The lock screen she sees first ────────────────────────────────
  lockScreen: {
    // Her photo as the lock-screen wallpaper. Remove this line for a
    // plain sky-blue-and-lilac wallpaper instead.
    wallpaper: "/media/photo-1.jpg",
    clock: "7:00",
    dateLabel: "Today",
    appName: "A little something",
    notificationTitle: "For you, Ade 💌",
    notificationBody: "I made you something. Tap to open.",
    hint: "Turn your sound on 🎧",
  },

  // ── 7:00 AM ────────────────────────────────────────────────────────
  morning: {
    time: "7:00 AM",
    label: "Morning",
    title: "This is what a day with you on my mind looks like.",
    greetingWithName: "Good morning, {name}.",
    greetingFallback: "Good morning, you.",
    // Little texts that "type" in, one after another.
    messages: [
      "good morning ☀️",
      "hope today is kind to you",
      "also… I made you a whole website. act normal 🙈",
    ],
    scrollHint: "Scroll slowly — the day is about to start",
  },

  // ── 9:41 AM ────────────────────────────────────────────────────────
  notifications: {
    time: "9:41 AM",
    label: "Notifications",
    title: "Things my phone keeps telling me",
    subtitle: "Tap for more. It has opinions.",
    buttonLabel: "Another one",
    initialCount: 2,
    allSeenNote: "That's all of them. My phone agrees with me, by the way.",
    // icon: "cloud" | "hourglass" | "bell" | "battery" | "map" | "note"
    //       | "music" | "heart"
    items: [
      {
        app: "Weather",
        icon: "cloud",
        text: "Today's forecast: 100% chance of you crossing my mind.",
      },
      {
        app: "Screen Time",
        icon: "hourglass",
        text: "Your most-smiled-at chat this week has been… guess.",
      },
      {
        app: "Reminders",
        icon: "bell",
        text: "Tell her she's appreciated. (Again. Still true.)",
      },
      {
        app: "Battery",
        icon: "battery",
        text: "5% remaining. Still choosing to reply to you first.",
      },
      {
        app: "Maps",
        icon: "map",
        text: "You have arrived at: thinking about you. Again.",
      },
      {
        app: "Notes",
        icon: "note",
        text: "Your name popping up on my screen is a pretty nice thing.",
      },
      {
        app: "Music",
        icon: "music",
        text: "Now playing: anything, as long as I'm talking to you.",
      },
      {
        app: "Heart",
        icon: "heart",
        text: "Unusual activity detected whenever you text. No action needed.",
      },
    ],
  },

  // ── 12:30 PM ───────────────────────────────────────────────────────
  snapshots: {
    time: "12:30 PM",
    label: "Midday",
    title: "Little things I notice",
    subtitle: "Tap a photo to see it bigger. Tap a note to unfold it.",
    noteFrontLabel: "Unfold me",
    // Her photos and videos, shown as polaroids. Put the files in
    // `public/media/`. type is "video" (.mp4) or "photo" (.jpg/.png).
    // While developing, missing files show a hint; on the live site
    // they're hidden.
    // Captions are PLACEHOLDERS — rename them to something that fits
    // each video. Reorder by moving whole { … } blocks around.
    media: [
      {
        id: "snap-1",
        type: "video",
        src: "/media/video-1.mp4",
        poster: "/media/poster-1.jpg",
        caption: "this one",
      },
      {
        id: "snap-2",
        type: "photo",
        src: "/media/photo-1.jpg",
        caption: "and this",
      },
      {
        id: "snap-3",
        type: "video",
        src: "/media/video-3.mp4",
        poster: "/media/poster-3.jpg",
        caption: "also this",
      },
      {
        id: "snap-4",
        type: "video",
        src: "/media/video-2.mp4",
        poster: "/media/poster-2.jpg",
        caption: "okay, one more",
      },
      {
        id: "snap-5",
        type: "video",
        src: "/media/video-5.mp4",
        poster: "/media/poster-5.jpg",
        caption: "my favourite",
      },
      {
        id: "snap-6",
        type: "video",
        src: "/media/video-4.mp4",
        poster: "/media/poster-4.jpg",
        caption: "no, this one",
      },
      {
        id: "snap-7",
        type: "video",
        src: "/media/video-6.mp4",
        poster: "/media/poster-6.jpg",
        caption: "fine, all of them",
      },
    ],
    // PLACEHOLDER notes — replace with things you've genuinely noticed.
    notes: [
      {
        id: "note-1",
        text: "You make ordinary conversations feel like the good part of the day.",
      },
      {
        id: "note-2",
        text: "You're really easy to talk to. That's rarer than people think.",
      },
      {
        id: "note-3",
        text: "I like the little things you choose to share with me.",
      },
      {
        id: "note-4",
        text: "You have your own kind of charm, and it's very you.",
      },
    ],
  },

  // ── 2:14 PM — the love game ───────────────────────────────────────
  heartGame: {
    time: "2:14 PM",
    label: "Playtime",
    title: "Catch my hearts",
    subtitle: "Tap the hearts before they float away. Golden ones are worth 3.",
    startLabel: "Let's play",
    durationSeconds: 20,
    scoreLabel: "hearts",
    popWords: ["+1 smile", "nice catch", "aww", "fast hands", "got it", "cute"],
    // The message she gets depends on her score. Highest matching wins.
    results: [
      {
        minScore: 0,
        title: "Warm-up round 😌",
        text: "{score} hearts. Good news: you didn't need to catch any. You already have my attention.",
      },
      {
        minScore: 15,
        title: "Look at you go!",
        text: "{score} hearts! Not that you needed to try — you've had my attention for a while now.",
      },
      {
        minScore: 30,
        title: "Okay, heart catcher.",
        text: "{score} hearts?! Honestly, you caught mine way before this game even started.",
      },
    ],
    playAgainLabel: "Play again",
  },

  // ── 4:20 PM ────────────────────────────────────────────────────────
  thisOrThat: {
    time: "4:20 PM",
    label: "Afternoon",
    title: "This or that?",
    subtitle: "Quick, don't overthink it. No wrong answers.",
    pairs: [
      {
        id: "sun",
        a: "Sunrise",
        b: "Sunset",
        reactionA: "An early bird. I respect it.",
        reactionB: "Golden-hour person. Good taste.",
      },
      {
        id: "talk",
        a: "Call",
        b: "Text",
        reactionA: "Noted. My voice is now on standby.",
        reactionB: "Fair. Typing is an art form.",
      },
      {
        id: "place",
        a: "Beach",
        b: "Mountains",
        reactionA: "Sand, sea, no stress. Lovely.",
        reactionB: "Fresh air and a view. Lovely.",
      },
      {
        id: "night",
        a: "Night in",
        b: "Night out",
        reactionA: "Blankets and snacks. Excellent choice.",
        reactionB: "Out and about. Fun choice.",
      },
      {
        id: "treat",
        a: "Sweet",
        b: "Savoury",
        reactionA: "Sweet, obviously. It suits you.",
        reactionB: "Savoury. A woman of substance.",
      },
    ],
    resultTitle: "Noted.",
    resultText: "Filed under: things I like knowing about you.",
    // Lets her copy (or share) her answers so she can send them to you.
    shareLabel: "Send me your answers",
    shareIntro: "My this-or-that answers:",
    copiedLabel: "Copied! Paste it in our chat 😌",
    playAgainLabel: "Play again",
  },

  // ── 6:47 PM ────────────────────────────────────────────────────────
  letter: {
    time: "6:47 PM",
    label: "Golden hour",
    title: "And a note, while the light is pretty",
    envelopeHint: "Tap the envelope to open it",
    content: {
      greeting: "Hey, Ade.",
      // PLACEHOLDER — rewrite in your own words if you can. Even one
      // real, specific sentence beats a perfect generic one.
      paragraphs: [
        "I wanted to make something a little different for you.",
        "Somewhere between all our everyday conversations, you became one of the nicest parts of my day — and I don't think I say that enough.",
        "I like getting to know you. The random stuff, the funny stuff, the little things that make you who you are.",
        "No special occasion. No big reason. Just a small reminder that someone out here is really glad to have you in their world.",
        "I hope this made you smile, because you deserve plenty of reasons to.",
      ],
      signOff: "With a smile,",
    },
  },

  // ── 9:30 PM ────────────────────────────────────────────────────────
  wishes: {
    time: "9:30 PM",
    label: "Night",
    title: "The stars are out",
    subtitle: "Tap every star to finish the constellation.",
    // One wish per star, in the order they light up.
    items: [
      "I hope tomorrow is gentle with you.",
      "I hope you laugh until your face hurts this week.",
      "I hope your worries get smaller.",
      "I hope you sleep well tonight.",
      "I hope good news finds you soon.",
      "I hope you always have someone to talk to.",
      "I hope you know how much you're appreciated.",
      "I hope you never run out of reasons to smile.",
    ],
    completeTitle: "Wish granted… I hope.",
    completeText: "Every one of those is for you.",
  },

  // ── 11:59 PM ───────────────────────────────────────────────────────
  goodnight: {
    time: "11:59 PM",
    label: "Midnight",
    title: "Last thought of the day",
    headingWithName: "Good night, {name}.",
    headingFallback: "Good night, you.",
    message:
      "Thank you for being one of the best parts of my day. Sleep well — and if this made you smile even a little, then today was a good day.",
    signature: "Made with care, just for you.",
    replayLabel: "Replay the day",
    readAgainLabel: "Read the note again",

    // OPTIONAL: the date you two started talking (YYYY-MM-DD). When set,
    // the last scene says how many days it's been. Leave "" to hide.
    talkingSince: "",
    // `{days}` is replaced with the number of days.
    talkingSinceText:
      "{days} days of talking to you, and you're still my favourite part of the day.",

    // OPTIONAL: a "Send me a smile" button that opens WhatsApp to you
    // with a message ready for her. Put your number in international
    // format, digits only (e.g. "2348012345678"). Leave "" to hide it.
    replyWhatsAppNumber: "2349150973009",
    replyLabel: "Send me a smile",
    replyMessage: "I saw it. 😊",
  },
};
