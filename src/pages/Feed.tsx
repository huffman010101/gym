import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Shuffle, ChevronRight, Flame } from 'lucide-react';

interface FeedCard {
  id: string;
  section: string;
  emoji: string;
  color: string;      // text colour class
  bg: string;         // gradient classes
  title: string;
  text: string;
  link: string;
}

const CARDS: FeedCard[] = [
  // GYM
  { id: 'g1', section: 'Gym', emoji: '🏋️', color: 'text-orange-400', bg: 'from-orange-950/60 to-black', title: 'The only 3 rules of muscle', text: 'Beat your logbook (one more rep or kg than last time), hit your protein (2g per kg bodyweight), sleep 8 hours. Everything else — the perfect split, the perfect supplement — is noise on top of these three.', link: '/programs' },
  { id: 'g2', section: 'Gym', emoji: '🏋️', color: 'text-orange-400', bg: 'from-orange-950/60 to-black', title: 'You can\'t out-train a bad diet', text: 'An hour of hard training burns ~400-600 kcal. One takeaway is 1,200+. Fat loss is won in the kitchen and multiplied in the gym — never the other way round.', link: '/food' },
  { id: 'g3', section: 'Gym', emoji: '🏋️', color: 'text-orange-400', bg: 'from-orange-950/60 to-black', title: 'The V-taper illusion', text: 'Shoulders wider than waist is the silhouette that reads across a room before anyone sees your face. Overhead press, lateral raises, pull-ups — and stay lean. That\'s the whole formula.', link: '/programs' },
  // COMBAT
  { id: 'c1', section: 'Combat', emoji: '🥊', color: 'text-red-400', bg: 'from-red-950/60 to-black', title: 'Chin down, hands up', text: 'This is 80% of not getting knocked out. Everyone drops their hands when tired without noticing — film yourself shadowboxing and see. Champions are just people whose guard survives fatigue.', link: '/combat?tab=fundamentals' },
  { id: 'c2', section: 'Combat', emoji: '🥊', color: 'text-red-400', bg: 'from-red-950/60 to-black', title: 'The body lock beats bigger men', text: 'You don\'t out-muscle a heavier opponent — you block his leg and steer. Chest to chest, hands locked behind his back, step outside his leg, drive over it. His size becomes the reason he falls harder.', link: '/combat?tab=takedowns' },
  { id: 'c3', section: 'Combat', emoji: '🥊', color: 'text-red-400', bg: 'from-red-950/60 to-black', title: 'Position before submission', text: 'Ground fighting is a ladder: back control > mount > side control > guard. Never hunt a choke from a bad position — climb first, finish second. Patience submits more people than aggression.', link: '/combat?tab=ground' },
  { id: 'c4', section: 'Combat', emoji: '🥊', color: 'text-red-400', bg: 'from-red-950/60 to-black', title: 'Breathe or gas out', text: 'Holding your breath under pressure empties your tank in 90 seconds. Exhale on every strike, slow nasal breaths in the clinch. The calm fighter in round 3 usually planned to be calm in round 1.', link: '/combat?tab=strategy' },
  // LOOKS
  { id: 'l1', section: 'Looks', emoji: '✨', color: 'text-purple-400', bg: 'from-purple-950/60 to-black', title: 'SPF is the whole game', text: '80-90% of visible facial ageing is UV damage. A £10 sunscreen every morning is the single best anti-ageing product ever invented — and without it, every dark mark you\'re trying to fade gets re-damaged daily.', link: '/guide?tab=skin' },
  { id: 'l2', section: 'Looks', emoji: '✨', color: 'text-purple-400', bg: 'from-purple-950/60 to-black', title: 'Women don\'t rank what you rank', text: 'The forums obsess over jaw angles and canthal tilt. Women actually notice: grooming, smell, skin, fit of your clothes, posture — in that order. The stuff that ranks first is all fixable this month.', link: '/looksmax?tab=techniques' },
  { id: 'l3', section: 'Looks', emoji: '✨', color: 'text-purple-400', bg: 'from-purple-950/60 to-black', title: 'Your face is under there', text: 'Cheekbones and jawline exist for almost everyone — they\'re hidden under body fat and water retention. 10-12% body fat + the debloat protocol reveals structure no exercise can build.', link: '/guide?tab=fatloss' },
  { id: 'l4', section: 'Looks', emoji: '✨', color: 'text-purple-400', bg: 'from-purple-950/60 to-black', title: 'Scent is memory', text: 'Smell is the most memory-linked sense. One signature fragrance worn consistently means people literally think of you when they smell it anywhere. That\'s not marketing — that\'s neuroscience.', link: '/looksmax?tab=fragrance' },
  { id: 'l5', section: 'Looks', emoji: '✨', color: 'text-purple-400', bg: 'from-purple-950/60 to-black', title: 'Fit > brand > everything', text: 'A £15 tee that fits your shoulders beats a £90 tee that doesn\'t. £80 of tailoring transforms your existing wardrobe more than £500 of new clothes. Nobody sees the label; everyone sees the fit.', link: '/looksmax?tab=style' },
  { id: 'l6', section: 'Looks', emoji: '✨', color: 'text-purple-400', bg: 'from-purple-950/60 to-black', title: 'The alcohol tax on your face', text: 'One heavy night = 2-3 days of facial bloat, wrecked sleep, and dehydrated skin. Nothing in your skincare routine out-works a weekly session. The Friday drinks show on your face until Tuesday.', link: '/looksmax?tab=techniques' },
  { id: 'l7', section: 'Looks', emoji: '✨', color: 'text-purple-400', bg: 'from-purple-950/60 to-black', title: 'Mewing: the honest version', text: 'Full tongue on the roof of the mouth, lips sealed, nasal breathing 24/7. Under 25 it genuinely guides bone development over 12-18 months. The instant win either way: no more mouth-breather resting face.', link: '/guide?tab=bone' },
  // MIND
  { id: 'm1', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'Confidence follows action', text: 'It never precedes it. Your brain updates its fear predictions only from evidence — and evidence only comes from doing the thing scared. The discomfort before is always worse than the thing itself.', link: '/mind?tab=confidence' },
  { id: 'm2', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'The sacred pause', text: 'Between what happens and how you respond there\'s a gap — that gap is your whole power. One slow breath before any word or action when triggered. Every regrettable text and outburst dies in that pause.', link: '/mind?tab=stoic' },
  { id: 'm3', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'Charisma = presence', text: 'The biggest driver of charisma isn\'t wit — it\'s making the person in front of you feel like the only person in the room. Phone away, full attention, react to what they actually said. Rare enough to be magnetic.', link: '/mind?tab=charisma' },
  { id: 'm4', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'Never act at the peak', text: 'Strong emotion = automatic 24-hour delay on anything irreversible. Same options tomorrow, clearer head. The Stoics ran empires on this one rule.', link: '/mind?tab=stoic' },
  { id: 'm5', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'Speak 30% less, land more', text: 'Bond wins conversations with a sentence, not a monologue. Say 70% of what you could — the withheld 30% is the aura. Silence after a strong statement lets it land.', link: '/mind?tab=aura' },
  { id: 'm6', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'Your brain isn\'t lazy — it\'s bribed', text: 'Shorts, junk food and porn pay dopamine for zero effort, so studying feels like it pays pennies. Cut the cheap sources for 2 weeks and watch hard work become startable again. Boredom is receptors healing.', link: '/mind?tab=confidence' },
  { id: 'm7', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'Standards over moods', text: 'Train when unmotivated. Work when tired. Kind when irritated. Moods are weather; standards are climate — and the entire difference between men you respect and men you don\'t is which one they obey.', link: '/mind?tab=stoic' },
  { id: 'm8', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'The 3-second rule', text: 'When you notice the urge to act — approach someone, raise your hand, start the task — move within 3 seconds. Hesitation compounds into stories; action interrupts them before they start.', link: '/mind?tab=confidence' },
  { id: 'm9', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'Peak-end rule', text: 'Nobel-winning research: people remember the most intense moment of an interaction and how it ended — the middle barely registers. Create one standout moment, always leave on a high.', link: '/mind?tab=charisma' },
  { id: 'm10', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'Steal one trait, not the whole man', text: 'Beckham\'s grooming. Craig\'s stillness. Reynolds\' warmth in the roast. Federer\'s grace in defeat. Pick the icon whose gap matches yours and run one trait for a month until it\'s yours.', link: '/mind?tab=icons' },
  // FOOTBALL
  { id: 'f1', section: 'Football', emoji: '⚽', color: 'text-emerald-400', bg: 'from-emerald-950/60 to-black', title: 'The first 5 metres win football', text: 'Most match sprints are under 20m — games are decided by who reaches the ball first, not who\'s fastest over 100m. Train explosive starts and reactive accelerations over long runs.', link: '/football?tab=speed' },
  { id: 'f2', section: 'Football', emoji: '⚽', color: 'text-emerald-400', bg: 'from-emerald-950/60 to-black', title: 'Scan every 3 seconds', text: 'Elite midfielders check their shoulders 6-8 times per 10 seconds. Know your next pass before the ball arrives and you\'ll "play faster" than players who out-sprint you.', link: '/football?tab=skills' },
  { id: 'f3', section: 'Football', emoji: '⚽', color: 'text-emerald-400', bg: 'from-emerald-950/60 to-black', title: 'Low and across the keeper', text: 'The highest-percentage finish in football: side foot, low, far corner. Keepers save high shots at their height — placement beats power everywhere inside the box.', link: '/football?tab=shooting' },
  { id: 'f4', section: 'Football', emoji: '⚽', color: 'text-emerald-400', bg: 'from-emerald-950/60 to-black', title: '100 wall touches a day', text: 'First touch is the metric that decides your level, and it\'s built alone against a wall — inside, outside, sole, both feet, touch OUT of your feet into space. Eight weeks of this changes your whole game.', link: '/football?tab=skills' },
  // MONEY
  { id: 'mo1', section: 'Money', emoji: '💰', color: 'text-yellow-400', bg: 'from-yellow-950/60 to-black', title: 'Income first, frugality later', text: 'You can\'t frugal your way from £200/month. Early on, 90% of energy goes to raising income — one skill to £2k/month beats every budgeting hack combined. Save the surplus earning creates.', link: '/money?tab=skills' },
  { id: 'mo2', section: 'Money', emoji: '💰', color: 'text-yellow-400', bg: 'from-yellow-950/60 to-black', title: '£200/month becomes £298k', text: 'At ~8% average returns over 30 years — and only £72k of it was ever deposited. Compounding is the closest thing to magic in finance, and starting at your age is the superpower. ISA, index fund, automate.', link: '/money?tab=trading' },
  { id: 'mo3', section: 'Money', emoji: '💰', color: 'text-yellow-400', bg: 'from-yellow-950/60 to-black', title: 'The first client is at message 100-300', text: 'Most people quit outreach at message 30. The maths was always: 20 personalised messages a day, 1 client per month at first, compounding after. The winners aren\'t better — they just didn\'t stop.', link: '/money?tab=online' },
  { id: 'mo4', section: 'Money', emoji: '💰', color: 'text-yellow-400', bg: 'from-yellow-950/60 to-black', title: 'If their signals worked…', text: '…they wouldn\'t need your £50/month subscription. Signals groups, guaranteed returns, courses promising fast money — they all earn from subscribers, not markets. The boring index fund path is the one that actually works.', link: '/money?tab=trading' },
  { id: 'mo5', section: 'Money', emoji: '💰', color: 'text-yellow-400', bg: 'from-yellow-950/60 to-black', title: 'Sell solutions, not time', text: 'Wages price your hours; businesses price the problem solved. "15 edited shorts a month for £750" beats any hourly rate — the shift from "what do I get paid?" to "what problem can I own?" is the whole game.', link: '/money?tab=launch' },
  // UNI
  { id: 'u1', section: 'Uni', emoji: '🎓', color: 'text-sky-400', bg: 'from-sky-950/60 to-black', title: 'Rereading is fake studying', text: 'Active recall beats rereading 3:1 in every study ever run. Close the slides, write everything you know, then check. The struggle to remember IS the learning — comfort is the tell you\'re wasting time.', link: '/uni?tab=smarter' },
  { id: 'u2', section: 'Uni', emoji: '🎓', color: 'text-sky-400', bg: 'from-sky-950/60 to-black', title: 'All-nighters delete the cramming', text: 'Memory is consolidated DURING sleep. Study then sleep 8 hours beats study-all-night every single time it\'s been tested. The night before the exam, sleep is revision.', link: '/uni?tab=sleep' },
  { id: 'u3', section: 'Uni', emoji: '🎓', color: 'text-sky-400', bg: 'from-sky-950/60 to-black', title: 'Internships open in September', text: 'Of second year — and many close by December or fill on rolling admissions. Most students find out a year too late. Spring weeks in year 1 → internship year 2 → offer. Now you know.', link: '/uni?tab=career' },
  { id: 'u4', section: 'Uni', emoji: '🎓', color: 'text-sky-400', bg: 'from-sky-950/60 to-black', title: 'Your 2pm coffee is still working at 8pm', text: 'Caffeine\'s half-life is 5-6 hours. It won\'t stop you falling asleep — it silently deletes your deep sleep. Last coffee by early afternoon and watch your mornings change.', link: '/uni?tab=sleep' },
  { id: 'u5', section: 'Uni', emoji: '🎓', color: 'text-sky-400', bg: 'from-sky-950/60 to-black', title: 'Aptitude tests are learnable', text: 'The filter that kills most applicants moves from 50th to 90th percentile with ~10 hours of practice. The candidates who pass aren\'t smarter — they\'d just seen the format before. Be one of them.', link: '/uni?tab=career' },
  // BLUEPRINT
  { id: 'b1', section: 'Blueprint', emoji: '📖', color: 'text-amber-400', bg: 'from-amber-950/60 to-black', title: 'The combination effect', text: 'Clear skin + fixed posture + debloating + jaw work + fat loss don\'t add — they multiply. None alone produces what all together produce. Your best features aren\'t missing; they\'re obscured.', link: '/guide?tab=execution' },
  { id: 'b2', section: 'Blueprint', emoji: '📖', color: 'text-amber-400', bg: 'from-amber-950/60 to-black', title: 'Aura is congruence', text: 'A tall athletic guy in wrong clothes with a weak voice = high potential, low aura — the signals don\'t cohere. Max aura isn\'t one thing done perfectly; it\'s every signal pointing the same direction at once.', link: '/guide?tab=aura' },
  { id: 'b3', section: 'Blueprint', emoji: '📖', color: 'text-amber-400', bg: 'from-amber-950/60 to-black', title: 'Slow your walk 20%', text: 'Fast walking signals anxiety; unhurried movement signals a man moving at his own pace because he can. The most immediately visible aura change there is — people notice in the first interaction.', link: '/guide?tab=aura' },
  { id: 'b4', section: 'Blueprint', emoji: '📖', color: 'text-amber-400', bg: 'from-amber-950/60 to-black', title: '"Sorry I\'m late." Full stop.', text: 'Over-explanation is a bid for approval — it signals anxiety about judgement. High status states the fact and moves on. Watch how much shorter your sentences get when you stop justifying yourself to rooms that didn\'t ask.', link: '/guide?tab=aura' },
  { id: 'b5', section: 'Blueprint', emoji: '📖', color: 'text-amber-400', bg: 'from-amber-950/60 to-black', title: '70% for 6 months', text: 'Beats 100% for 2 weeks then stopping — every time, in every domain. Consistency isn\'t one of the variables; it\'s the variable. The plan you can repeat is the best plan that exists.', link: '/guide?tab=execution' },
  { id: 'b6', section: 'Blueprint', emoji: '📖', color: 'text-amber-400', bg: 'from-amber-950/60 to-black', title: 'The voice outranks the face', text: 'After the first visual assessment, voice takes over: pitch, pace, pauses. A measured, unhurried voice reads high-status in every interaction regardless of looks — and it\'s 100% trainable in weeks.', link: '/guide?tab=aura' },
  // SECRET-ADJACENT (kept clean)
  { id: 's1', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'Grace in rejection is the flex', text: 'How you handle a no is watched by everyone — including the person who said it. Exit warm and unbothered and half of tonight\'s no\'s become next week\'s yes. Desperation repels; grace recruits.', link: '/mind?tab=secret' },
  { id: 's2', section: 'Mind', emoji: '🧠', color: 'text-pink-400', bg: 'from-pink-950/60 to-black', title: 'Be a rollercoaster of experiences…', text: '…and a rock of character. Vary the fun — banter, depth, adventure, teasing — never the respect or reliability. That combination is rare enough to be unforgettable.', link: '/mind?tab=secret' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Feed() {
  const navigate = useNavigate();
  const [seed, setSeed] = useState(0);
  const [idx, setIdx] = useState(0);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [burst, setBurst] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTap = useRef(0);

  const cards = useMemo(() => shuffle(CARDS), [seed]);

  useEffect(() => {
    try { setLikes(JSON.parse(localStorage.getItem('gymforge_feed_likes') || '{}') as Record<string, boolean>); } catch {}
  }, []);

  const toggleLike = (id: string, viaDoubleTap = false) => {
    setLikes(prev => {
      const updated = { ...prev, [id]: viaDoubleTap ? true : !prev[id] };
      localStorage.setItem('gymforge_feed_likes', JSON.stringify(updated));
      return updated;
    });
    if (viaDoubleTap) {
      setBurst(id);
      setTimeout(() => setBurst(null), 600);
    }
  };

  const handleTap = (id: string) => {
    const now = Date.now();
    if (now - lastTap.current < 300) toggleLike(id, true);
    lastTap.current = now;
  };

  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setIdx(Math.round(el.scrollTop / el.clientHeight));
  };

  const reshuffle = () => {
    setSeed(s => s + 1);
    setIdx(0);
    containerRef.current?.scrollTo({ top: 0 });
  };

  const likedCount = Object.values(likes).filter(Boolean).length;

  return (
    <main className="h-[100dvh] bg-black text-white overflow-hidden relative">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-5 pb-3 bg-gradient-to-b from-black/90 to-transparent">
        <Link to="/" className="flex items-center gap-1.5 text-gray-400 text-sm font-semibold">
          <ArrowLeft size={16} /> Home
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-bold">{idx + 1}/{cards.length}</span>
          {likedCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-pink-400 font-bold"><Heart size={11} fill="currentColor" /> {likedCount}</span>
          )}
          <button onClick={reshuffle} className="flex items-center gap-1 bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full transition-colors press">
            <Shuffle size={12} /> Shuffle
          </button>
        </div>
      </div>

      {/* Feed */}
      <div ref={containerRef} onScroll={onScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {cards.map(card => (
          <div key={card.id} onClick={() => handleTap(card.id)}
            className={`h-[100dvh] snap-start flex flex-col justify-center px-7 relative bg-gradient-to-b ${card.bg} select-none`}>

            {/* Like burst */}
            {burst === card.id && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <Heart size={110} className="text-pink-500 fade-up" fill="currentColor" style={{ filter: 'drop-shadow(0 0 30px rgba(236,72,153,0.6))' }} />
              </div>
            )}

            <div className="max-w-md mx-auto w-full">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">{card.emoji}</span>
                <span className={`text-xs font-black uppercase tracking-widest ${card.color}`}>{card.section}</span>
              </div>
              <h2 className="text-3xl font-black leading-tight mb-4">{card.title}</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">{card.text}</p>
              <div className="flex items-center gap-3">
                <button onClick={e => { e.stopPropagation(); navigate(card.link); }}
                  className={`flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors press ${card.color}`}>
                  Go deeper <ChevronRight size={15} />
                </button>
                <button onClick={e => { e.stopPropagation(); toggleLike(card.id); }}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all press ${
                    likes[card.id] ? 'bg-pink-500/20 border-pink-500/50 text-pink-400' : 'bg-white/5 border-white/15 text-gray-500 hover:text-gray-300'
                  }`}>
                  <Heart size={18} fill={likes[card.id] ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Swipe hint on first card */}
            {cards[0].id === card.id && idx === 0 && (
              <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                <p className="text-gray-600 text-xs font-semibold animate-bounce">swipe up · double-tap to like</p>
              </div>
            )}
          </div>
        ))}

        {/* End card */}
        <div className="h-[100dvh] snap-start flex flex-col items-center justify-center px-7 bg-gradient-to-b from-orange-950/50 to-black text-center">
          <Flame size={40} className="text-orange-500 mb-4" />
          <h2 className="text-3xl font-black mb-3">That's the feed.</h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm mb-8">
            Knowing it is 1%. The other 99% is in your daily checklists. Shuffle for a new order, or go execute.
          </p>
          <div className="flex gap-3">
            <button onClick={reshuffle} className="flex items-center gap-1.5 bg-white/10 border border-white/15 px-5 py-3 rounded-xl text-sm font-bold press">
              <Shuffle size={15} /> Shuffle
            </button>
            <Link to="/journey" className="flex items-center gap-1.5 bg-orange-500 px-5 py-3 rounded-xl text-sm font-bold text-white press">
              The Journey <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
