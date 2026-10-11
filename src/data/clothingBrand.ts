/*
 * Money → Clothing Brand: the step-by-step from idea to first drop.
 * UK-specific where it matters (trademarks, labelling, consumer law).
 * Costs are rough 2025-26 ranges — get real quotes before committing.
 */

export interface BrandGroup { title: string; tag: string; items: [string, string][] }

export const BRAND_STEPS: [string, string][] = [
  ['1 · Brand', 'Who it is for, what it stands for, the name — checked and available.'],
  ['2 · Logo', 'Sketch, vectorise, test small and embroidered, lock the files.'],
  ['3 · Product', 'One hero piece: reference garment, flats, tech pack.'],
  ['4 · Samples', 'Prototype → fit → pre-production. Never skip.'],
  ['5 · Audience', 'Build the waitlist while the samples are being made.'],
  ['6 · Drop', 'Small run or pre-order, real photos, launch day, reinvest.'],
];

export const BRAND_GUIDE: BrandGroup[] = [
  {
    title: 'Step 1 — The brand before the clothes', tag: 'Who it is for and what it stands for', items: [
      ['Pick one person', 'Write a paragraph about the exact customer: age, what they do, where they train, who they follow, what they want to look and feel like. "Lads 18-25 who train and play football and want to look athletic, not like a gym bro." Every decision gets checked against this person.'],
      ['Three brand words', 'Three adjectives the brand must always feel like — e.g. disciplined, understated, athletic. If a design, photo or caption does not fit all three, it does not go out.'],
      ['The belief', 'One sentence the brand stands for, written plainly: "Built for people who train when nobody is watching." This is what people actually buy into; the logo is just the badge.'],
      ['Study the competition', 'Screenshot ten brands in your space and note price, fabric, logo style, photo style and what their comments say people love and hate. Find the gap — usually a price point, a fit, or a community nobody is speaking to.'],
      ['Moodboard', 'A Pinterest board or Figma page: 30-50 images of colours, fits, fonts, photography and textures that feel like the brand. It keeps every later decision consistent, and it is the brief you give a designer or manufacturer.'],
      ['The name', 'Short, easy to say and spell, no meaning clash in other languages. Then check it is free: the .com or .co.uk domain, the Instagram and TikTok handle, Companies House, and — most important — the UK IPO trademark search for class 25 (clothing). Do not fall in love with a name until it passes all of these.'],
    ],
  },
  {
    title: 'Step 2 — Making the logo', tag: 'Simple enough to embroider on a cap at 5cm', items: [
      ['What a clothing logo has to do', 'Work in one colour, at tiny sizes (a 2cm chest print, a 16px Instagram icon) and as embroidery, where fine lines and small gaps fill in. If it needs a gradient, thin lines or lots of detail, it fails on product.'],
      ['The four types', 'Wordmark (the name in a distinctive font — e.g. most streetwear), lettermark (initials), symbol (an icon on its own) and combination (icon plus name). Start with a strong wordmark plus a simple symbol — you get a version for every placement.'],
      ['Sketch 50 before you open a computer', 'Pen and paper, fast and ugly: 50 small thumbnails in an hour. Most will be bad; that is the point. Circle the best five, then pick three to develop.'],
      ['Vectorise it', 'Redraw the chosen three as vectors — Figma (free), Inkscape (free) or Illustrator. Vectors scale to any size without blurring and are what printers and embroiderers need. Canva is fine for mockups but its stock elements cannot be trademarked as your logo.'],
      ['Fonts', 'Use a font with a commercial licence — Google Fonts are free for commercial use. Then customise it slightly (spacing, a cut, a joined letter) so it is genuinely yours and harder to copy.'],
      ['Test it properly', 'Black on white, white on black, shrunk to 1.5cm, on a cap and tee mockup, and at arm\'s length on your phone. Show it to five people in your target customer group and ask what it makes them think — not whether they like it.'],
      ['Hiring a designer', 'A good freelancer on Fiverr, Dribbble or Behance is roughly £100-500 for a logo. Give them your moodboard and brand words, and get in writing that copyright is assigned to you plus all files: SVG, PDF, transparent PNG, one-colour versions.'],
      ['AI logos', 'Useful for ideas, risky as the final logo: AI output can be close to existing marks and its ownership is legally unclear. Use it to explore, then have it redrawn by hand.'],
      ['Lock the files', 'Final pack: full logo, symbol only, wordmark only, each in black, white and brand colour, as SVG and PNG; plus your colour codes (HEX for screens, Pantone for fabric and thread). This is your brand kit for every supplier.'],
    ],
  },
  {
    title: 'Protecting it — trademark and company', tag: 'Do it before you spend on stock', items: [
      ['Search first', 'UK IPO trademark search for your name and logo in class 25 (clothing), plus class 35 if you will run a store and class 18 for bags. Also check the EU and US databases if you want to sell there later.'],
      ['File the trademark', 'Apply online at the UK IPO — about £170 for one class and £50 per extra class. It takes around 3-4 months if nobody opposes. Without it, someone can register your name and force you to stop using it.'],
      ['Sole trader or limited company', 'Start as a sole trader (simplest, register with HMRC once you are past the £1,000 trading allowance). Move to a Ltd company once profits grow or you want to separate personal risk — see the Tax tab.'],
    ],
  },
  {
    title: 'Step 3 — Designing the actual garment', tag: 'From an idea to something a factory can make', items: [
      ['Start from a garment you love', 'Find a tee, hoodie or short set whose fit is exactly right. Measure it flat — it becomes your "reference sample", and you can send it to the manufacturer. This is far more reliable than describing a fit in words.'],
      ['Draw technical flats', 'Front and back line drawings, no shading, like a blueprint — seams, pockets, cuffs, zip, logo placement. Use free Figma or Illustrator flat templates rather than drawing from scratch.'],
      ['Choose the fabric', 'Heavyweight tee 220-280gsm cotton. Hoodie and joggers 350-450gsm loopback or brushed fleece. Activewear 200-280gsm nylon or polyester with 15-25% elastane — ask for squat-proof (opaque when stretched) and four-way stretch. GSM is the weight per square metre: higher feels more premium.'],
      ['Colour', 'Pick colours from a Pantone TCX swatch, not a screen — screens lie. Give the code for the fabric and for the print or thread. Start with black or one neutral; they sell most and hide manufacturing flaws.'],
      ['How the logo goes on', 'Screen print: best from about 50 units, sharp and durable, priced per colour. DTG: full colour for small runs, less durable. DTF transfers: flexible and cheap for small batches. Embroidery: premium, best for caps and small chest logos, priced by stitch count. Activewear: silicone or reflective heat transfers that stretch with the fabric. Puff print for raised streetwear graphics.'],
      ['Placement in centimetres', 'Specify every logo exactly: "Left chest, 9cm wide, 18cm down from the shoulder seam, 10cm from centre front." Vague placement is the most common sample mistake.'],
      ['Trims and labels', 'Zips (YKK is the standard), drawcords and their tips, woven neck label, size tags, a printed or woven care label, swing tag, and polybag or branded packaging. These are what make a printed blank feel like a brand.'],
      ['The legal label', 'UK law requires a fibre composition label (e.g. "95% cotton, 5% elastane"). Care symbols are expected, and include your brand name and a size. Your manufacturer can add all of this — but you must specify it.'],
    ],
  },
  {
    title: 'The tech pack', tag: 'The document that gets you the product you imagined', items: [
      ['What it is', 'A PDF that tells the factory exactly what to make. No tech pack means they guess, and their guess is never what was in your head.'],
      ['Page 1 — overview', 'Style name and code, season, flats front and back, fabric, colourways, and your logo placement drawings.'],
      ['Page 2 — measurements', 'A spec sheet of every point of measure (chest width, body length, sleeve length, waist, hip, inseam, rise, hem) for each size, with a tolerance like ±1cm. Base it on your reference garment.'],
      ['Page 3 — grading', 'How each size changes from the next — e.g. chest +4cm per size from S to XXL. Keep it consistent forever, or your sizing will drift between drops.'],
      ['Page 4 — materials and trims', 'Fabric composition and GSM, rib, thread colour, zip, drawcord, labels, packaging — every component with a code or colour. This is called the bill of materials.'],
      ['Page 5 — artwork', 'Each logo or graphic with exact size, placement, colours (Pantone), and decoration method.'],
      ['Making one', 'Free templates exist on Figma Community and Canva. A freelance tech pack designer costs roughly £50-200 per style and is worth it for your first product.'],
    ],
  },
  {
    title: 'Step 4 — Manufacturers and samples', tag: 'Three rounds of samples is normal', items: [
      ['Where to look', 'UK: Make It British and Sewport directories (higher price, small MOQs, fast). Portugal: premium jersey and knitwear. Turkey: good quality fleece and jersey at mid prices. Pakistan (Sialkot): strong in gymwear and activewear. China via Alibaba: widest choice — only "Verified" suppliers with Trade Assurance.'],
      ['Contact 5-10, shortlist 3', 'Send each one your tech pack and ask: MOQ per style and colour, sample cost and time, bulk unit price at 50/100/300, lead time, payment terms, and whether they source the fabric.'],
      ['The sample rounds', 'Prototype (is it the right idea?) → fit sample (try it on two or three different body types, wash it three times) → pre-production sample (exactly what bulk will be). Only sign off bulk against the PP sample. Each round takes 2-6 weeks.'],
      ['Red flags', 'No sample offered, pressure to pay everything upfront, prices far below everyone else, vague answers on fabric, or no real photos of their factory and previous work.'],
      ['Payment and protection', 'The norm is about 30% deposit and 70% before shipping. Use a written order that attaches the tech pack and the approved sample, and ask for photos or a video of the bulk before the final payment.'],
      ['Import costs', 'Shipping, import duty and VAT on goods from outside the UK can add 15-30% to your unit cost. Ask for a DDP quote (duties paid) or get a courier estimate before you calculate your price.'],
    ],
  },
  {
    title: 'Step 5 — Your first collection', tag: 'One hero product, done properly', items: [
      ['One product, two colours max', 'A heavyweight tee, a hoodie, a short set or a cap. Black plus one other colour. Prove it sells before adding anything.'],
      ['Order a sensible size curve', 'For 50 men\'s units, roughly S 8 · M 15 · L 15 · XL 9 · XXL 3. Most stock sits in M and L. Pre-orders tell you the real split.'],
      ['Mockups and votes', 'Put the designs on mockups (Placeit, Figma community templates) and let your followers vote on colours. It builds hype and tells you what to produce.'],
      ['Seed it', 'Give 10-20 pieces to people in your gym, football and padel circles who look the part and will post in it. Real people wearing it is your best marketing.'],
    ],
  },
  {
    title: 'Step 6 — The 12-week launch timeline', tag: 'From logo to first drop', items: [
      ['Weeks 1-2', 'Brand doc, moodboard, name checked, logo sketched and vectorised. Trademark search, then file.'],
      ['Weeks 3-4', 'Reference garment, flats, tech pack. Contact manufacturers and order prototypes. Start posting your training and the build-up — "building a brand" content performs well.'],
      ['Weeks 5-8', 'Fit samples and corrections. Shopify store, size guide with real measurements, returns policy. Waitlist page (email and SMS) and start collecting sign-ups.'],
      ['Weeks 9-10', 'PP sample approved, bulk or pre-order production starts. Photoshoot: real people, natural light, in motion — gym, pitch, street.'],
      ['Weeks 11-12', 'Teasers every day for a week, waitlist gets early access 24 hours before everyone, drop goes live at a set time. Post every order you pack.'],
      ['After the drop', 'Look at what sold out, what got returned and why, and what people asked for. Reinvest the profit into the next drop — not new equipment or ads you cannot measure.'],
    ],
  },
  {
    title: 'Selling online — the legal basics', tag: 'UK distance-selling rules', items: [
      ['Right to cancel', 'Online customers can cancel within 14 days of receiving the item, and you must refund within 14 days of getting it back. You can ask them to pay return postage if you say so clearly beforehand.'],
      ['Faulty goods', 'Faulty items must be refunded, repaired or replaced regardless of your returns policy.'],
      ['Your website must show', 'Business name and contact address, prices including VAT if registered, delivery costs and times, and your returns policy. Plus a privacy policy if you collect emails.'],
      ['Selling to the EU', 'Extra product safety and labelling rules apply. Start with the UK only.'],
    ],
  },
];
