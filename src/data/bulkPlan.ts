/*
 * Gym → Lean Bulk → Meal plan. 3,400 kcal lean bulk for 6ft 4 / 86kg,
 * built from UK label values per 100g (raw/dry unless stated). Macros were
 * calculated from those values; UK labels count fibre at 2 kcal/g, so
 * P×4 + C×4 + F×9 sits slightly under the stated kcal (all within 5%).
 * Kitchen measures are added at render time by withMeasure().
 */

export interface PlanItem {
  id: string; name: string; time: string;
  kcal: number; p: number; c: number; f: number;
  ingredients: string[]; method: string[]; swap: string;
}

export const TARGETS = [
  ['Calories', '3,400 kcal (3,300–3,500)'],
  ['Protein', '170–190g'],
  ['Fat', '70–90g'],
  ['Carbs', 'The rest (≈450–500g)'],
  ['Fibre', '30g+'],
] as const;

export const BREAKFAST: PlanItem[] = [
  { id: 'B1', name: 'Greek Yoghurt Power Bowl', time: '5 min', kcal: 744, p: 43, c: 93, f: 19,
    ingredients: ['250g 0% fat Greek yoghurt', '70g porridge oats', '100g frozen mixed berries', '100g banana (peeled)', '20g smooth peanut butter', '15g honey', '10g chia seeds'],
    method: ['Microwave the berries for 60 seconds.', 'Stir the oats and chia into the yoghurt.', 'Top with the berries and sliced banana.', 'Add the peanut butter and honey.'],
    swap: '+184 kcal: add 30g almonds.' },
  { id: 'B2', name: 'Smoked Salmon Scrambled Eggs on Toast', time: '10 min', kcal: 757, p: 49, c: 48, f: 39,
    ingredients: ['3 large eggs (174g without shell)', '30ml semi-skimmed milk', '5g olive oil', '40g spinach', '50g smoked salmon', '120g wholemeal bread (3 slices)', '50g avocado'],
    method: ['Whisk the eggs with the milk.', 'Wilt the spinach in the oil over a low heat, 30 seconds.', 'Add the eggs and stir slowly for 2–3 minutes until just set.', 'Toast the bread and spread with mashed avocado.', 'Top with the eggs and smoked salmon.'],
    swap: '−186 kcal: drop the avocado and 1 slice of bread.' },
  { id: 'B3', name: 'Protein Overnight Oats (batch)', time: '5 min + overnight', kcal: 840, p: 52, c: 95, f: 26,
    ingredients: ['90g porridge oats', '30g whey protein', '300ml semi-skimmed milk', '10g chia seeds', '100g banana (peeled)', '15g smooth peanut butter'],
    method: ['Shake the whey into the milk until smooth.', 'Stir in the oats and chia.', 'Seal in jars and refrigerate overnight. Make 2 at a time — eat within 2 days.', 'Top with banana and peanut butter to serve.'],
    swap: '−206 kcal: cut the oats to 35g.' },
];

export const LUNCH: PlanItem[] = [
  { id: 'L1', name: 'Sweet Chilli Chicken, Pouch Rice & Broccoli', time: '15 min', kcal: 687, p: 51, c: 84, f: 16,
    ingredients: ['150g chicken breast', '1 × 250g microwave basmati rice pouch', '150g broccoli', '10g olive oil', '15ml light soy sauce', '20g sweet chilli sauce'],
    method: ['Dice the chicken and fry in the oil on high for 6–7 minutes.', 'Microwave the broccoli for 4 minutes.', 'Toss the chicken in both sauces for 1 minute.', 'Microwave the rice pouch (2 min) and serve. Batch the chicken; the rice is always fresh.'],
    swap: '+168 kcal: add half another rice pouch.' },
  { id: 'L2', name: 'Tuna Pasta Salad (batch)', time: '15 min', kcal: 718, p: 57, c: 87, f: 13,
    ingredients: ['110g wholewheat pasta (dry)', '150g tuna in spring water, drained', '30g light mayonnaise', '80g tinned sweetcorn, drained', '100g cherry tomatoes', '80g cucumber'],
    method: ['Boil the pasta for 10–12 minutes, drain and rinse cold.', 'Halve the tomatoes and dice the cucumber.', 'Mix the tuna with the mayonnaise.', 'Combine everything. Fridge, eat within 2 days.'],
    swap: '+209 kcal: increase the pasta to 170g.' },
  { id: 'L3', name: 'Turkey Chilli with Pouch Rice (batch)', time: '25 min', kcal: 776, p: 58, c: 102, f: 13,
    ingredients: ['165g turkey breast mince (2% fat)', '5g olive oil', '60g onion', '80g red pepper', '200g tinned chopped tomatoes', '120g red kidney beans, drained', '1 × 250g microwave basmati rice pouch', 'Chilli powder, cumin, smoked paprika (1 tsp each)'],
    method: ['Fry the onion and pepper in the oil for 3 minutes.', 'Add the mince and spices and brown for 5 minutes.', 'Add the tomatoes and beans and simmer for 10 minutes.', 'Batch only the chilli (fridge 2 days, freeze the rest).', 'Microwave a rice pouch on the day and serve.'],
    swap: '+168 kcal: add half another rice pouch.' },
  { id: 'L4', name: 'Chicken & Hummus Wraps', time: '15 min', kcal: 755, p: 55, c: 67, f: 27,
    ingredients: ['140g chicken breast', '5g olive oil', '2 wholemeal tortilla wraps (128g)', '50g reduced-fat hummus', '40g mixed salad leaves', '60g red pepper', '20g reduced-fat cheddar'],
    method: ['Slice and fry the chicken in the oil for 6–7 minutes, or use batch-cooked chicken.', 'Warm the wraps for 20 seconds.', 'Spread with hummus.', 'Fill with chicken, leaves, pepper and grated cheese, then roll.'],
    swap: '+179 kcal: add a third wrap.' },
  { id: 'L5', name: 'Peri Chicken & Pouch Rice (batch)', time: '15 min', kcal: 673, p: 47, c: 85, f: 15,
    ingredients: ['150g chicken breast', '5g olive oil', '1 × 250g microwave basmati rice pouch', '80g tinned sweetcorn, drained', '100g frozen mixed veg', '15g light mayonnaise', 'Peri-peri seasoning (1 tsp)'],
    method: ['Coat the chicken in the oil and seasoning; air-fry at 200°C for 15 minutes or pan-fry for 7.', 'Microwave the veg and sweetcorn for 4 minutes.', 'Microwave the rice pouch for 2 minutes.', 'Slice the chicken over the rice; mayo on the side.'],
    swap: '+168 kcal: add half another rice pouch.' },
  { id: 'L6', name: 'Chicken Pesto Pasta', time: '15 min', kcal: 681, p: 50, c: 83, f: 14,
    ingredients: ['140g chicken breast', '110g pasta (dry)', '25g green pesto', '100g cherry tomatoes', '40g spinach'],
    method: ['Boil the pasta for 10–11 minutes.', 'Slice and dry-fry the chicken in a non-stick pan for 6–7 minutes.', 'Add the halved tomatoes and spinach for 1 minute.', 'Drain the pasta and stir everything through the pesto.'],
    swap: '+215 kcal: increase the pasta to 170g.' },
];

export const DINNER: PlanItem[] = [
  { id: 'D1', name: 'Beef Bolognese (batch)', time: '25 min', kcal: 872, p: 60, c: 111, f: 20,
    ingredients: ['165g 5% fat beef mince', '5g olive oil', '60g onion', '80g carrot', '200g tinned chopped tomatoes', '130g spaghetti (dry)', '20g reduced-fat cheddar', 'Garlic, dried oregano'],
    method: ['Fry the onion, grated carrot and garlic in the oil for 3 minutes.', 'Add the mince and brown for 5 minutes.', 'Add the tomatoes and oregano and simmer for 10 minutes.', 'Batch the sauce: a 500g pack makes 3 portions. Fridge 2 days, freeze the rest.', 'Boil the spaghetti fresh (10 min) and top with cheese.'],
    swap: '−215 kcal: cut the spaghetti to 70g.' },
  { id: 'D2', name: 'Salmon, Sweet Potato & Green Beans', time: '25 min', kcal: 732, p: 36, c: 87, f: 28,
    ingredients: ['140g salmon fillet', '400g sweet potato', '150g green beans', '5g olive oil', 'Salt, pepper, lemon'],
    method: ['Dice the sweet potato, toss in the oil and air-fry at 200°C for 18–20 minutes.', 'Season the salmon and air-fry or bake for 10–12 minutes alongside.', 'Steam the green beans for 4 minutes.', 'Plate and finish with lemon.'],
    swap: '+176 kcal: add 150g sweet potato and 5g olive oil.' },
  { id: 'D3', name: 'Chicken Noodle Stir-Fry', time: '15 min', kcal: 772, p: 55, c: 99, f: 15,
    ingredients: ['150g chicken breast', '10g olive oil', '250g stir-fry vegetable mix', '110g dried egg noodles', '20ml light soy sauce', '20g sweet chilli sauce'],
    method: ['Soak or boil the noodles for 4 minutes and drain.', 'Stir-fry the sliced chicken in the oil on high for 6 minutes.', 'Add the vegetables for 3 minutes.', 'Add the noodles and both sauces and toss for 1 minute.'],
    swap: '+195 kcal: increase the noodles to 165g.' },
  { id: 'D4', name: 'Turkey Burgers, Wedges & Peas (batch)', time: '25 min', kcal: 723, p: 60, c: 78, f: 20,
    ingredients: ['170g turkey breast mince (2% fat)', '30g onion, finely diced', '400g potatoes', '10g olive oil', '100g frozen peas', '20g reduced-fat cheddar', 'Garlic granules, paprika'],
    method: ['Cut the potatoes into wedges, toss in the oil and paprika, and air-fry at 200°C for 20 minutes.', 'Mix the mince, onion and garlic and shape into 2 burgers.', 'Grill or air-fry the burgers for 10–12 minutes, cheese on for the last minute.', 'Microwave the peas for 3 minutes and serve.'],
    swap: '+195 kcal: add 200g potatoes and 5g olive oil.' },
  { id: 'D5', name: 'Rump Steak, Chips & Peppers', time: '25 min', kcal: 737, p: 50, c: 76, f: 26,
    ingredients: ['200g rump steak, fat strip trimmed', '400g potatoes', '5g olive oil', '100g red pepper', '50g onion', 'Salt, pepper, garlic'],
    method: ['Cut the potatoes into chips, toss in the oil and air-fry at 200°C for 20 minutes.', 'Bring the steak to room temperature and season well.', 'Sear in a smoking-hot dry pan 2–3 minutes a side for medium; rest 5 minutes.', 'Fry the sliced pepper and onion in the steak pan for 4 minutes.', 'Cook steak fresh — it does not reheat well.'],
    swap: '+195 kcal: add 200g potatoes and 5g olive oil.' },
  { id: 'D6', name: 'Steak, Pouch Rice & Broccoli', time: '15 min', kcal: 747, p: 52, c: 74, f: 27,
    ingredients: ['180g rump steak, fat strip trimmed', '1 × 250g microwave basmati rice pouch', '150g broccoli', '15ml light soy sauce', '5g olive oil'],
    method: ['Sear the seasoned steak in the oil 2–3 minutes a side; rest 5 minutes and slice.', 'Microwave the broccoli for 4 minutes and the rice pouch for 2.', 'Splash the soy into the steak pan and pour over.'],
    swap: '+168 kcal: add half another rice pouch.' },
];

export const SNACKS: PlanItem[] = [
  { id: 'S1', name: 'Cottage Cheese Rice Cakes', time: '3 min', kcal: 254, p: 20, c: 34, f: 4,
    ingredients: ['150g reduced-fat cottage cheese', '4 rice cakes (32g)', '80g cherry tomatoes', 'Black pepper'],
    method: ['Spread the cottage cheese on the rice cakes.', 'Top with halved tomatoes and pepper.'],
    swap: '+173 kcal: add 4 more rice cakes and 15g honey.' },
  { id: 'S2', name: 'Yoghurt & Berries', time: '2 min', kcal: 168, p: 21, c: 19, f: 0,
    ingredients: ['200g 0% fat Greek yoghurt', '80g frozen mixed berries', '10g honey'],
    method: ['Thaw the berries for 45 seconds in the microwave.', 'Stir into the yoghurt and add the honey.'],
    swap: '+188 kcal: stir in 50g oats.' },
  { id: 'S3', name: 'Peanut Butter Banana Toast', time: '4 min', kcal: 431, p: 16, c: 56, f: 15,
    ingredients: ['80g wholemeal bread (2 slices)', '25g smooth peanut butter', '100g banana (peeled)'],
    method: ['Toast the bread.', 'Spread with peanut butter and top with sliced banana.'],
    swap: '−184 kcal: use 1 slice and 10g peanut butter.' },
  { id: 'S4', name: 'Boiled Eggs, Apple & Almonds', time: '10 min (batch)', kcal: 320, p: 18, c: 19, f: 19,
    ingredients: ['2 large eggs (116g without shell)', '150g apple', '15g almonds'],
    method: ['Boil the eggs for 8 minutes, cool in cold water and peel. Boil 4 at a time and eat within 2 days.', 'Serve with the sliced apple and almonds.'],
    swap: '+167 kcal: add a third egg and 1 slice of wholemeal toast.' },
  { id: 'S5', name: 'Banana & Honey Bagel', time: '4 min', kcal: 400, p: 12, c: 72, f: 6,
    ingredients: ['1 wholemeal bagel (85g)', '30g light soft cheese', '100g banana (peeled)', '15g honey'],
    method: ['Toast the bagel.', 'Spread with the soft cheese.', 'Top with banana and honey.'],
    swap: '+184 kcal: add 30g almonds on the side.' },
  { id: 'S6', name: 'Rice Cakes, Banana & Peanut Butter', time: '2 min', kcal: 363, p: 8, c: 63, f: 9,
    ingredients: ['4 rice cakes (32g)', '120g banana (peeled)', '15g smooth peanut butter', '10g honey'],
    method: ['Spread the rice cakes with peanut butter.', 'Top with sliced banana and honey.'],
    swap: '+124 kcal: 2 more rice cakes and 10g more peanut butter.' },
  { id: 'S7', name: 'Dates, Almonds & Apple', time: '1 min', kcal: 314, p: 6, c: 46, f: 11,
    ingredients: ['40g pitted dates', '20g almonds', '150g apple'],
    method: ['Bag it up — the easiest snack to carry to uni.'],
    swap: '+125 kcal: have it with 250ml semi-skimmed milk.' },
];

export const SHAKES: PlanItem[] = [
  { id: 'SH1', name: 'Banana Oat Mass Shake', time: '3 min', kcal: 735, p: 47, c: 90, f: 20,
    ingredients: ['30g whey protein', '300ml semi-skimmed milk', '60g porridge oats', '120g banana (peeled)', '15g peanut butter', '10g honey'],
    method: ['Milk in the blender first.', 'Add everything else.', 'Blend for 45 seconds.'],
    swap: '−225 kcal: leave out the oats.' },
  { id: 'SH2', name: 'Berry Yoghurt Shake', time: '3 min', kcal: 362, p: 46, c: 38, f: 3,
    ingredients: ['30g whey protein', '300ml skimmed milk', '100g 0% fat Greek yoghurt', '100g frozen mixed berries', '15g honey'],
    method: ['Milk and yoghurt in first.', 'Add the berries, whey and honey.', 'Blend for 45 seconds.'],
    swap: '+188 kcal: blend in 50g oats.' },
  { id: 'SH3', name: 'Chocolate Peanut Butter Shake', time: '3 min', kcal: 612, p: 43, c: 67, f: 19,
    ingredients: ['30g chocolate whey protein', '300ml semi-skimmed milk', '20g peanut butter', '120g banana (peeled)', '5g cocoa powder', '30g pitted dates'],
    method: ['Milk in the blender first.', 'Add everything else.', 'Blend for 60 seconds until the dates are smooth.'],
    swap: '+206 kcal: blend in 55g oats.' },
];

/*
 * The week: each day is generated from the options above and checked against
 * the targets (3,300–3,500 kcal, 170–190g protein, 70–90g fat, 30g+ fibre).
 * Totals are added up by the page from the items, never typed in.
 * Lunches follow the prep: chilli batch Mon–Wed, peri chicken batch Thu–Sat.
 */
export const WEEK: { day: string; training: string; ids: string[] }[] = [
  { day: 'Mon', training: 'Push', ids: ['B1', 'L3', 'D1', 'S5', 'S6', 'S7'] },
  { day: 'Tue', training: 'Kickboxing', ids: ['B3', 'L3', 'D2', 'S1', 'S5', 'S6'] },
  { day: 'Wed', training: 'Legs', ids: ['B1', 'L3', 'D6', 'S5', 'S6', 'S7'] },
  { day: 'Thu', training: 'Pull', ids: ['B1', 'L5', 'D1', 'S5', 'S6', 'S7'] },
  { day: 'Fri', training: 'Shoulders & Arms', ids: ['B1', 'L5', 'D3', 'S3', 'S5', 'S6'] },
  { day: 'Sat', training: 'Football', ids: ['B1', 'L5', 'D4', 'S3', 'S5', 'S6'] },
  { day: 'Sun', training: 'Rest', ids: ['B1', 'L6', 'D5', 'S3', 'S5', 'S6'] },
];
export const SPORT_EXTRA = 'Kickboxing (Tue) and match day (Sat): add a shake on top — Banana Oat Mass Shake (+735 kcal) or Berry Yoghurt Shake (+362) — to cover the extra burn. Protein runs a little over 190g on those days — that is fine.';

export const PREP: { when: string; time: string; steps: [string, string][] }[] = [
  { when: 'Sunday', time: '≈60 min', steps: [
    ['Turkey chilli × 3 (Mon–Wed lunch)', '1 × 500g turkey breast mince, 1 large onion, 2 red peppers, 1½ × 400g tins chopped tomatoes, 1½ × 400g tins kidney beans. Split into 3 tubs: Mon + Tue in the fridge, Wed in the freezer.'],
    ['Bolognese sauce × 3 (Mon + Thu dinner, 1 spare)', '1 × 500g 5% beef mince, 1 large onion, 2 carrots, 1½ × 400g tins chopped tomatoes. 3 tubs: Mon in the fridge, Thu and the spare in the freezer.'],
    ['Overnight oats × 1 (Tue breakfast)', 'One jar on Monday night is enough — it only keeps 2 days.'],
    ['Defrost reminders', 'Tuesday night: Wed chilli to the fridge. Wednesday night: Thu bolognese to the fridge. Friday night: Sat chicken to the fridge.'],
  ] },
  { when: 'Wednesday', time: '≈25 min', steps: [
    ['Peri chicken × 3 (Thu–Sat lunch)', '450g chicken breast (3 fillets) from the 1kg pack, air-fried together. 3 tubs: Thu + Fri in the fridge, Sat in the freezer.'],
  ] },
  { when: 'Cook fresh (all ≤25 min)', time: 'on the day', steps: [
    ['Rice', 'Always a microwave pouch on the day — 2 minutes, nothing to store.'],
    ['Pasta', 'Boil fresh each time (10 min). Cooked pasta goes gluey and has to be eaten within 2 days anyway.'],
    ['Steak, salmon, stir-fry, burgers', 'Cook on the night. Steak especially does not reheat well.'],
  ] },
];

export const COOKED: [string, string][] = [
  ['Basmati rice', '100g dry ≈ 250–300g cooked. A 250g pouch ≈ 85–90g dry.'],
  ['Pasta', '100g dry ≈ 220–250g cooked.'],
  ['Chicken breast', '100g raw ≈ 75g cooked.'],
  ['Mince (beef or turkey)', '100g raw ≈ 70–75g cooked.'],
  ['Steak', '100g raw ≈ 70–75g cooked.'],
  ['Potatoes / sweet potato', 'Weigh raw — they lose 10–20% roasting.'],
  ['The batch trick', 'Weigh the whole cooked batch, divide by the number of portions. No maths per ingredient.'],
];

/* UK Food Standards Agency guidance. */
export const STORAGE: [string, string][] = [
  ['Cooked rice', 'Fridge no more than 24 hours, reheated once until steaming hot. That is why the plan uses pouches.'],
  ['Everything else cooked', 'Cool within 1–2 hours, fridge, eat within 2 days. Freeze anything for later in the week.'],
  ['Defrosting', 'In the fridge overnight, then eat within 24 hours. Reheat until steaming hot all the way through.'],
  ['Freezer', 'Fine for months — best within 2–3 months for cooked meat.'],
];

export const SHOPPING: [string, [string, string, string][]][] = [
  ['Meat & fish', [['Chicken breast', '740g', '1 × 1kg pack (freeze the rest)'], ['Turkey breast mince 2%', '665g', '2 × 500g packs (freeze the spare)'], ['5% beef mince', '500g', '1 × 500g pack'], ['Rump steak', '2 steaks', '2 × 255g steaks'], ['Salmon fillet', '140g', '1 × 2-fillet pack (freeze one)']]],
  ['Dairy & eggs', [['0% fat Greek yoghurt', '1,500g', '3 × 500g tubs'], ['Reduced-fat cottage cheese', '150g', '1 × 300g tub'], ['Light soft cheese', '210g', '2 × 180g tubs'], ['Reduced-fat cheddar', '60g', '1 small block'], ['Semi-skimmed milk', '300ml', '1 × 1-pint bottle']]],
  ['Fruit & veg', [['Bananas', '2,540g peeled', '≈21'], ['Apples', '450g', '3'], ['Potatoes', '800g', '1 × 1kg bag'], ['Sweet potato', '400g', '2 medium'], ['Onions', '380g', '3'], ['Red peppers', '340g', '3'], ['Carrots', '160g', '2'], ['Broccoli', '150g', '1 small head'], ['Cherry tomatoes', '180g', '1 punnet'], ['Spinach', '40g', '1 small bag'], ['Green beans', '150g', '1 pack']]],
  ['Frozen', [['Mixed berries', '600g', '1 × 750g bag'], ['Mixed veg', '300g', '1 × 1kg bag'], ['Stir-fry veg', '250g', '1 bag']]],
  ['Cupboard', [['Microwave basmati rice', '7 pouches', '7 × 250g'], ['Porridge oats', '510g', '1 × 1kg bag'], ['Spaghetti / pasta', '370g', '1 × 500g pack'], ['Egg noodles', '110g', '1 pack'], ['Rice cakes', '≈32', '2 packs'], ['Peanut butter', '315g', '1 × 340g jar'], ['Honey', '265g', '1 × 340g jar'], ['Pitted dates', '120g', '1 × 250g bag'], ['Almonds', '60g', '1 × 200g bag'], ['Chia seeds', '70g', '1 small bag'], ['Chopped tomatoes', '1,000g', '3 × 400g tins'], ['Kidney beans', '360g drained', '2 × 400g tins'], ['Sweetcorn', '240g', '2 small tins'], ['Pesto', '25g', '1 jar'], ['Light mayonnaise', '45g', '1 bottle'], ['Soy sauce, sweet chilli', 'small amounts', '1 bottle each'], ['Olive oil', '75g', '1 bottle']]],
  ['Bakery', [['Wholemeal bagels', '7', '2 × 5-packs'], ['Wholemeal bread', '6 slices', '1 loaf']]],
  ['Supplements', [['Whey protein', '1 scoop', 'from a 1kg tub'], ['Creatine', '35g (5g a day)', 'from a 250g tub']]],
];
