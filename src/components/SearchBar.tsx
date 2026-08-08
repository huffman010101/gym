import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';

interface Entry { label: string; section: string; path: string; keywords: string }

const INDEX: Entry[] = [
  { label: 'The Journey (guided phases + AI advisor)', section: 'Journey', path: '/journey', keywords: 'journey phases guide walkthrough plan roadmap advisor ask ai questions coach interactive start' },
  { label: 'Know More — daily general knowledge', section: 'Knowledge', path: '/knowledge', keywords: 'general knowledge learn daily world affairs history tech business deals science economics facts interesting smart trivia geopolitics' },
  { label: 'The Feed (scroll & learn)', section: 'Feed', path: '/feed', keywords: 'feed scroll swipe cards learn tips knowledge fun interactive' },
  { label: 'Blueprint: Skin & Acne Protocol', section: 'Blueprint', path: '/guide?tab=skin', keywords: 'blueprint skin acne routine retinol bha benzoyl niacinamide spf slugging hyperpigmentation marks cerave ordinary tretinoin tret prescription retin-a purging dermatica skin+me' },
  { label: 'Blueprint: Bone Development & Mewing', section: 'Blueprint', path: '/guide?tab=bone', keywords: 'blueprint bone mewing maxilla masseter mastic gum cheekbone development' },
  { label: 'Blueprint: Fat Loss & Face Reveal', section: 'Blueprint', path: '/guide?tab=fatloss', keywords: 'blueprint fat loss deficit calories protein face reveal lean cut' },
  { label: 'Blueprint: Jawline Routine', section: 'Blueprint', path: '/guide?tab=jaw', keywords: 'blueprint jawline jaw routine chin tucks neck curls gua sha' },
  { label: 'Blueprint: Hair & Scalp', section: 'Blueprint', path: '/guide?tab=hair', keywords: 'blueprint hair scalp rosemary oil wavy waves dermaroller wash haircut french crop verb' },
  { label: 'Blueprint: Grooming Detail', section: 'Blueprint', path: '/guide?tab=grooming', keywords: 'blueprint grooming eyebrows threading castor oil lips under eyes teeth stubble beard neckline' },
  { label: 'Blueprint: Posture Routine', section: 'Blueprint', path: '/guide?tab=posture', keywords: 'blueprint posture apt anterior pelvic tilt rib flare stomach vacuum dead hang wall angels neck training' },
  { label: 'Back Extensions & Neck Thickness', section: 'Blueprint', path: '/guide?tab=posture', keywords: 'back extensions erectors lower back neck thicker stronger harness curls shrugs traps rdl' },
  { label: 'Blueprint: Debloating', section: 'Blueprint', path: '/guide?tab=debloat', keywords: 'blueprint debloat lymph collarbone gua sha ice roller sodium' },
  { label: 'Blueprint: Supplements & Lifestyle', section: 'Blueprint', path: '/guide?tab=supps', keywords: 'blueprint supplements zinc omega collagen biotin spearmint b6 creatine d3 magnesium sleep hydration' },
  { label: 'Blueprint: Execution Order & Timeline', section: 'Blueprint', path: '/guide?tab=execution', keywords: 'blueprint execution week 1 timeline order start plan' },
  { label: 'Blueprint: Aura 0→100 Roadmap', section: 'Blueprint', path: '/guide?tab=aura', keywords: 'blueprint aura psl levels roadmap presence walk voice high status behaviour tall style fit tailor signature' },
  { label: 'Blueprint: The Social Edge', section: 'Blueprint', path: '/guide?tab=social', keywords: 'blueprint social edge confidence exposure charisma memorable peak end ford mirror label daily stack' },
  { label: 'Fighting as the Taller Man', section: 'Combat', path: '/combat?tab=strategy', keywords: 'tall taller height reach boxing muay thai grappling teep jab range' },
  { label: 'Investing 101 & Financial Freedom', section: 'Money', path: '/money?tab=trading', keywords: 'investing stocks isa index funds financial freedom fire compound passive income' },
  { label: 'Backtest Lab — test strategies & paper trade', section: 'Money', path: '/backtest', keywords: 'backtest trading strategy nasdaq100 nasdaq paper trade simulate simulator moving average rsi macd breakout practice' },
  { label: 'Stretching & Posture Routine', section: 'Looks', path: '/looksmax?tab=techniques', keywords: 'stretching posture stretch mobility apt anterior pelvic tilt rounded shoulders forward head' },
  { label: 'Running for Debloat', section: 'Looks', path: '/looksmax?tab=techniques', keywords: 'running cardio debloat zone 2 face fat sharp jawline steps' },
  { label: 'Zygos Pop Protocol', section: 'Looks', path: '/looksmax?tab=techniques', keywords: 'zygos cheekbones pop gua sha lymphatic hollow cheeks' },
  { label: 'Football: Home Drills (solo, no pitch)', section: 'Football', path: '/football?tab=home', keywords: 'football home drills solo alone wall ball mastery juggling touch cones garden practice training weak foot no equipment' },
  { label: 'Football: Becoming Elite', section: 'Football', path: '/football?tab=elite', keywords: 'football elite best player ever improve fastest separate professional mentality deliberate practice two footed scanning' },
  { label: 'Book Notes — key takeaways from the classics', section: 'Uni', path: '/uni?tab=books', keywords: 'books book notes summary summaries reading atomic habits carnegie win friends influence people cant hurt me goggins rich dad poor dad psychology of money housel deep work mindset dweck kahneman thinking fast slow never split difference voss cialdini models manson richest man babylon millionaire next door takeaways self improvement' },
  { label: 'Padel — technique, strategy & wall play', section: 'Padel', path: '/padel', keywords: 'padel racket bandeja vibora serve volley wall glass court smash strategy positioning drills plan' },
  { label: 'Money: Investing (ISA, index funds, FIRE)', section: 'Money', path: '/money?tab=invest', keywords: 'investing invest isa stocks shares index fund s&p global tracker compound pound cost averaging fire financial freedom accumulation fees platform vanguard' },
  { label: 'Money: Tax (UK)', section: 'Money', path: '/money?tab=tax', keywords: 'tax hmrc self assessment national insurance income tax allowance side hustle trading allowance capital gains cgt dividend vat sole trader' },
  { label: 'Money: Economics explained', section: 'Money', path: '/money?tab=econ', keywords: 'economics inflation interest rates gdp recession supply demand elasticity central bank monetary fiscal policy' },
  { label: 'Mind: The Code (whole-section takeaway)', section: 'Mind', path: '/mind?tab=code', keywords: 'the code summary takeaway one page whole section highest leverage overview' },
  { label: 'Uni: My Subject (AI concept explainer)', section: 'Uni', path: '/uni?tab=subject', keywords: 'my subject course modules concepts explain ai economics simple explanation facts related' },
  { label: 'Blueprint: Lifestyle', section: 'Blueprint', path: '/guide?tab=lifestyle', keywords: 'lifestyle habits daily sleep hydration water stress alcohol smoking sun exposure' },
  { label: 'Football: The Plan', section: 'Football', path: '/football?tab=plan', keywords: 'football plan weekly schedule training programme how to run it' },
  { label: 'Football: Set Pieces', section: 'Football', path: '/football?tab=setpieces', keywords: 'set pieces free kick corner penalty technique knuckleball delivery dead ball' },
  { label: 'Football: Gym work', section: 'Football', path: '/football?tab=gym', keywords: 'football gym lifts strength trap bar hip thrust split squat nordic power speed' },
  { label: 'Combat: Gym work', section: 'Combat', path: '/combat?tab=gym', keywords: 'combat gym strength neck training grip power punch conditioning fighter lifts' },
  // Gym
  { label: 'The Program — Upper & Lower', section: 'Gym', path: '/programs', keywords: 'program programme workout routine split upper body lower body aesthetic functional combat power speed explosive strength push pull squat deadlift sprint jump' },
  { label: 'Workout Plan (AI)', section: 'Gym', path: '/plan', keywords: 'training split programme exercises workout plan quiz' },
  { label: 'Food Log & Macros', section: 'Gym', path: '/food', keywords: 'food eat calories macros protein diet nutrition meals fuel' },
  { label: 'Physique AI Review', section: 'Gym', path: '/physique', keywords: 'physique photos progress body ai review muscle' },
  { label: 'Skin Photo AI Routine', section: 'Gym', path: '/physique', keywords: 'skin photo analysis personalised skincare routine ai scan' },
  // Combat
  { label: 'Striking Fundamentals', section: 'Combat', path: '/combat?tab=fundamentals', keywords: 'stance jab punch boxing defence slip block clinch striking fight' },
  { label: 'Takedowns', section: 'Combat', path: '/combat?tab=takedowns', keywords: 'takedown double leg single leg body lock trip sweep sprawl wrestle wrestling' },
  { label: 'Ground Game', section: 'Combat', path: '/combat?tab=ground', keywords: 'ground bjj guard mount side control escape grappling jiu jitsu' },
  { label: 'Chokes & Submissions', section: 'Combat', path: '/combat?tab=chokes', keywords: 'choke rear naked guillotine triangle armbar kimura submission tap' },
  { label: 'Fight Strategy (bigger/taller)', section: 'Combat', path: '/combat?tab=strategy', keywords: 'bigger stronger taller opponent strategy fight iq mma' },
  // Looks
  { label: 'AI Face Scan', section: 'Looks', path: '/looksmax?tab=scan', keywords: 'face scan haircut hairstyle facial hair glasses analysis photo upload ai' },
  { label: 'Hair', section: 'Looks', path: '/looksmax?tab=hair', keywords: 'hair hairstyle dermaroll minoxidil barber cut' },
  { label: 'Face (posture, eyes, lips, mewing)', section: 'Looks', path: '/looksmax?tab=face', keywords: 'face skincare posture chin tuck forward head eyes dark circles lips mewing jawline' },
  { label: 'Methods (teeth, tanning, supplements…)', section: 'Looks', path: '/looksmax?tab=techniques', keywords: 'teeth whitening tanning tan supplements creatine debloat symmetry nose maxilla zygos hyoid female gaze harmony lifestyle foods desirability audit methods techniques' },
  { label: 'Style & Colours', section: 'Looks', path: '/looksmax?tab=style', keywords: 'style colours colour clothes outfit wardrobe capsule undertone contrast glasses sunglasses archetype fit pose posing photos photography camera framing high value photo iphone editing' },
  { label: 'High-Value Instagram — grid, posts & reset', section: 'Looks', path: '/looksmax?tab=style', keywords: 'instagram insta ig social media presence grid profile bio posts captions highlights stories followers post ideas aesthetic feed 30 day reset thirst trap' },
  { label: 'Grooming', section: 'Looks', path: '/looksmax?tab=grooming', keywords: 'grooming beard eyebrows brows nails body hair trim' },
  { label: 'Scent / Fragrance', section: 'Looks', path: '/looksmax?tab=fragrance', keywords: 'scent fragrance perfume cologne smell layering combos edp edt most complimented' },
  { label: 'Looksmax Tracker', section: 'Looks', path: '/looksmax?tab=tracker', keywords: 'tracker checklist daily routine morning evening weekly' },
  // Mind
  { label: 'Security — being settled in yourself', section: 'Mind', path: '/mind?tab=security', keywords: 'security secure insecure insecurity self worth self trust settled grounded unbothered validation reassurance comparison confidence identity' },
  { label: 'Charisma & Conversation', section: 'Mind', path: '/mind?tab=charisma', keywords: 'charisma conversation voice body language storytelling banter funny humour group status punching bag' },
  { label: 'High Value — frame, looks & being chased', section: 'Mind', path: '/mind?tab=highvalue', keywords: 'high value frame looks chased girls attraction attractive neediness needy abundance standards outcome independence chasing women dating value instagram insta social bad boys nice guy night out mistakes reading interest tests ambition mindset dont care unbothered' },
  { label: 'Aura & High-Value Habits', section: 'Mind', path: '/mind?tab=aura', keywords: 'aura james bond high value habits composure positivity psychology restraint' },
  { label: 'Stoicism & Emotional Control', section: 'Mind', path: '/mind?tab=stoic', keywords: 'stoic stoicism emotions control anger marcus aurelius seneca epictetus being a man masculinity discipline code' },
  { label: 'Icons (Beckham, Ronaldo…)', section: 'Mind', path: '/mind?tab=icons', keywords: 'icons beckham ronaldo reynolds bond gandy federer keanu inspiration famous role model' },
  { label: 'Confidence', section: 'Mind', path: '/mind?tab=confidence', keywords: 'confidence nerves approval seeking validation self belief courage' },
  { label: 'Uncook Your Brain — 10 rules', section: 'Mind', path: '/mind?tab=focus', keywords: 'uncook brain fog rules no music shower sunlight gooning porn short form scrolling phone focus present boredom rewire reset' },
  { label: 'Dopamine Detox & Deep Work', section: 'Mind', path: '/mind?tab=focus', keywords: 'lazy laziness dopamine detox motivation discipline procrastination hard work focus willpower deep work groggy scrolling' },
  { label: 'Whole-Food Diet & Water Retention', section: 'Looks', path: '/looksmax?tab=techniques', keywords: 'whole foods diet eating clean water retention bloat sodium potassium 80 20' },
  { label: 'Self-Talk Scripts', section: 'Mind', path: '/mind?tab=selftalk', keywords: 'self talk affirmations inner critic mindset scripts' },
  { label: '🔒 Secret Playbook', section: 'Mind', path: '/mind?tab=secret', keywords: 'secret girls dating texting chase girlfriend nights out club approach women intimacy rollercoaster' },
  // Football
  { label: 'Sprint Speed', section: 'Football', path: '/football?tab=speed', keywords: 'sprint speed faster acceleration running pace nordic' },
  { label: 'Shooting & Finishing', section: 'Football', path: '/football?tab=shooting', keywords: 'shooting finishing shot volley chip penalty striker technique' },
  { label: 'Every Skill Metric', section: 'Football', path: '/football?tab=skills', keywords: 'first touch passing dribbling weak foot stamina heading scanning skills' },
  { label: 'By Position', section: 'Football', path: '/football?tab=position', keywords: 'position striker winger midfielder fullback defender goalkeeper cam cdm' },
  { label: 'Physicality — Win Every Duel', section: 'Football', path: '/football?tab=physical', keywords: 'physical physicality strong strength duels body bully haaland khusanov shielding aerial headers mass bulk size contact hold off dominant' },
  // Money
  { label: 'Money Skills', section: 'Money', path: '/money?tab=skills', keywords: 'money skills editing copywriting coding sales content trades income earn' },
  { label: 'Online Income & Social Media', section: 'Money', path: '/money?tab=online', keywords: 'freelancing fiverr upwork flipping dropshipping agency social media presence audience followers' },
  { label: 'Launch a Business', section: 'Money', path: '/money?tab=launch', keywords: 'business plan startup launch validate legal millionaire roadmap model modelling agency wealthy rich' },
  { label: 'Trading & Investing', section: 'Money', path: '/money?tab=trading', keywords: 'trading investing stocks index funds isa crypto forex day trading' },
  { label: 'Money Rules & Psychology', section: 'Money', path: '/money?tab=mindset', keywords: 'money rules wealth psychology saving debt pay yourself' },
  // Uni
  { label: 'AI Study Pack (revision)', section: 'Uni', path: '/uni?tab=ai', keywords: 'study revision timetable exam notes summary equation sheet powerpoint lectures uni university modules' },
  { label: 'Get Smarter', section: 'Uni', path: '/uni?tab=smarter', keywords: 'smarter intelligence learning memory focus recall feynman anki brain iq reading' },
  { label: 'Night Routine', section: 'Mind', path: '/mind?tab=night', keywords: 'night routine evening bedtime wind down sleep screens blue light phone bedroom bed insomnia cant sleep alcohol nap shutdown' },
  { label: 'Morning Routine', section: 'Mind', path: '/mind?tab=morning', keywords: 'morning routine wake up early light water phone cold shower caffeine coffee breakfast protein snooze grogginess energy start day productive' },
  { label: 'High-Value Day Routine', section: 'Uni', path: '/uni?tab=day', keywords: 'day routine schedule morning structure productivity high value' },
  { label: 'Career, Interviews & HireVue', section: 'Uni', path: '/uni?tab=career', keywords: 'career job interview hirevue cv application internship aptitude tests quizzes star graduate' },
  { label: 'Sleep Lab', section: 'Uni', path: '/uni?tab=sleep', keywords: 'sleep deep tired red light blue light glasses melatonin nap insomnia energy' },
];

export default function SearchBar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    return INDEX
      .map(e => {
        const inLabel = e.label.toLowerCase().includes(query);
        const inKeywords = e.keywords.includes(query);
        const score = inLabel ? 2 : inKeywords ? 1 : 0;
        return { e, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(r => r.e);
  }, [q]);

  const go = (path: string) => {
    setQ('');
    navigate(path);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2.5 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-orange-500/40 transition-colors">
        <Search size={16} className="text-gray-600 flex-shrink-0" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && results[0]) go(results[0].path); }}
          placeholder="Search anything… scent, takedowns, sleep, HireVue"
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-600"
        />
      </div>
      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#161616] border border-white/10 rounded-2xl overflow-hidden z-40 shadow-2xl fade-up">
          {results.map(r => (
            <button key={r.path + r.label} onClick={() => go(r.path)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-200">{r.label}</p>
                <p className="text-[11px] text-gray-600">{r.section}</p>
              </div>
              <ChevronRight size={14} className="text-gray-600 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
