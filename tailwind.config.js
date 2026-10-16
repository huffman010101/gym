import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';

/*
 * One J.A.R.V.I.S. palette for the whole app, now switchable at runtime.
 * Section chrome that used to be pink, purple, sky, indigo, blue or teal
 * renders in the ACCENT palette (reactor cyan by default); the gym's orange
 * and yellow render in the SECOND palette (Stark gold by default). Red, rose,
 * emerald, green and amber are left alone on purpose — they carry meaning
 * (warnings, "good", caution, status), which is also why no theme uses them.
 *
 * Both palettes are CSS variables (--a-50…--a-950, --g-50…--g-950). THEMES
 * below writes one block of them per theme under html[data-theme="id"]; the
 * picker (src/lib/themes.ts, keep the ids in step) sets that attribute.
 */
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

export const THEMES = {
  arc: [colors.cyan, colors.yellow],        // Arc Reactor — the default
  mark3: [colors.orange, colors.yellow],    // Mark III — hot-rod orange + gold
  vibranium: [colors.violet, colors.slate], // Vibranium — violet + silver
  gamma: [colors.lime, colors.violet],      // Gamma — lime + purple
  stealth: [colors.slate, colors.sky],      // Stealth — silver + ice blue
  ultraviolet: [colors.fuchsia, colors.cyan], // Ultraviolet — magenta + cyan
  deepsea: [colors.blue, colors.teal],      // Deep Sea — electric blue + teal
};

// Section skins: Gym is the Bat (steel + signal yellow), Mind is the Cave
// (Bat-computer blue + silver), Looks is Aura (violet + pink). A page opts in
// with data-skin="<id>" on its root (an attribute, not a class: Tailwind
// drops class rules it cannot find written out in the source), which re-points the same variables
// for everything inside it. src/lib/themes.ts can switch skins off.
export const SKINS = {
  bat: [colors.zinc, colors.yellow],
  cave: [colors.sky, colors.slate],
  aura: [colors.violet, colors.pink],
};

const rgb = hex => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(' ');
};
const vars = (accent, second) => Object.fromEntries(SHADES.flatMap(s => [
  [`--a-${s}`, rgb(accent[s])],
  [`--g-${s}`, rgb(second[s])],
]));
const palette = p => Object.fromEntries(SHADES.map(s => [s, `rgb(var(--${p}-${s}) / <alpha-value>)`]));
const accent = palette('a');
const gold = palette('g');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan: accent,
        pink: accent,
        purple: accent,
        fuchsia: accent,
        violet: accent,
        indigo: accent,
        blue: accent,
        sky: accent,
        teal: accent,
        orange: gold,
        yellow: gold,
      },
      // /8 and /12 are used ~100 times across the app but are not in Tailwind's
      // default opacity scale, so those classes silently generated nothing and
      // borders fell back to near-white. Registering them fixes every one.
      opacity: {
        8: '0.08',
        12: '0.12',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      const [a, g] = THEMES.arc;
      addBase({ ':root': vars(a, g) });
      for (const [id, [x, y]] of Object.entries(THEMES)) addBase({ [`html[data-theme="${id}"]`]: vars(x, y) });
      for (const [id, [x, y]] of Object.entries(SKINS)) addBase({ [`[data-skin="${id}"]`]: vars(x, y) });
    }),
  ],
};
