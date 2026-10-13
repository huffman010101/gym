/*
 * Looks → ★ Blueprint: everything that moves your face, looks and hair,
 * ranked by impact, with the schedule that keeps it running and the honest
 * medical options. Each item says where in the app the detail lives.
 */

export interface Tier { tier: string; tag: string; items: [string, string, string][] } // [what, why/how, where]

export const LOOKS_TIERS: Tier[] = [
  {
    tier: 'Tier 1 — the big five', tag: 'Do these and you have 80% of the result', items: [
      ['Body fat at 10-14%', 'The single biggest face changer. The jaw, cheekbones and eyes appear as the fat layer comes off — nothing else on this list competes.', 'Body & Habits · Gym'],
      ['A haircut chosen for your face', 'The fastest visible upgrade, kept fresh every 3-4 weeks. The scan names your face shape and cuts.', 'Scan · Face, Hair & Style'],
      ['Clear, even skin', 'Cleanser, moisturiser and SPF every day; one active at night. Clear skin reads as health and youth before anything else.', 'Skin'],
      ['Posture', 'Forward head and rounded shoulders make you look shorter, weaker and give you a weaker jawline in every photo. Ten minutes a day fixes it.', 'Gym → Posture'],
      ['Sleep', '7.5-9 hours. Short sleep shows within a day as puffiness, dark circles and dull skin, and people rate it as less attractive.', 'Mind → Morning & Night'],
    ],
  },
  {
    tier: 'Tier 2 — the details people notice', tag: 'What separates "fine" from "sharp"', items: [
      ['Brows', 'Tidy the unibrow and strays, keep the natural shape. Full, groomed brows frame the eyes.', 'Face, Hair & Style → Groom'],
      ['Beard or stubble', 'Stubble at 3-5mm suits most faces and sharpens the jaw; a clean neckline is what makes it look intentional.', 'Groom'],
      ['Teeth', 'Electric brush, floss, whitening strips 2-3 times a year, hygienist twice a year. A white, straight smile is one of the most-noticed features.', 'Face → Lips, teeth and smile'],
      ['Clothes that fit', 'At 6ft 4, tall ranges or tailoring. Fit beats brand; a fitted tee makes a trained body visible.', 'Style'],
      ['Neck and shoulders', 'A trained neck and capped shoulders frame the face and make the head look proportionate.', 'Face → Neck · Gym'],
      ['Hair health', 'Thick-looking hair comes from the right products, a blow-dryer and acting early on any thinning.', 'Hair'],
    ],
  },
  {
    tier: 'Tier 3 — the fine-tuning', tag: 'Small, stacking gains', items: [
      ['Colouring', 'Carotenoid-rich food for a warmer tone, self-tan over sunbeds, darker defined brows for contrast.', 'Face → Colouring'],
      ['De-puffing', 'Lower salt and alcohol, water, cold water and the 4-minute fascia massage before photos and nights out.', 'Face → Fascia · Body & Habits'],
      ['Under-chin and jaw', 'Get leaner, fix forward head posture, keep your tongue up. Know what is genetic.', 'Face → Hyoid'],
      ['Eyes', 'Sleep, cold in the morning, retinol eye cream at night.', 'Face → Eyes'],
      ['Smell', 'One good signature fragrance, applied properly. People remember it.', 'Fragrance'],
      ['Photos', 'Rear camera, slightly above eye level, natural light, chin a touch forward and down.', 'Style → Photos'],
    ],
  },
];

export const LOOKS_SCHEDULE: [string, string][] = [
  ['Every morning (5 min)', 'Cold water on the face, gentle cleanse, vitamin C or niacinamide, moisturiser, SPF 30-50. Chin tucks while it sinks in. Style hair with the blow-dryer and a matte product.'],
  ['Every night (5 min)', 'Cleanse properly (twice if you wore SPF), your active (retinol or BHA on alternate nights), moisturiser, lip balm. Phone out of the bedroom, 7.5+ hours.'],
  ['Every day', 'Posture routine, protein target, 3L water, colourful veg, a progress photo for 90 Hard. Tongue on the roof of your mouth.'],
  ['Every week', 'Beard and neckline trim, brow strays, exfoliate once, wash and change your pillowcase, nails. Minoxidil and microneedling if you are on them.'],
  ['Every 3-4 weeks', 'Haircut. Book the next one before you leave the chair.'],
  ['Every 3 months', 'Same-light photos of face, hairline and crown to check for change. Rerun the J.A.R.V.I.S. scan.'],
  ['Every 6 months', 'Dentist and hygienist. Whitening top-up. Replace the razor and electric-brush heads.'],
];

export const LOOKS_MEDICAL: [string, string][] = [
  ['Acne that will not clear', 'After 8-12 weeks of a proper routine, see a GP or dermatologist: prescription topicals, antibiotics, or isotretinoin for persistent acne. Do not suffer for years with something that is treatable.'],
  ['Tretinoin', 'The strongest-evidence anti-ageing and acne topical — prescription only in the UK (GP or online dermatology service). Start slowly; it irritates at first.'],
  ['Hair loss', 'Finasteride (prescription) and minoxidil are the evidence-backed pair — talk to a GP or online clinic about side effects before starting. Start at the first sign; it keeps hair far better than it regrows it.'],
  ['Teeth', 'In the UK only dentists can legally use whitening stronger than 0.1% hydrogen peroxide — over-the-counter strips are weak, dentist whitening is the real thing. Clear aligners if your teeth are crooked.'],
  ['Laser hair removal', 'For a unibrow, neck hair or back. A few sessions, long-lasting. Use a medically supervised clinic.'],
  ['Fillers and surgery', 'Leave them until your mid-20s at least: your face is still changing, and most of what they fix comes from leanness, skin and grooming first. Only ever with a GMC-registered doctor.'],
];

export const LOOKS_IGNORE: string[] = [
  'Bone smashing, "hunter eye" tricks, eyelid tape — useless to dangerous.',
  'Jawline trainers and chewing gadgets that load the jaw joint — masseter growth from hard gum is modest and can cause TMJ pain.',
  'Most supplements sold for skin or hair — fix diet, sleep and actual deficiencies (test iron, vitamin D) instead.',
  'Sunbeds — a proven skin cancer risk and the fastest way to age your face.',
  'Comparing yourself to filtered photos — real faces have pores, asymmetry and texture.',
];

/* ---------------- Hair, in depth ---------------- */

export const HAIR_DEPTH: { title: string; tag: string; items: [string, string][] }[] = [
  {
    title: 'Make it look thicker', tag: 'Volume is mostly technique', items: [
      ['Blow-dry it', 'Rough-dry on medium heat, lifting at the roots in the direction you want it to sit, then finish on cool to set. This alone doubles the volume.'],
      ['Pre-styler', 'Sea-salt spray or a volumising mousse on damp hair before the blow-dry.'],
      ['Matte products only', 'Matte clay or paste, a pea-sized amount, worked from the back forward. Gels, waxes and shiny pomades clump hair and show the scalp.'],
      ['Shorter sides, texture on top', 'A taper makes the top look denser; ask the barber to point-cut or texturise the top rather than thinning it out.'],
      ['Do not over-wash', 'Daily shampooing strips oils and makes hair flat and frizzy. 2-4 times a week, conditioner every time.'],
    ],
  },
  {
    title: 'Products by hair type', tag: 'What to actually buy', items: [
      ['Straight and fine', 'Sea-salt spray + matte clay. Avoid heavy creams — they weigh it down.'],
      ['Thick and straight', 'Matte paste or fibre for hold; a texturising spray to stop it looking helmet-like.'],
      ['Wavy', 'Light curl cream or sea salt on damp hair, scrunch, air-dry or diffuse. Finish with a little light paste.'],
      ['Curly', 'Leave-in conditioner and curl cream, no brushing when dry, a diffuser on low. Wash less, condition more.'],
      ['Any type', 'A heat protectant if you blow-dry daily, and a ketoconazole or zinc shampoo if you get flakes.'],
    ],
  },
  {
    title: 'Hair health from the inside', tag: 'Hair is built from what you eat', items: [
      ['Protein', 'Hair is protein. Under-eating protein shows as thin, brittle hair within months — your diet plan already covers it.'],
      ['Iron and vitamin D', 'Low ferritin and low vitamin D are common causes of shedding. A GP blood test is free if you notice thinning; supplement only if you are low.'],
      ['Stress and crash diets', 'Big stress or rapid weight loss can trigger heavy shedding 2-3 months later (telogen effluvium). It usually recovers once the cause stops.'],
      ['Heat and pulling', 'Very hot tools, bleaching and tight styles damage hair and can pull the hairline back. Go easy on all three.'],
    ],
  },
  {
    title: 'Hair loss — the full playbook', tag: 'Act at the first sign', items: [
      ['How to tell', 'Compare same-light photos every 3 months: temples receding into an M, a widening parting or a visible crown. Some temple recession in your late teens and twenties is a normal "mature hairline"; ongoing change is not.'],
      ['Minoxidil', '5% foam or solution on the scalp, once or twice a day. Expect extra shedding in months 1-3 (it is old hairs making way), results at 6-12 months. It only works while you use it.'],
      ['Finasteride', '1mg daily, prescription only — the most effective medication for male-pattern loss. A small minority get side effects; discuss with a GP or online clinic and stop if you do.'],
      ['Ketoconazole 2% shampoo', 'Twice a week, left on for 3-5 minutes. Cheap, mildly helpful, and clears flakes.'],
      ['Microneedling', 'A 1-1.5mm derma-roller or pen once a week alongside minoxidil has good evidence. Not on the same night as minoxidil.'],
      ['Hide it well meanwhile', 'Shorter sides, textured top, matte product, a fringe or French crop over thinning temples. Going short and confident looks far better than holding on to thin length.'],
      ['Transplants', 'Only once loss has stabilised (usually late 20s+) and with a reputable surgeon — and you still need medication to keep the rest.'],
    ],
  },
  {
    title: 'Beard growth', tag: 'If it is patchy', items: [
      ['Give it time', 'Grow it untouched for 6-8 weeks before judging — patches often fill in. Facial hair keeps developing into your mid-20s.'],
      ['Shape around the gaps', 'A short boxed stubble hides patches better than a long beard.'],
      ['Minoxidil for beard', 'Some men use it off-label with modest results after 6-12 months. Irritation is common; patch test first.'],
    ],
  },
];
