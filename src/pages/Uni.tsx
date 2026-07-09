import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Brain, Sun, Briefcase, Moon, Loader2, AlertCircle, ChevronDown, Sparkles, Clock } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DailyHabits from '../components/DailyHabits';
import { generateStudyPack } from '../lib/generators';
import type { StudyPack } from '../lib/generators';

type Tab = 'ai' | 'smarter' | 'day' | 'career' | 'sleep';

const TABS: { id: Tab; label: string }[] = [
  { id: 'ai', label: 'AI Study Pack' },
  { id: 'smarter', label: 'Get Smarter' },
  { id: 'day', label: 'High-Value Day' },
  { id: 'career', label: 'Career' },
  { id: 'sleep', label: 'Sleep Lab' },
];

function Block({ title, items, accent = 'text-sky-300' }: { title: string; items: [string, string][]; accent?: string }) {
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
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden press">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{title}</p>
          <p className="text-xs text-sky-400/70 mt-0.5">{tag}</p>
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

export default function Uni() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = params.get('tab');
    return (['ai', 'smarter', 'day', 'career', 'sleep'] as const).includes(t as Tab) ? (t as Tab) : 'ai';
  });
  const [course, setCourse] = useState('');
  const [modules, setModules] = useState('');
  const [examInfo, setExamInfo] = useState('');
  const [materials, setMaterials] = useState('');
  const [pack, setPack] = useState<StudyPack | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gymforge_studypack');
      if (saved) {
        const parsed = JSON.parse(saved) as { course: string; modules: string; examInfo: string; pack: StudyPack };
        setCourse(parsed.course); setModules(parsed.modules); setExamInfo(parsed.examInfo); setPack(parsed.pack);
      }
    } catch {}
  }, []);

  const generate = async () => {
    if (!course.trim() || !modules.trim()) return;
    setBusy(true); setError('');
    try {
      const result = await generateStudyPack(course.trim(), modules.trim(), examInfo.trim(), materials.trim());
      setPack(result);
      localStorage.setItem('gymforge_studypack', JSON.stringify({ course, modules, examInfo, pack: result }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed. Check your API key.');
    }
    setBusy(false);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-sky-950/40 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-sky-500/10 rounded-xl flex items-center justify-center">
            <GraduationCap className="text-sky-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Uni & Brain</h1>
            <p className="text-gray-500 text-sm">AI Revision · Intelligence · Routine · Career · Sleep</p>
          </div>
        </div>

        <DailyHabits section="uni" />

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-6 -mx-5 px-5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-sky-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== AI STUDY PACK ===== */}
        {tab === 'ai' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={15} className="text-sky-400" />
                <h2 className="font-bold">AI Study Pack Generator</h2>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">
                Tell it your course + modules and paste your lecture content (open your PowerPoints → select-all → copy → paste here;
                rough formatting is fine). It builds your revision timetable, priority list, summary sheet, equation sheet and dense notes.
              </p>
              <div className="space-y-2.5">
                <input value={course} onChange={e => setCourse(e.target.value)} placeholder="Course (e.g. BSc Economics, Year 1)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500/50" />
                <input value={modules} onChange={e => setModules(e.target.value)} placeholder="Modules/topics (e.g. Microeconomics, Statistics, Maths for Econ)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500/50" />
                <input value={examInfo} onChange={e => setExamInfo(e.target.value)} placeholder="Exam dates & format (e.g. 20 May, 2h written + MCQ)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500/50" />
                <textarea value={materials} onChange={e => setMaterials(e.target.value)} rows={5}
                  placeholder="Paste lecture slides / notes here (as much as you can — it uses this to build YOUR pack, not a generic one)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500/50 resize-none" />
                <button onClick={generate} disabled={busy || !course.trim() || !modules.trim()}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  {busy ? <><Loader2 size={15} className="animate-spin" /> Building your pack (30-60s)…</> : 'Generate My Study Pack'}
                </button>
                {error && <p className="text-red-400 text-xs flex items-center gap-1.5"><AlertCircle size={12} /> {error}</p>}
              </div>
            </div>

            {pack && (
              <>
                <div className="bg-[#111] border border-sky-500/20 rounded-2xl p-5">
                  <h3 className="font-bold text-sky-300 mb-3 flex items-center gap-2"><Clock size={15} /> Revision Timetable</h3>
                  <div className="space-y-3">
                    {pack.timetable.map(d => (
                      <div key={d.day} className="bg-black/30 border border-white/5 rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="font-bold text-sm">{d.day}</p>
                          <span className="text-[10px] bg-sky-500/15 text-sky-400 px-2 py-0.5 rounded-full">{d.focus}</span>
                        </div>
                        <ul className="space-y-1">
                          {d.tasks.map((t, i) => <li key={i} className="text-gray-400 text-xs leading-relaxed">• {t}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
                  <h3 className="font-bold text-amber-300 mb-2">🎯 Priority Sheet — where the marks live</h3>
                  <ul className="space-y-1.5">
                    {pack.prioritySheet.map((p, i) => <li key={i} className="text-gray-300 text-sm leading-relaxed">• {p}</li>)}
                  </ul>
                </div>
                <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
                  <h3 className="font-bold text-emerald-300 mb-3">📄 Summary Sheet</h3>
                  <div className="space-y-3">
                    {pack.summarySheet.map(s => (
                      <div key={s.topic}>
                        <p className="font-semibold text-sm text-gray-200 mb-1">{s.topic}</p>
                        <ul className="space-y-1">
                          {s.keyPoints.map((k, i) => <li key={i} className="text-gray-400 text-xs leading-relaxed">• {k}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
                  <h3 className="font-bold text-purple-300 mb-3">∑ Equation / Framework Sheet</h3>
                  <div className="space-y-3">
                    {pack.equationSheet.map(eq => (
                      <div key={eq.name} className="bg-black/30 border border-white/5 rounded-xl p-3.5">
                        <p className="font-semibold text-sm text-gray-200">{eq.name}</p>
                        <p className="text-purple-300/90 text-sm font-mono my-1">{eq.formula}</p>
                        <p className="text-gray-500 text-xs">Use when: {eq.whenToUse}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-200 mb-2">📚 Dense Notes</h3>
                  <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-wrap">{pack.denseNotes}</p>
                </div>
                <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
                  <h3 className="font-bold text-red-300 mb-2">✍️ Exam Technique for Your Format</h3>
                  <ul className="space-y-1.5">
                    {pack.examTips.map((t, i) => <li key={i} className="text-gray-300 text-sm leading-relaxed">• {t}</li>)}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== GET SMARTER ===== */}
        {tab === 'smarter' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Learning Science — study half as long, remember twice as much" items={[
              ['Active recall beats rereading 3:1', 'Close the slides. Write/say everything you know about the topic, THEN check what you missed. The struggle to retrieve IS the learning — rereading just feels like learning.'],
              ['Spaced repetition', 'Review at day 1, 3, 7, 14, 30. Use Anki for flashcards — 15 min/day of spaced cards beats a 3-hour cram for retention. Make cards from lectures the same day.'],
              ['The Feynman technique', 'Explain the concept out loud as if to a 12-year-old. Every place you stall or use jargon you can\'t unpack = a gap. Fix the gap, repeat. If you can\'t teach it, you don\'t know it.'],
              ['Interleaving', 'Mix problem types within a session (ABCABC, not AAABBB). Feels harder, tests better — exams mix topics, so should practice.'],
              ['Past papers are the syllabus', 'Examiners repeat patterns. 5 past papers under timed conditions teach you what actually gets asked — the single highest-ROI revision activity.'],
            ]} />
            <Block title="Focus — the real intelligence multiplier" items={[
              ['Deep work blocks', '90 minutes, phone in another room (physically — willpower loses to proximity), one task, then a 15-min break. Two real blocks beat 8 hours of distracted "studying".'],
              ['The 5-minute rule', 'Can\'t start? Commit to just 5 minutes. Starting is the only hard part — momentum does the rest.'],
              ['Attention is trainable', 'Every time you notice drift and return to the task, that\'s one rep. Meditation (10 min/day, any app) is literally attention gym — measurable focus gains in 2 weeks.'],
              ['Environment design', 'Same desk, same playlist (no lyrics), water ready, notifications off. Your brain learns "this setup = work mode" and drops into focus faster each time.'],
            ]} />
            <Block title="Raw Brainpower — what actually moves it" items={[
              ['Exercise is cognition fuel', 'Cardio + lifting increase BDNF (brain fertiliser), memory and processing speed. The gym section is literally making you smarter.'],
              ['Sleep consolidates memory', 'Learning happens awake; remembering is built asleep. All-nighters DELETE the material you crammed. (Sleep Lab tab.)'],
              ['Read daily, mix difficulty', '20 pages/day. One challenging book (ideas above your level) + anything enjoyable. Vocabulary, reasoning and worldview compound like money.'],
              ['Write to think', 'Writing forces clarity that thinking alone fakes. Summarise ideas in your own words — journal, notes, arguments. Fuzzy writing exposes fuzzy thinking.'],
              ['Learn hard things constantly', 'New language, instrument, coding, chess — difficulty is the stimulus. Comfort content (feeds, highlights) is cognitive junk food.'],
              ['Feed it', 'Omega-3s, eggs (choline), berries, dark chocolate, hydration, caffeine BEFORE studying not during sleep hours. Chronic sugar + ultra-processed = brain fog.'],
            ]} />
          </div>
        )}

        {/* ===== HIGH-VALUE DAY ===== */}
        {tab === 'day' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Sun size={16} className="text-sky-400" /> The Architecture of a High-Value Day</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                You don't rise to goals, you fall to systems. This template stacks everything in this app into one repeatable day.
                Adjust times to your lectures — protect the STRUCTURE, not the exact clock.
              </p>
            </div>
            {[
              ['06:30-07:30 — Launch sequence', ['Wake same time daily (weekends ±1h max) — this alone upgrades sleep quality', 'Sunlight in eyes within 30 min (window/walk) — sets your circadian clock, boosts daytime energy', 'Water + make bed + 5 min movement or stretch', 'NO PHONE for the first 30 min — your attention is highest-value before the world claims it']],
              ['07:30-08:00 — Body & face', ['Shower (end 30s cold — proven mood/alertness spike)', 'Skincare AM routine (Looks tab)', 'Fragrance, outfit from your capsule — dress intentionally even for lectures', 'Breakfast: protein-anchored (eggs), not cereal']],
              ['08:00-12:00 — Deep work block', ['Hardest mental work FIRST while glucose and willpower are full: lectures, study pack tasks, business building', '90-min focus blocks, phone in another room', 'This is where degrees and businesses are actually built — protect it violently']],
              ['12:00-14:00 — Fuel & train', ['Lunch: protein + carbs (performance meal, not a deli meal deal)', 'Training: gym / football / combat (your programme from Gym tab)', 'Training midday = energy for the afternoon instead of a slump']],
              ['14:00-18:00 — Second block', ['Lectures, lighter study (flashcards, past-paper review), applications & outreach (Career tab, Money sprint)', 'Social time slots here too — lunch with mates, society stuff: connection is a pillar, not a distraction']],
              ['18:00-21:00 — Life block', ['Dinner (cook properly — a man who cooks is ahead on 3 metrics at once)', 'Social / date / calls home / hobby', 'Content creation or business admin if building (Money tab)']],
              ['21:00-22:30 — Shutdown sequence', ['Screens dim/off by 21:30 (or blue-blockers on — Sleep Lab)', 'PM skincare + tomorrow\'s 3 priorities written down (kills morning decision fatigue AND bedtime rumination)', '3 wins logged (Mind tab) + read 20 pages', 'Same bedtime every night — the whole day\'s energy is decided here']],
            ].map(([title, items]) => (
              <div key={title as string} className="bg-[#111] border border-white/8 rounded-2xl p-5">
                <h3 className="font-bold text-sky-300 mb-2">{title as string}</h3>
                <ul className="space-y-1.5">
                  {(items as string[]).map((it, i) => <li key={i} className="text-gray-400 text-sm leading-relaxed">• {it}</li>)}
                </ul>
              </div>
            ))}
            <Block title="The rules that hold it together" items={[
              ['Non-negotiables vs flexibles', 'Wake time, training, deep work block, shutdown = fixed. Everything else can move around them. 4 anchors is enough to make any chaotic day high-value.'],
              ['The 80% rule', 'Hitting this 5-6 days a week transforms you within months. Hitting it 7/7 for two weeks then quitting transforms nothing. Consistency > intensity, everywhere, always.'],
              ['Track leading, not lagging', 'Don\'t judge days by outcomes (marks, matches, money) — judge by whether you executed the blocks. Outcomes follow execution with a delay.'],
              ['One day = the life', 'How you do one Tuesday is how you do everything. The day IS the transformation — there is no other mechanism.'],
            ]} />
          </div>
        )}

        {/* ===== CAREER ===== */}
        {tab === 'career' && (
          <div className="fade-up stagger space-y-4">
            <Block title="The Headstart Strategy — get ahead of everyone" items={[
              ['The timeline nobody tells you', 'Spring weeks (Year 1) → summer internships (Year 2, applications open SEPTEMBER of Year 2, close by December) → grad offers from converting internships. Most students find out a year too late. You now know.'],
              ['Apply early, literally', 'Many schemes fill on a rolling basis — an identical application in September beats itself submitted in November. Set the deadlines in your calendar NOW.'],
              ['Volume with quality floor', '15-30 applications is normal for competitive schemes. Build one excellent master CV + cover letter skeleton, customise 20% per application.'],
              ['The uni years CV formula', 'Grades + one leadership thing (society role, sports captain, event run) + one initiative thing (your business, content, this-app-level projects) + one skill (coding, languages, editing). That combination beats a 1st with nothing around it.'],
              ['Network like it\'s a module', 'LinkedIn profile done properly, connect with alumni at target firms, 2-line message: what you\'re studying, one specific question. 10% reply, those replies become referrals — referred applications are ~5× more likely to land.'],
            ]} />
            <Fold title="CV & Applications" tag="Pass the 6-second scan" items={[
              ['One page, results-first', 'Every bullet: action verb + what + measurable result. "Grew society membership 40% by running 6 events" not "responsible for events".'],
              ['Mirror the job description', 'ATS software and tired recruiters both scan for their own keywords. Echo their exact phrasing for skills you genuinely have.'],
              ['Kill the padding', '"Hard-working team player with a passion for excellence" says nothing. Specifics or delete.'],
              ['Cover letters: company-specific paragraph first', 'Why THIS firm (name a deal, product, value — something real), why you, evidence. 250 words max.'],
            ]} />
            <Fold title="Online Tests & Aptitude Quizzes" tag="The filter that kills most applicants" items={[
              ['They\'re learnable — that\'s the secret', 'Numerical, verbal, logical reasoning tests repeat formats. 10 hours of practice moves you from 50th to 90th percentile. Free practice: AssessmentDay, Practice Aptitude Tests, JobTestPrep samples.'],
              ['Numerical: it\'s GCSE maths at speed', 'Percentages, ratios, graph reading. The skill is SPEED — drill until 60 seconds per question feels roomy. Keep a calculator and rough paper ready.'],
              ['Verbal: answer ONLY from the passage', 'The trap is using outside knowledge. True/False/Cannot Say — "Cannot Say" is correct more often than instinct suggests.'],
              ['Situational judgement (SJT)', 'They\'re testing values: team-first, escalate-appropriately, customer-focus, integrity ALWAYS wins. Read the company\'s values page first — the "right" answers are literally published there.'],
              ['Game-based assessments', '(Pymetrics etc.) Don\'t overthink — play honestly but alert, full attention, no distractions. They measure consistency as much as performance.'],
            ]} />
            <Fold title="HireVue & Video Interviews" tag="Talking to a camera without dying inside" items={[
              ['The format', 'Pre-recorded questions, 30s prep, 1-3 min answers, sometimes AI-scored on content and delivery. Practise with your actual phone camera — the awkwardness fades by attempt five.'],
              ['STAR everything', 'Situation (1 line), Task (1 line), Action (the meat — what YOU did), Result (number or outcome). 90 seconds. Prepare 6 stories that flex to any question: leadership, conflict, failure, pressure, teamwork, initiative.'],
              ['Camera = eye contact', 'Look at the LENS not the screen. Laptop at eye height, window light in front of you, plain background, dressed sharp (full effect on your own psychology too).'],
              ['Energy 20% above natural', 'Cameras eat energy. Smile at the start and end, gesture normally, vary your tone — flat delivery scores badly with humans and algorithms alike.'],
              ['Use the prep time', '30 seconds = pick your story + first sentence. A strong first sentence ("The toughest deadline I\'ve handled was…") buys composure for the rest.'],
            ]} />
            <Fold title="Live Interviews" tag="Where offers actually happen" items={[
              ['Preparation IS the confidence', 'Know: their business model, 2 recent news items, why this role, your 6 STAR stories, your questions for them. The Mind section handles nerves; preparation removes their cause.'],
              ['First 90 seconds decide the vibe', 'Firm handshake, eye contact, "great to meet you", sit tall. Interviewers confirm first impressions for the remaining 40 minutes — make the first one count.'],
              ['Answer, then stop', 'Strong answer + silence beats strong answer + nervous rambling that talks them out of it. Comfortable with pauses = senior energy.'],
              ['Have real questions', '"What separates the people who excel here from the ones who just do fine?" — signals ambition and gives you intel. Never "no questions, I think you covered it".'],
              ['Follow up same day', '3-line thank-you email referencing one specific moment from the conversation. Almost nobody does it; it\'s remembered.'],
            ]} />
          </div>
        )}

        {/* ===== SLEEP LAB ===== */}
        {tab === 'sleep' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Moon size={16} className="text-sky-400" /> Sleep Is the Master Metric</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every section of this app — muscle, skin, face, brain, mood, testosterone, patience with people — runs on sleep.
                Deep, consistent sleep is the closest thing to a legal performance drug. Here's the full protocol.
              </p>
            </div>
            <Block title="The Non-Negotiables" items={[
              ['Same wake time, 7 days a week', 'The single most powerful sleep intervention. Your circadian rhythm is a clock — moving it 3 hours at weekends is self-inflicted jet lag (that Monday tiredness is literal jet lag).'],
              ['Morning light, evening dark', 'Sunlight within 30 min of waking anchors the clock and triggers the melatonin release ~16h later. The morning walk is a sleeping pill you take at 7am.'],
              ['Caffeine cutoff: 8-10h before bed', 'Half of your 2pm coffee is still in your blood at 8pm. It doesn\'t stop you falling asleep — it silently deletes your deep sleep. Last coffee by early afternoon.'],
              ['Cool, dark, quiet cave', '17-19°C room (cool triggers sleep onset), blackout curtains or eye mask, earplugs if needed. Warm hands/feet + cool room = fastest sleep onset combo.'],
              ['Alcohol honesty', 'It knocks you out then wrecks REM and deep sleep for the whole night. "I sleep fine when drinking" = you\'re unconscious, not asleep.'],
            ]} />
            <Block title="Blue Light & Red Light — what's real" items={[
              ['The mechanism is real', 'Blue-spectrum light (phones, laptops, big ceiling lights) suppresses melatonin and delays your body clock. Evening screens genuinely push sleep later and thin it out.'],
              ['Blue-blocking glasses — worth it, with caveats', 'Evidence is decent for AMBER/RED-tinted lenses worn 2-3h before bed (clear "blue-blocking" lenses filter too little to matter). £15-30 amber glasses are a legit tool for unavoidable evening screen time — not a licence to doomscroll till 1am.'],
              ['Software layer too', 'Night Shift/f.lux at maximum warmth from sunset, brightness right down, dark mode. Better: screens off 30-60 min before bed entirely — the CONTENT (dopamine, stress) harms sleep as much as the light.'],
              ['Evening environment', 'After sunset switch to lamps low in the room (light below eye level), warm bulbs (2700K or lower). Bright overhead white light at 10pm tells your brain it\'s noon.'],
              ['Red light therapy panels', 'Different thing — decent early evidence for skin (collagen) and recovery, NOT required for sleep. If curious: 10-20 min red panel sessions are the looksmax angle, but it\'s optional-tier, not core.'],
            ]} />
            <Block title="Deep Sleep Maximisers" items={[
              ['The wind-down ramp (60 min)', 'Same order nightly trains a sleep trigger: dim lights → hot shower (the after-drop in body temp induces sleepiness) → skincare → read paper book → bed. Boring by design.'],
              ['Empty the brain onto paper', 'Tomorrow\'s 3 priorities + anything circling your head, written down. Rumination is the #1 sleep killer for driven people — paper holds it overnight so your head doesn\'t.'],
              ['Breathing to switch off', 'Physiological sighs ×3, then 4-7-8 breathing (in 4, hold 7, out 8) in bed. Long exhales activate the rest state — it\'s a dimmer switch you control.'],
              ['Magnesium glycinate 200-400mg', 'The one supplement with real support for sleep depth (see supplement stack). Skip melatonin pills as a nightly crutch — useful for jet lag, badly dosed for daily use.'],
              ['Eating & training timing', 'Last big meal 2-3h before bed; train hard but not within ~2h of sleep. A small carb-containing dinner actually helps sleep onset — don\'t fear it.'],
              ['If you can\'t sleep in 20 min', 'Get up, dim light, read something dull, return when sleepy. Lying awake frustrated trains your brain that bed = stress. Bed is for sleep only (no scrolling, no Netflix in bed).'],
              ['Naps: 20 or 90', '20-min power nap (before 3pm) or full 90-min cycle. The 45-minute nap wakes you mid-deep-sleep feeling worse — that\'s nap grogginess, not nap failure.'],
            ]} />
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
