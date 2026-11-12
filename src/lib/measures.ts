/*
 * Kitchen measures for gram/ml amounts, so a recipe line like
 * "250g 0% Greek yoghurt" also reads "≈ 8 heaped tbsp". UK spoons
 * (tbsp 15ml, tsp 5ml), a 250ml mug, and everyday counts (tins, fillets,
 * handfuls). Approximate by design — weigh when it matters.
 */

type Rule = [RegExp, (n: number) => string | null];

// Nearest quarter (or half, for spoons); whole numbers from 3 up.
const frac = (x: number, step = 0.25) => {
  if (x >= 3) return String(Math.round(x));
  const r = Math.max(step, Math.round(x / step) * step);
  const whole = Math.floor(r), part = r - whole;
  const p = part === 0.75 ? '¾' : part === 0.5 ? '½' : part === 0.25 ? '¼' : '';
  return whole === 0 ? p : `${whole}${p}`;
};
const per = (size: number, unit: string, plural = unit + 's', step = 0.25) => (n: number) => {
  const v = n / size;
  return `${frac(v, step)} ${v > 1.125 ? plural : unit}`;
};
const spoon = (size: number, unit: string) => per(size, unit, unit, 0.5);
const count = (each: number, unit: string, plural = unit + 's') => (n: number) => {
  const c = Math.max(1, Math.round(n / each));
  return `${c} ${c === 1 ? unit : plural}`;
};
const spoons = (tsp: number) => (n: number) => {
  // tsp = grams in one level teaspoon; under a tablespoon read in tsp
  const t = n / tsp;
  return t < 2.75 ? `${frac(t, 0.5)} tsp` : `${frac(t / 3, 0.5)} tbsp`;
};

// Order matters: specific foods before general ones.
const RULES: Rule[] = [
  [/rice cake|ricecake/i, () => null],
  [/pouch|microwave|cooked rice/i, () => null],
  [/(greek|yogh?urt|skyr|quark|cottage cheese)/i, (n) => (n > 330 ? per(260, 'mug')(n) : spoon(30, 'heaped tbsp')(n))],
  [/(peanut|almond|nut) butter/i, spoon(16, 'tbsp')],
  [/(honey|maple|syrup)/i, spoons(7)],
  [/oil\b/i, spoons(4.5)],
  [/whey|protein powder/i, per(30, 'scoop')],
  [/creatine/i, spoon(5, 'tsp')],
  [/cocoa/i, spoon(5, 'tbsp')],
  [/chia|flax|linseed|seeds?\b/i, spoon(10, 'tbsp')],
  [/oat/i, (n) => (n > 150 ? per(85, 'mug')(n) : `${Math.round(n / 10)} heaped tbsp${n >= 60 ? ` / ${frac(n / 85)} mug` : ''}`)],
  [/(basmati|rice)/i, per(190, 'mug')],
  [/(mayo|hummus|soft cheese|cream cheese|pesto)/i, spoon(15, 'tbsp')],
  [/(soy sauce)/i, (n) => spoons(5)(n)],
  [/(sweet chilli|ketchup|bbq|sriracha|sauce)/i, spoon(17, 'tbsp')],
  [/(milk|oat drink)/i, per(250, 'mug')],
  [/(berr|raspberr|blueberr)/i, per(50, 'handful')],
  [/(spinach|salad|leaves|rocket)/i, per(20, 'handful')],
  [/almond|cashew|walnut|nuts\b/i, count(1.2, 'nut')],
  [/dates?\b/i, count(7, 'date')],
  [/(cheddar|mozzarella|parmesan|cheese)/i, (n) => (n > 60 ? per(100, 'mug grated', 'mugs grated')(n) : per(30, 'matchbox', 'matchboxes')(n))],
  [/(sweetcorn|peas)/i, spoon(25, 'heaped tbsp')],
  [/(kidney|chickpea|black bean|beans)/i, per(240, 'drained tin')],
  [/(chopped tomatoes|tinned tomatoes|passata)/i, per(400, 'tin')],
  [/tuna/i, per(100, 'drained tin')],
  [/banana/i, per(120, 'medium banana', 'medium bananas')],
  [/chicken breast|chicken\b/i, per(150, 'breast fillet', 'breast fillets')],
  [/salmon fillet|salmon\b/i, per(130, 'fillet')],
  [/sweet potato/i, per(200, 'medium potato', 'medium potatoes')],
  [/potato/i, per(175, 'medium potato', 'medium potatoes')],
  [/onion/i, per(150, 'medium onion', 'medium onions')],
  [/pepper\b/i, per(160, 'pepper')],
  [/carrot/i, per(80, 'carrot')],
  [/broccoli/i, per(350, 'head')],
  [/noodle/i, per(55, 'nest')],
  [/(pasta|fusilli|penne)/i, per(100, 'mug dry', 'mugs dry')],
  [/apple/i, per(150, 'apple')],
];

/** A kitchen measure for an amount of a food, or null when none is useful. */
export function household(food: string, amount: number): string | null {
  for (const [re, fn] of RULES) if (re.test(food)) return fn(amount);
  return null;
}

/**
 * Add a measure after the first gram/ml amount in an ingredient line:
 * "250g 0% Greek yoghurt" → "250g (≈ 8 heaped tbsp) 0% Greek yoghurt".
 * Lines that already give spoons, scoops or counts are left alone.
 */
export function withMeasure(line: string): string {
  if (/≈|tbsp|tsp|scoop|handful|\bmug\b/i.test(line)) return line;
  const m = line.match(/(\d+(?:\.\d+)?)\s?(g|ml)\b(?:\s*\([^)]*\))?\s*(?:of\s+)?(.*)/i);
  if (!m) return line;
  const amount = parseFloat(m[1]);
  if (!amount || amount < 3) return line;
  const h = household(m[3] || line, amount);
  if (!h) return line;
  const at = (m.index ?? 0) + m[1].length + (line.slice((m.index ?? 0) + m[1].length).match(/^\s?(g|ml)\b/i)?.[0].length ?? 0);
  return `${line.slice(0, at)} (≈ ${h})${line.slice(at)}`;
}
