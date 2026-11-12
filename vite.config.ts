import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

// The service worker's cache name (gymforge-vNN) is the release number. Bake
// it into the bundle so the app can tell which build is actually running.
const APP_VERSION = /gymforge-(v\d+)/.exec(readFileSync('public/sw.js', 'utf8'))?.[1] ?? 'dev';

export default defineConfig({
  plugins: [react()],
  base: './',
  define: { __APP_VERSION__: JSON.stringify(APP_VERSION) },
});
