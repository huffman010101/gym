/*
 * Looks → Diet → Meal upgrader. A small rule engine that reads a meal the
 * owner typed ("beef and rice") and suggests the veg and fruit to add, how
 * to add them in the same pan or plate, and what they do. Works offline;
 * the AI version in generators.ts goes further.
 */

export interface Addition { item: string; amount: string; how: string; why: string; colour: string }
export interface Upgrade { matched: string[]; veg: Addition[]; fruit: Addition; extra: string; portions: number }

type V = { item: string; how: string; why: string; colour: string };
const V: Record<string, V> = {
  broccoli: { item: 'Broccoli or tenderstem', how: 'Throw florets into the same pan for the last 4 minutes, or steam in the microwave for 3.', why: 'Vitamin C, folate, fibre; one of the most nutrient-dense veg there is.', colour: 'green' },
  peppers: { item: 'Mixed peppers', how: 'Slice and fry with the meat for the last 5 minutes — sweet, cheap, no prep beyond a knife.', why: 'More vitamin C than an orange, plus carotenoids for skin tone.', colour: 'red' },
  spinach: { item: 'Spinach', how: 'Stir two big handfuls into the hot food at the end — it wilts in 30 seconds and disappears.', why: 'Folate, iron, vitamin K and magnesium for almost zero calories.', colour: 'green' },
  onionGarlic: { item: 'Onion and garlic', how: 'Fry a sliced onion first, garlic for the last minute — the base of every good sauce.', why: 'Prebiotic fibre for your gut and far more flavour.', colour: 'white' },
  carrots: { item: 'Carrots', how: 'Grate one raw into the sauce or salad, or roast batons alongside.', why: 'Beta-carotene — the most researched food for a warmer, healthier skin tone.', colour: 'orange' },
  tomatoes: { item: 'Cherry tomatoes', how: 'Halve a handful on the side, or blister them in the pan for 3 minutes.', why: 'Lycopene (better absorbed cooked with a little oil) and vitamin C.', colour: 'red' },
  greenBeans: { item: 'Green beans', how: 'Frozen, boiled 3 minutes, tossed in soy or garlic butter.', why: 'Fibre and vitamin K, easy to batch.', colour: 'green' },
  peas: { item: 'Peas', how: 'Frozen peas into the rice or pasta water for the last 2 minutes.', why: 'Plant protein and fibre — the easiest veg in the freezer.', colour: 'green' },
  edamame: { item: 'Edamame', how: 'Frozen, boiled 3 minutes, salt on top.', why: 'About 11g protein per 100g plus fibre — a veg that helps your protein target.', colour: 'green' },
  mushrooms: { item: 'Mushrooms', how: 'Slice and fry hard until golden before the meat goes in.', why: 'B vitamins, savoury depth, very few calories.', colour: 'brown' },
  courgette: { item: 'Courgette', how: 'Dice into the sauce or roast in chunks with the meat.', why: 'Bulk and potassium without heaviness.', colour: 'green' },
  cucumber: { item: 'Cucumber and red onion', how: 'Thin slices with lemon and salt — a 2-minute side salad.', why: 'Fresh crunch next to heavy food; hydration.', colour: 'green' },
  kimchi: { item: 'Kimchi or pickled cucumber', how: 'A spoonful on the side straight from the jar.', why: 'Fermented veg — live bacteria and fibre, huge flavour.', colour: 'red' },
  salad: { item: 'Bag of mixed leaves', how: 'A handful on the plate with olive oil, lemon and salt.', why: 'Fibre, folate and an easy portion with zero cooking.', colour: 'green' },
  sweetcorn: { item: 'Sweetcorn', how: 'Half a tin or frozen, stirred through.', why: 'Lutein and zeaxanthin for your eyes; kids-level easy.', colour: 'yellow' },
  beans: { item: 'Black or kidney beans', how: 'Half a drained tin into the pan to warm through.', why: 'Fibre and plant protein; counts as one portion a day.', colour: 'brown' },
  cabbage: { item: 'Red cabbage slaw', how: 'Shred with a carrot, lime and a spoon of yoghurt.', why: 'Anthocyanins and vitamin C — a crunchy, colourful side.', colour: 'purple' },
  pakChoi: { item: 'Pak choi', how: 'Halve and wok for 2 minutes with soy and garlic.', why: 'Calcium, vitamin C and A, very fast.', colour: 'green' },
  sweetPotato: { item: 'Swap half the carb for sweet potato', how: 'Cube and roast 25 minutes at 220°C, or microwave whole for 8.', why: 'Beta-carotene and fibre, same carbs.', colour: 'orange' },
  aubergine: { item: 'Aubergine', how: 'Cube and roast with oil and salt, or simmer in the sauce.', why: 'Fibre and polyphenols; soaks up flavour.', colour: 'purple' },
  avocado: { item: 'Avocado', how: 'Half, sliced on top with lime and salt.', why: 'Healthy fats, potassium and fibre — and calories if you are bulking.', colour: 'green' },
};

type F = { item: string; why: string };
const FRUIT: Record<string, F> = {
  citrus: { item: 'An orange, kiwi or a squeeze of lemon', why: 'Vitamin C roughly doubles how much iron you absorb from the meal.' },
  berries: { item: 'Berries (frozen are fine)', why: 'Polyphenols and vitamin C for collagen; low sugar.' },
  banana: { item: 'A banana', why: 'Potassium and fast carbs — great around training.' },
  apple: { item: 'An apple or pear', why: 'Fibre that keeps you full; the easiest fruit to carry.' },
  mango: { item: 'Mango or pineapple', why: 'Vitamin C and beta-carotene; fits Asian and Caribbean flavours.' },
  grapes: { item: 'Grapes or dried fruit', why: 'Easy calories if you are struggling to eat enough.' },
};

const RULES: { match: RegExp; label: string; veg: string[]; fruit: string; extra?: string }[] = [
  { match: /stir ?fry|teriyaki|soy|noodle|ramen|korean|bulgogi|gochujang|katsu|sushi|poke|chow mein|fried rice|pot noodle/, label: 'Asian-style', veg: ['pakChoi', 'peppers', 'broccoli', 'edamame', 'kimchi'], fruit: 'mango' },
  { match: /curry|tikka|masala|korma|dal|dhal|biryani|jalfrezi|madras|butter chicken|jerk/, label: 'curry', veg: ['spinach', 'peas', 'onionGarlic', 'courgette', 'tomatoes'], fruit: 'mango', extra: 'A side of cucumber raita adds a portion and cools it down.' },
  { match: /chilli|chili|burrito|taco|fajita|mexican|nachos|quesadilla|enchilada|peri|nando/, label: 'Mexican / peri-peri', veg: ['peppers', 'beans', 'sweetcorn', 'tomatoes', 'avocado'], fruit: 'citrus', extra: 'Fresh salsa (tomato, onion, lime, coriander) is a portion of veg on its own.' },
  { match: /bolognese|\bbol\b|spag|pasta|spaghetti|lasagne|lasagna|penne|ragu|carbonara|mac ?(and|n|&) ?cheese|orzo|gnocchi/, label: 'pasta', veg: ['carrots', 'courgette', 'mushrooms', 'spinach', 'salad'], fruit: 'berries', extra: 'Grate a carrot and a courgette into any tomato sauce — nobody can tell, two portions added.' },
  { match: /pizza/, label: 'pizza', veg: ['salad', 'peppers', 'mushrooms', 'spinach'], fruit: 'apple', extra: 'Eat a side salad first — it fills you a bit and adds two portions.' },
  { match: /burger|kebab|gyro|wrap|sandwich|sarnie|butty|sub\b|toastie|bagel|panini/, label: 'handheld', veg: ['salad', 'tomatoes', 'cucumber', 'cabbage'], fruit: 'apple', extra: 'Pile the lettuce, tomato and onion in — and have slaw instead of chips.' },
  { match: /egg|omelette|scramble|fry[ -]?up|full english|breakfast|brekkie|beans on toast/, label: 'eggs / breakfast', veg: ['spinach', 'tomatoes', 'mushrooms', 'peppers'], fruit: 'berries', extra: 'Grilled tomatoes and mushrooms turn a fry-up into two portions of veg.' },
  { match: /oat|porridge|cereal|granola|yoghurt|yogurt|overnight/, label: 'oats / yoghurt', veg: [], fruit: 'berries', extra: 'Fruit is the move here: a banana sliced in plus a handful of berries is two portions before 9am.' },
  { match: /shake|smoothie/, label: 'shake', veg: ['spinach'], fruit: 'banana', extra: 'A handful of spinach in a shake is invisible with banana and cocoa — a free portion.' },
  { match: /roast|sunday dinner|shepherd|cottage pie|\bpie\b|stew|casserole/, label: 'roast / pie', veg: ['carrots', 'broccoli', 'peas', 'cabbage', 'greenBeans'], fruit: 'apple', extra: 'Two veg on the plate before the meat goes on — roast carrots and greens are the classic portion-and-a-half.' },
  { match: /salmon|cod|fish|tuna|prawn|mackerel/, label: 'fish', veg: ['greenBeans', 'broccoli', 'tomatoes', 'salad'], fruit: 'citrus' },
  { match: /steak|beef|mince/, label: 'beef', veg: ['broccoli', 'peppers', 'spinach', 'onionGarlic', 'mushrooms'], fruit: 'citrus' },
  { match: /chicken|turkey/, label: 'chicken', veg: ['broccoli', 'peppers', 'carrots', 'greenBeans', 'courgette'], fruit: 'apple' },
  { match: /lamb|pork|sausage|bacon|gammon/, label: 'pork / lamb', veg: ['cabbage', 'peas', 'carrots', 'greenBeans'], fruit: 'apple' },
  { match: /tofu|chickpea|lentil|bean/, label: 'plant protein', veg: ['spinach', 'peppers', 'tomatoes', 'aubergine'], fruit: 'citrus' },
  { match: /rice/, label: 'rice', veg: ['peas', 'peppers', 'broccoli', 'sweetcorn'], fruit: 'citrus' },
  { match: /potato|chips|fries|mash|jacket|spud|chippy/, label: 'potatoes', veg: ['greenBeans', 'peas', 'carrots', 'salad', 'sweetPotato'], fruit: 'apple', extra: 'Potatoes do not count as veg — the greens next to them do.' },
];

export function upgradeMeal(text: string): Upgrade {
  const t = text.toLowerCase();
  const hits = RULES.filter(r => r.match.test(t));
  const matched = hits.map(h => h.label);
  const order: string[] = [];
  for (const h of hits) for (const v of h.veg) if (V[v] && !order.includes(v)) order.push(v);
  if (order.length === 0 && !hits.some(h => h.label === 'oats / yoghurt')) order.push('broccoli', 'peppers', 'spinach', 'salad');
  // Two veg of different colours, plus a third option if there is one.
  const picks: string[] = [];
  for (const k of order) {
    if (picks.length >= 3) break;
    if (picks.length < 2 && picks.some(p => V[p].colour === V[k].colour)) continue;
    picks.push(k);
  }
  for (const k of order) { if (picks.length >= 3) break; if (!picks.includes(k)) picks.push(k); }
  const veg = picks.map((k, i) => ({ ...V[k], amount: i < 2 ? 'A big handful (~80g)' : 'Optional extra', colour: V[k].colour }));
  const fruitKey = hits[0]?.fruit ?? 'citrus';
  const f = FRUIT[fruitKey];
  const fruit: Addition = { item: f.item, amount: 'One piece or a handful (~80g)', how: 'With the meal or straight after.', why: f.why, colour: 'fruit' };
  const extra = hits.find(h => h.extra)?.extra ?? 'Frozen veg is as nutritious as fresh and never goes off — keep two bags in the freezer.';
  const portions = Math.min(veg.filter(v => v.amount !== 'Optional extra').length, 2) + 1;
  return { matched, veg, fruit, extra, portions };
}

/* Why it matters — honest, UK guidance and the best evidence. */
export const VEG_FACTS: [string, string][] = [
  ['The target', 'At least five 80g portions a day (UK 5-a-day). The largest analysis of the evidence found the lowest risk of heart disease, stroke and early death at around 800g a day — roughly ten portions. More is better, up to a point.'],
  ['Your heart and blood pressure', 'Fruit and veg bring potassium and fibre, which lower blood pressure and cholesterol. Higher intake is consistently linked to less heart disease and stroke.'],
  ['Your gut', 'Fibre feeds your gut bacteria. The UK target is 30g a day and most people eat under 20g. Variety seems to matter too — one large study linked eating 30+ different plants a week to a more diverse gut microbiome (herbs, nuts, beans and spices all count).'],
  ['Your skin and looks', 'Carotenoids from orange, red and green veg build up in the skin and give a warmer, healthier tone in 6-8 weeks; vitamin C is needed to make collagen.'],
  ['Training and recovery', 'Fruit carbs refuel you, potassium helps muscle function, and vitamin C and polyphenols support recovery. Vitamin C also boosts iron absorption from meat and beans.'],
  ['Cutting vs bulking', 'Cutting: veg adds volume so you feel full on fewer calories. Bulking: lots of raw veg can blunt your appetite — use cooked, blended or grated veg, fruit in shakes, and dried fruit.'],
  ['What counts as a portion', '80g of fruit or veg (about a handful, a medium fruit, three heaped tablespoons of peas). 30g dried fruit. Beans and pulses count once a day however much you eat. Juice or smoothie: max one portion (150ml). Potatoes do not count.'],
  ['Frozen and tinned are fine', 'Frozen veg is picked and frozen at its best and is as nutritious as fresh; tinned is fine in water or juice. Cheaper and nothing goes off.'],
  ['Eat the colours', 'Each colour brings different compounds: green (folate, vitamin K), orange (beta-carotene), red (lycopene), purple (anthocyanins), white (prebiotic fibre). Aim for three colours a day.'],
];
