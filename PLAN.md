# Personal Site Upgrade Plan
Source: patterns distilled from Zara Zhang's "coolest personal website" X thread (2026-10-08; 393 replies read, 312 domains expanded, top ~20 sites reviewed). Full reference list lives in the "Dope Personal Pages" tab of Abhishek's Google Sheet, entries 30-40.
Implementation notes for any coding agent: one feature per PR, branch `feature/<slug>`, order by priority. Everything below is spec'd against the current codebase (HEAD 998e370).

## Guardrails (read before any PR)
- Stack: Astro, single-page site at `src/pages/index.astro`, custom domain at root (`BASE_URL` is `/`), Node 22 for build.
- Do not break: cursor-following face (`src/components/CursorFace.ts`), 3D bookshelf (`src/components/BookShelf.tsx` + `src/components/shelf/ShelfEngine.ts`), reading history (`src/components/ReadingHistory.astro`), Goodreads sync (`scripts/sync-goodreads.py`).
- New type stays in Geist Mono or the existing display stack. No font additions unless a feature explicitly lists one.
- Every animated/interactive piece must respect `prefers-reduced-motion` (disable or reduce).
- Theme rules: an explicit localStorage `theme` choice always wins over time-of-day defaults (see feature 1).
- Content rules: only real Abhishek content. No placeholder bios, no invented projects. If copy needs his voice, mark `TODO(OWNER)` and flag it in the PR description.
- Verify each PR: `npm run build`, Playwright headless screenshot of the page, confirm no console errors, confirm deployed asset URLs return HTTP 200. Never write CSS via printf without escaping `%` (check dist CSS for `%%` artifacts).

## P0 — Quick wins (one evening each)

### 1. Time-of-day lighting + SF clock (ref: calissa.ai, thread likes 50)
What: the site palette and 3D-shelf lighting shift by actual SF local hour, and a small live `SF 14:32` clock sits in the nav.
- New `src/lib/daylight.ts`: maps hour to a named phase (`dawn 5-8`, `morning 8-12`, `afternoon 12-17`, `evening 17-21`, `night 21-5`), sets `document.documentElement.dataset.hour = phase`.
- `src/styles/global.css`: define per-phase accent/ambient CSS variable overrides under `html[data-hour="dawn"]` etc. Only 3-4 vars per phase (accent, surface tint, border tone). Small deltas, not theme swaps.
- Shelf: pass the current phase into `ShelfEngine.refreshTheme()`; add per-phase key-light warm/intensity values to the existing dark-mode museum-lighting logic. The shelf already has light/dark handling; this extends it, does not replace it.
- Clock: small `useEffect` interval (60s) component, Geist Mono, renders `SF HH:MM` next to the theme toggle.
- Rule: if localStorage has an explicit theme choice, hour phases apply only to the 3D scene lighting, not the page theme. The toggle still wins for the page.
- Acceptance: page accent changes across phase boundaries without reload; toggle still overrides; clock ticks without re-rendering the 3D canvas.

### 2. Terminal boot sequence (ref: elliothu.me, likes 128)
What: on first visit, before the face and hero appear, a short Geist Mono terminal boot types out and resolves into the page.
- New `src/components/BootIntro.astro` (inline script, no framework). Lines are Abhishek-flavored, e.g. `boot: abhishek.si 1.0`, `loading voice ai ... ok`, `mounting bookshelf ... ok`, `good ideas jump too.`. Copy is `TODO(OWNER)`.
- Behavior: sessionStorage flag `booted=1` so it only runs once per session; total runtime under 1.2s; `prefers-reduced-motion` skips straight to the page; skips entirely on repeat views.
- Must not delay LCP: hero image keeps `fetchpriority=high`; boot overlay is a fixed overlay that fades out, not a render blocker. Test Lighthouse LCP before/after.
- Acceptance: runs once, skips on reload, LCP regression under 100ms.

### 3. Text scramble on hover (ref: gordontu.com, likes 85)
What: nav links and section headings scramble into cipher glyphs and resolve on hover.
- New `src/lib/scramble.ts` + a `data-scramble` attribute on nav links (`Writing`, `Building`, `Reading`) and section headings.
- Characters: box-drawing/glyph set that renders in Geist Mono (test: `▚▞◆✕#+*=`). Interval-based resolve left-to-right, ~400ms, cancel on mouseout, skip entirely under `prefers-reduced-motion`.
- Pure JS/CSS, no dependency. Applies on hover/focus.
- Acceptance: no layout shift while scrambling (glyphs are same width in mono), focus-visible still resolves for keyboard users.

## P1 — Personality layer (each a focused PR)

### 4. Chat-style contact (ref: krishnagupta.web.app, likes 76)
What: the contact section becomes a chat transcript in Geist Mono: `hey, you there?` (incoming), `yep, on it` (reply), `ringing... connected`, then a copy-email button and mailto link.
- Modify the contact block at the bottom of `src/pages/index.astro`; add `.chat-log` styles to `global.css`.
- Messages animate in sequentially on scroll-into-view (IntersectionObserver), ~150ms stagger; instant render under reduced motion.
- Tap email copies it (Clipboard API) with `copied.` confirmation as the next chat bubble.
- Acceptance: reads as a real chat, copy works on touch, no external JS.

### 5. Scroll readout HUD (ref: annacheng8.vercel.app, likes 439, thread winner)
What: a fixed Geist Mono readout, bottom-left, mirroring Anna Cheng's altitude/speed device: shows current section and progress.
- Format: `READING 03/12` style inside the bookshelf section (selected book index / featured count), and `SECTION 2/5 · 42%` elsewhere. Cheap interpretation: a scroll-progress counter styled as an instrument readout.
- New `src/components/ScrollHud.astro`, `position: fixed; bottom: 1rem; left: 1rem;`, updates via rAF-throttled scroll listener. Hidden on mobile (<768px).
- Acceptance: no jank (rAF throttle), no overlap with existing footer content on short viewports.

### 6. Now Playing widget (ref: mason-wong.com, elliothu.me)
What: a `NOW PLAYING` / `CURRENTLY ON REPEAT` line with track + artist in the footer or intro.
- Dependency: needs a data source. Options: Last.fm API (Abhishek to provide account), Apple Music embed, or a hand-updated `src/data/now-playing.json` (weekly manual edit, zero dependency). Recommend the JSON first; upgrade later.
- Render mono, one line, with a subtle equalizer-bars CSS animation. Hidden under reduced motion.
- Acceptance: ships with JSON route; API route is a follow-up PR only if Abhishek provides creds.

## P2 — Identity layer (needs assets or owner input before build)

### 7. Hand-drawn life grid (ref: jinhyuk.org, likes 63)
What: a grid of hand-drawn scenes from Abhishek's life (like Ryan Choi's Korean manuscript grid), tap to enlarge.
- Hard dependency: assets. Abhishek must provide or approve 9-20 hand-drawn (or AI-generated in a consistent style) moments. Agent may draft a shot list, not ship without approval.
- If AI-generated: use the Gemini image-generation pattern from the personal-site-maintenance skill (`gemini-2.5-flash-image`), compress to webp, commit to `public/life-grid/`.
- Layout: CSS grid, object-fit cover, lightbox on click, alt text written from the moment's story.
- Placement: new section between Projects and Bookshelf, or a dedicated tab once the view-toggle WIP is restored.

### 8. Devanagari accents (ref: mason-wong.com)
What: bilingual type layering, Abhishek's version: English headings with Devanagari echoes, like Mason's English + vertical Chinese.
- Font dependency: one Devanagari display font (e.g. Tiro Devanagari Hindi, SIL OFL) loaded as a separate `.ttf` in `public/fonts/` with preload.
- Usage: section eyebrows get a small Devanagari echo word (`writing → लिखत`, `projects → बनाना`, `reading → पढ़ना`). Copy `TODO(OWNER)` — Abhishek picks the words; agent must not invent translations without his sign-off.
- Acceptance: Devanagari renders correctly (matras, conjuncts), does not affect font metrics of English text.

### 9. Easter eggs (ref: girtonian.com, calissa.ai)
What: hidden personal touches. Two independent thread replies made easter eggs the explicit brag.
- Cheap set: (a) Konami code swaps the cursor face for a surprise, (b) typing `abhi` anywhere triggers a toast in mono, (c) footer has an invisible-on-paint but screen-readable line only visible when text is selected, (d) the theme toggle cycles to a secret third theme after 7 rapid clicks.
- Copy is `TODO(OWNER)` throughout. Keep all eggs opt-in (keyboard/console), never block content.

### 10. Sites I like page (ref: brianlovin.com/sites, likes 44)
What: a `/sites` route, curated personal-site index. Data source already exists: the "Dope Personal Pages" tab (entries 30-40 are the thread picks).
- New `src/pages/sites.astro`, static build; optionally a script to pull the sheet via the Sheets API (follow-up; static JSON check-in is fine for v1).
- Each row: name, one-line steal-note, link. Same mono aesthetic.
- Acceptance: builds as a second static page, does not affect the root index.

## Suggested PR order
1. `feature/daylight` (1) and `feature/boot-intro` (2) can go in parallel.
2. `feature/scramble` (3).
3. `feature/chat-contact` (4) + `feature/scroll-hud` (5).
4. `feature/now-playing` (6) with JSON fallback.
5. P2 items only after Abhishek supplies assets/copy sign-off.

## Definition of done (applies to every PR)
- Build passes on Node 22; screenshots attached in the PR.
- Reduced-motion behavior verified.
- No console errors; Lighthouse LCP not regressed.
- Deployed URLs return 200; live site checked on abhisheksharma.si before merge.
