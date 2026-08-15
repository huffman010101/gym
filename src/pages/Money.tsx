import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Banknote, TrendingUp, Laptop, Rocket, AlertTriangle, ChevronDown, Brain } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DailyHabits from '../components/DailyHabits';

type Tab = 'skills' | 'online' | 'launch' | 'invest' | 'trading' | 'tax' | 'econ' | 'mindset';

const TABS: { id: Tab; label: string }[] = [
  { id: 'skills', label: 'Skills' },
  { id: 'online', label: 'Online Income' },
  { id: 'launch', label: 'Launch a Business' },
  { id: 'invest', label: 'Investing' },
  { id: 'trading', label: 'Trading' },
  { id: 'tax', label: 'Tax' },
  { id: 'econ', label: 'Economics' },
  { id: 'mindset', label: 'Money Rules' },
];

function Block({ title, items, accent = 'text-yellow-300' }: { title: string; items: [string, string][]; accent?: string }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
      <h3 className={`font-bold mb-3 ${accent}`}>{title}</h3>
      <div className="space-y-3">
        {items.map(([t, d]) => (
          <div key={t}>
            <p className="font-semibold text-sm text-gray-200">{t}</p>
            <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Fold({ title, tag, items }: { title: string; tag: string; items: [string, string][] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{title}</p>
          <p className="text-xs text-yellow-400/70 mt-0.5">{tag}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-5 pb-5 space-y-3">
            {items.map(([t, d]) => (
              <div key={t}>
                <p className="font-semibold text-sm text-gray-200">{t}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Money() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = params.get('tab');
    return (['skills', 'online', 'launch', 'invest', 'trading', 'tax', 'econ', 'mindset'] as const).includes(t as Tab) ? (t as Tab) : 'skills';
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-yellow-950/30 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-yellow-500/10 rounded-xl flex items-center justify-center">
            <Banknote className="text-yellow-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Money</h1>
            <p className="text-gray-500 text-sm">Skills · Online Income · Trading · Wealth Rules</p>
          </div>
        </div>

        <DailyHabits section="money" />

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-6 -mx-5 px-5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== SKILLS ===== */}
        {tab === 'skills' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Rocket size={16} className="text-yellow-400" /> The Formula</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Pick ONE skill below → 2 focused hours a day for 90 days (all free to learn on YouTube) → do 3-5 free/cheap jobs
                for proof → charge properly → raise prices every 3 clients. Every path below is this same loop.
                The killer is switching skills every two weeks — pick one lane and stay in it for a quarter.
              </p>
            </div>
            <Fold title="Video Editing" tag="Fastest to first money — weeks not months" items={[
              ['Why it prints', 'Every creator, business, and podcast needs shorts/reels edited. Demand massively outstrips editors who understand pacing and hooks.'],
              ['Learn', 'CapCut (free) → DaVinci Resolve (free, pro-grade). Study why viral clips retain: cuts every 1-3s, captions, sound design, the first-second hook.'],
              ['Get paid', 'Edit 5 sample clips from a creator\'s long-form content unasked, DM them the finished work. Close 1 in 20 and you have a £300-1500/month client. Stack 3 clients.'],
            ]} />
            <Fold title="Copywriting & Sales Writing" tag="Words that sell = always in demand" items={[
              ['Why it prints', 'Every business needs ads, emails, landing pages. Good copy is directly measurable in sales, so good copywriters get paid a % of the results.'],
              ['Learn', 'Read "Ca$hvertising" and study every ad you see: what\'s the hook, the pain point, the offer, the CTA? Rewrite bad ads you find, daily, as practice.'],
              ['Get paid', 'Pick a niche (gyms, barbers, e-com brands). Rewrite one of their emails/ads free, send it over, offer 5 more paid. Email sequences alone are a £500-2k/month retainer skill.'],
            ]} />
            <Fold title="Coding & AI Apps" tag="Highest ceiling, slower start" items={[
              ['Why it prints', 'Software salaries are top-tier, and AI tools now let one person build what took teams. Freelance web dev for local businesses is the entry point.'],
              ['Learn', 'HTML/CSS/JS → React (free: The Odin Project, freeCodeCamp). Then learn to build WITH AI tools — you\'re living proof, this app was built with one.'],
              ['Get paid', 'Local business websites £300-800 each while learning. Then SaaS/apps, then a job or contract work at £300-600/day.'],
            ]} />
            <Fold title="Sales & Closing" tag="No product needed — sell other people's" items={[
              ['Why it prints', 'Commission closers on high-ticket offers (coaching, agencies, solar, property) take 10-20% per deal. Top closers out-earn doctors with no degree.'],
              ['Learn', 'It\'s the Mind section applied: tonality, listening, objection handling. Watch sales call breakdowns, practise on anything — sell your mates on a film tonight.'],
              ['Get paid', 'Start with door-to-door or phone sales jobs (brutal, best training on earth), then remote closing gigs — companies hire proven closers off performance, not CVs.'],
            ]} />
            <Fold title="Content Creation" tag="Slowest, biggest compounding asset" items={[
              ['Why it prints', 'An audience is leverage for EVERYTHING: brand deals, your own products, any business you start later. It compounds like nothing else.'],
              ['The niche formula', 'Document what you\'re already doing (training, glow-up, football, building income) rather than performing expertise you don\'t have. Progress content > guru content.'],
              ['Get paid', 'Monetisation follows attention: creator funds, brand deals, affiliate, then your own product. Post daily for 6 months before judging results.'],
            ]} />
            <Fold title="Trades & Physical Skills" tag="Underrated — six figures, no laptop" items={[
              ['Why it prints', 'Electricians, plumbers, barbers, PTs — scarce, unautomatable, cash-flowing. A barber at £25/cut doing 10 cuts a day out-earns most office juniors.'],
              ['The stack', 'Trade skill + social media (before/after content) + basic sales = own business within 2-3 years, not employee wages.'],
              ['Fits your life', 'Personal training certification is a natural one given the gym knowledge you\'re already building.'],
            ]} />
          </div>
        )}

        {/* ===== ONLINE INCOME ===== */}
        {tab === 'online' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Freelancing (the reliable one)" items={[
              ['The platforms are the start, not the end', 'Fiverr/Upwork for first reviews, then move clients off-platform. Real money is in direct outreach: 20 personalised DMs/emails a day to businesses in one niche.'],
              ['Niche down hard', '"Video editor" competes with the planet. "Short-form editor for fitness coaches" owns a lane. Riches are in niches.'],
              ['Proof beats promises', 'One strong portfolio piece (even made-up spec work) outperforms any bio. Do the work first, show it, then ask.'],
            ]} />
            <Block title="E-commerce & Flipping" items={[
              ['Start with flipping (zero risk)', 'Buy undervalued items locally (Facebook Marketplace, car boots, Vinted) → clean, photograph well, relist. Trainers, gym equipment, tech. Teaches sourcing, pricing, and sales with £50 starting capital.'],
              ['Dropshipping — the honest version', 'It works but it\'s a real business: product research, paid ads, customer service. 9 in 10 quit at the first failed product. Budget to test 5-10 products before one hits, or don\'t start.'],
              ['Print-on-demand / digital products', 'Designs, templates, presets — make once, sell forever. Slow but zero inventory and stacks with a content audience.'],
            ]} />
            <Block title="The Agency Path (skill → business)" items={[
              ['Step 1: do the skill yourself', 'Editing, ads, web design — whatever you picked in Skills. Get to 3-4 clients solo.'],
              ['Step 2: productise', 'Fixed packages ("15 shorts/month for £750") beat hourly. Predictable for them, scalable for you.'],
              ['Step 3: hire and multiply', 'Train someone to deliver at half your rate, you handle sales and quality. This is how freelancers become £10k/month agencies.'],
            ]} />
            <Block title="Building a Real Social Media Presence" items={[
              ['Pick one platform, one niche, one format', 'E.g. TikTok/Reels + your glow-up/training journey + talking-to-camera clips. Mastering one combination beats dabbling in five. Expand only after the first works.'],
              ['Document, don\'t perform', 'Your transformation using this exact system (physique, style, football, business attempts) IS the content. Progress content builds trust no guru act can fake — and you\'re making it anyway.'],
              ['The hook is 80% of the video', 'First 1.5 seconds decides everything: a bold claim, a question, a visual jump. Write 5 hooks per video, pick the best. Study why the videos YOU watch to the end hooked you.'],
              ['Volume through the silence', '1 post/day (or 4-5/week) for 6 months. The first 100 videos are practice the algorithm barely shows anyone — the skill they build is what makes video 101 hit.'],
              ['Engagement is content too', 'Reply to every comment early on, comment genuinely on bigger accounts in your niche daily. Community grows accounts; broadcasting alone doesn\'t.'],
              ['Read the data weekly', 'Watch time and shares > likes. Double down on whatever your top 20% have in common — format, topic, hook style. The audience tells you what to make; listen.'],
              ['Monetise in order', 'Attention → trust → money. Creator funds first (pennies), then affiliates/brand deals (~5-10k engaged followers), then your own offer (coaching, editing, products) — that\'s where the real income is.'],
            ]} />
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Filter for scams: anyone selling a course promising fast money makes their money from the course, not the method.
                Free YouTube + doing the work beats every £997 course. If it needs you to recruit others to earn — it's an MLM, run.
              </p>
            </div>
          </div>
        )}

        {/* ===== LAUNCH ===== */}
        {tab === 'launch' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Rocket size={16} className="text-yellow-400" /> From Zero to First Business — the full guide</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Everything below is the actual sequence: pick → validate → plan → register → sell → grow. Most first businesses
                die from step-skipping (building for months before checking anyone will pay) — follow the order.
              </p>
            </div>
            <Fold title="Step 1 — Pick the Right First Business" tag="Boring beats brilliant for business #1" items={[
              ['The first-business filter', 'Low startup cost (under £500), sells a service not a product (services need no inventory or manufacturing), you can deliver it with skills from the Skills tab, customers are reachable by you directly.'],
              ['Best first businesses at uni', 'Freelance service (editing/design/web) → agency · fitness coaching · tutoring your strong subjects (£25-40/h!) · reselling/flipping · content-based (slow but compounds) · events/promotions at uni.'],
              ['The idea myth', 'You don\'t need a new idea — you need an existing service delivered better/faster/to a niche nobody serves properly. Competition proves the market exists.'],
              ['Match it to your unfair advantage', 'What do you have that\'s rare? Gym knowledge, football, your uni network, your age (young = native at content/AI tools that businesses pay for).'],
            ]} />
            <Fold title="Step 2 — Validate Before You Build" tag="One week, not one year" items={[
              ['The pre-sell test', 'Describe the offer to 10 real potential customers. Ask: "would you pay £X for this?" then crucially: "can I take a deposit / booking now?" Verbal yes = polite; money = validation.'],
              ['Do it manually first', 'Deliver the service yourself to 3 people (free or cheap) before building anything — website, logo, name all come AFTER someone has paid. A logo is procrastination in disguise.'],
              ['Define the niche painfully tight', '"Video editing for anyone" = invisible. "Short-form editing for fitness coaches in London" = the only choice for that person. You can widen later from success.'],
            ]} />
            <Fold title="Step 3 — The One-Page Business Plan" tag="Fill these 9 boxes and you have a plan" items={[
              ['1. Problem', 'What pain do customers have? (e.g. "coaches film content but never edit or post it")'],
              ['2. Customer', 'Exactly who — job, age, where they hang out online, what they earn.'],
              ['3. Offer', 'What they get, delivered how, in what timeframe. Make it a package: "15 edited shorts per month".'],
              ['4. Price', 'Start = market rate. Raise every 3 clients. Price on value to them (a client worth £2k/month to them can pay £500), not your hours.'],
              ['5. Reach', 'The ONE channel you\'ll master first: DMs, content, referrals, flyers, uni societies. One done hard beats five done weakly.'],
              ['6. Costs', 'List everything monthly: tools, subscriptions, materials, ads. Keep under £100/month at the start.'],
              ['7. Numbers', 'Break-even = costs ÷ price. Then: how many clients to hit £1k/month? Write the actual number — it\'s usually smaller than you think (4 clients × £250).'],
              ['8. Week one actions', 'The first 5 concrete moves (make portfolio piece, list 30 prospects, send 10 DMs…). A plan without a week-one list is a wish.'],
              ['9. Kill/scale criteria', 'Decide NOW: "if no paying customer in 6 weeks of real effort, I change the offer/niche" and "at 5 clients I raise prices / hire help". Pre-made decisions beat emotional ones.'],
            ]} />
            <Fold title="Step 4 — Make It Legal (UK, simple version)" tag="30 minutes of admin, not a law degree" items={[
              ['Sole trader first', 'Register as self-employed with HMRC (free, online, 20 min) once you\'re earning. Under £1,000/year trading income needs no registration at all (trading allowance).'],
              ['Tax reality', 'You pay income tax on PROFIT (revenue minus expenses) above your personal allowance (~£12.5k). Save 25-30% of profit in a separate account for the tax bill; file Self Assessment by 31 Jan.'],
              ['Track from day one', 'Spreadsheet or free software: date, client, amount in, expenses out. 10 minutes a week saves January panic.'],
              ['Limited company later', 'Worth it around £30-50k+ profit or when clients require it — not before. Don\'t pay for company formation you don\'t need yet.'],
              ['Get paid properly', 'Invoice template (free), payment by bank transfer/Stripe, 50% deposit upfront for project work. Deposits filter unserious clients AND fund the work.'],
            ]} />
            <Fold title="Step 5 — First Customers → Growth Loop" tag="Where it becomes real" items={[
              ['The outreach engine', '20 personalised contacts/day into your niche (DM/email: one specific compliment or observation about THEIR business + one clear offer + proof). Expect 1 client per 100-300 contacts at first — that\'s normal, not failure.'],
              ['Overdeliver the first five', 'First clients = your case studies, testimonials, referrals and reviews. Treat a £100 job like a £1,000 one — the second five clients come from the first five.'],
              ['Ask for the referral', '"Who else do you know who needs this?" at the moment they\'re happiest (delivery day). Referred customers close 4× easier.'],
              ['Systemise then scale', 'Write down your delivery process → templatise → raise prices → productise into packages → (much later) hire delivery help. Each step only after the previous is boring-reliable.'],
            ]} />
            <Fold title="The Millionaire Roadmap" tag="The honest 10-year version" items={[
              ['The equation', 'Wealth = (income − lifestyle) × investment returns × time. Millionaires are made by all four levers, and the biggest early lever is INCOME — a 22-year-old saving £200/month never catches a 24-year-old earning £2k/month more.'],
              ['Phase 1 (now-2 yrs): build the earner', 'One high-income skill to £2-5k/month (Skills tab) + degree as backup + tiny living costs while young. Net worth barely moves — earning power moves massively. This phase decides everything.'],
              ['Phase 2 (2-5 yrs): own something', 'Employee/freelancer income has a ceiling; OWNERSHIP doesn\'t. Turn the skill into an agency/product/business with revenue not tied to your hours. Invest 20%+ of everything into index funds on autopilot the whole time.'],
              ['Phase 3 (5-10 yrs): compound', 'Business profits + investments + possibly property. £3k/month invested at ~8% = £1M in ~15 years; a business sale or scale can collapse that timeline to 5-7. Boring consistency is the whole trick.'],
              ['What the data says about real millionaires', 'Most are made in unglamorous businesses (trades, agencies, logistics, B2B services) + decades of index investing. Almost none from day trading, crypto punts, or dropshipping courses. The flashy paths are lottery tickets; the boring path is a conveyor belt.'],
              ['The behaviours that actually correlate', 'Live below your means while income grows · never carry consumer debt · automate investing · stay married to the process for a decade · avoid the two wealth-killers: lifestyle inflation and starting over every 6 months.'],
            ]} />
            <Fold title="Starting an Activewear Brand" tag="Short sets · tracksuits · hats — the real path" items={[
              ['The honest reality first', 'Clothing is a brutal, crowded market with real upfront cost and real inventory risk. What actually sells is not "nice designs" — it is a BRAND people want to belong to. Gymshark started as a teenager screen-printing in a garage with an audience built first. The audience is the moat; the clothes are the product.'],
              ['Build the audience BEFORE the stock', 'This is the single biggest lever and where most people get it backwards. Document your training, your physique journey, your football — build 5-10k engaged followers who care what you wear. Then your first drop sells out to people who already trust you, instead of you begging strangers on ads.'],
              ['Start with ONE product, not a range', 'A short set OR a hat. Not both, not five colourways. One product proves the whole chain — supplier, quality, sizing, shipping, returns — with the least money at risk. Range expansion comes after something sells out.'],
              ['Hats are the smartest first product', 'Low unit cost (roughly £4-9), one-size-fits-all so no sizing nightmare, cheap to ship, high margin, and people wear them in photos which markets you for free. Embroidered 6-panel or trucker caps are the classic low-risk entry.'],
              ['Then short sets and tracksuits', 'Higher ticket and higher margin, but far harder: sizing across S-XXL, fabric weight and stretch matter enormously, and colour matching between top and bottom is where cheap manufacturers fail. Only attempt once a simpler product has proven your supply chain.'],
            ]} />
            <Fold title="Activewear — how to actually make the product" tag="From idea to physical stock" items={[
              ['Level 1 — Print on demand (zero risk, low margin)', 'Printful, Printify. They print and ship per order; you never hold stock. Margins are thin and quality is average, but it costs almost nothing to test whether ANYONE wants your brand. Perfect for validating designs before spending money.'],
              ['Level 2 — Blanks + custom decoration (the real starting point)', 'Buy quality blank garments (AS Colour, Stanley/Stella, Gildan for cheap) and get them screen-printed or embroidered locally. Roughly £8-15 all-in per unit, sell at £30-45. Order 25-50 units. This is where most credible small brands actually begin.'],
              ['Level 3 — Custom manufacturing (real brand territory)', 'Your own patterns, fabric, cut and labels via Alibaba, or manufacturers in Portugal, Turkey, China or Bangladesh. Minimum order quantities are typically 100-300 per style per colour. This is where quality becomes genuinely yours — and where you can lose thousands if you skip samples.'],
              ['ALWAYS order samples first', 'Non-negotiable. Get samples from 3-5 suppliers before any bulk order. Wash them, train in them, stretch them. Photos lie constantly, and the £100 you spend on samples is what stops a £3,000 mistake in unsellable stock.'],
              ['Fabric is what people feel', 'For activewear: fabric weight (GSM), stretch and recovery, and whether it goes see-through when stretched — the classic killer for squat-proof bottoms. Cheap poly that pills after three washes destroys a brand faster than bad design ever will.'],
              ['Get the labels right', 'Woven neck labels, hem tags, custom polybags. This is what separates "a printed blank" from a brand people will pay £45 for. Cheap to add at manufacture, near impossible to retrofit.'],
            ]} />
            <Fold title="Activewear — money, pricing & launch" tag="The numbers and the drop" items={[
              ['Realistic startup budget', '£500-1,500 gets you a genuine first run: samples (~£150), 50-100 units of one product (~£600-900), labels and packaging (~£100), plus a Shopify subscription. Under £500 is possible with print-on-demand but the margins barely justify it.'],
              ['Price at 3-5× your unit cost', 'Costs £10 to make, sell at £35-45. That margin is NOT greed — it has to absorb returns, damaged stock, free shipping, ad spend, and the units that never sell. Pricing at 2× is how clothing brands go broke while appearing busy.'],
              ['The drop model beats always-in-stock', 'Limited quantities, announced date, sells out. It creates urgency, means you never sit on dead stock, and gives you a repeatable event to market. It is also far kinder on cash flow than trying to keep every size live year-round.'],
              ['Pre-orders de-risk everything', 'Take orders BEFORE you manufacture. Customers fund the production run, and you learn exactly which sizes and colours to make. Be honest about the delivery window — late pre-orders with no communication kill new brands.'],
              ['Store setup', 'Shopify (~£25/month) is the default and worth it. A clean product page with real photos on real people, honest sizing guide with actual measurements, and a plain returns policy. Sizing confusion is the number one cause of returns.'],
              ['Photos are the entire product online', 'Nobody can feel your fabric — they judge on photos alone. Real people, natural light, in motion, in a gym or on a pitch. Your training content is already this. Bad photos will sink genuinely good product.'],
              ['UK admin', 'Register as a sole trader with HMRC once past the £1,000 trading allowance (see the Tax tab). VAT registration is only required above the threshold, so ignore it early. Check the customs and import duty on overseas manufacturing — it catches people out badly on the first shipment.'],
            ]} />
            <Fold title="Activewear — why most brands die" tag="Learn these for free" items={[
              ['They ordered 500 units of 5 products first', 'All the cash gone before knowing whether anyone wanted it. One product, small run, prove demand, reinvest. Boring, and it is the only version that survives.'],
              ['They built a brand with no audience', 'A logo and a Shopify store is not a business. Without attention, you are paying ads to strangers with zero trust — the most expensive way possible to sell clothing.'],
              ['They competed on price', 'You cannot out-cheap Shein or Amazon. Compete on identity, community and quality. People buy activewear to signal who they are, not because it was the cheapest.'],
              ['Sizing chaos', 'Inconsistent sizing between runs causes mass returns and destroys trust permanently. Measure every sample, publish exact measurements, keep it identical across drops.'],
              ['They quit after drop one', 'The first drop rarely sells out. Brands are built over years of consistent posting, iterating on product, and slowly growing a following. Treat drop one as tuition, not a verdict.'],
              ['Your unfair advantage', 'You genuinely train — gym, football, Muay Thai, padel. You can test product in real conditions and speak credibly to people who do the same. That authenticity is exactly what the huge faceless brands cannot manufacture.'],
            ]} />
            <Fold title="Becoming a Model" tag="The real industry playbook" items={[
              ['The honest requirements', 'Fashion/runway has hard filters (typically 6\'0"-6\'3" for men, specific measurements). BUT commercial, fitness, and social-media modelling care about look, physique, grid and reliability — far more open, and where most working models actually earn.'],
              ['Your build path is this app', 'Fitness modelling = the physique (Gym), the skin/grooming (Looks), the style (Style tab). 10-14% body fat, good posture, great skin photographs like a career.'],
              ['Digitals first', 'Agencies want simple unedited shots: plain wall, natural light, fitted plain clothes — front, profile, full length, relaxed smile + neutral. Phone camera is fine. NO filters, no sunglasses, no heavy grading.'],
              ['Apply properly, free', 'Every legitimate agency has an online application ("become a model" page) — submit digitals + stats to 10-20 agencies (in the UK: Select, Storm, IMG, Models 1, Nevs, plus commercial/fitness boards like W Athletic). Apply to ALL, let them filter.'],
              ['The scam filter', 'Real agencies NEVER charge upfront fees, "portfolio packages", or academy courses. They earn commission (~20%) when YOU earn. Anyone asking for money first is the business — you\'re the product they\'re selling to.'],
              ['Build leverage while waiting', 'A strong Instagram (Style tab\'s presence guide) with clean fitness/style content gets you scouted AND gives brands a reason to book you directly. Many working "models" now are physique + audience, no agency.'],
              ['Treat it as a side quest', 'Modelling income is lumpy and career length is short. It stacks beautifully on top of the degree + skill + business path — it should never replace them.'],
            ]} />
          </div>
        )}

        {/* ===== INVESTING ===== */}
        {tab === 'invest' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><TrendingUp size={16} className="text-yellow-400" /> Being Smart With Money — the whole thing in order</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Investing is the easy part — it is about six decisions total, then decades of leaving it alone.
                What separates people is doing them in the right ORDER. Work down this page top to bottom; do not skip
                to picking funds before the steps above it are done.
              </p>
            </div>
            <Block title="Step 0 — Do these BEFORE you invest a penny" items={[
              ['1. Kill high-interest debt first', 'Credit cards, overdrafts, buy-now-pay-later at 20-40% APR. Paying that off is a GUARANTEED 20-40% return — no investment on earth reliably beats that. Student loans are different (see Tax tab), don\'t rush those.'],
              ['2. Build a 3-month emergency fund', 'In an easy-access savings account, not invested. This is what stops you selling investments at the worst possible moment when your laptop dies or you lose income. Boring, and the reason most portfolios survive.'],
              ['3. Take the free money — employer pension match', 'If an employer matches pension contributions, contributing enough to get the full match is an instant 100% return. Nothing else comes close. Do this before any ISA investing.'],
              ['4. THEN invest', 'Only once the three above are done. Skipping to step 4 because investing feels exciting is the single most common mistake young investors make.'],
            ]} />
            <Fold title="What to actually invest in" tag="The honest answer is boring — that's why it works" items={[
              ['A global index fund — for most people this is the answer', 'One fund holding thousands of companies across the whole world (e.g. a FTSE Global All Cap or MSCI World tracker). Instant diversification, near-zero effort, and it has beaten the large majority of professional stock pickers over long periods. If you only ever buy one thing, this is it.'],
              ['S&P 500 tracker — the popular alternative', 'The 500 biggest US companies. Historically strong returns, but it is 100% one country. A global fund already holds these (the US is roughly 60-70% of a world tracker) with the rest of the planet included as well. Global is the more sensible default.'],
              ['Bonds — the shock absorber, not the engine', 'Loans to governments/companies paying fixed interest. Lower return, lower volatility. In your 20s with decades ahead, you need very little or none. Their job is protecting money you will need SOON, not growing it.'],
              ['Individual stocks — cap it at "fun money"', 'Picking single companies is a skill most professionals fail at. If you want to, keep it under 5-10% of your portfolio and treat losses as tuition. Never let it become the core.'],
              ['Property', 'Real but illiquid, concentrated in one asset, and needs a big deposit plus real running costs. It works, but it is a business, not a passive investment. Do not treat "get on the ladder" as automatically superior to investing — run the numbers.'],
              ['Crypto — speculation, not investing', 'Extremely volatile, minimal regulation, dense with scams. If you want exposure, cap it at a small percentage you can watch go to zero without it changing your life. It is not a retirement plan.'],
              ['What to avoid entirely', 'Anything with "guaranteed returns", anything a stranger DMs you, leveraged/inverse ETFs, actively managed funds charging over ~0.75%, and any product you cannot explain in one sentence.'],
            ]} />
            <Fold title="How to invest — the actual mechanics" tag="First investment, start to finish, UK" items={[
              ['1. Open a Stocks & Shares ISA', 'This is a wrapper, not an investment. Everything inside grows completely tax-free, forever, and you never declare it. £20,000 allowance per tax year (2026/27) across all ISA types combined. Low-fee providers: Vanguard, InvestEngine, Trading 212, AJ Bell, Hargreaves Lansdown.'],
              ['2. Pick ONE global index fund', 'Look for: "accumulation" (Acc) units, which reinvest dividends automatically, and an ongoing charge (OCF) under 0.25%. That is genuinely the entire selection criteria for a first investment.'],
              ['3. Set a monthly direct debit', 'Automate it for the day after payday so it leaves before you can spend it. Automation beats motivation — this single step is why some people build wealth and others intend to.'],
              ['4. Then do nothing', 'Do not check it daily. Do not switch funds because something else did better last year. The strategy IS leaving it alone. Rebalance once a year at most.'],
              ['Accumulation vs Income units', 'Acc reinvests dividends for you (best while building wealth). Inc pays them out as cash (useful when you eventually live off it). Pick Acc now.'],
              ['Lifetime ISA — worth knowing', 'If you are under 40 and saving for a FIRST home: the government adds 25% on up to £4,000/year, so £1,000 free per year. Huge. But withdrawing for anything other than a first home or age 60 carries a penalty that can leave you worse off. Only use it if the goal genuinely is a first home.'],
            ]} />
            <Fold title="When to invest" tag="The timing question, answered properly" items={[
              ['Time IN the market beats timing the market', 'Missing just the ~10 best days over a couple of decades can cut your total return dramatically — and those days cluster right after crashes, exactly when scared people are sitting in cash. Staying invested is the whole strategy.'],
              ['Invest as soon as you have the money', 'Statistically, investing a lump sum immediately beats drip-feeding it in about two thirds of the time, simply because markets rise more often than they fall. If a lump sum makes you anxious, splitting it over 3-6 months is a reasonable emotional compromise.'],
              ['Monthly automatic buying is the default', 'For regular income, buy every month regardless of price. You buy more units when cheap and fewer when expensive, and it removes emotion — the thing that actually destroys returns.'],
              ['Do not wait for a crash', 'People have waited years for a "better entry point" while the market ran away. The best time was earlier; the second best is now, mechanically, every month.'],
              ['What to do WHEN it crashes', 'Nothing. Keep buying. A 30-50% drop happens roughly once a decade and has always recovered given enough time. A crash while you are still buying is a discount, not a disaster. Selling is the only way to make a paper loss permanent.'],
              ['Only invest money you will not need for 5+ years', 'Short-term money belongs in savings. Markets can be down for several years running — never be forced to sell at the bottom.'],
            ]} />
            <Block title="Fees — the silent killer" items={[
              ['Why 1% matters enormously', 'A 1% annual fee versus 0.2% sounds trivial. Over 30 years on serious money it can cost you a very large fraction of your final pot, because you lose the fee AND all the growth that fee would have compounded into.'],
              ['The two fees to check', 'The fund\'s OCF (ongoing charge — aim under 0.25%) and the platform fee (aim under ~0.45%, some are flat-fee which is cheaper once your pot is large).'],
              ['Actively managed funds', 'Charge 5-10× more than index funds for the promise of beating the market, and the large majority fail to do so over long periods. You pay more for worse expected outcomes.'],
              ['Financial advisors', 'Can genuinely help with complex situations (big inheritance, business sale, retirement drawdown). For "put money into a global index fund monthly", a 1%/year advisor fee is not worth it.'],
            ]} />
            <Block title="How much, and what it becomes" items={[
              ['Aim for 15-20% of income invested', 'Start wherever you can — £50/month at 19 genuinely beats £500/month at 30 because of the extra decade of compounding. Raise the percentage every time your income rises.'],
              ['The real numbers', '£200/month at ~8% average: 10 yrs ≈ £36k · 20 yrs ≈ £118k · 30 yrs ≈ £298k — of which only £72k was ever your own deposits. The rest is compounding doing the work.'],
              ['Your income is still the biggest lever', 'At your stage, going from £500 to £2,000/month income (Skills tab) moves your future far more than optimising which fund you picked. Earn more, invest the difference, keep lifestyle flat.'],
              ['The first £10k is the hardest', 'Progress feels invisible early because your contributions dwarf the growth. Around £100k, growth starts outpacing what you put in. Push through the boring phase — that is the entire game.'],
            ]} />
            <Fold title="Investing 101 — from absolute zero" tag="The full beginner path, UK edition" items={[
              ['What a stock actually is', 'A share = a slice of a real company\'s profits and assets. You make money two ways: the price rising (growth) and dividends (profit paid out). You\'re buying businesses, not lottery tickets.'],
              ['What an index fund is and why it wins', 'One purchase = tiny slices of hundreds of companies (S&P 500 = 500 biggest US firms; a global tracker = the world). No picking winners, near-zero fees, and it has beaten ~90% of professional stock-pickers over 15-year periods. This is the vehicle.'],
              ['The account order (UK)', '1) Stocks & Shares ISA — £20k/year allowance, ALL gains tax-free forever, open with a low-fee broker (Vanguard, Trading 212, InvestEngine). 2) Employer pension with matching when you work — free money. 3) Only then anything else.'],
              ['Your first investment, concretely', 'Open ISA → pick ONE global index fund or S&P 500 fund (look for "accumulation" version, fees under 0.25%) → set an automatic monthly buy. That\'s genuinely it. Complexity is a fee-generating illusion.'],
              ['Crashes are features, not bugs', 'The market drops 30-50% every decade or so. Sellers lock in the loss; buyers get the discount. Automate the monthly buy and never check during crashes — boring wins.'],
            ]} />
            <Fold title="Financial Freedom — the actual maths" tag="FIRE numbers made simple" items={[
              ['The freedom formula', 'Financial freedom = investments × ~4% ≥ your yearly spending. Spend £24k/year? You need ~£600k invested. That\'s the whole equation behind every "FIRE" video.'],
              ['Your savings RATE is the dial', 'At a 10% savings rate, freedom takes ~50 years. At 30%, ~28 years. At 50%, ~17. Income raises (Skills/Business tabs) move this dial far more than investment genius does.'],
              ['The three levers, in order', '1) Raise income (biggest lever at your age), 2) hold lifestyle steady as income grows (the hard one), 3) automate investing the gap. Optimising fund choice is lever #47 — ignore the noise.'],
              ['Milestones that matter', '£1k emergency buffer → 3-month emergency fund → first £10k invested (the hardest) → £100k (compounding takes over from here — Charlie Munger\'s famous line) → your freedom number.'],
              ['Freedom is bought monthly', 'Every £100 invested ≈ £4-5/year of permanent passive income. Reframe purchases in those terms and impulse spending gets very honest very fast.'],
            ]} />
          </div>
        )}

        {/* ===== TRADING ===== */}
        {tab === 'trading' && (
          <div className="fade-up stagger space-y-4">
            <Link to="/backtest" className="block bg-gradient-to-br from-amber-500/15 to-[#111] border border-amber-500/30 rounded-2xl p-4 hover:border-amber-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-300">Backtest Lab</p>
                  <p className="text-gray-400 text-xs mt-0.5">Test strategies on simulated NASDAQ100 price history, or play a paper-trading session day by day.</p>
                </div>
                <ChevronDown size={16} className="text-amber-400 flex-shrink-0 -rotate-90" />
              </div>
            </Link>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-200/80 leading-relaxed">
                Straight truth first: ~70-90% of day traders lose money, and the "funded account" / signals / forex-guru world is
                mostly monetising hope. Trading is a real skill with a brutal filter — treat it like the stats say, not like TikTok says.
                Nothing here is financial advice; it's the map of the territory.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-gray-400 text-xs leading-relaxed mb-2">
                Before any of this: the boring, evidence-backed path &mdash; index funds in a Stocks &amp; Shares ISA,
                automated monthly, left alone for decades &mdash; beats most active traders over any long period. That
                is the default, and it lives in its own tab rather than being restated here.
              </p>
              <Link to="/money?tab=invest" className="inline-block text-[11px] font-bold bg-yellow-500/10 border border-yellow-500/25 text-yellow-200 px-3 py-1.5 rounded-full">
                Money &rarr; Investing
              </Link>
            </div>
            <Block title="If You Still Want to Learn Active Trading" items={[
              ['Paper trade for 6 months minimum', 'Demo account, real strategy, full journal of every trade and why. If you can\'t beat the market on paper, you\'ll just lose real money faster.'],
              ['Risk management IS the skill', 'Never risk more than 1-2% of the account per trade. Position sizing, stop losses, risk:reward of at least 1:2. Entries are 20% of it; surviving is 80%.'],
              ['One setup, mastered', 'Like the football go-to move: trade ONE pattern (e.g. breakout-retest) on ONE market until your journal shows an edge across 100+ trades. Strategy-hopping = account death.'],
              ['Psychology is the boss fight', 'Revenge trading, oversizing after wins, moving stops — the account killers are all emotional. The Mind section\'s composure work applies directly here.'],
              ['Only ever risk money you can burn', 'Trading capital = money whose total loss changes nothing in your life. Rent money on leverage is how disasters happen.'],
            ]} />
            <Fold title="How Markets & Brokers Actually Work" tag="The mechanics nobody explains before you start" items={[
              ['What actually happens when you "buy a stock"', 'You place an order through a broker app, which routes it to an exchange (LSE, NYSE, NASDAQ), where it\'s matched against someone selling at that price. The broker just gives you access — it doesn\'t set prices, the market does.'],
              ['Bid, ask, and the spread', 'The "bid" is the highest price buyers are offering; the "ask" is the lowest price sellers want. The gap between them (the spread) is a hidden cost — tighter spreads on big stocks/ETFs, wider on obscure ones. Always check it before trading illiquid assets.'],
              ['Market hours and pre/after-hours', 'UK/European markets: roughly 8am-4:30pm UK time. US markets: 2:30pm-9pm UK time (varies with US clock changes). Trading outside these windows ("after-hours") has thinner volume and wider, riskier spreads.'],
              ['What a broker is (and isn\'t)', 'A broker (Trading 212, Vanguard, Hargreaves Lansdown, eToro, IBKR) executes your orders and holds your assets — it is not your financial advisor. Compare them on fees, ISA availability, and what markets they give access to before picking one.'],
              ['Settlement and "T+1/T+2"', 'When you sell, the cash doesn\'t arrive in your account instantly — it settles 1-2 business days later. This matters if you plan to immediately withdraw or reinvest proceeds.'],
            ]} />
            <Fold title="Reading Charts & Candlesticks" tag="The visual language every trader needs to read" items={[
              ['What a candlestick shows', 'Each candle = one time period (a minute, hour, day). The body shows open vs close price; the wicks (thin lines) show the high and low reached during that period. Green/white = closed higher than it opened; red/black = closed lower.'],
              ['Timeframes change the story completely', 'The same stock can look bullish on a daily chart and bearish on a 5-minute chart — always match your timeframe to your actual holding plan (day trade vs long-term hold), not to whichever chart looks more exciting.'],
              ['Support and resistance', 'Support = a price level buyers have repeatedly stepped in at (price tends to bounce there); resistance = a level sellers have repeatedly capped it at. These aren\'t exact lines, they\'re zones — and once broken with volume, they often flip roles.'],
              ['Trend lines and structure', 'An uptrend = a series of higher highs and higher lows; a downtrend = lower highs and lower lows. Most sustainable profits come from trading WITH the existing trend, not guessing reversals.'],
              ['Volume — the detail beginners skip', 'A price move on high volume is far more meaningful than the same move on low volume (a breakout on low volume often fails and reverses). Volume is the "how many people agree with this move" indicator.'],
              ['Common candlestick patterns', 'Doji (indecision — open ≈ close), hammer (rejection of lower prices, often bullish at support), engulfing patterns (a big candle fully overtaking the prior one, signalling a potential reversal). Useful as context, never as a standalone signal.'],
            ]} />
            <Fold title="Order Types — how to actually place a trade" tag="Get this wrong and you overpay or get stopped out for no reason" items={[
              ['Market order', 'Buy/sell immediately at the current best available price. Simple and guaranteed to fill, but on volatile or illiquid assets you can get a worse price than expected ("slippage").'],
              ['Limit order', 'Buy/sell ONLY at your specified price or better. Guarantees your price, but not that it fills — if the market never reaches your limit, nothing happens. The standard order type for anyone not needing instant execution.'],
              ['Stop-loss order', 'An automatic sell order that triggers if the price falls to a level you set — your core risk-management tool. Set it BEFORE you enter the trade, based on where your thesis is proven wrong, never based on how much you\'re "willing to lose".'],
              ['Take-profit order', 'The mirror of a stop-loss — automatically closes the trade at a pre-set profit level so you don\'t have to watch the screen and don\'t talk yourself out of a good exit.'],
              ['Stop-limit vs stop-market', 'A stop-market order guarantees execution once triggered but not the price (can slip in fast-moving markets); a stop-limit guarantees the price but might not fill at all in a fast crash. Know which one your broker defaults to.'],
              ['GTC vs Day orders', '"Good Til Cancelled" orders sit active until you cancel them (days/weeks); "Day" orders expire at market close if unfilled. Long-term limit orders should usually be GTC so you don\'t have to re-enter them daily.'],
            ]} />
            <Fold title="Technical Analysis Basics" tag="Reading price action and momentum — a toolkit, not a crystal ball" items={[
              ['Moving averages (MA)', 'The average price over the last N periods (e.g. 50-day, 200-day), smoothing out noise to show the underlying trend. Price crossing above/below a major MA (like the 200-day) is a widely watched signal of trend change.'],
              ['The Golden Cross / Death Cross', 'When a shorter MA (e.g. 50-day) crosses above a longer one (200-day) = "golden cross", a classic bullish signal; crossing below = "death cross", bearish. Lagging indicators — they confirm trends after they\'ve started, not before.'],
              ['RSI (Relative Strength Index)', 'A 0-100 momentum gauge; above 70 is generally considered "overbought" (potentially due a pullback), below 30 "oversold" (potentially due a bounce). Works best as one input alongside trend and support/resistance, never alone.'],
              ['MACD', 'Shows the relationship between two moving averages via a histogram — used to spot momentum shifts earlier than a simple MA crossover. Useful for timing entries within an already-identified trend.'],
              ['Volume indicators', 'On-balance volume and similar tools track whether volume is flowing into or out of an asset — divergences (price rising while volume-based indicators fall) can warn of a weakening move before price confirms it.'],
              ['The honest limitation', 'No indicator predicts the future — they all describe what already happened, with varying lag. Their real value is removing emotional guesswork and giving you consistent, repeatable rules to backtest and follow.'],
            ]} />
            <div className="bg-gradient-to-br from-amber-500/12 to-[#111] border border-amber-500/25 rounded-2xl p-5">
              <h3 className="font-black text-amber-300 mb-1">Intermediate — price action and "smart money" concepts</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                This is the language you will hear in every NAS100 / ICT / SMC video: market structure, liquidity,
                FVGs, order blocks, CHoCH, CISD. Below is what each one actually means, how to mark it on a chart,
                how it fails, and the honest verdict on the whole framework. Read them in order — each builds on the
                one above. Then drill them on real-looking charts in the Quiz.
              </p>
              <Link to="/backtest?mode=quiz" className="inline-block mt-3 text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-200 px-3 py-1.5 rounded-full">
                Drill these &rarr; Backtest Lab &middot; Quiz
              </Link>
            </div>
            <Fold title="1. Market structure — the base layer everything sits on" tag="Learn this before any of the fancy terms" items={[
              ['What structure actually is', 'Price does not move in a line, it moves in swings. An uptrend is a stack of higher highs and higher lows; a downtrend is lower highs and lower lows. Everything below — BOS, CHoCH, order blocks — is just describing what happens at those swing points. If you cannot mark swing highs and lows accurately, nothing else will work.'],
              ['How to mark it', 'On your chart, dot every obvious swing high and swing low. Join them. You now have structure. Use a higher timeframe than you trade on to decide the direction, and your trading timeframe to find the entry — a 5-minute chart in isolation will have you fighting a daily downtrend.'],
              ['BOS — Break of Structure', 'Price closes beyond the previous swing high (bullish BOS) or swing low (bearish BOS). It means the current trend is continuing. It is confirmation, not prediction: the move that made the BOS already happened, so chasing the break itself is where beginners get filled at the top.'],
              ['CHoCH — Change of Character', 'The first break in the OPPOSITE direction. In an uptrend of higher lows, price finally breaks below the last higher low — that is a bearish CHoCH, and it is the earliest structural hint the trend may be over. It is a hint, not a guarantee: plenty of CHoCHs are just deep pullbacks in a continuing trend.'],
              ['BOS vs CHoCH in one line', 'BOS = "same direction, still going". CHoCH = "first sign of the other side taking control". Every reversal starts with a CHoCH, but not every CHoCH becomes a reversal.'],
              ['Internal vs external structure', 'Big swings (external) and the small swings inside a pullback (internal) both exist at once. Most confusion — "is this a CHoCH or not?" — is someone reading an internal break as if it were an external one. Pick one timeframe, define your swings, be consistent.'],
            ]} />
            <Fold title="2. Liquidity — why price keeps hitting your stop first" tag="The single most useful idea in this whole framework" items={[
              ['The core idea', 'Every stop-loss is a pending order. Above a cluster of highs sits a pile of buy stops; below a cluster of lows sits a pile of sell stops. Large participants need volume to fill big positions, and those clusters are exactly where volume is. So price is repeatedly drawn to obvious levels — not because "they" are hunting you personally, but because that is where the orders are.'],
              ['Equal highs / equal lows (EQH/EQL)', 'Two or more highs at nearly the same price look like solid resistance to everyone, so everyone puts stops just above them. That makes them a magnet, not a wall. When you see clean equal highs, the base case is that price goes ABOVE them at some point.'],
              ['Liquidity sweep / stop hunt', 'Price spikes through the level, triggers all those stops, and immediately reverses back inside — often a long wick and a fast close back. That is a sweep. It is the most reliably observable pattern here, and the whole point is that it looks exactly like a breakout at the moment it happens.'],
              ['How to actually use it', 'Two changes. One: stop putting your stop-loss at the obvious round number just under the swing low — give it room beyond the level, or accept a smaller position. Two: stop buying breakouts of clean equal highs the instant they break; wait to see whether price holds above or snaps back.'],
              ['The trap', 'You cannot label a sweep until it has reversed. In real time, a sweep and a genuine breakout are the same candle. Anyone showing you a chart where every sweep is marked perfectly is showing you hindsight — this is exactly what the Replay tool in the Backtest Lab is for, because it forces you to decide bar by bar.'],
              ['Session liquidity', 'The previous day\'s high and low, and the Asian session range high and low, are the most-watched levels on indices like NAS100 — they collect the most stops and get swept most often. If you only ever mark four lines on a chart, mark those.'],
            ]} />
            <Fold title="3. Fair Value Gaps (FVG) — what they are and how to use one" tag="The term you asked about, in full" items={[
              ['The definition', 'An FVG is a three-candle pattern where price moved so fast in one direction that a gap was left in the middle. Bullish FVG: the LOW of candle 3 is above the HIGH of candle 1 — the middle candle ran so hard that the range between those two levels was never traded in both directions. Bearish FVG is the mirror: the HIGH of candle 3 is below the LOW of candle 1.'],
              ['Why it is called that', 'The idea is that a one-sided, unbalanced move left "unfair" pricing behind, and price often returns to trade through that zone before continuing. It is also called an imbalance; you will see BISI (buyside imbalance sellside inefficiency) for bullish and SIBI for bearish — the same thing with more syllables.'],
              ['How to mark it', 'Draw a box from the high of candle 1 to the low of candle 3 (bullish), extending right. The 50% line of that box is worth marking too — many entries use the midpoint rather than the full fill, because a lot of FVGs only get partly filled before the move continues.'],
              ['How it is traded', 'In an uptrend: wait for a bullish FVG to form on the impulse, let price pull back INTO the box, enter as it reacts, stop below the box, target the next liquidity pool (the previous high). That is the entire textbook setup. The FVG gives you a defined risk level, which is genuinely its most useful property.'],
              ['When it fails — and it will', 'FVGs get blown straight through constantly, especially against the higher-timeframe trend and around news. A "filled" FVG is not a failed prediction, it is just a filled gap. Treat it as one location where a reaction is more likely, not a signal on its own — and never take one that requires you to trade against structure.'],
              ['The honest bit', 'On a fast-moving index there are dozens of FVGs on any chart. You can find one to justify almost any trade after the fact. The discipline is deciding IN ADVANCE which timeframe and which direction you will accept them in, then ignoring the rest.'],
            ]} />
            <Fold title="4. Order blocks, breakers and mitigation" tag="Supply and demand, renamed" items={[
              ['Order block', 'The last opposing candle before an aggressive move that breaks structure. Before a big rally, the last down-candle is the "bullish order block". The logic: that is where the big buying was absorbed, so if price returns there, buyers may defend it again. Mark the candle body (some mark body-to-wick) as a zone.'],
              ['What makes one worth watching', 'Three things: it caused a genuine break of structure, the move away from it was fast and one-sided (usually leaving an FVG), and it has not been returned to yet. An order block that price has already traded back through twice is spent — the orders are gone.'],
              ['Mitigation', 'When price returns to the zone and reacts, the block is "mitigated". First touch is the highest-probability one; each subsequent touch is weaker. This is the same reason a support line drawn on any other chart weakens each time it is tested.'],
              ['Breaker block', 'An order block that FAILED — price broke through it — and is then retested from the other side. A broken bullish block becomes resistance on the way back up. This is just support-becomes-resistance with a newer name, and it is one of the more reliable ideas in the set.'],
              ['Stacking, honestly', 'The strongest setups in this framework are where several things line up in one place: an order block sitting inside an FVG, in the discount half of the range, just after a liquidity sweep, in the direction of higher-timeframe structure. If you need to squint to find the confluence, it is not there.'],
              ['Order block = supply/demand zone', 'Be clear-eyed: this is classic supply and demand zone trading with different vocabulary. That is not a criticism — the concept has been around for decades because price does react at prior imbalance areas — but it does mean you are not learning a secret.'],
            ]} />
            <Fold title="5. Premium, discount and the rest of the vocabulary" tag="CISD, OTE, PD arrays — decoded" items={[
              ['Premium and discount', 'Take the current swing range, high to low, and mark the 50%. Above the midpoint is "premium" (expensive), below is "discount" (cheap). The rule of thumb: only buy in discount, only sell in premium. It is a simple filter that stops you buying at the top of a move, which is the single most common beginner error.'],
              ['OTE — Optimal Trade Entry', 'The 61.8%-79% Fibonacci retracement zone of the impulse leg. It is the deep-pullback entry: better risk:reward, but more trades never reach it and run without you. That trade-off is the whole story — deeper entry means better R:R and a lower hit rate.'],
              ['CISD — Change in State of Delivery', 'Price has been making a run of candles in one direction; then a candle closes back beyond the open of the first candle of that run, reversing the sequence. It is a finer-grained, earlier reversal signal than a CHoCH — often used as the trigger to enter once a higher-timeframe level has been swept.'],
              ['PD arrays', 'Umbrella term for all the marked zones — FVGs, order blocks, breakers, gaps. When someone says "price is heading to the nearest PD array", they mean the nearest marked zone.'],
              ['Killzones / sessions', 'The claim is that indices move most in specific windows: the London open and the New York open (roughly 8-11am and 2:30-5pm UK time for NAS100). The underlying truth is real and unglamorous — volume and volatility genuinely concentrate around session opens, so spreads are tighter and moves are cleaner. Outside those windows you are usually paying spread to trade noise.'],
              ['Inducement', 'A minor high or low placed to attract early entries and stops just before the real move. Practically: if there is an obvious small level between your entry and where you think price is going, expect price to take it first.'],
            ]} />
            <Fold title="6. Risk, position sizing and R — the maths that decides everything" tag="Do this part or none of the above matters" items={[
              ['Think in R, not pounds', 'One R = the amount you risk on a trade. If you risk £20, a trade that makes £40 is +2R. Judge every trade and every month in R, because it makes results comparable across account sizes and stops you feeling rich or ruined based on position size.'],
              ['Position sizing, the actual formula', 'Position size = (account × risk %) ÷ (distance from entry to stop). Example: £5,000 account, 1% risk = £50. Entry 20,150, stop 20,100 — that is 50 points. £50 ÷ 50 points = £1 per point. That calculation happens BEFORE the trade, every time. If it gives you an uncomfortably small size, your stop is too wide for your account, not the other way round.'],
              ['Why 1-2% and not more', 'Ten losses in a row happens to everyone eventually. At 1% risk that is a 10% drawdown — annoying, recoverable. At 10% risk it is a 65% drawdown, and you now need a 186% gain to get back to even. Drawdown maths is asymmetric and it is what actually ends accounts.'],
              ['Expectancy — the only number that matters', 'Expectancy = (win rate × average win) − (loss rate × average loss). A 40% win rate at 3R average wins is hugely profitable; a 70% win rate at 0.5R with 1R losses loses money. This is why "win rate" screenshots are meaningless on their own, and why cutting winners early is more damaging than taking a few extra losses.'],
              ['Set the stop where the idea is wrong', 'Your stop goes at the price that proves your reason for entering was wrong — below the order block, beyond the sweep wick. It never goes at "the most I feel like losing". If that level is too far away for your risk, skip the trade; that is the correct outcome, not a missed opportunity.'],
              ['Never move a stop away from price', 'Moving a stop further out to avoid a loss converts a planned 1R loss into an unplanned 4R one. Moving it TO breakeven or trailing it in your favour is fine. This one rule prevents most account-ending days.'],
            ]} />
            <Fold title="7. The journal, and how you know if you actually have an edge" tag="The unglamorous part that separates the two groups" items={[
              ['Log every trade the moment you take it', 'Date, instrument, direction, setup name, entry, stop, target, size, R risked, and one sentence on WHY — written before the outcome is known, so you cannot rewrite the reasoning afterwards. Then the outcome in R, and one sentence on what you would repeat or change.'],
              ['Screenshot before and after', 'Chart at entry, chart at exit. Reviewing 50 screenshots teaches you more about your setup than 50 videos will. It also exposes the trades you took that were not actually your setup — usually the majority of the losses.'],
              ['The 100-trade rule', 'You cannot judge a strategy on 10 trades; the noise is bigger than the signal. 100 trades of ONE setup, same rules throughout, is roughly the point where expectancy means something. Changing the rules halfway resets the count to zero.'],
              ['Track your own error rate separately', 'Two columns: was this an A+ setup by my rules (yes/no), and did I follow my plan (yes/no). Most people find their by-the-rules trades are profitable and their improvised ones pay for it. That is a discipline problem, not a strategy problem, and it needs a different fix.'],
              ['Review weekly, not daily', 'Daily review makes you react to noise and tinker. Once a week: total R, number of rule breaks, best and worst trade, one thing to change. One change at a time or you will never know what worked.'],
              ['Practise here first', 'The Replay tool reveals a chart one bar at a time so you cannot cheat by seeing the future, and the Paper mode tracks a running balance. Both are simulated data, which is fine for practising mechanics and terrible for proving an edge — build the habit here, prove the edge on a real demo account.'],
            ]} />
            <Fold title="8. The honest verdict on ICT / SMC" tag="Read this before you spend 200 hours on YouTube" items={[
              ['What is genuinely useful', 'Liquidity as a concept, marking previous day/session highs and lows, premium vs discount as an entry filter, using FVGs and order blocks to define a precise stop level, and thinking in R. These are real, they improve how you place stops and targets, and they cost nothing to adopt.'],
              ['What is repackaging', 'Order blocks are supply and demand zones. Breakers are support-becomes-resistance. CHoCH is a trend line break. BOS is a breakout. The vocabulary is newer than the ideas, and the newness is part of what is being sold to you.'],
              ['What is unfalsifiable', 'The framework has enough moving parts — timeframes, internal vs external structure, dozens of zones per chart — that any past move can be explained perfectly and almost no future move can be predicted cleanly. Beware of anything that is only ever demonstrated on completed charts.'],
              ['No published edge', 'There is no credible, audited evidence that this framework beats the market for retail traders. The base rate stands: most active traders lose. The people making reliable money from SMC are overwhelmingly making it from courses, signals and affiliate links, not from trading.'],
              ['How to hold it sensibly', 'Use it as a structured way to define entries, stops and targets — which is a real benefit over trading on vibes — while keeping your actual wealth plan in index funds in an ISA. Trade with money whose loss changes nothing, cap it at a small share of your net worth, and let the boring plan do the compounding.'],
              ['The test that settles it', '100 journalled trades of one setup with fixed rules. If your expectancy is positive across those, you have something worth scaling slowly. If it is not, you have saved yourself years — and that is a genuinely good outcome, not a failure.'],
            ]} />
            <Fold title="Fundamental Analysis Basics" tag="Judging what a company/asset is actually worth" items={[
              ['P/E ratio (Price-to-Earnings)', 'Share price ÷ earnings per share — roughly "how many years of current profit are you paying for". A high P/E can mean overvalued OR high expected growth; always compare within the same industry, never across unrelated sectors.'],
              ['Revenue and earnings growth', 'Is the company actually growing sales and profit, or just its share price? Check the trend over several years/quarters, not one good quarter — one-off gains distort a single period easily.'],
              ['Debt levels', 'A debt-to-equity ratio that\'s high relative to industry peers is a red flag, especially in a rising interest-rate environment where servicing that debt gets more expensive.'],
              ['Reading an earnings report, at minimum', 'Revenue (is it growing?), net income (is it profitable, or improving toward it?), guidance (what management expects next quarter — often moves the price MORE than the actual numbers just reported).'],
              ['Macro context matters too', 'Interest rates, inflation, and overall economic cycle affect nearly every asset class — a "great company" can still see its stock fall in a broad market downturn for reasons that have nothing to do with the business itself.'],
              ['Fundamentals vs technicals — use both', 'Fundamentals tell you WHAT might be worth buying; technicals/charts help with WHEN. Long-term investors lean fundamental; active traders lean technical — most serious market participants use a blend.'],
            ]} />
            <Fold title="Asset Classes — what's actually out there" tag="Know the tool before you pick it up" items={[
              ['Stocks/equities', 'Ownership slices of real companies. Historically the best long-term return of any major asset class, with volatility along the way. The default vehicle for long-term wealth building via index funds.'],
              ['Bonds', 'Loans to governments or companies that pay fixed interest. Lower return, lower volatility than stocks — used to reduce portfolio risk as you get closer to needing the money, not as a primary growth engine in your 20s.'],
              ['Forex (currency trading)', 'Trading one currency against another (e.g. GBP/USD). Extremely high liquidity but dominated by algorithmic institutions and often paired with heavy leverage at retail brokers — one of the hardest markets for beginners to have a genuine edge in.'],
              ['Crypto', 'Highly volatile, 24/7 markets with far less regulation and far more scam density than traditional markets. Treat any allocation as high-risk speculation (a small, capped % of your investable money), never as your core plan.'],
              ['Options', 'Contracts giving the right (not obligation) to buy/sell an asset at a set price by a set date. Powerful for hedging or income generation in experienced hands; a fast way to lose 100% of a position in inexperienced ones — this is genuinely advanced-tier, not a beginner tool.'],
              ['ETFs (Exchange-Traded Funds)', 'A basket of assets (stocks, bonds, commodities) traded like a single stock. This is how most people should access diversification — including the index funds recommended throughout this app.'],
            ]} />
            <Block title="Red Flags — Auto-Skip List" items={[
              ['Signals groups & copy-trading gurus', 'If their signals worked, they wouldn\'t need your £50/month. They earn from subscribers, not markets.'],
              ['Screenshots of profits', 'Demo accounts and cherry-picking. Audited track records or it didn\'t happen.'],
              ['Leverage pushed at beginners', '100x leverage means a 1% move wipes you. Brokers push it because your loss is often their gain.'],
              ['"Guaranteed returns"', 'The two words that always mean scam. Real markets guarantee nothing.'],
            ]} />
          </div>
        )}

        {/* ===== TAX ===== */}
        {tab === 'tax' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Banknote size={16} className="text-yellow-400" /> Tax — the thing nobody teaches you</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                UK figures for the <span className="text-yellow-300 font-semibold">2026/27 tax year</span>. Most thresholds are frozen
                until April 2031, so these hold for a while — but always confirm on gov.uk before acting.
                This is general information, not personal tax advice.
              </p>
            </div>
            <Fold title="Actually do this — opening a Stocks & Shares ISA" tag="Start to finish, about 20 minutes" items={[
              ['1. Check you are eligible', 'You must be 18+ and a UK resident. You get one £20,000 allowance per tax year across ALL your ISAs combined — it resets every 6 April and does not roll over, so an unused year is gone.'],
              ['2. Pick a platform', 'For a beginner investing small monthly amounts, the main considerations are platform fee and fund choice. Trading 212 and InvestEngine charge no platform fee on their basic offerings. Vanguard is the classic low-cost option but only sells its own funds. Hargreaves Lansdown has the best interface and the highest fees. Any of them is fine — the fee difference on £100/month is pennies, so do not spend three weeks comparing.'],
              ['3. What you need to hand', 'Your National Insurance number, a debit card or bank details, and photo ID. It is an online form and usually takes 10-15 minutes to be approved.'],
              ['4. Choose ONE fund', 'This is where people freeze. A global tracker is the default sensible answer — something like a FTSE Global All Cap or an all-world index fund. Two things to check: pick the ACCUMULATION version (dividends reinvest automatically) and check the ongoing charge is under about 0.25%.'],
              ['5. Set the monthly direct debit', 'Pick an amount you will not need back and a date just after payday. £50 a month started now beats £500 a month started in five years. Then turn the notifications off.'],
              ['6. Then genuinely ignore it', 'The single most common way to lose money is checking during a crash and selling. Set it, and look once or twice a year. That is the whole strategy — see the Investing tab for why.'],
              ['A caveat worth knowing', 'A Stocks & Shares ISA is for money you will not need for 5+ years, because markets can fall for years at a time. Short-term money belongs in a Cash ISA or savings account instead.'],
            ]} />

            <Fold title="Actually do this — your payslip, tax code and refunds" tag="Where students and first jobs lose money" items={[
              ['Read your payslip once, properly', 'Gross pay is before deductions. You should see income tax, National Insurance and possibly pension and student loan lines. Your tax code sits somewhere on it — for most people on one job with no complications it should be 1257L.'],
              ['If your tax code is wrong you are probably overpaying', 'Codes starting BR, D0, or ending in W1/M1 or X mean you are being taxed at a flat rate or on an emergency basis. This is extremely common when you start a first job, a second job, or a summer job. It is not a fine — it is just HMRC not having your details yet.'],
              ['How to fix it', 'Log into your Personal Tax Account on gov.uk (you will need to set up a Government Gateway ID). You can see your tax code, check what HMRC thinks you earn, and correct it. Usually it self-corrects on the next payslip and the overpayment comes back automatically through payroll.'],
              ['Claiming back overpaid tax', 'If you overpaid in a previous tax year — very common if you worked only part of the year, e.g. a summer job — you can claim it back for the last four years. Do it directly through gov.uk. Never use a "tax refund company" that takes a percentage; they do the same free form and keep a cut.'],
              ['Students are not automatically tax-free', 'A persistent myth. Students pay tax exactly like everyone else — you just often earn under the £12,570 Personal Allowance across the year, so you owe nothing. But if you earn heavily in a single month, PAYE can tax you as though that rate continues all year, and you claim it back.'],
              ['Student loan repayments', 'These start only once you earn over the threshold for your plan, and are taken automatically from your payslip as a percentage of income above it. It behaves more like a graduate tax than a debt, and it is written off after a set period — which is why aggressively overpaying it early is usually a bad idea.'],
            ]} />

            <Fold title="Actually do this — side income and self assessment" tag="If you earn anything outside a payslip" items={[
              ['The £1,000 trading allowance', 'You can earn up to £1,000 a tax year from self-employment or side income without declaring it or paying tax on it. Freelancing, reselling, tutoring, content — all counts toward this. Under £1,000 and you genuinely do not need to do anything.'],
              ['Over £1,000 — you must register', 'Register for Self Assessment on gov.uk. Deadline: 5 October following the end of the tax year you started earning. Registering does not mean you will owe much — you still get your Personal Allowance — it just means you have to declare it.'],
              ['The dates that matter', 'The tax year runs 6 April to 5 April. Online return deadline is 31 January after the tax year ends, and payment is due the same day. Missing 31 January triggers an automatic £100 penalty even if you owe zero tax, which is the most avoidable fine in the system.'],
              ['Keep records from day one', 'A spreadsheet with date, what it was for, amount in, amount out. Keep receipts for anything you might claim as an expense. Doing this as you go takes minutes; reconstructing a year of it in January takes a weekend.'],
              ['You can deduct genuine costs', 'Equipment, software, a proportion of phone and internet if used for the work. Deducting reduces the profit you are taxed on. Be honest about the split — this is exactly what gets checked.'],
              ['Put tax aside as you earn it', 'The classic first-year mistake is spending everything and getting a bill in January. Move roughly 30% of side income into a separate savings pot the moment it lands and treat it as not yours.'],
            ]} />

            <Block title="How income tax actually works" items={[
              ['You are NOT taxed at one rate on everything', 'This is the single biggest misunderstanding. Tax is charged in bands — only the money inside each band is taxed at that band\'s rate. Earning £1 into the higher band does not re-tax your whole salary.'],
              ['Personal Allowance — £12,570', 'The first £12,570 you earn is tax-free.'],
              ['Basic rate — 20%', 'On income from £12,571 to £50,270.'],
              ['Higher rate — 40%', 'On income from £50,271 to £125,140.'],
              ['Additional rate — 45%', 'On income above £125,140.'],
              ['Worked example', 'On a £60,000 salary you do NOT pay 40% on £60,000. You pay: nothing on the first £12,570, 20% on the next £37,700 (£7,540), and 40% only on the £9,730 above £50,270 (£3,892). Total ≈ £11,432, an effective rate of about 19%.'],
              ['A pay rise is always worth taking', 'Because of banding, more gross pay always means more take-home. The only real exceptions are the specific traps below.'],
            ]} />
            <Fold title="National Insurance — the second income tax" tag="Everyone forgets this one exists" items={[
              ['What it is', 'A separate deduction on top of income tax, nominally funding the state pension and NHS. In practice, treat it as a second income tax when working out what you actually keep.'],
              ['Employee rates (Class 1)', 'Nothing below roughly £12,570, then 8% on earnings up to about £50,270, then 2% above that. Note it goes DOWN at the higher threshold, unlike income tax.'],
              ['Your true marginal rate', 'A basic-rate employee loses about 28% of each extra pound (20% tax + 8% NI). A higher-rate employee loses about 42% (40% + 2%). Use these numbers, not the headline tax rate, when judging overtime or a raise.'],
              ['Self-employed', 'Class 4 NI on profits, at different rates, paid through Self Assessment rather than deducted at source. Budget for it — it is the bill that catches out first-year freelancers.'],
            ]} />
            <Fold title="The tax traps — where marginal rates go insane" tag="Worth knowing before you hit them" items={[
              ['The 60% trap (£100k-£125,140)', 'Above £100k your Personal Allowance is withdrawn by £1 for every £2 earned. Combined with 40% tax, your effective marginal rate on that band is about 60%. Pension contributions are the standard fix — they reduce adjusted net income and can pull you back under £100k.'],
              ['High Income Child Benefit Charge', 'If you or a partner earn above the threshold and claim Child Benefit, some or all of it is clawed back through Self Assessment. Not relevant yet, but it blindsides people later.'],
              ['Losing the personal savings allowance', 'Basic-rate taxpayers get £1,000 of savings interest tax-free; higher-rate only £500; additional-rate nothing. Crossing a band can quietly create a tax bill on savings interest.'],
              ['The fix is almost always pension contributions', 'They come off your taxable income, so they can pull you out of a trap while the money is still yours — just locked until pension age.'],
            ]} />
            <Fold title="ISAs — your most important tax shelter" tag="Use this before anything clever" items={[
              ['£20,000 per tax year', 'Across ALL ISA types combined (Cash, Stocks & Shares, Lifetime, Innovative Finance). The allowance resets every 6 April and does NOT carry over — unused allowance is gone forever.'],
              ['Everything inside is tax-free, permanently', 'No income tax on interest or dividends, no capital gains tax, and nothing to declare on a tax return. This is as good as tax planning gets for a normal person.'],
              ['Cash ISA vs Stocks & Shares ISA', 'Cash ISA for money you need within ~5 years. Stocks & Shares ISA for long-term growth. With inflation around 2-3%, cash held for decades loses real purchasing power.'],
              ['Lifetime ISA — the 25% bonus', 'Under 40, up to £4,000/year (inside the £20k total), government adds 25% — up to £1,000 free annually. For a FIRST home under the price cap, or age 60+. Withdraw for anything else and the penalty can leave you with less than you put in.'],
              ['Practical order', 'Employer pension match first → then ISA → then pension beyond the match → then a general investment account once the £20k is genuinely used up.'],
            ]} />
            <Fold title="Pensions — the biggest tax break you get" tag="Boring, and mathematically enormous" items={[
              ['Tax relief explained simply', 'Contributions are made from pre-tax income. For a basic-rate taxpayer, £100 in your pension costs you £80 of take-home. For a higher-rate taxpayer it costs £60 (claim the extra via Self Assessment). That is an instant 25-67% uplift before any investment growth.'],
              ['Employer match is free money', 'If they match contributions, not contributing enough to get the full match is declining part of your salary. Always take the full match.'],
              ['The trade-off', 'You cannot touch it until pension age (currently 57 from 2028, likely rising). That illiquidity is the price of the tax relief.'],
              ['ISA vs pension, simply', 'Pension: tax relief now, taxed on withdrawal, locked away. ISA: no relief now, completely tax-free later, accessible anytime. Young and building flexibility, weight toward the ISA — but never at the cost of losing an employer match.'],
            ]} />
            <Fold title="Capital Gains, Dividends & side income" tag="What you owe when money makes money" items={[
              ['Capital Gains Tax (CGT)', 'On PROFIT when you sell investments outside an ISA. Annual exempt amount is just £3,000 (2026/27), then 18% for basic-rate and 24% for higher/additional-rate taxpayers. Inside an ISA: zero, and nothing to report.'],
              ['Dividend allowance — £500', 'Dividends above £500/year (outside an ISA) are taxed at 8.75% basic, 33.75% higher, 39.35% additional. Again, zero inside an ISA.'],
              ['The £1,000 trading allowance', 'You can earn up to £1,000/year of self-employed or side-hustle income with no tax and no need to register. Above that, register for Self Assessment.'],
              ['Self Assessment key dates', 'Tax year runs 6 April to 5 April. Register by 5 October after the tax year. File online and pay by 31 January. Miss it and there is an automatic £100 penalty, then more.'],
              ['Set aside 25-30% of profit', 'From day one, move it to a separate account the moment you get paid. The January bill destroys freelancers who spent gross income as if it were net.'],
              ['Payments on account', 'Once your bill passes a threshold, HMRC makes you pre-pay half of next year\'s tax in January and July. Your first year can therefore feel like paying 150% at once — budget for it or it is genuinely brutal.'],
            ]} />
            <Block title="Student loans — the bit everyone gets wrong" items={[
              ['It behaves like a graduate tax, not a debt', 'You repay a percentage of income above a threshold, via payroll. If your income is low, you pay nothing. The balance is written off after a set period regardless of what is left.'],
              ['Do not rush to overpay', 'For most graduates who will never clear the balance before write-off, voluntary overpayments are money you simply hand over for no benefit. Only high earners who will clearly repay in full should consider it.'],
              ['It does not work like a credit card', 'It is not on your credit file and does not block a mortgage directly — though the monthly repayment reduces the income lenders assess. Check your plan type (1, 2, 4, 5 or postgrad); thresholds and rates differ significantly.'],
            ]} />
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Tax avoidance schemes promising to convert salary into loans or offshore payments are how people end up
                owing HMRC six figures years later. If it sounds clever and it is not an ISA or a pension, it probably is not legal.
              </p>
            </div>
          </div>
        )}

        {/* ===== ECONOMICS ===== */}
        {tab === 'econ' && (
          <div className="fade-up stagger space-y-4">
            <div className="bg-gradient-to-br from-yellow-500/15 to-[#111] border border-yellow-500/30 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-black text-yellow-300">Where things stand</h3>
                <span className="text-[10px] bg-black/30 text-yellow-200/80 px-2 py-1 rounded-full font-bold flex-shrink-0">30 JUL 2026</span>
              </div>
              <div className="space-y-2.5">
                {[
                  ['UK inflation (CPI)', '2.6%', 'Above the Bank of England\'s 2% target. Expected to rise again later this year as higher energy prices feed through — the Bank projects a peak around 3.2% in Q4 2026.'],
                  ['UK interest rate (Bank Rate)', '3.75%', 'Held on 29 July 2026 by a 6-3 vote. Three members wanted a rise to 4%, so the committee is split and leaning hawkish.'],
                  ['US interest rate (Fed funds)', '3.50-3.75%', 'Held on 29 July 2026 by 9-3, with three dissenters wanting a hike. US economy described as expanding at a solid pace with inflation still above target.'],
                  ['UK Prime Minister', 'Andy Burnham', 'Took office in July 2026 — the UK\'s seventh PM in recent years. New leadership means policy direction is still being set.'],
                  ['UK Chancellor', 'John Healey', 'Appointed late July 2026. The Chancellor controls tax and spending, so this is the person whose Budget decisions hit your take-home pay.'],
                  ['The big pressure', 'Energy prices', 'Middle East conflict is pushing energy costs up, which is the main force keeping inflation above target on both sides of the Atlantic.'],
                ].map(([label, val, note]) => (
                  <div key={label} className="bg-black/25 rounded-xl px-3.5 py-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-bold text-gray-200">{label}</span>
                      <span className="text-sm font-black text-yellow-300 flex-shrink-0">{val}</span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed mt-1">{note}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-amber-200/70 leading-relaxed mt-3 bg-amber-500/10 rounded-lg px-3 py-2">
                These are a snapshot, not live data — they will go stale. Check the real numbers yourself:
                <span className="text-amber-200"> bankofengland.co.uk</span> (rates),
                <span className="text-amber-200"> ons.gov.uk</span> (inflation, jobs, GDP),
                <span className="text-amber-200"> federalreserve.gov</span> (US rates).
                The section below is the part that does not expire — learn to read it and you never need anyone to tell you what is happening.
              </p>
            </div>
            <Fold title="Actually do this — turning economic news into decisions" tag="The 'so what do I do' layer" items={[
              ['Once a month, check three numbers', 'CPI inflation (ons.gov.uk), Bank Rate (bankofengland.co.uk), and your own savings account rate. Two minutes. If your easy-access account pays less than inflation, your cash is shrinking in real terms and you should move it — that is the single most common, most fixable money mistake.'],
              ['When rates are HIGH (like now, 3.75%)', 'Savings pay well: move emergency cash into the best easy-access or a Cash ISA rather than a current account paying 0.1%. Do NOT lock into a long fixed-rate savings bond if rates are still being voted up. Avoid taking on new variable-rate debt. Keep investing monthly anyway — high rates depress share prices, which means you are buying cheaper.'],
              ['When rates start FALLING', 'Savings rates drop fast, usually before the cut is even announced. That is the moment to fix a savings rate if you have cash you will not touch for a year. Mortgage deals improve — if your fix ends within six months, start getting quotes, because most lenders let you lock a rate up to six months ahead and switch down for free if rates fall further.'],
              ['Diarise your mortgage/fix end date', 'The rate you are on today is irrelevant; the rate on the day your fix ends is what matters. Put the date in your calendar with a six-month-before reminder. Rolling onto a lender\'s standard variable rate by accident is the most expensive passive mistake in UK personal finance.'],
              ['Use inflation in every pay conversation', 'A 3% rise with 2.6% inflation is a 0.4% real rise. Going into a review knowing the current CPI figure — and saying it out loud — reframes the conversation from "more please" to "keeping pace". Ask for above inflation and justify it with what you delivered.'],
              ['Watch Budget day, ignore the rest of politics', 'The one date that actually changes your finances is the Chancellor\'s Budget: ISA allowance, income tax thresholds, CGT and dividend allowances, pension rules. Read a summary the next morning and check only whether anything you use has changed. Everything else in the political cycle is noise for your money.'],
              ['What NOT to do with any of this', 'Do not sell, pause your monthly investing, or move to cash because of an inflation print, a rate decision, or a scary headline. Macro forecasting is where amateurs and professionals both lose. This information exists so you understand what you are seeing and price your savings and debt correctly — not so you can time markets.'],
              ['The 15-minute version', 'Emergency fund in the best-paying easy-access account. Everything long-term in a monthly direct debit into a global index fund inside an ISA. Mortgage end date in the calendar. Check CPI and Bank Rate monthly. That is the entire practical output of this whole section.'],
            ]} />
            <Block title="Inflation — what it actually is" items={[
              ['The definition', 'How fast prices rise. 2.6% inflation means what cost £100 a year ago costs £102.60 now. CPI is the headline measure; CPIH also includes housing costs.'],
              ['Why 2% is the target', 'Mild inflation encourages spending and investing rather than hoarding cash. Zero risks deflation (people delay purchases, the economy stalls); high inflation destroys savings and planning.'],
              ['What it does to you', 'Cash loses purchasing power every year it sits still. At 2.6%, money in a 1% savings account is LOSING about 1.6% a year in real terms. This is the entire argument for investing rather than saving long-term.'],
              ['What it does to markets', 'High inflation usually means higher interest rates to fight it — and higher rates push share prices and bond prices down. Persistent inflation is generally bad for stocks in the short run.'],
              ['Real vs nominal', 'Always subtract inflation. A 5% pay rise with 2.6% inflation is a 2.4% real rise. A 7% investment return with 2.6% inflation is 4.4% of genuine gain. Nominal numbers flatter everything.'],
            ]} />
            <Block title="Interest rates — the most powerful lever there is" items={[
              ['Who sets them', 'In the UK, the Bank of England\'s Monetary Policy Committee — nine members, voting roughly eight times a year. Deliberately independent of government, so politicians cannot cut rates to win elections. The Fed\'s FOMC does the same job in the US.'],
              ['What the rate actually is', 'The Bank Rate is what the central bank pays commercial banks. Everything else — mortgages, loans, savings accounts — prices off it. Change this one number and you change the cost of money everywhere.'],
              ['Rates UP = economy cooled', 'Borrowing costs more, saving pays more, people spend less, demand falls, inflation comes down. It also slows growth and can cause job losses — that is the deliberate trade-off.'],
              ['Rates DOWN = economy stimulated', 'Borrowing is cheap, saving is pointless, spending and investing rise. Boosts growth but risks pushing inflation up.'],
              ['Why a 6-3 split matters', 'Vote splits signal what is coming. Three members voting for a hike means the committee is closer to raising than cutting — markets read those minutes as carefully as the decision itself.'],
              ['What it means for you personally', 'Higher rates: better savings accounts, worse mortgage deals, pressure on share prices. Lower rates: the reverse. If you are on a fixed-rate mortgage, note the date it ends — that is when today\'s rates hit you.'],
            ]} />
            <Fold title="The other indicators worth knowing" tag="What the news is talking about" items={[
              ['GDP — total economic output', 'The value of everything a country produces. Growing GDP means expansion; two consecutive quarters of shrinking GDP is the common definition of a recession. Watch the direction more than the level.'],
              ['Unemployment rate', 'Low unemployment means workers have bargaining power and wages rise — good for people, but it can feed inflation. Central banks watch it closely; rising unemployment is often the price of taming inflation.'],
              ['Government bond yields (gilts in the UK)', 'What it costs the government to borrow. Rising yields mean investors demand more to lend, usually signalling inflation or fiscal worry. Gilt yields also drive mortgage pricing, so they matter to you directly.'],
              ['The yield curve', 'Normally long-term bonds pay more than short-term ones. When it INVERTS (short pays more than long), it has historically preceded recessions — one of the most-watched warning signals in finance.'],
              ['Exchange rates', 'A weak pound makes imports and holidays dearer but helps UK exporters. It also boosts the sterling value of your overseas investments — a global index fund is partly a hedge against a falling pound.'],
              ['Consumer confidence & PMI', 'Surveys of how households and businesses feel. They move BEFORE the hard data, which is why markets react to them.'],
            ]} />
            <Fold title="Who controls what — and why it matters" tag="Central bank vs government" items={[
              ['The Bank of England controls interest rates', 'Independent of government. Its single legal mandate is 2% inflation. It cannot be told by the PM to cut rates — this independence is precisely what keeps inflation expectations anchored.'],
              ['The Chancellor controls tax and spending', 'Income tax, National Insurance, VAT, allowances, public spending — all set by the Treasury, announced at Budgets. This is what changes your payslip.'],
              ['Why the pairing matters', 'The two can pull against each other: a government spending heavily while the Bank raises rates to cool things is a tug-of-war. Markets punish governments whose plans look unfunded — gilt yields spike and the currency falls.'],
              ['New leadership = uncertainty', 'A new PM and Chancellor mean markets are pricing guesses about future tax and spending. Expect volatility around the first Budget of any new government.'],
              ['What to do about it', 'Nothing dramatic. Politics changes tax rules (relevant to ISAs, CGT, pensions — worth watching at Budget time) but should almost never change a long-term investing plan.'],
            ]} />
            <Block title="How this all moves markets" items={[
              ['The core relationship', 'Interest rates up → borrowing costs rise for companies, future profits are discounted more heavily, and safe savings become a real alternative to shares → share prices generally fall. Rates down → the reverse. Most market moves trace back to this.'],
              ['Bonds move opposite to rates', 'When rates rise, existing bonds paying less become worth less, so their prices fall. This is why "safe" bond funds lost money in rate-rising periods and surprised a lot of people.'],
              ['Markets trade expectations, not news', 'Prices already contain what everyone expects. Markets move on the SURPRISE — a rate hold can rally or sink markets depending on whether it was expected and what the guidance said.'],
              ['Sectors respond differently', 'Higher rates hurt growth/tech stocks (their value is mostly future profits) and can help banks (wider lending margins). A global index fund holds all of it, which is exactly why it is the low-stress option.'],
              ['What you should actually do', 'Almost nothing. Keep buying monthly through all of it. The entire point of automated index investing is that you do not have to forecast any of this — and virtually nobody who tries to forecast it does better.'],
            ]} />
            <Block title="Reading the economy yourself" items={[
              ['Check the source, not the headline', 'ONS for UK inflation/jobs/GDP, Bank of England for rates and minutes, Federal Reserve for US policy. Free, primary, and without the panic framing.'],
              ['Read the vote split and the minutes', 'The decision is one number; the reasoning tells you what is coming next. "Split 6-3 with dissenters wanting a hike" is a genuine forward signal.'],
              ['Distrust scary headlines', 'Financial media monetises fear and urgency. "Markets plunge" usually describes a move that is irrelevant to a 30-year plan. Check the actual percentage before reacting.'],
              ['Watch direction and trend, not single prints', 'One month of data is noise. Three to six months is a trend. Central banks think in trends; so should you.'],
              ['Know which numbers touch YOUR life', 'Inflation (your purchasing power and pay rises), Bank Rate (your mortgage and savings), and Budget announcements (your take-home and ISA/CGT rules). Most of the rest is spectator sport.'],
            ]} />
          </div>
        )}

        {/* ===== MINDSET ===== */}
        {tab === 'mindset' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Money Rules to Live By" items={[
              ['Earn more > save more (at the start)', 'You can\'t frugal your way from £200/month. Early on, 90% of energy goes into raising income; saving optimises what earning creates.'],
              ['Pay yourself first', 'Fixed % of every pound in (start at 20%: 10% invest, 10% save) moves automatically on payday. Budget what remains, never the reverse.'],
              ['Assets before flexes', 'The watch and the car after the income is boringly stable — bought with returns, not principal. Rich people buy assets that buy their luxuries; broke people buy luxuries that keep them broke.'],
              ['Avoid consumer debt like injury', 'Credit-card and BNPL interest is compounding working AGAINST you. If you can\'t buy it twice in cash, you can\'t afford it once.'],
              ['Skills compound like money', 'Every skill multiplies the others — editing × sales × an audience is a career; each alone is a gig. Stack deliberately.'],
            ]} />
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Brain size={16} className="text-yellow-400" /> Wealth Psychology</h3>
              <div className="space-y-3">
                {[
                  ['Long games only', 'Every real fortune is 5-10 years of compounding that looked like nothing for the first 2. The people who made it are the ones who didn\'t quit in the flat part of the curve.'],
                  ['Proximity is currency', 'Income gravitates to the average of your circle. Find the gym-rat equivalent of money: people building things. Online communities count.'],
                  ['Sell solutions, not time', 'Wages price your hours; businesses price the problem solved. The shift from "what do I get paid?" to "what problem can I own?" is the whole game.'],
                  ['Boredom tolerance = edge', 'The money is in doing the unsexy thing (outreach, reps, posting, journaling trades) daily for months. Everyone knows what to do; almost nobody does it long enough.'],
                  ['Never let money idle as identity', 'The point is options and freedom, not the scoreboard. Broke with discipline beats rich with panic — and usually becomes rich anyway.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>
            <Block title="The 90-Day Money Sprint" accent="text-yellow-300" items={[
              ['Days 1-30: skill', '2h/day learning + doing your chosen skill. Output daily, consume max 30 min of tutorials — making beats watching.'],
              ['Days 31-60: proof', 'Build 3-5 portfolio pieces. Free or cheap work for real people in exchange for testimonials and results you can screenshot.'],
              ['Days 61-90: outreach', '20 targeted DMs/emails a day, every day. Track responses in a sheet. First paying client usually lands between message 100-300 — most people quit at 30.'],
              ['Then: raise and repeat', 'Every 3 clients, raise prices 25-50%. Reinvest the first £500 into better tools, not a celebration purchase.'],
            ]} />
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
