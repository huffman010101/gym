/*
 * Recipe library for the Diet tab's meal planner. Calories and protein are
 * honest estimates for the quantities listed, not lab values. Every recipe
 * is written to be cooked by someone who does not cook yet.
 */

export type Slot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  slot: Slot;
  name: string;
  kcal: number;
  protein: number;
  mins: number;
  tags: string[];          // Gain · Skin · Quick · Batch · Dairy-free · Lean
  looks: string;           // what it does for how you look
  ingredients: string[];
  steps: string[];
  season: string;          // exactly how to season it
  chef: string[];          // the upgrades that make it restaurant-good
  custom?: boolean;        // written by the AI chef
}

export const SLOT_LABEL: Record<Slot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack / shake',
};

export const MEALS: Meal[] = [
  /* ---------------- BREAKFAST ---------------- */
  {
    id: 'oats-loaded', slot: 'breakfast', name: 'Loaded overnight oats', kcal: 900, protein: 55, mins: 5,
    tags: ['Gain', 'Quick'],
    looks: 'Slow carbs and protein first thing; berries add vitamin C for collagen.',
    ingredients: ['100g rolled oats', '300ml whole milk (or oat milk)', '1 scoop vanilla whey', '1 banana', '1 tbsp peanut butter', 'Handful of berries', '1 tsp honey', 'Pinch of salt', 'Pinch of cinnamon'],
    steps: [
      'The night before: stir the oats, milk, whey, salt and cinnamon together in a jar or tub until there are no dry lumps of whey.',
      'Slice half the banana into it, lid on, fridge overnight.',
      'Morning: stir, loosen with a splash of milk if thick.',
      'Top with the rest of the banana, the berries, peanut butter and honey.',
    ],
    season: 'A pinch of salt is the secret — it makes the sweetness taste of something. Cinnamon and a few drops of vanilla if your whey is unflavoured.',
    chef: ['Toast the oats dry in a pan for 3 minutes before soaking — nutty, not porridge-y.', 'Warm the peanut butter for 10 seconds so it drizzles.', 'Grate a little orange zest on top — it lifts the whole thing.'],
  },
  {
    id: 'eggs-salmon', slot: 'breakfast', name: 'Soft scrambled eggs, smoked salmon, sourdough', kcal: 850, protein: 50, mins: 10,
    tags: ['Gain', 'Skin'],
    looks: 'Omega-3 from the salmon, biotin and protein from the eggs — skin and hair in one plate.',
    ingredients: ['4 large eggs', '15g butter', '2 slices sourdough', '50-70g smoked salmon', 'Half an avocado', 'Chives', 'Lemon', 'Salt, black pepper'],
    steps: [
      'Crack the eggs into a cold pan with the butter. Do not whisk yet.',
      'Put on medium heat and stir constantly with a spatula. Every 30 seconds take the pan off the heat for 10 seconds, then back on.',
      'When they are just set but still glossy, take them off — they keep cooking. Season now, not before.',
      'Toast the sourdough, smash the avocado on it with salt and a squeeze of lemon.',
      'Eggs on top, salmon alongside, chives over everything.',
    ],
    season: 'Salt and pepper the eggs only at the end (early salt makes them watery). Lemon juice and flaky salt on the avocado. Black pepper on the salmon.',
    chef: ['The Ramsay trick: a teaspoon of crème fraîche stirred in at the end — silky and it stops them overcooking.', 'Chives cut with scissors straight over the plate.', 'Rub the hot toast with a cut garlic clove before the avocado.'],
  },
  {
    id: 'yoghurt-bowl', slot: 'breakfast', name: 'Greek yoghurt power bowl', kcal: 750, protein: 40, mins: 3,
    tags: ['Gain', 'Quick', 'Skin'],
    looks: 'Berries and walnuts: antioxidants and omega-3 for calmer skin.',
    ingredients: ['300g full-fat Greek yoghurt', '60g granola', 'Big handful of mixed berries', '20g walnuts', '1 tbsp honey', '1 tbsp chia or ground flax'],
    steps: [
      'Yoghurt in a wide bowl.',
      'Berries on one side, granola on the other so it stays crunchy.',
      'Walnuts, chia, honey over the top. Eat straight away.',
    ],
    season: 'A pinch of flaky salt on the honey sounds wrong and is right.',
    chef: ['Toast the walnuts in a dry pan for 2 minutes.', 'Microwave frozen berries for 40 seconds for an instant compote.', 'Add a scoop of whey stirred into the yoghurt for +25g protein.'],
  },
  {
    id: 'breakfast-burrito', slot: 'breakfast', name: 'Steak and egg breakfast burrito', kcal: 900, protein: 60, mins: 15,
    tags: ['Gain'],
    looks: 'Zinc and iron from the beef — both linked to skin and hair quality.',
    ingredients: ['120g leftover steak or 150g beef mince', '3 eggs', '1 large tortilla wrap', '30g grated cheddar', 'Half a pepper, diced', 'Salsa', 'Hot sauce'],
    steps: [
      'Fry the pepper in a little oil for 3 minutes. Add the beef (sliced steak or mince) and cook through.',
      'Push to one side, scramble the eggs in the same pan.',
      'Warm the wrap in a dry pan for 20 seconds each side.',
      'Fill: eggs, beef, cheese, salsa, hot sauce. Fold the ends in, roll tight.',
      'Put it seam-down back in the pan for a minute to seal and crisp.',
    ],
    season: 'Salt, pepper, smoked paprika and a pinch of cumin on the beef. Hot sauce to taste.',
    chef: ['Crisping the wrap seam-down is what makes it feel like a café, not a kitchen.', 'Add pickled jalapeños for sharpness.', 'Make four on Sunday, wrap in foil, freeze — 3 minutes in the microwave.'],
  },
  {
    id: 'protein-pancakes', slot: 'breakfast', name: 'Banana protein pancakes', kcal: 700, protein: 45, mins: 15,
    tags: ['Gain', 'Dairy-free'],
    looks: 'High protein without a dairy load, if dairy breaks you out.',
    ingredients: ['2 ripe bananas', '3 eggs', '60g oats', '1 scoop protein (egg, pea, or whey)', '1 tsp baking powder', 'Coconut oil for the pan', 'Berries, maple syrup'],
    steps: [
      'Blend everything except the oil and toppings until smooth. Rest 5 minutes.',
      'Heat a non-stick pan on medium with a little oil.',
      'Small ladles of batter. Flip when bubbles pop on the surface (about 2 minutes).',
      'Stack with berries and syrup.',
    ],
    season: 'Pinch of salt and cinnamon in the batter.',
    chef: ['Keep them small — big pancakes burn outside before they cook inside.', 'Warm the syrup with a knob of butter or coconut oil.', 'Add blueberries onto each pancake in the pan, not in the batter.'],
  },
  {
    id: 'shakshuka', slot: 'breakfast', name: 'Shakshuka with feta', kcal: 650, protein: 35, mins: 20,
    tags: ['Skin', 'Lean'],
    looks: 'Cooked tomatoes are the best source of lycopene; peppers give vitamin C.',
    ingredients: ['1 tin chopped tomatoes', '1 red pepper, sliced', '1 onion, sliced', '2 garlic cloves', '4 eggs', '40g feta', 'Parsley or coriander', 'Sourdough to dip', 'Olive oil'],
    steps: [
      'Fry the onion and pepper in olive oil for 8 minutes until soft and sweet.',
      'Add garlic and spices for 1 minute.',
      'Tip in the tomatoes, simmer 5 minutes until thick.',
      'Make four wells, crack an egg into each. Lid on, low heat, 5-7 minutes until the whites set.',
      'Crumble feta and herbs over. Eat from the pan with bread.',
    ],
    season: '1 tsp cumin, 1 tsp smoked paprika, pinch of chilli flakes, salt, pepper, a pinch of sugar to balance the tomato.',
    chef: ['Let the peppers catch a little colour — sweetness is flavour.', 'A spoon of harissa takes it up a level.', 'Finish with a drizzle of good olive oil.'],
  },
  {
    id: 'bagel-stack', slot: 'breakfast', name: 'Bagel, eggs, bacon, avocado', kcal: 800, protein: 40, mins: 10,
    tags: ['Gain', 'Quick'],
    looks: 'Good fats from avocado for skin barrier; easy calories when appetite is low.',
    ingredients: ['1 bagel', '2 eggs', '3 rashers back bacon', 'Half an avocado', 'Handful of spinach', 'Hot sauce'],
    steps: [
      'Bacon in a dry pan until crisp, then set aside.',
      'Fry the eggs in the bacon fat.',
      'Toast the bagel, smash the avocado on the bottom half.',
      'Spinach, bacon, eggs, hot sauce, lid.',
    ],
    season: 'Salt and pepper on the eggs, lemon and salt on the avocado.',
    chef: ['Baste the eggs with the hot fat so the tops set without flipping.', 'Wilt the spinach in the pan for 20 seconds.'],
  },

  /* ---------------- LUNCH ---------------- */
  {
    id: 'chicken-rice-bowl', slot: 'lunch', name: 'Sticky chicken thigh rice bowl', kcal: 900, protein: 60, mins: 25,
    tags: ['Gain', 'Batch'],
    looks: 'Protein anchor plus peppers for vitamin C. Easy to batch for five days.',
    ingredients: ['250g boneless chicken thighs', '100g rice (dry)', '1 pepper, 1 onion', '2 tbsp soy sauce', '1 tbsp honey', '1 garlic clove, 1 thumb ginger', 'Spring onion, sesame seeds', 'Oil'],
    steps: [
      'Rinse the rice until the water runs clear, then cook it (1 part rice to 1.5 water, lid on, low heat 12 minutes, rest 5).',
      'Cut the chicken into chunks. Fry in hot oil without moving it for 4 minutes so it browns, then turn.',
      'Add the sliced pepper and onion for 4 minutes.',
      'Grate in garlic and ginger, add soy and honey, bubble until sticky and glossy (2 minutes).',
      'Rice in the bowl, chicken on top, spring onion and sesame.',
    ],
    season: 'Soy, honey, garlic, ginger, a squeeze of lime and a pinch of chilli flakes. Taste before serving — add soy for salt, lime for brightness.',
    chef: ['Thighs, not breasts: juicier and far harder to overcook.', 'Do not crowd the pan — brown in two batches if needed. Colour is flavour.', 'A drizzle of sesame oil at the very end, never at the start.'],
  },
  {
    id: 'burrito-bowl', slot: 'lunch', name: 'Beef burrito bowl', kcal: 1000, protein: 60, mins: 20,
    tags: ['Gain', 'Batch'],
    looks: 'Beef for zinc and iron, beans for fibre, tomato salsa for lycopene.',
    ingredients: ['200g beef mince (10-12%)', '100g rice (dry)', 'Half a tin black beans', '30g grated cheddar', 'Tomato, red onion, coriander, lime', 'Half an avocado', 'Sour cream (optional)'],
    steps: [
      'Cook the rice.',
      'Brown the mince hard in a hot pan, breaking it up. Pour off excess fat.',
      'Add the spices and a splash of water, simmer 5 minutes.',
      'Quick salsa: dice tomato and red onion, add chopped coriander, lime and salt.',
      'Warm the beans. Build: rice, beans, beef, cheese, salsa, avocado.',
    ],
    season: '1 tsp each cumin, smoked paprika, garlic powder, half tsp chilli powder and oregano, salt, pepper. Lime over the rice.',
    chef: ['Let the mince sit without stirring for 2 minutes at the start — a proper crust makes it taste meaty, not boiled.', 'Stir lime zest and coriander through the rice.', 'Pickle the red onion in lime and salt for 10 minutes first.'],
  },
  {
    id: 'salmon-potatoes', slot: 'lunch', name: 'Crispy-skin salmon, new potatoes, greens', kcal: 850, protein: 45, mins: 25,
    tags: ['Skin', 'Gain'],
    looks: 'The best skin meal here: omega-3, plus vitamin C and folate from the greens.',
    ingredients: ['200g salmon fillet, skin on', '350g new potatoes', 'Tenderstem broccoli or green beans', 'Olive oil, butter', 'Lemon', 'Garlic', 'Dill or parsley'],
    steps: [
      'Halve the potatoes, boil in salted water 12 minutes, drain, then roast or pan-fry in olive oil until golden.',
      'Pat the salmon skin completely dry with kitchen roll. Salt the skin.',
      'Hot pan, oil, salmon skin-side down. Press flat with a spatula for 20 seconds. Leave it alone for 5-6 minutes.',
      'Flip for 1 minute only, add a knob of butter and a squeezed garlic clove, spoon over.',
      'Blanch the greens 2 minutes, toss in the pan juices. Plate with lemon.',
    ],
    season: 'Salt on the skin only. Lemon, dill and black pepper on the flesh. Flaky salt on the potatoes.',
    chef: ['Dry skin plus a hot pan plus not touching it is the entire crispy-skin secret.', 'Crush the potatoes lightly before frying — more crispy edges.', 'Finish with capers fried for 30 seconds in the butter.'],
  },
  {
    id: 'tuna-pasta', slot: 'lunch', name: 'Lemon tuna pasta', kcal: 850, protein: 50, mins: 15,
    tags: ['Gain', 'Quick'],
    looks: 'Cheap protein; spinach adds iron and vitamin K.',
    ingredients: ['100g pasta (dry)', '1 tin tuna', 'Handful of spinach', 'Sweetcorn', 'Spring onion', '1 tbsp olive oil, 1 tbsp mayo', 'Lemon', 'Parmesan'],
    steps: [
      'Cook pasta in well-salted water. Keep a mug of pasta water.',
      'Drain, return to the pan with spinach so it wilts.',
      'Stir in tuna, sweetcorn, olive oil, mayo, lemon zest and juice, and a splash of pasta water until glossy.',
      'Spring onion and parmesan on top.',
    ],
    season: 'Salt the water like the sea. Black pepper, lemon zest, chilli flakes.',
    chef: ['Pasta water is the sauce — the starch makes it cling.', 'Toast breadcrumbs in olive oil with garlic for a crunchy topping.'],
  },
  {
    id: 'chicken-wrap', slot: 'lunch', name: 'Grilled chicken Caesar wrap', kcal: 750, protein: 55, mins: 15,
    tags: ['Quick', 'Lean'],
    looks: 'Lean and high protein for when you are cutting; romaine adds vitamin A.',
    ingredients: ['200g chicken breast', '1 large wrap', 'Romaine lettuce', 'Parmesan', '1 tbsp Caesar dressing', '1 tbsp Greek yoghurt', 'Lemon'],
    steps: [
      'Butterfly the chicken so it is an even thickness. Season.',
      'Hot griddle or pan, 4 minutes each side, rest 3 minutes, slice.',
      'Mix Caesar dressing with Greek yoghurt and lemon.',
      'Wrap: lettuce, chicken, dressing, parmesan. Roll tight, toast seam-down.',
    ],
    season: 'Garlic powder, smoked paprika, salt, pepper, olive oil on the chicken before it hits the pan.',
    chef: ['Butterflying is why restaurant chicken is juicy — it cooks evenly.', 'Resting keeps the juice in the meat, not on the board.'],
  },
  {
    id: 'poke-bowl', slot: 'lunch', name: 'Salmon poke bowl', kcal: 800, protein: 40, mins: 20,
    tags: ['Skin'],
    looks: 'Omega-3, edamame protein, cucumber and carrot for hydration and beta-carotene.',
    ingredients: ['150g salmon (cooked, or sushi-grade)', '100g sushi rice (dry)', 'Edamame', 'Cucumber, carrot, avocado', 'Soy sauce, rice vinegar, sesame oil', 'Sesame seeds, nori'],
    steps: [
      'Cook the rice, stir through 1 tbsp rice vinegar with a pinch of sugar and salt.',
      'Cube the salmon, toss in soy and a few drops of sesame oil.',
      'Ribbon the carrot and cucumber with a peeler.',
      'Build in sections: rice, salmon, edamame, veg, avocado. Seeds and nori on top.',
    ],
    season: 'Soy, sesame oil, rice vinegar, a squeeze of lime; sriracha mayo if you want heat.',
    chef: ['Seasoned rice is what makes it taste like the shop version.', 'If using cooked salmon, flake it warm over cold rice for contrast.'],
  },
  {
    id: 'lentil-soup', slot: 'lunch', name: 'Red lentil and chorizo soup', kcal: 700, protein: 35, mins: 30,
    tags: ['Batch', 'Skin'],
    looks: 'Lentils for iron and zinc, carrots for beta-carotene — the glow vegetable.',
    ingredients: ['150g red lentils', '60g chorizo, diced', '1 onion, 2 carrots, 2 garlic cloves', '1 tin chopped tomatoes', '1 litre chicken stock', 'Crusty bread'],
    steps: [
      'Fry the chorizo until it releases its red oil.',
      'Add diced onion and carrot, soften 8 minutes.',
      'Garlic and spices for 1 minute.',
      'Lentils, tomatoes and stock in. Simmer 20 minutes until the lentils collapse.',
      'Blend half for body, or leave chunky.',
    ],
    season: 'Cumin, smoked paprika, salt, pepper; a squeeze of lemon at the end.',
    chef: ['Lemon at the end is the difference between flat and bright.', 'Swirl in Greek yoghurt and a pinch of chilli flakes.', 'Makes four portions — freeze three.'],
  },
  {
    id: 'steak-sandwich', slot: 'lunch', name: 'Steak sandwich with onions', kcal: 950, protein: 55, mins: 20,
    tags: ['Gain'],
    looks: 'Iron and zinc; rocket for bitter greens that help digestion.',
    ingredients: ['200g sirloin or rump', 'Ciabatta', '1 onion', 'Rocket', 'Dijon mustard, mayo', 'Butter'],
    steps: [
      'Slice the onion, cook low in butter for 15 minutes until sticky and golden.',
      'Steak out of the fridge 20 minutes before. Oil the steak, not the pan.',
      'Very hot pan, 2-3 minutes each side for medium-rare. Rest 5 minutes, slice against the grain.',
      'Toast the ciabatta in the steak pan. Mustard mayo, rocket, steak, onions.',
    ],
    season: 'Generous salt and black pepper on the steak just before cooking. A splash of balsamic in the onions.',
    chef: ['Rest the steak on a warm plate — the juices redistribute.', 'Slice against the grain so it is tender.', 'Baste with butter, garlic and thyme in the last minute.'],
  },

  /* ---------------- DINNER ---------------- */
  {
    id: 'steak-sweet-potato', slot: 'dinner', name: 'Pan-seared steak, sweet potato wedges, spinach', kcal: 900, protein: 60, mins: 35,
    tags: ['Gain', 'Skin'],
    looks: 'Zinc, iron and beta-carotene together — skin tone, hair, energy.',
    ingredients: ['250g sirloin or rump', '1 large sweet potato', '2 big handfuls spinach', 'Butter, olive oil', 'Garlic, thyme or rosemary'],
    steps: [
      'Oven to 220°C. Cut the sweet potato into wedges, toss in oil, salt and paprika, roast 25 minutes turning once.',
      'Steak out of the fridge 20 minutes before. Pat dry.',
      'Smoking-hot pan. Steak in, 2-3 minutes each side. Add butter, crushed garlic and herbs, tilt the pan and spoon the foaming butter over for 1 minute.',
      'Rest 5 minutes.',
      'Wilt the spinach in the same pan with the juices.',
    ],
    season: 'Salt the steak 40 minutes ahead, or right before — never in between. Black pepper after searing. Smoked paprika and a little chilli on the wedges.',
    chef: ['Basting with foaming butter, garlic and thyme is the Ramsay move — do not skip it.', 'Pour the resting juices over the sliced steak.', 'Flaky salt on the sliced steak at the table.'],
  },
  {
    id: 'bolognese', slot: 'dinner', name: 'Proper bolognese', kcal: 1000, protein: 55, mins: 45,
    tags: ['Gain', 'Batch'],
    looks: 'Cooked tomatoes and carrots: lycopene and beta-carotene.',
    ingredients: ['400g beef mince (serves 2)', '1 onion, 1 carrot, 1 celery stick', '3 garlic cloves', '2 tins chopped tomatoes', '1 tbsp tomato purée', 'Splash of milk', '125g spaghetti per portion', 'Parmesan', 'Basil'],
    steps: [
      'Finely dice onion, carrot and celery; cook slowly in olive oil for 10 minutes.',
      'Push aside, brown the mince hard. Add garlic and purée, cook 2 minutes.',
      'Tomatoes plus half a tin of water. Simmer at least 30 minutes, longer is better.',
      'Stir in the splash of milk in the last 5 minutes.',
      'Cook the pasta 1 minute under the packet time, finish it in the sauce with a ladle of pasta water.',
    ],
    season: 'Salt, pepper, dried oregano, a bay leaf, a pinch of sugar. Taste at the end and adjust.',
    chef: ['Finishing the pasta in the sauce, not sauce on top, is the difference.', 'Grate the parmesan rind into the simmering sauce.', 'Double it and freeze portions.'],
  },
  {
    id: 'chicken-curry', slot: 'dinner', name: 'Chicken and chickpea curry', kcal: 950, protein: 55, mins: 35,
    tags: ['Gain', 'Batch', 'Skin'],
    looks: 'Turmeric, tomatoes, spinach; a third of the salt of a takeaway.',
    ingredients: ['250g chicken thighs', 'Half a tin of chickpeas', '1 tin chopped tomatoes', '1 onion, 2 garlic, thumb of ginger', '2 tbsp curry paste', '100ml coconut milk', 'Spinach', '100g basmati', 'Coriander'],
    steps: [
      'Soften the onion in oil for 8 minutes until golden.',
      'Garlic, ginger and curry paste for 2 minutes until fragrant.',
      'Add chicken, coat it in the paste, cook 5 minutes.',
      'Tomatoes, chickpeas, simmer 15 minutes.',
      'Coconut milk and spinach, 2 more minutes. Serve on rice with coriander.',
    ],
    season: 'Curry paste does most of it; add garam masala at the end, salt to taste, lime juice.',
    chef: ['Cook the paste until it smells toasted — raw paste tastes flat.', 'Garam masala at the end, not the start.', 'Toast a few cumin seeds in oil for the rice.'],
  },
  {
    id: 'teriyaki-noodles', slot: 'dinner', name: 'Salmon teriyaki noodles', kcal: 850, protein: 45, mins: 20,
    tags: ['Skin', 'Quick'],
    looks: 'Omega-3 plus greens; one of the best skin dinners.',
    ingredients: ['200g salmon', '1 nest egg noodles', 'Pak choi or broccoli', '3 tbsp soy, 1 tbsp honey, 1 tbsp mirin or rice vinegar', 'Garlic, ginger', 'Spring onion, sesame'],
    steps: [
      'Mix soy, honey, mirin, grated garlic and ginger.',
      'Sear the salmon skin-side down 5 minutes, flip, pour in half the sauce and glaze for 1 minute.',
      'Cook noodles, toss with greens and the rest of the sauce in the pan.',
      'Salmon on top, spring onion, sesame.',
    ],
    season: 'The teriyaki sauce is the seasoning — taste it: more honey for sweet, more soy for salt, rice vinegar for sharpness.',
    chef: ['Let the glaze bubble until it coats a spoon.', 'A few drops of sesame oil and chilli crisp to finish.'],
  },
  {
    id: 'roast-chicken-tray', slot: 'dinner', name: 'Lemon garlic chicken traybake', kcal: 850, protein: 55, mins: 45,
    tags: ['Batch', 'Skin'],
    looks: 'Colourful roast veg: peppers, red onion, tomatoes — antioxidants on a tray.',
    ingredients: ['4 chicken thighs (bone in, skin on)', 'Potatoes', '1 red onion, 1 pepper, cherry tomatoes', '1 lemon', '1 garlic bulb', 'Rosemary or thyme', 'Olive oil'],
    steps: [
      'Oven to 200°C. Chop the potatoes and veg into chunks.',
      'Toss everything in oil, salt, pepper and herbs on one tray. Halve the lemon and the garlic bulb and nestle them in.',
      'Chicken skin-side up on top. Roast 40 minutes.',
      'Squeeze the roasted lemon and garlic over everything.',
    ],
    season: 'Salt the chicken skin well. Smoked paprika, rosemary, black pepper. Roasted lemon at the end.',
    chef: ['Pat the chicken skin dry and leave it uncovered in the fridge for an hour for crackling skin.', 'Do not crowd the tray — use two if needed so it roasts rather than steams.'],
  },
  {
    id: 'beef-stir-fry', slot: 'dinner', name: 'Ginger beef and broccoli stir-fry', kcal: 850, protein: 55, mins: 20,
    tags: ['Quick', 'Gain'],
    looks: 'Broccoli is vitamin C and sulforaphane; beef for zinc.',
    ingredients: ['250g beef strips or thinly sliced steak', 'Broccoli', '1 pepper', 'Garlic, ginger', '3 tbsp soy, 1 tbsp oyster sauce, 1 tsp cornflour', 'Rice or noodles'],
    steps: [
      'Toss the beef with 1 tbsp soy and the cornflour.',
      'Wok or pan as hot as it goes. Sear the beef in batches, 1 minute each, remove.',
      'Stir-fry the broccoli and pepper 3 minutes with a splash of water.',
      'Garlic and ginger 30 seconds, beef back in, sauce in, toss until glossy.',
    ],
    season: 'Soy, oyster sauce, a pinch of sugar, white pepper, chilli if you like it.',
    chef: ['Cornflour on the beef ("velveting") is why takeaway beef is silky.', 'Screaming-hot pan, small batches — never let it stew.'],
  },
  {
    id: 'turkey-meatballs', slot: 'dinner', name: 'Turkey meatballs in tomato sauce', kcal: 800, protein: 60, mins: 35,
    tags: ['Lean', 'Batch'],
    looks: 'Lean protein in a lycopene-rich sauce; good when you are cutting.',
    ingredients: ['400g turkey mince (serves 2)', '1 egg, 30g breadcrumbs, 30g parmesan', '1 tin tomatoes, garlic, basil', 'Pasta, rice, or courgetti'],
    steps: [
      'Mix mince, egg, crumbs, parmesan, grated garlic, salt and pepper. Roll into 12 balls.',
      'Brown them all over in a hot pan (5 minutes).',
      'Add the tomatoes and basil, simmer 15 minutes lid on.',
      'Serve with pasta and extra parmesan.',
    ],
    season: 'Salt, pepper, dried oregano, chilli flakes in the mix. Basil and a pinch of sugar in the sauce.',
    chef: ['Wet your hands before rolling so they stay smooth.', 'Fry a tiny test piece to check the seasoning before rolling them all.'],
  },
  {
    id: 'cod-chips', slot: 'dinner', name: 'Oven fish and chips with peas', kcal: 800, protein: 45, mins: 35,
    tags: ['Lean'],
    looks: 'The takeaway classic at half the fat; peas for plant protein and vitamin C.',
    ingredients: ['2 cod or haddock fillets', '2 large potatoes', 'Panko breadcrumbs, 1 egg, flour', 'Frozen peas, mint', 'Lemon, tartare sauce'],
    steps: [
      'Oven 220°C. Cut potatoes into chips, toss in oil and salt, roast 30 minutes.',
      'Pat the fish dry. Flour, egg, panko.',
      'Onto the tray for the last 12 minutes.',
      'Boil peas 3 minutes, crush with butter and mint.',
    ],
    season: 'Salt and vinegar on the chips, lemon on the fish, pepper and mint in the peas.',
    chef: ['Parboil the chips 5 minutes and rough them up in the colander — crispier edges.', 'Lemon zest in the panko.'],
  },
  {
    id: 'lamb-kofta', slot: 'dinner', name: 'Lamb koftas, flatbread, tzatziki', kcal: 950, protein: 50, mins: 25,
    tags: ['Gain'],
    looks: 'Cucumber and herbs for freshness; lamb for zinc and B12.',
    ingredients: ['250g lamb mince', 'Flatbreads', 'Cucumber, Greek yoghurt, garlic, mint', 'Tomato, red onion, parsley', 'Lemon'],
    steps: [
      'Mix the lamb with grated onion, garlic and spices. Shape around skewers or into sausages.',
      'Grill or pan-fry 8-10 minutes, turning.',
      'Tzatziki: grate cucumber, squeeze out the water, mix with yoghurt, garlic, mint, salt.',
      'Warm the flatbreads, fill with kofta, salad and tzatziki.',
    ],
    season: '1 tsp each cumin and coriander, half tsp cinnamon, chilli flakes, salt, pepper in the mince. Lemon and sumac on the salad.',
    chef: ['Squeezing the cucumber is what stops tzatziki going watery.', 'Char the flatbreads directly over a gas flame for 10 seconds.'],
  },

  /* ---------------- SNACKS / SHAKES ---------------- */
  {
    id: 'mass-shake', slot: 'snack', name: 'The 1000 kcal shake', kcal: 1000, protein: 55, mins: 3,
    tags: ['Gain', 'Quick'],
    looks: 'The easiest surplus there is. Dairy-free version if milk breaks you out.',
    ingredients: ['500ml whole milk (or oat milk)', '1 scoop whey (or pea protein)', '80g oats', '1 banana', '2 tbsp peanut butter', '1 tbsp honey', 'Ice'],
    steps: ['Oats in the blender first and blitz to powder.', 'Everything else in. Blend 45 seconds.', 'Drink between meals, not instead of one.'],
    season: 'Pinch of salt and cinnamon. Cocoa powder for a chocolate version.',
    chef: ['Freeze the banana in chunks — thicker, colder, like a milkshake.', 'Espresso shot and cocoa for a mocha version.'],
  },
  {
    id: 'green-smoothie', slot: 'snack', name: 'Glow smoothie', kcal: 450, protein: 30, mins: 3,
    tags: ['Skin', 'Quick'],
    looks: 'Spinach, kiwi, mango: vitamin C and folate in a glass. Tastes of fruit, not grass.',
    ingredients: ['Big handful spinach', '1 kiwi', '100g frozen mango', 'Half a banana', '1 scoop vanilla protein', '250ml coconut water or water', 'Squeeze of lime'],
    steps: ['Spinach and liquid first, blend until smooth.', 'Everything else in, blend again.'],
    season: 'Lime juice and a small piece of ginger.',
    chef: ['Blending the greens with the liquid first is how you avoid bits.'],
  },
  {
    id: 'cottage-bowl', slot: 'snack', name: 'Cottage cheese, pineapple, seeds', kcal: 350, protein: 30, mins: 2,
    tags: ['Quick', 'Lean'],
    looks: 'Slow protein before bed; pumpkin seeds for zinc.',
    ingredients: ['250g cottage cheese', 'Pineapple chunks', '1 tbsp pumpkin seeds', 'Drizzle of honey'],
    steps: ['Bowl, top, eat.'],
    season: 'Black pepper on pineapple is a real thing — try it.',
    chef: ['Toast the pumpkin seeds with a pinch of salt.'],
  },
  {
    id: 'trail-mix', slot: 'snack', name: 'Homemade trail mix', kcal: 450, protein: 14, mins: 2,
    tags: ['Gain', 'Skin', 'Dairy-free'],
    looks: 'Brazil nuts for selenium, walnuts for omega-3, almonds for vitamin E.',
    ingredients: ['20g almonds', '15g walnuts', '2 Brazil nuts', '20g dark chocolate chips (70%+)', '20g raisins or dried mango'],
    steps: ['Make a big jar on Sunday. 60-80g portions in your bag.'],
    season: 'A pinch of flaky salt through the jar.',
    chef: ['Toast the nuts in the oven 8 minutes at 170°C and let them cool first.'],
  },
  {
    id: 'pb-dates', slot: 'snack', name: 'Dates, peanut butter, dark chocolate', kcal: 350, protein: 8, mins: 2,
    tags: ['Gain', 'Quick', 'Dairy-free'],
    looks: 'Potassium from dates helps with water retention.',
    ingredients: ['4 Medjool dates', '2 tbsp peanut butter', 'Square of dark chocolate'],
    steps: ['Split the dates, remove the stones, fill with peanut butter, grate chocolate over.'],
    season: 'Flaky salt on top.',
    chef: ['Freeze them for 30 minutes — they taste like a Snickers.'],
  },
  {
    id: 'egg-muffins', slot: 'snack', name: 'Egg muffins (batch of 12)', kcal: 300, protein: 25, mins: 25,
    tags: ['Batch', 'Lean'],
    looks: 'Portable protein with peppers and spinach baked in.',
    ingredients: ['10 eggs', 'Spinach, peppers, spring onion', '60g feta or cheddar', 'Muffin tin'],
    steps: ['Oven 180°C. Grease the tin.', 'Chop the veg into each hole, add cheese.', 'Whisk the eggs with salt and pepper, pour over.', 'Bake 18-20 minutes. Fridge for 4 days.'],
    season: 'Salt, pepper, smoked paprika, chilli flakes.',
    chef: ['Pull them out while the centre still has a slight wobble — they set as they cool.'],
  },
];

/* Foods that make a visible difference — rated honestly. */
export interface LooksFood { name: string; group: string; helps: string; why: string; evidence: 'Strong' | 'Good' | 'Some' | 'Weak' }

export const LOOKS_FOODS: LooksFood[] = [
  { name: 'Salmon, mackerel, sardines', group: 'Protein', helps: 'Skin calm, acne, barrier', why: 'Omega-3 fats lower inflammation; twice a week, or fish oil.', evidence: 'Good' },
  { name: 'Carrots, sweet potato, butternut', group: 'Veg', helps: 'Skin tone, the "glow"', why: 'Carotenoids tint skin slightly golden; people rate it as healthier and more attractive in studies.', evidence: 'Good' },
  { name: 'Tomatoes (cooked)', group: 'Veg', helps: 'Sun resilience', why: 'Lycopene, better absorbed cooked with oil; a modest boost to sun protection — never instead of SPF.', evidence: 'Some' },
  { name: 'Red and yellow peppers', group: 'Veg', helps: 'Collagen', why: 'More vitamin C than an orange; collagen needs it.', evidence: 'Good' },
  { name: 'Spinach, kale, broccoli', group: 'Veg', helps: 'Skin, eyes, energy', why: 'Folate, iron, lutein, vitamin C. Lutein supports the eyes and skin.', evidence: 'Good' },
  { name: 'Berries', group: 'Fruit', helps: 'Collagen, antioxidants', why: 'Vitamin C and polyphenols; frozen are just as good and cheaper.', evidence: 'Good' },
  { name: 'Kiwi and citrus', group: 'Fruit', helps: 'Collagen, sleep (kiwi)', why: 'Vitamin C; two kiwis before bed has some evidence for sleep quality.', evidence: 'Some' },
  { name: 'Watermelon, cucumber', group: 'Fruit', helps: 'Hydration', why: 'Mostly water with electrolytes; helps if you forget to drink.', evidence: 'Weak' },
  { name: 'Bananas, potatoes, avocado', group: 'Fruit', helps: 'Less puffiness', why: 'Potassium balances sodium, which drives water retention.', evidence: 'Good' },
  { name: 'Avocado, olive oil', group: 'Fats', helps: 'Barrier, dryness', why: 'Monounsaturated fats and vitamin E; also help you absorb carotenoids.', evidence: 'Some' },
  { name: 'Pumpkin seeds, oysters, beef', group: 'Minerals', helps: 'Acne, hair', why: 'Zinc — low levels are common in acne and some hair shedding.', evidence: 'Good' },
  { name: 'Brazil nuts (2 a day)', group: 'Minerals', helps: 'Hair, thyroid', why: 'Selenium; more than 3 a day is too much.', evidence: 'Some' },
  { name: 'Eggs', group: 'Protein', helps: 'Hair, nails', why: 'Protein and biotin; true biotin deficiency is rare, but protein matters for hair.', evidence: 'Good' },
  { name: 'Lentils, red meat', group: 'Minerals', helps: 'Hair, energy, dark circles', why: 'Iron — low iron is the most common nutritional cause of hair shedding and a pale, tired look.', evidence: 'Good' },
  { name: 'Green tea', group: 'Drinks', helps: 'Oil, redness', why: 'Polyphenols (EGCG); modest effects on oiliness.', evidence: 'Some' },
  { name: 'Water', group: 'Drinks', helps: 'Dull skin', why: 'Dehydration shows as dull, tight skin; more water will not fix acne.', evidence: 'Some' },
  { name: 'Dark chocolate (70%+)', group: 'Treat', helps: 'Mood, not skin', why: 'Cocoa flavanols; evidence for skin benefits is weak. Not a cause of acne either.', evidence: 'Weak' },
  { name: 'Kefir, live yoghurt', group: 'Gut', helps: 'Possibly skin', why: 'Gut-skin link is plausible but not proven; fine to include.', evidence: 'Weak' },
];

/* ================= FOOD SWAPS — per 100g, approximate UK supermarket values ================= */

export interface Food { name: string; kcal: number; p: number; c: number; f: number; note?: string; unit?: { label: string; grams: number } }

export const PROTEINS: Food[] = [
  { name: 'Chicken thigh (skinless, raw)', kcal: 120, p: 20, c: 0, f: 4.5 },
  { name: 'Chicken breast (raw)', kcal: 106, p: 23, c: 0, f: 1.5 },
  { name: 'Beef mince 5% (raw)', kcal: 125, p: 21, c: 0, f: 5 },
  { name: 'Beef mince 10-12% (raw)', kcal: 175, p: 20, c: 0, f: 10 },
  { name: 'Steak, sirloin (raw)', kcal: 160, p: 23, c: 0, f: 7.5 },
  { name: 'Turkey mince 2% (raw)', kcal: 110, p: 23, c: 0, f: 2 },
  { name: 'Salmon fillet (raw)', kcal: 200, p: 20, c: 0, f: 13, note: 'Best skin food on the list' },
  { name: 'Cod or haddock (raw)', kcal: 80, p: 18, c: 0, f: 0.7 },
  { name: 'Tuna, tinned in water', kcal: 110, p: 25, c: 0, f: 1, unit: { label: 'tin (drained)', grams: 112 } },
  { name: 'Eggs', kcal: 145, p: 12.5, c: 0.5, f: 10, unit: { label: 'large egg', grams: 60 } },
  { name: 'Greek yoghurt 0%', kcal: 57, p: 10, c: 4, f: 0.2 },
  { name: 'Cottage cheese', kcal: 98, p: 11, c: 3.5, f: 4.3 },
  { name: 'Whey protein', kcal: 400, p: 78, c: 7, f: 6, unit: { label: 'scoop', grams: 30 } },
  { name: 'Prawns (cooked)', kcal: 70, p: 16, c: 0, f: 0.7 },
  { name: 'Tofu (firm)', kcal: 120, p: 13, c: 2, f: 7 },
];

export const CARBS: Food[] = [
  { name: 'Rice (dry weight)', kcal: 350, p: 7, c: 78, f: 0.6 },
  { name: 'Pasta (dry weight)', kcal: 355, p: 12, c: 72, f: 1.5 },
  { name: 'Oats', kcal: 375, p: 13, c: 60, f: 8 },
  { name: 'Potatoes (raw)', kcal: 77, p: 2, c: 17, f: 0.1 },
  { name: 'Sweet potato (raw)', kcal: 86, p: 1.6, c: 20, f: 0.1, note: 'Beta-carotene — the glow food' },
  { name: 'Sourdough bread', kcal: 250, p: 9, c: 48, f: 1.5, unit: { label: 'slice', grams: 45 } },
  { name: 'Egg noodles (dry)', kcal: 360, p: 13, c: 70, f: 2.5 },
  { name: 'Couscous (dry)', kcal: 360, p: 13, c: 72, f: 1.5 },
  { name: 'Quinoa (dry)', kcal: 370, p: 14, c: 64, f: 6 },
  { name: 'Wraps', kcal: 300, p: 8, c: 50, f: 7, unit: { label: 'large wrap', grams: 64 } },
  { name: 'Banana', kcal: 90, p: 1.1, c: 23, f: 0.3, unit: { label: 'banana', grams: 120 } },
];

export const FATS: Food[] = [
  { name: 'Olive oil', kcal: 820, p: 0, c: 0, f: 91, unit: { label: 'tbsp', grams: 13.5 } },
  { name: 'Peanut butter', kcal: 600, p: 25, c: 12, f: 50, unit: { label: 'tbsp', grams: 16 } },
  { name: 'Almonds / walnuts', kcal: 600, p: 20, c: 10, f: 52 },
  { name: 'Avocado', kcal: 160, p: 2, c: 2, f: 15, unit: { label: 'half avocado', grams: 75 } },
  { name: 'Cheddar', kcal: 410, p: 25, c: 0.1, f: 34 },
  { name: 'Butter', kcal: 740, p: 0.5, c: 0.5, f: 82, unit: { label: 'knob', grams: 10 } },
];

export const VEG_ROTATION = [
  'Broccoli', 'Spinach', 'Peppers', 'Green beans', 'Carrots', 'Courgette', 'Tomatoes', 'Pak choi', 'Asparagus', 'Kale', 'Cauliflower', 'Peas',
];

/* ================= MEAL PREP PLANS ================= */

export interface PrepPlan {
  id: string;
  name: string;
  tagline: string;
  makes: string;
  time: string;
  recipeIds: string[];
  shopping: string[];
  steps: [string, string][];   // [time marker, what to do]
  storage: string[];
}

export const PREP_PLANS: PrepPlan[] = [
  {
    id: 'bulk-box', name: 'The bulk box', tagline: 'Five lunches and five breakfasts, one session', makes: '5 lunches + 5 breakfasts', time: '75 min',
    recipeIds: ['chicken-rice-bowl', 'oats-loaded'],
    shopping: ['1.25kg chicken thighs (boneless)', '500g rice', '3 peppers, 2 onions, 2 courgettes', 'Soy sauce, honey, garlic, ginger', '500g oats', '1.5L whole milk (or oat milk)', 'Whey, 5 bananas, peanut butter, berries', '5 lunch tubs + 5 jars'],
    steps: [
      ['0:00', 'Oven to 220°C. Chop all the veg into chunks, toss with oil and salt on two trays, roast 30 minutes.'],
      ['0:05', 'Rinse the rice and cook it all in one pot (500g rice, 750ml water, lid on, low heat 12 minutes, rest 5).'],
      ['0:10', 'Cut the chicken into chunks. Brown in two batches in a hot pan, 5 minutes each.'],
      ['0:25', 'All the chicken back in, add grated garlic and ginger, 5 tbsp soy and 3 tbsp honey. Bubble until sticky.'],
      ['0:35', 'Spread the rice on a tray to cool fast — this matters for food safety (see storage).'],
      ['0:45', 'Overnight oats: 5 jars, each 100g oats, 300ml milk, 1 scoop whey, pinch of salt. Lids on, fridge.'],
      ['0:55', 'Portion into 5 tubs: rice, chicken, veg. Once cool, 3 to the fridge, 2 to the freezer.'],
      ['1:05', 'Wash up as you go and it is done by 1:15.'],
    ],
    storage: ['Cooked chicken: fridge up to 3 days, so freeze Thursday and Friday tubs and move them to the fridge the night before.', 'Cooked rice: cool within an hour, fridge, eat within 24 hours, or freeze straight away. Reheat until steaming hot, and only once.', 'Overnight oats: fridge up to 5 days. Add the banana and toppings on the day.'],
  },
  {
    id: 'two-sauce', name: 'Two-sauce week', tagline: 'Big pots, different every night', makes: '4 bolognese + 4 curry portions', time: '90 min',
    recipeIds: ['bolognese', 'chicken-curry'],
    shopping: ['800g beef mince (10-12%)', '1kg chicken thighs', '4 tins chopped tomatoes, 1 tin coconut milk', '1 tin chickpeas, 1 bag spinach', '2 onions, 2 carrots, 2 celery sticks, 1 garlic bulb, ginger', 'Curry paste, tomato purée, oregano', 'Pasta and rice (cook fresh each night)', '8 freezer-safe tubs'],
    steps: [
      ['0:00', 'Dice the onions, carrot and celery. Start the bolognese base in a big pot with olive oil, low heat, 10 minutes.'],
      ['0:10', 'In a second pan, soften the curry onion, then add garlic, ginger and curry paste until fragrant.'],
      ['0:20', 'Brown the mince hard in the bolognese pot. Add the chicken to the curry pan and coat it in the paste.'],
      ['0:30', 'Tomatoes into both. Chickpeas into the curry. Both simmer, lids half on.'],
      ['1:00', 'Coconut milk and spinach into the curry. Taste both and season.'],
      ['1:10', 'Cool the pots in cold water in the sink for speed, then portion into 8 tubs.'],
      ['1:20', 'Two of each into the fridge, two of each into the freezer. Label them.'],
    ],
    storage: ['Sauces: fridge up to 3 days, freezer up to 3 months. Defrost in the fridge overnight.', 'Cook pasta and rice fresh on the night — 12 minutes, and it tastes far better than reheated.', 'Reheat until piping hot all the way through.'],
  },
  {
    id: 'grab-go', name: 'Grab-and-go', tagline: 'For busy uni days and nights out', makes: '12 egg muffins + 8 meatball portions + snacks', time: '70 min',
    recipeIds: ['egg-muffins', 'turkey-meatballs', 'trail-mix'],
    shopping: ['12 eggs', 'Spinach, 2 peppers, spring onions, 100g feta', '800g turkey mince', '2 tins tomatoes, basil, parmesan, breadcrumbs', '1kg potatoes', 'Almonds, walnuts, Brazil nuts, dark chocolate, raisins', 'Muffin tin, tubs, snack bags'],
    steps: [
      ['0:00', 'Oven to 200°C. Cut the potatoes into wedges, oil and salt, roast 35 minutes.'],
      ['0:05', 'Egg muffins: veg and feta into a greased muffin tin, whisk 10-12 eggs, pour over. In the oven with the wedges (they take 20 minutes).'],
      ['0:15', 'Mix the turkey mince with egg, crumbs, parmesan and garlic. Roll 24 meatballs.'],
      ['0:25', 'Brown the meatballs, add tomatoes and basil, simmer 15 minutes.'],
      ['0:45', 'Trail mix: toast the nuts 8 minutes, cool, mix with chocolate and raisins, bag into 70g portions.'],
      ['0:55', 'Cool everything and pack: meatballs with wedges, egg muffins in a tub.'],
    ],
    storage: ['Egg muffins: fridge 4 days, or freeze and microwave from frozen for 60-90 seconds.', 'Meatballs: fridge 3 days, freezer 3 months.', 'Trail mix: a sealed jar keeps for weeks.'],
  },
];
