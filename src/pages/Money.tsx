import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Banknote, TrendingUp, Laptop, Rocket, AlertTriangle, ChevronDown, Brain } from 'lucide-react';
import BottomNav from '../components/BottomNav';

type Tab = 'skills' | 'online' | 'trading' | 'mindset';

const TABS: { id: Tab; label: string }[] = [
  { id: 'skills', label: 'Skills' },
  { id: 'online', label: 'Online Income' },
  { id: 'trading', label: 'Trading & Investing' },
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
  const [tab, setTab] = useState<Tab>('skills');

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
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
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Filter for scams: anyone selling a course promising fast money makes their money from the course, not the method.
                Free YouTube + doing the work beats every £997 course. If it needs you to recruit others to earn — it's an MLM, run.
              </p>
            </div>
          </div>
        )}

        {/* ===== TRADING ===== */}
        {tab === 'trading' && (
          <div className="fade-up stagger space-y-4">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-200/80 leading-relaxed">
                Straight truth first: ~70-90% of day traders lose money, and the "funded account" / signals / forex-guru world is
                mostly monetising hope. Trading is a real skill with a brutal filter — treat it like the stats say, not like TikTok says.
                Nothing here is financial advice; it's the map of the territory.
              </p>
            </div>
            <Block title="The Boring Path That Actually Builds Wealth" items={[
              ['Index funds — the 80% solution', 'Broad market index funds (e.g. S&P 500 / global trackers) via a Stocks & Shares ISA (tax-free in the UK). Automate monthly buying, never sell on dips, let compounding run for years. This beats most professional traders over a decade.'],
              ['Pound-cost averaging', 'Fixed amount in monthly regardless of price. Removes emotion — the thing that destroys most investors.'],
              ['Emergency fund first', '3 months\' expenses in savings BEFORE any investing. Investing money you might need soon forces selling at the worst time.'],
              ['Your income is the real lever', 'At a young age, going from £500 to £2000/month income (Skills tab) beats any realistic return on a small portfolio. Invest the surplus; don\'t trade instead of earning.'],
            ]} />
            <Block title="If You Still Want to Learn Active Trading" items={[
              ['Paper trade for 6 months minimum', 'Demo account, real strategy, full journal of every trade and why. If you can\'t beat the market on paper, you\'ll just lose real money faster.'],
              ['Risk management IS the skill', 'Never risk more than 1-2% of the account per trade. Position sizing, stop losses, risk:reward of at least 1:2. Entries are 20% of it; surviving is 80%.'],
              ['One setup, mastered', 'Like the football go-to move: trade ONE pattern (e.g. breakout-retest) on ONE market until your journal shows an edge across 100+ trades. Strategy-hopping = account death.'],
              ['Psychology is the boss fight', 'Revenge trading, oversizing after wins, moving stops — the account killers are all emotional. The Mind section\'s composure work applies directly here.'],
              ['Only ever risk money you can burn', 'Trading capital = money whose total loss changes nothing in your life. Rent money on leverage is how disasters happen.'],
            ]} />
            <Block title="Red Flags — Auto-Skip List" items={[
              ['Signals groups & copy-trading gurus', 'If their signals worked, they wouldn\'t need your £50/month. They earn from subscribers, not markets.'],
              ['Screenshots of profits', 'Demo accounts and cherry-picking. Audited track records or it didn\'t happen.'],
              ['Leverage pushed at beginners', '100x leverage means a 1% move wipes you. Brokers push it because your loss is often their gain.'],
              ['"Guaranteed returns"', 'The two words that always mean scam. Real markets guarantee nothing.'],
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
