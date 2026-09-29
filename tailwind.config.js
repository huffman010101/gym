import colors from 'tailwindcss/colors';

/*
 * One J.A.R.V.I.S. palette for the whole app. Section chrome that used to be
 * pink, purple, sky, indigo, blue or teal renders as reactor cyan; the gym's
 * orange renders as Stark gold. Red, rose, emerald, green and amber are left
 * alone on purpose — they carry meaning (warnings, "good", caution, status).
 */
const cyan = colors.cyan;
const gold = colors.yellow;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: cyan,
        purple: cyan,
        fuchsia: cyan,
        violet: cyan,
        indigo: cyan,
        blue: cyan,
        sky: cyan,
        teal: cyan,
        orange: gold,
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
  plugins: [],
};
