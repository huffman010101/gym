/*
 * Injects the built asset list into dist/sw.js so the service worker can
 * precache the full app shell at install time. Vite content-hashes asset
 * filenames, so this list can only be known after the build runs.
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const swPath = join(dist, 'sw.js');

function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(dist)
  .map(f => './' + relative(dist, f).split(/[\\/]/).join('/'))
  // sw.js must not cache itself; source maps are dead weight offline.
  .filter(f => f !== './sw.js' && !f.endsWith('.map'));

// './' is the navigation entry point and must be cached explicitly.
const precache = ['./', ...files];

const sw = readFileSync(swPath, 'utf8');
const marker = 'self.__GYMFORGE_PRECACHE__';
if (!sw.includes(marker)) {
  console.error('inject-sw-precache: marker not found in dist/sw.js — aborting');
  process.exit(1);
}

writeFileSync(
  swPath,
  sw.replace(marker, JSON.stringify(precache)),
  'utf8'
);

console.log(`inject-sw-precache: ${precache.length} files precached`);
