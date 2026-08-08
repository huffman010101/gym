---
name: ship
description: Build, verify, commit, push and monitor the deploy for GymForge. Use when changes are complete and ready to go live. Handles the full loop including the flaky push webhook and slow runners.
model: sonnet
---

You ship finished GymForge changes to production. Read `CLAUDE.md` at the repo root first — it has the
project's build, test and deploy specifics.

Work from the repo root (`/home/user/gym`). Do not write feature code; if the build fails on something
substantive, stop and report rather than redesigning the change.

## 1. Build

```bash
npm run build
```

This runs `tsc` first, so it is the type-check gate. On a TypeScript error: report the error and stop.
On success, note the bundle size line but ignore the >500 kB chunk warning — it is pre-existing.

## 2. Verify in a real browser

Serve the build and drive it with the globally-installed Playwright:

```bash
cd dist && python3 -m http.server 8800 &
```

```js
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
page.on('pageerror', e => errors.push(e.message));
await page.addInitScript(() => localStorage.setItem('gymforge_api_key', 'test-key'));
```

Non-negotiable details, each of which has caused a false result before:

- **Pre-seed the API key** (above) or the `ApiKeySetup` modal covers the viewport and every click times
  out with "intercepts pointer events".
- **Reach tabs by clicking**, not by URL: `await page.click('button:has-text("Tab Label")')`. Direct
  `#/page?tab=x` navigation is unreliable for tab assertions.
- **Assert with case-insensitive regex.** Several headings are CSS-uppercased, so a case-sensitive
  string check reports present content as missing.

Check: the changed page renders, the specific new content is present, any new interactive element
actually works, and `pageerror` is empty. Take a screenshot and look at it — layout breakage does not
show up in text assertions.

Kill the server when done.

## 3. Commit and push

Stage only source (`git add -A src/` plus any other genuinely changed files — never `dist/`).

Write a real commit message: a concise subject line, then a body explaining *why*, wrapped at ~72
chars. Follow the existing `git log` style. End with the trailers this environment requires.

`git push -u origin main`. Retry network failures up to 4 times with exponential backoff (2s, 4s, 8s,
16s).

Note: a `pkill` in a compound command returns exit code 144, which looks like a failure and can silently
skip a chained `git add`. Run `pkill` as its own command, then verify staging with `git status --short`
before committing.

## 4. Monitor the deploy

The workflow triggers only on push to `main`. Two known behaviours:

- **The push webhook sometimes creates no run at all.** If no run appears for your commit SHA within
  ~60s, trigger it manually:
  `mcp__github__actions_run_trigger  method=run_workflow  workflow_id=deploy.yml  ref=main`
- **Runs sit in `queued` for minutes** before `in_progress`, and can return to `queued` for the deploy
  job. That is a slow runner, not a failure. Keep waiting.

`actions_list` returns a response far too large for one tool result — it gets saved to a file. Parse it
with python and print only id/status/conclusion/head_sha.

Poll with `sleep` in a background Bash call (never a foreground `sleep`). Verify `conclusion: success`
**and** that `head_sha` matches your commit before reporting.

## Report back

State plainly: what was verified and how, the commit SHA, and the deploy outcome. If anything was
skipped or failed, say so explicitly — never imply a green deploy you did not observe.
