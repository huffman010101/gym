# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

GymForge — a personal self-improvement PWA (gym, looks, mind, football, padel, money, uni) that the owner
uses daily. Deployed at https://huffman010101.github.io/gym/ via GitHub Pages.

**FINdr (the `huffman010101/website` repo) is a completely separate, unrelated app and must stay
unlinked from GymForge.** No shared routes, no cross-links, no shared deploy. These two previously
shared a Pages site and one deploy wiped the other — do not reintroduce any coupling.

## Commands

```bash
npm run dev          # vite dev server
npm run build        # tsc && vite build && node scripts/inject-sw-precache.mjs
npm run preview      # preview the built output
```

There is **no test script and no linter**. `npm run build` runs `tsc` first, so it is the type-check
gate — a build that passes means types are clean. Always build before committing.

### Verifying changes (no test framework)

Playwright is installed **globally**, not in `node_modules`, and it is CommonJS:

```js
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
```

Serve the build and drive it:

```bash
cd dist && python3 -m http.server 8800 &
```

Two gotchas that have each cost real time:

- **Pre-seed the API key** or an `ApiKeySetup` modal covers the whole viewport and every click times out
  with "intercepts pointer events":
  ```js
  await page.addInitScript(() => localStorage.setItem('gymforge_api_key', 'test-key'));
  ```
- **Navigating to `#/page?tab=x` directly is unreliable** for tab assertions (HashRouter + the
  `useSearchParams` initialiser). Load the page, then click the tab button:
  `await page.click('button:has-text("Tab Label")')`.
- Several headings are CSS-uppercased. **Use case-insensitive regex** when asserting text, or you will
  report present content as missing.

## Deploy

`.github/workflows/deploy.yml` triggers **only on push to `main`** (plus `workflow_dispatch`). It
deliberately does not trigger on other branches: the `github-pages` environment rejects them, and
because `concurrency.cancel-in-progress` is true those doomed runs used to cancel the real deploy.

The push webhook sometimes does not create a run. When that happens, trigger it manually rather than
assuming it will appear:

```
mcp__github__actions_run_trigger  method=run_workflow  workflow_id=deploy.yml  ref=main
```

Runs regularly sit in `queued` for several minutes before `in_progress` — that is a slow runner, not a
failure. Confirm `conclusion: success` before telling the user it is live.

The `actions_list` MCP response is far too large for one tool result. Read the saved file with python
and print only the fields you need.

## Architecture

Vite + React 18 + TypeScript SPA, **HashRouter** (required for GitHub Pages), Tailwind, lucide-react.
`base: './'` in `vite.config.ts` so the app works from a subpath.

- `src/App.tsx` — every route is registered here; one page component per top-level section.
- `src/pages/*.tsx` — the sections. Each is self-contained and follows a consistent shape:
  a `type Tab` union, a `TABS` array, a `useSearchParams`-seeded `useState<Tab>`, then one
  `{tab === 'x' && ( … )}` block per tab.
- **Each page defines its own local `Block` / `Fold` / `Card` helpers.** These are intentionally
  duplicated per file rather than shared — match the host file's existing helpers. The page *frame* is
  shared: `SectionHeader`, `TabBar` and `OneThing` (the "If you only read one thing" box that opens
  every tab) live in `src/components/Hud.tsx`.
- **One J.A.R.V.I.S. palette.** `tailwind.config.js` remaps pink/purple/sky/indigo/blue/teal/fuchsia/
  violet to cyan and orange to gold, so old accent classes render in the theme. Red, rose, emerald,
  green and amber are left alone because they carry meaning (warning, good, caution, status).
- Content is hardcoded arrays of `[title, description]` tuples passed to those helpers. Adding content
  means adding tuples, not new components.
- `src/components/` — cross-section pieces (`BottomNav`, `SearchBar`, `ApiKeySetup`, `Hud`, `Jarvis`,
  `LockIn`, `WhoopPanel`, `FocusMap`) plus a few large interactive components rendered as a tab
  (`KnowYourself`, `FaceDossier`, `MealPlanner`, `BookNotes`). `DailyPlan` sits on Home under J.A.R.V.I.S.:
  today's priorities, week goals (`gymforge_week_<Monday>`; on Sunday they target the coming week) and a
  7-day strip. Every day uses `gymforge_plan_<YYYY-MM-DD>` in LOCAL dates, so a planned day becomes
  that day's plan automatically. Housekeeping deletes only past days — never future ones.

### Theme and the command screen

- The HUD theme is global CSS in `src/index.css`: the fixed backdrop is `body::before` (body stays
  transparent), and the ~180 `bg-[#111]` cards are recoloured there rather than edited per page. Page
  roots use `bg-transparent` so the backdrop shows. Section accent colours are unchanged on purpose.
- Fonts (Orbitron, Rajdhani) are self-hosted via `@fontsource` in `main.tsx` so they work offline.
- `src/components/Jarvis.tsx` is the Home command screen and the once-per-session boot overlay. Its
  numbers come from real activity, not checklists: `LockIn.tsx` (focus sessions, minutes logged per
  day in `gymforge_lockin_log`) and `src/lib/whoop.ts` (WHOOP data). There are no per-section daily
  checklists any more — do not add them back.
- WHOOP: there is **no live API sync** — WHOOP's OAuth needs a registered app, a client secret and a
  server-side token exchange, which a static Pages app cannot hold. Data comes from the WHOOP data
  export (zip or `physiological_cycles.csv`, parsed by column name) and a quick daily manual log.
  `todaysSession()` turns the weekday plan plus recovery zone into today's training.
- `src/components/FocusMap.tsx` maps goals to exact `?tab=` links. **When you rename, add or remove a
  tab, update FocusMap too** — it is the "where does X live" index.
- Every page syncs `tab` from `?tab=` in a `useEffect` as well as the initialiser, so links between
  tabs of the same page work. Keep that effect when adding pages.

### Adding a tab to an existing page

Four edits, all in the same file, and missing any one breaks it silently:
1. add the id to the `type Tab` union
2. add `{ id, label }` to `TABS`
3. add the id to the `as const` array in the `useState<Tab>` initialiser
4. add the `{tab === 'id' && ( … )}` render block (and add the id to the `?tab=` sync effect's array)

Then add a `SearchBar.tsx` INDEX entry with generous keywords, or the content is unfindable.

### AI features

`src/lib/generators.ts` holds every AI call. All follow the same shape: `makeClient()` (throws if no
key) → `client.messages.create({ model, … })` → `parse()` to strip code fences and extract JSON.
Models in use: `claude-haiku-4-5-20251001` and `claude-sonnet-5`. The key is user-supplied and stored
in `localStorage` under `gymforge_api_key`; `dangerouslyAllowBrowser` is intentional for this
personal client-side app.

`src/lib/extractText.ts` parses uploaded study material — JSZip for `.pptx`/`.docx`, dynamically
imported `pdfjs-dist` for PDFs (dynamic so it stays out of the main bundle). It parses actual `<a:t>` /
`<w:t>` text-run elements. **Do not "simplify" this to stripping XML tags with a regex** — that
silently destroys any content containing a stray `<`, e.g. "PED < 1".

### Offline / service worker

`public/sw.js` (cache `gymforge-v42`) precaches the app shell. **Bump `CACHE` on any release the user must actually receive** — devices pinned to an old build otherwise keep serving stale hashed JS, which has already caused one "you didn't fix it" round trip. Vite content-hashes filenames, so the
asset list can only be known post-build — `scripts/inject-sw-precache.mjs` injects it into
`dist/sw.js`. Any change to the build output pipeline needs that script to still run last.

The registration logic in `index.html` caps auto-reload at **one per tab session** via a
`gymforge_sw_reloaded` sessionStorage flag, and throttles foreground update checks to 30 minutes.
Both guards exist because OneSignal once registered a competing worker at the same scope, which caused
a production reload loop. **OneSignal and push notifications have since been removed at the owner's
request** (its floating bell and prompt were unwanted) — do not re-add a notification SDK or prompt.

Two offline rules that are easy to break: the navigation handler must **not** attempt the network when
`navigator.onLine === false` and must time-box the attempt (3.5s) otherwise, or a flaky connection looks
identical to "the app won't open"; and the 9s recovery valve in `index.html` must **never** run offline —
it deletes every cache and unregisters the worker, which offline destroys the only openable copy. Offline behaviour that depends on real network conditions is hard to reproduce in local Playwright
testing — reason about it rather than trusting a green test.

### State

No state library. Everything persists to `localStorage` under `gymforge_*` keys, read lazily in
`useState` initialisers wrapped in try/catch. Keys are listed across the pages that own them.

**Cross-device sync** (`src/lib/sync.ts`, UI `SyncPanel` on Home) mirrors every `gymforge_*` key to one
file in the user's own secret GitHub gist via a `gist`-scoped token. It wraps
`localStorage.setItem/removeItem`, stamps each key's write time in `gfsync_meta`, and merges newest-wins per
key with tombstones for deletes. Sync config lives under `gfsync_*` so it is never synced itself;
`gymforge_api_key` and values over 250KB (photos) never leave the device. Remote changes fire a
`gymforge-synced` event and `App.tsx` remounts the routes (deferred while an input has focus). So pages
need nothing special — just keep using `gymforge_*` keys read in `useState` initialisers.

## Dead code — ignore these

`app/`, `lib/` and `next.config.js` at the repo root are leftover Next.js scaffolding. The Vite build
entry is `index.html` → `src/main.tsx`; nothing under `app/` or root `lib/` is bundled or served.
Edits there have no effect. (Note `src/lib/` — which *is* live — versus root `lib/`, which is not.)

## Content conventions

The owner reads this app daily, so content quality matters as much as the code:

- Concise and actionable. Where a topic is long, lead with a short "the fix" summary and keep the
  detail below it.
- **Keep each tab specific to its own title.** Content has repeatedly drifted into the wrong section
  (money advice inside the looks Blueprint, generic sleep hygiene inside the study section). When a
  topic already lives elsewhere, link to it rather than duplicating it.
- State trade-offs and caveats honestly rather than overselling — e.g. flagging that a book's specifics
  are dated, or that a training change halves a protective exercise's frequency.
- The Backtest Lab price series is **generated, not real market data** (no route to a data feed from
  this environment). Every screen using it says so, and that disclosure must stay.
