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
    method: ['Shake the whey into the milk until smooth.', 'Stir in the oats and chia.', 'Seal in jars and refrigerate overnight (keeps 3 days).', 'Top with banana and peanut butter to serve.'],
    swap: '−206 kcal: cut the oats to 35g.' },
];

export const LUNCH: PlanItem[] = [
  { id: 'L1', name: 'Sweet Chilli Chicken, Rice & Broccoli (batch)', time: '20 min', kcal: 768, p: 51, c: 109, f: 13,
    ingredients: ['140g chicken breast', '120g basmati rice (dry)', '150g broccoli', '10g olive oil', '15ml light soy sauce', '20g sweet chilli sauce'],
    method: ['Cook the rice (12 min).', 'Dice the chicken and fry in the oil on high for 6–7 minutes.', 'Steam or microwave the broccoli for 4 minutes.', 'Toss the chicken in both sauces for 1 minute.', 'Serve over the rice. Keeps 3 days.'],
    swap: '+213 kcal: increase the rice to 180g.' },
  { id: 'L2', name: 'Tuna Pasta Salad (batch)', time: '15 min', kcal: 718, p: 57, c: 87, f: 13,
    ingredients: ['110g wholewheat pasta (dry)', '150g tuna in spring water, drained', '30g light mayonnaise', '80g tinned sweetcorn, drained', '100g cherry tomatoes', '80g cucumber'],
    method: ['Boil the pasta for 10–12 minutes, drain and rinse cold.', 'Halve the tomatoes and dice the cucumber.', 'Mix the tuna with the mayonnaise.', 'Combine everything. Keeps 2 days.'],
    swap: '+209 kcal: increase the pasta to 170g.' },
  { id: 'L3', name: 'Turkey Chilli with Rice (batch)', time: '25 min', kcal: 790, p: 58, c: 112, f: 11,
    ingredients: ['160g turkey breast mince (2% fat)', '5g olive oil', '60g onion', '80g red pepper', '200g tinned chopped tomatoes', '120g red kidney beans, drained', '100g basmati rice (dry)', 'Chilli powder, cumin, smoked paprika (1 tsp each)'],
    method: ['Cook the rice.', 'Fry the onion and pepper in the oil for 3 minutes.', 'Add the mince and spices and brown for 5 minutes.', 'Add the tomatoes and beans and simmer for 10 minutes.', 'Serve over the rice. Freezes well.'],
    swap: '+178 kcal: add 50g rice.' },
  { id: 'L4', name: 'Chicken & Hummus Wraps', time: '15 min', kcal: 755, p: 55, c: 67, f: 27,
    ingredients: ['140g chicken breast', '5g olive oil', '2 wholemeal tortilla wraps (128g)', '50g reduced-fat hummus', '40g mixed salad leaves', '60g red pepper', '20g reduced-fat cheddar'],
    method: ['Slice and fry the chicken in the oil for 6–7 minutes, or use batch-cooked chicken.', 'Warm the wraps for 20 seconds.', 'Spread with hummus.', 'Fill with chicken, leaves, pepper and grated cheese, then roll.'],
    swap: '+179 kcal: add a third wrap.' },
];

export const DINNER: PlanItem[] = [
  { id: 'D1', name: 'Beef Bolognese (batch)', time: '25 min', kcal: 853, p: 57, c: 111, f: 19,
    ingredients: ['150g 5% fat beef mince', '5g olive oil', '60g onion', '80g carrot', '200g tinned chopped tomatoes', '130g spaghetti (dry)', '20g reduced-fat cheddar', 'Garlic, dried oregano'],
    method: ['Boil the spaghetti for 10–11 minutes.', 'Fry the onion, grated carrot and garlic in the oil for 3 minutes.', 'Add the mince and brown for 5 minutes.', 'Add the tomatoes and oregano and simmer for 10 minutes.', 'Serve topped with cheese. Freezes well.'],
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
    method: ['Boil the eggs for 8 minutes, cool and peel. Batch 6 — they keep 4 days.', 'Serve with the sliced apple and almonds.'],
    swap: '+167 kcal: add a third egg and 1 slice of wholemeal toast.' },
  { id: 'S5', name: 'Banana & Honey Bagel', time: '4 min', kcal: 400, p: 12, c: 72, f: 6,
    ingredients: ['1 wholemeal bagel (85g)', '30g light soft cheese', '100g banana (peeled)', '15g honey'],
    method: ['Toast the bagel.', 'Spread with the soft cheese.', 'Top with banana and honey.'],
    swap: '+184 kcal: add 30g almonds on the side.' },
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

/** The example day: B1, L1, SH1 (after training), S5, D2. */
export const EXAMPLE_DAY = ['B1', 'L1', 'SH1', 'S5', 'D2'];
export const EXAMPLE_TOTAL = { kcal: 3379, p: 189, c: 451, f: 86, fibre: 50 };

export const SHOPPING: [string, [string, string, string][]][] = [
  ['Dairy & eggs', [['0% fat Greek yoghurt', '1,750g', '4 × 450g tubs'], ['Semi-skimmed milk', '2,100ml', '2 × 2-pint bottles'], ['Light soft cheese', '210g', '2 × 180g tubs']]],
  ['Meat & fish', [['Chicken breast fillets', '980g', '1 × 1kg pack'], ['Salmon fillets', '980g (7 × 140g)', '1kg frozen bag or 2 × 4-fillet packs']]],
  ['Fruit & veg', [['Bananas', '2,240g peeled', '≈19 medium'], ['Sweet potatoes', '2,800g', '2 × 1kg bags + 800g loose'], ['Broccoli', '1,050g', '3 heads'], ['Green beans', '1,050g', '1kg frozen bag + a few fresh']]],
  ['Frozen', [['Mixed berries', '700g', '1 × 750g bag']]],
  ['Cupboard', [['Porridge oats', '910g', '1 × 1kg bag'], ['Basmati rice', '840g', '1 × 1kg bag'], ['Smooth peanut butter', '245g', '1 × 340g jar'], ['Honey', '280g', '1 × 340g jar'], ['Chia seeds', '70g', '1 × 150g bag'], ['Light soy sauce', '105ml', '1 × 150ml bottle'], ['Sweet chilli sauce', '140g', '1 bottle'], ['Olive oil', '≈115ml', '1 × 500ml bottle']]],
  ['Bakery', [['Wholemeal bagels', '7', '2 × 5-packs']]],
  ['Supplements', [['Whey protein', '210g (7 scoops)', 'from a 1kg tub'], ['Creatine monohydrate', '35g (5g a day)', 'from a 250g tub']]],
];
