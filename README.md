# A Day With You on My Mind

_One day, morning to midnight, under a sky in her favourite colours._

A full-screen, scroll-driven love letter: the sky changes from morning
sky blue to golden-hour lilac to a starry night as she scrolls. Built
with React, TypeScript, Vite, Tailwind CSS v4 and Framer Motion, on top of the Softgem `ViteFrontendTemplate`.

## Personalise it

Edit **one file**: `src/data.ts`. Her nickname, your name, every card, the
notifications, notes, this-or-that, the letter, the wishes, the good-night
message, the song and her photos/videos are all set there. Anything marked `PLACEHOLDER` is
sample text — swap it for things that are genuinely true.

## Add her videos, photos and your song

1. Drop the files into `public/media/` (see `public/media/README.txt`).
2. List them in `src/data.ts` → `music` and `snapshots.media`.

While developing, any listed file that is missing shows a placeholder
card naming the file to add. On the live site, missing files are hidden.

## Run it

```bash
yarn install     # first time only
yarn dev         # open the printed http://localhost:5173 link
```

Other scripts:

```bash
yarn lint        # ESLint
yarn build       # type-check + production build into dist/
yarn preview     # serve the production build locally
yarn format      # Prettier
```

## Test it on your phone

She'll view it on her phone, so check it on yours before sending:

```bash
yarn dev --host
```

Your phone must be on the same Wi-Fi as your laptop. Open the
`Network:` address it prints (e.g. `http://192.168.1.5:5173`) in your
phone's browser.

Phone notes:
- Most phones won't let a website start music by itself. If the song
  doesn't start, the Spotify player stays open with "Tap ▶ to play our
  song" — one tap and it loops from then on.
- Spotify plays the full song only if she's logged in to Spotify in her
  phone's browser; otherwise it's a 30-second preview on repeat. An
  `our-song.mp3` in `public/media/` avoids that completely.

## Project layout

```
src/
├── data.ts                       # ← all editable content
├── app.tsx / main.tsx            # entry + music provider + reduced motion
├── assets/style/index.css        # Tailwind v4 theme: sky blue + lilac palette
├── constants/scene-constant.ts   # scene order, day/night tone, sky colours
├── model/frontend/               # TypeScript types for data.ts
├── router/                       # React Router (home + 404 + error)
├── view/experience-view/         # lock screen → the day (scroll-driven sky)
└── components/
    ├── sky/                      # the sky: gradient, sun, moon, clouds, stars
    ├── hud/                      # story clock, scene dots, music player
    ├── scenes/                   # one per time of day (View + ViewModel)
    ├── providers/                # background music (play / pause / duck)
    ├── decor/                    # text reveal, sparkles, tap hearts, star field
    └── ui/button.tsx             # shadcn Button, restyled
```

## Deploy

It's live on GitHub Pages: **https://balentino202.github.io/for-ade/**

After changing anything (e.g. `src/data.ts`), update the live site with:

```bash
yarn deploy
```

Then save your source changes to GitHub too:

```bash
git add -A && git commit -m "Update" && git push
```

`yarn deploy` builds the site for the `/for-ade/` sub-folder and pushes
it to the `gh-pages` branch, which GitHub Pages serves. It's live about a
minute later. (`yarn build` is still the right command for Vercel or
Netlify, which serve from the domain root.)

Note: a deployed site is public to anyone who has the link. It is not
password-protected.
