import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Brain, Sun, Briefcase, Moon, Loader2, AlertCircle, ChevronDown, Sparkles, Clock, Upload, FileText, X, Lightbulb, BookOpen } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DailyHabits from '../components/DailyHabits';
import { generateStudyPack, generateSubjectConcepts, type SubjectConcept } from '../lib/generators';
import { extractFile, combine, MAX_TOTAL_CHARS, type Extracted } from '../lib/extractText';
import type { StudyPack } from '../lib/generators';

type Tab = 'ai' | 'subject' | 'smarter' | 'books' | 'day' | 'career' | 'sleep';

const TABS: { id: Tab; label: string }[] = [
  { id: 'ai', label: 'AI Study Pack' },
  { id: 'subject', label: 'My Subject' },
  { id: 'smarter', label: 'Get Smarter' },
  { id: 'books', label: 'Book Notes' },
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
    return (['ai', 'subject', 'smarter', 'books', 'day', 'career', 'sleep'] as const).includes(t as Tab) ? (t as Tab) : 'ai';
  });
  const [course, setCourse] = useState('');
  const [modules, setModules] = useState('');
  const [examInfo, setExamInfo] = useState('');
  const [materials, setMaterials] = useState('');
  const [pack, setPack] = useState<StudyPack | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<Extracted[]>([]);
  const [extracting, setExtracting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // My Subject — concept explanations, kept locally so they survive offline
  const [concepts, setConcepts] = useState<SubjectConcept[]>(() => {
    try { return JSON.parse(localStorage.getItem('gymforge_subject_concepts') || '[]') as SubjectConcept[]; }
    catch { return []; }
  });
  const [subjBusy, setSubjBusy] = useState(false);
  const [subjErr, setSubjErr] = useState('');
  const [openConcept, setOpenConcept] = useState<number | null>(null);

  const explainSubject = async () => {
    if (!course.trim() || !modules.trim()) {
      setSubjErr('Add your course and modules first.');
      return;
    }
    setSubjBusy(true); setSubjErr('');
    try {
      const fresh = await generateSubjectConcepts(
        course.trim(), modules.trim(), concepts.map(c => c.concept)
      );
      if (!fresh.length) throw new Error('Nothing came back — try again.');
      const next = [...concepts, ...fresh];
      setConcepts(next);
      try { localStorage.setItem('gymforge_subject_concepts', JSON.stringify(next)); } catch { /* quota */ }
    } catch (e) {
      setSubjErr(e instanceof Error ? e.message : 'Failed. Check your API key and connection.');
    }
    setSubjBusy(false);
  };

  const clearConcepts = () => {
    setConcepts([]); setOpenConcept(null);
    try { localStorage.removeItem('gymforge_subject_concepts'); } catch { /* ignore */ }
  };

  const totalChars = files.filter(f => !f.error).reduce((n, f) => n + f.chars, 0);
  const overBudget = totalChars + materials.length > MAX_TOTAL_CHARS;

  const addFiles = async (list: FileList | null) => {
    if (!list || !list.length) return;
    setExtracting(true);
    setError('');
    const incoming = Array.from(list);
    // Sequential: parsing several large decks at once spikes memory on phones.
    for (const file of incoming) {
      const res = await extractFile(file);
      setFiles(prev => [...prev, res]);
    }
    setExtracting(false);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gymforge_studypack');
      if (saved) {
        const parsed = JSON.parse(saved) as { course: string; modules: string; examInfo: string; pack: StudyPack };
        setCourse(parsed.course); setModules(parsed.modules); setExamInfo(parsed.examInfo); setPack(parsed.pack);
      } else {
        // Course details may have been saved by My Subject without a full pack.
        const light = localStorage.getItem('gymforge_course_details');
        if (light) {
          const d = JSON.parse(light) as { course: string; modules: string };
          setCourse(d.course || ''); setModules(d.modules || '');
        }
      }
    } catch {}
  }, []);

  const generate = async () => {
    if (!course.trim() || !modules.trim()) return;
    setBusy(true); setError('');
    try {
      const { text: combined } = combine(files, materials);
      if (!combined.trim()) {
        setError('Attach at least one file, or paste some notes, so it has material to work from.');
        setBusy(false);
        return;
      }
      const result = await generateStudyPack(course.trim(), modules.trim(), examInfo.trim(), combined);
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
                Attach your lecture slides — as many as you like — and it builds your revision timetable, priority list,
                summary sheet, equation sheet and dense notes from YOUR material, not a generic version.
              </p>
              <div className="space-y-2.5">
                <input value={course} onChange={e => setCourse(e.target.value)} placeholder="Course (e.g. BSc Economics, Year 1)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500/50" />
                <input value={modules} onChange={e => setModules(e.target.value)} placeholder="Modules/topics (e.g. Microeconomics, Statistics, Maths for Econ)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500/50" />
                <input value={examInfo} onChange={e => setExamInfo(e.target.value)} placeholder="Exam dates & format (e.g. 20 May, 2h written + MCQ)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500/50" />

                {/* File attachments */}
                <input ref={fileRef} type="file" multiple accept=".pptx,.pdf,.docx,.txt,.md,.csv" className="hidden"
                  onChange={e => { addFiles(e.target.files); if (fileRef.current) fileRef.current.value = ''; }} />
                <button onClick={() => fileRef.current?.click()} disabled={extracting}
                  className="w-full border-2 border-dashed border-white/20 hover:border-sky-500/50 disabled:opacity-50 rounded-xl py-5 flex flex-col items-center gap-1.5 text-gray-400 hover:text-sky-400 transition-colors">
                  {extracting
                    ? <><Loader2 size={20} className="animate-spin" /><span className="text-sm font-semibold">Reading your slides…</span></>
                    : <><Upload size={20} /><span className="text-sm font-semibold">Attach lecture slides</span>
                        <span className="text-[11px] text-gray-600">PowerPoint · PDF · Word · text — as many as you want</span></>}
                </button>

                {files.length > 0 && (
                  <div className="space-y-1.5">
                    {files.map((f, i) => (
                      <div key={f.name + i} className={`flex items-center gap-2.5 rounded-xl px-3 py-2 border ${
                        f.error ? 'bg-red-500/5 border-red-500/25' : 'bg-white/5 border-white/10'
                      }`}>
                        <FileText size={14} className={f.error ? 'text-red-400 flex-shrink-0' : 'text-sky-400 flex-shrink-0'} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-200 truncate">{f.name}</p>
                          <p className={`text-[10px] ${f.error ? 'text-red-400' : 'text-gray-500'}`}>
                            {f.error ? f.error : `${f.chars.toLocaleString()} characters read`}
                          </p>
                        </div>
                        <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                          className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[11px] text-gray-500">
                        {files.filter(f => !f.error).length} file(s) · {totalChars.toLocaleString()} characters
                      </p>
                      {overBudget && <p className="text-[11px] text-amber-400">Will be trimmed to fit</p>}
                    </div>
                  </div>
                )}

                <textarea value={materials} onChange={e => setMaterials(e.target.value)} rows={3}
                  placeholder="Optional: paste anything extra (topics the slides skip, your own notes, past-paper questions)"
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

        {/* ===== MY SUBJECT ===== */}
        {tab === 'subject' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={15} className="text-sky-400" />
                <h2 className="font-bold">Explain My Subject</h2>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">
                Put in your course and modules and it explains the key concepts in plain English — what each one
                actually means, why it matters, and a worked example. Press it again for a fresh set; it will not
                repeat concepts it has already covered.
              </p>
              <div className="space-y-2.5">
                <input value={course} onChange={e => setCourse(e.target.value)} placeholder="Course (e.g. BSc Economics, Year 1)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500/50" />
                <input value={modules} onChange={e => setModules(e.target.value)} placeholder="Modules/topics (e.g. Microeconomics, Macro, Statistics)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500/50" />
                <button
                  onClick={() => {
                    try {
                      localStorage.setItem('gymforge_course_details', JSON.stringify({ course, modules }));
                    } catch { /* ignore */ }
                    explainSubject();
                  }}
                  disabled={subjBusy}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  {subjBusy
                    ? <><Loader2 size={15} className="animate-spin" /> Explaining your modules…</>
                    : <><Sparkles size={15} /> {concepts.length ? 'Explain 8 more concepts' : 'Explain my modules'}</>}
                </button>
                {subjErr && <p className="text-red-400 text-xs flex items-center gap-1.5"><AlertCircle size={12} /> {subjErr}</p>}
              </div>
            </div>

            {concepts.length > 0 && (
              <>
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    {concepts.length} concept{concepts.length === 1 ? '' : 's'} saved
                  </p>
                  <button onClick={clearConcepts} className="text-[11px] text-gray-600 hover:text-red-400 font-semibold transition-colors">
                    Clear all
                  </button>
                </div>

                <div className="space-y-2">
                  {concepts.map((c, i) => (
                    <div key={c.concept + i} className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setOpenConcept(openConcept === i ? null : i)}
                        className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-100 leading-snug">{c.concept}</p>
                          {openConcept !== i && (
                            <p className="text-gray-500 text-xs leading-relaxed mt-1 line-clamp-2">{c.simple}</p>
                          )}
                        </div>
                        <ChevronDown size={16} className={`text-gray-600 flex-shrink-0 mt-0.5 transition-transform duration-300 ${openConcept === i ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`collapse-wrap ${openConcept === i ? 'open' : ''}`}>
                        <div className="collapse-inner">
                          <div className="collapse-content px-4 pb-4 space-y-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-sky-400/80 mb-1">In plain English</p>
                              <p className="text-gray-300 text-sm leading-relaxed">{c.simple}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400/80 mb-1">Why it matters</p>
                              <p className="text-gray-400 text-sm leading-relaxed">{c.why}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl px-3.5 py-3 flex gap-2.5">
                              <Lightbulb size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-amber-400/80 mb-1">Example</p>
                                <p className="text-gray-300 text-sm leading-relaxed">{c.example}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-gray-600 text-center leading-relaxed">
                  Saved on your device — these stay available offline. Use them for active recall: read the
                  concept name, explain it yourself, then open the card to check.
                </p>
              </>
            )}

            {concepts.length === 0 && !subjBusy && (
              <div className="bg-[#111] border border-white/8 rounded-2xl px-5 py-8 text-center">
                <BookOpen size={26} className="text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No concepts yet.</p>
                <p className="text-gray-600 text-xs mt-1">Add your course and modules above, then tap Explain.</p>
              </div>
            )}
          </div>
        )}

        {/* ===== GET SMARTER ===== */}
        {tab === 'smarter' && (
          <div className="fade-up stagger space-y-4">
            <Fold title="How to remember almost anything" tag="The techniques that actually beat forgetting" items={[
              ['The forgetting curve is the problem', 'Without review you lose roughly half of new material within a day or two and most of it within a week. Everything below exists to interrupt that curve. Studying without reviewing is filling a bucket with a hole in it.'],
              ['Spaced repetition — the single best tool', 'Review at day 1, 3, 7, 14, 30. Each successful recall at a longer gap makes the memory more durable. Anki does the scheduling for you — 15 minutes a day of cards beats a three-hour cram, and it is not close.'],
              ['Active recall — retrieve, do not review', 'Close everything and write down what you know BEFORE checking. The effort of retrieval is what strengthens the memory. Highlighting and re-reading feel productive and are close to worthless — they build familiarity, which your brain mistakes for knowledge.'],
              ['Elaboration — ask why and how', 'Do not just learn that something is true; ask why it is true and how it connects to what you already know. Memory is a network, and facts with more connections are far easier to retrieve.'],
              ['The memory palace (method of loci)', 'For lists and sequences: picture a route you know well — your house, your walk to lectures — and place a vivid, absurd image for each item at a specific spot. Walk the route mentally to recall them. This is genuinely how memory champions do it, and it works because spatial memory is enormous.'],
              ['Chunking', 'Working memory holds about four items at once. Group information into meaningful chunks and you multiply what fits — a phone number as three chunks, an essay as five arguments, a formula as three moves rather than twelve symbols.'],
              ['Dual coding — words plus pictures', 'Pair a written explanation with a diagram you draw yourself. Two routes to the same memory means two chances to retrieve it. Drawing it badly from memory beats copying a perfect one from the slides.'],
              ['Sleep is when it gets stored', 'Memory consolidation happens overnight, particularly in deep sleep and REM. Learning something and then sleeping 5 hours actively wastes the study. Reviewing briefly right before bed is genuinely effective.'],
              ['Teach it to nobody', 'Explain the topic out loud to an empty room as if to a 12-year-old. Every point where you stall or reach for jargon is a gap. This is the Feynman technique and it is the fastest way to find what you only think you know.'],
            ]} />

            <Fold title="How to learn any skill fast" tag="Football, guitar, coding, a language — the same process" items={[
              ['Deliberate practice, not repetition', 'Mindless repetition of what you can already do builds almost nothing. Deliberate practice means working at the edge of your ability, on a specific weakness, with immediate feedback. It is uncomfortable by definition — comfort means you are rehearsing, not improving.'],
              ['Break the skill into sub-skills', 'Do not practise "football" — practise weak-foot first touch. Do not practise "guitar" — practise one chord change. Skills are stacks of small components, and progress comes from isolating the ones that are actually holding you back.'],
              ['Find the 80/20 first', 'Every skill has a small number of things that produce most of the result. In a language it is the 1,000 most common words. In cooking it is knife skills and heat control. Identify those before you touch anything advanced.'],
              ['Feedback loops decide your speed', 'You improve at the speed you get accurate feedback. Video yourself, use a coach, use a metronome, check answers immediately. Practising for months with no feedback usually means grooving mistakes.'],
              ['Desirable difficulty', 'Conditions that make practice feel harder — spacing sessions out, mixing topics, testing yourself — reduce performance during practice but substantially improve long-term retention. If it feels easy, you are probably not learning much.'],
              ['Plateaus are normal and mean something', 'Progress is stepwise, not linear. A plateau usually means the thing that got you here will not get you further and you need to change the constraint — a new drill, more difficulty, or a coach who can see what you cannot.'],
              ['The first 20 hours matter most', 'Going from nothing to competent is fast; going from competent to excellent is slow. If the goal is being decent at something, 20 focused hours genuinely does it. Do not let the fear of a 10,000-hour figure stop you starting.'],
            ]} />

            <Fold title="How to actually read a book" tag="Most people finish books and remember nothing" items={[
              ['Decide why you are reading it first', 'Entertainment, one specific answer, or a whole model of a topic? The answer changes how you read. Reading everything the same way is why so little sticks.'],
              ['Read with a question in mind', 'Skim the contents and ask what you want out of it before starting. A brain looking for something reads far more actively than one passively receiving.'],
              ['Notes in your own words, not highlights', 'Highlighting is the reading equivalent of re-reading — it feels productive and does almost nothing. One or two sentences per chapter, written in your own words, beats a book full of yellow lines.'],
              ['Summarise from memory at the end', 'Close the book and write the argument in five bullets. That single act of retrieval does more for retention than the whole read did.'],
              ['Talk about it within a week', 'Explaining a book to someone forces you to compress and structure it. If you cannot explain what a book said, you did not really read it.'],
              ['Abandon bad books without guilt', 'Finishing a book you are not getting anything from has no virtue in it. There are more good books than you have time for — sunk cost applies to reading too.'],
              ['Two books at once, different types', 'One challenging (ideas above your level) and one enjoyable. The hard one grows you; the easy one keeps the habit alive on tired days.'],
            ]} />

            <Fold title="The reading list" tag="Books actually worth your time, by category" items={[
              ['Learning & memory — start here', '"Make It Stick" (Brown, Roediger, McDaniel) is the best evidence-based book on how learning actually works. "A Mind for Numbers" (Barbara Oakley) for maths and science specifically. "Moonwalking with Einstein" (Joshua Foer) for memory technique, and it is genuinely a good read.'],
              ['Thinking & decisions', '"Thinking, Fast and Slow" (Kahneman) — dense but foundational on how your brain fools you. "The Art of Thinking Clearly" (Dobelli) covers similar ground in short, readable chapters if Kahneman is heavy going. "Poor Charlie\'s Almanack" (Munger) on mental models.'],
              ['Discipline & work', '"Atomic Habits" (James Clear) — the most practical habit book there is. "Deep Work" (Cal Newport) on focus as a competitive advantage. "Peak" (Anders Ericsson) is the actual research behind deliberate practice, as opposed to the 10,000-hours myth built on top of it.'],
              ['Mindset & philosophy', '"Meditations" (Marcus Aurelius) — a Roman emperor\'s private notes on self-control, and it holds up 1,900 years later. "Mindset" (Carol Dweck) on fixed versus growth mindset. "Man\'s Search for Meaning" (Frankl) if you want something that stays with you.'],
              ['Money', '"The Psychology of Money" (Housel) — the best first money book, about behaviour rather than spreadsheets. "The Almanack of Naval Ravikant" (free online) on wealth and leverage. "Zero to One" (Thiel) if you are interested in building something.'],
              ['World & history', '"Prisoners of Geography" (Tim Marshall) explains world affairs through maps and is perfect if you like the Know More cards. "Sapiens" (Harari) is a brilliant read — worth knowing some historians dispute specific claims, so treat it as a provocative framework rather than settled fact.'],
              ['Communication', '"How to Win Friends and Influence People" (Carnegie) — dated in tone, still the best on basic social skill. "Never Split the Difference" (Chris Voss) on negotiation, and far more useful in normal life than the FBI framing suggests.'],
              ['Body & health', '"Outlive" (Peter Attia) on training and longevity, genuinely rigorous. "Why We Sleep" (Matthew Walker) is the famous sleep book and largely directionally right, though several specific claims have been challenged — take the principles, not every statistic.'],
              ['How to use this list', 'Do not buy eight books. Buy one, finish it, apply one thing from it. Someone who has read three books properly and acted on them is far ahead of someone who has read thirty and changed nothing.'],
              ['Want the takeaways before you commit?', 'The Book Notes tab has the actual core ideas and action points from the main ones here — Atomic Habits, Carnegie, Psychology of Money, Can\'t Hurt Me, Deep Work, Mindset, Kahneman and more. Use it to decide which are worth your time, or to act on the idea today.'],
            ]} />

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
        {tab === 'books' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><BookOpen size={16} className="text-sky-400" /> The important bits, without reading 4,000 pages</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Most self-improvement books are one genuinely good idea stretched to 300 pages. Below is the actual
                idea from each, plus what to do about it. Tap any book to open it.
              </p>
              <p className="text-gray-500 text-xs leading-relaxed mt-3">
                A summary is not a substitute for reading the ones that hit — but it does tell you which ones are
                worth your time, and it means you can act on the idea today rather than in three weeks.
              </p>
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-300/60 pt-1">People & influence</p>

            <Fold title="How to Win Friends and Influence People" tag="Carnegie · 1936 · the one everyone should read first" items={[
              ['The core idea', 'People act almost entirely out of a desire to feel important. Every technique in the book is one application of that: make the other person feel significant and genuinely valued, and influence follows as a by-product.'],
              ['Become genuinely interested in other people', 'The single most repeated point. You make a better impression in five minutes of real curiosity about someone than an hour of talking about yourself. Ask, then actually listen to the answer.'],
              ['Use their name, and remember details', 'A person\'s name is the sweetest sound to them. Referencing something they told you last week does more for the relationship than any compliment.'],
              ['Never criticise directly — it never works', 'Criticism puts people on the defensive and they justify rather than change. Start with honest appreciation, ask questions that let them arrive at the conclusion, and let them save face.'],
              ['Admit your mistakes fast and fully', 'Saying "I was wrong, completely my fault" disarms people instantly and costs you nothing. Defending a mistake costs you far more than the mistake did.'],
              ['Let the other person do the talking, and take less credit', 'Let people own the idea. "Let the other person feel the idea is theirs" is the most useful line in the book for getting anything done through other people.'],
              ['The honest caveat', 'Applied as technique it reads as manipulation and people sense it. It only works if the interest is real — which is the actual lesson: become someone who is genuinely interested, do not perform it.'],
            ]} />

            <Fold title="Never Split the Difference" tag="Voss · negotiation, by an FBI hostage negotiator" items={[
              ['Negotiation is emotional, not logical', 'People decide emotionally then justify rationally. So the job is not out-arguing them — it is making them feel heard enough to move.'],
              ['Tactical empathy and labelling', 'Name the other side\'s emotion out loud: "It seems like this deadline is stressing you." Labelling a feeling defuses it — the same mechanism as "name it to tame it" in the Stoic tab.'],
              ['Mirroring', 'Repeat the last three words of what they said, as a question. It costs nothing, and it makes people elaborate and feel understood. Absurdly effective and almost invisible.'],
              ['Get to "that\'s right", not "yes"', '"Yes" is often given to end a conversation. "That\'s right" means they actually agree. Summarise their position until you hear it.'],
              ['"No" is the start, not the end', 'A no usually means "I do not feel safe/informed yet". Design questions they can safely say no to — it gives them control and keeps the conversation open.'],
              ['Calibrated questions', '"How am I supposed to do that?" makes the other side solve your problem for you. Open questions starting how/what beat any demand.'],
            ]} />

            <Fold title="Influence" tag="Cialdini · why people say yes" items={[
              ['Six levers, used on you daily', 'Reciprocity, commitment/consistency, social proof, authority, liking, scarcity. Learning them is half persuasion skill and half defence against marketing.'],
              ['Reciprocity is the strongest', 'People feel real pressure to return a favour. Giving first — genuinely, without a ledger — is the most reliable way to build goodwill.'],
              ['Commitment and consistency', 'People act to stay consistent with what they have already said or done publicly. This is why small commitments lead to big ones, and why stating a goal out loud changes your behaviour.'],
              ['Social proof does the heavy lifting', 'People look to what similar others do, especially when uncertain. This is exactly why photos with other people signal more than anything you claim about yourself.'],
              ['Scarcity', 'Things feel more valuable when limited. Real in dating, hiring, and every "only 3 left" banner you have ever seen.'],
            ]} />

            <Fold title="Models" tag="Manson · honest attraction, not tactics" items={[
              ['Attraction runs on vulnerability, not technique', 'The central claim: being willing to be openly, honestly yourself — including risking rejection — is what actually attracts. Every tactic exists to avoid that vulnerability, which is why tactics plateau.'],
              ['Become someone worth wanting, then be honest about wanting', 'Two jobs: build a life and standards worth choosing, then express interest directly instead of hinting. Most men do neither and run routines instead.'],
              ['Non-neediness is the whole game', 'Neediness is investing in an outcome you cannot control. The fix is not acting aloof — it is genuinely having enough going on that one outcome is not load-bearing.'],
              ['Polarise deliberately', 'Trying to be liked by everyone makes you attractive to nobody. Having real opinions repels some people and strongly attracts others, which is the correct trade.'],
              ['Rejection is filtering, not failure', 'A no is information about fit, obtained cheaply. Reframing it that way is what makes directness sustainable.'],
            ]} />

            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-300/60 pt-2">Habits, discipline & mind</p>

            <Fold title="Atomic Habits" tag="Clear · the most practical book on this list" items={[
              ['You do not rise to your goals, you fall to your systems', 'Motivation and goals are unreliable; the process you run daily decides the outcome. Goals set direction, systems produce progress.'],
              ['The four laws: make it obvious, attractive, easy, satisfying', 'To build a habit, hit all four. To break one, invert them — make it invisible, unattractive, hard, unsatisfying. This is the whole framework in one line.'],
              ['Environment beats willpower, every time', 'You do not need more discipline, you need a phone in another room and a gym bag by the door. Behaviour follows friction more than intention.'],
              ['Habit stacking and implementation intentions', '"After I [existing habit], I will [new habit]." Attaching new behaviour to something already automatic is far more reliable than deciding to remember.'],
              ['The two-minute rule', 'Shrink any new habit to a version that takes two minutes. "Read one page", "put your kit on". Starting is the hard part; the two-minute version removes the resistance entirely.'],
              ['Never miss twice', 'Missing once is an accident, missing twice is the start of a new pattern. This single rule protects streaks better than any amount of motivation.'],
              ['Identity is the real lever', 'Aim for "I am someone who trains" rather than "I want to get fit". Every action is a vote for the type of person you are — and the identity then produces the behaviour automatically.'],
            ]} />

            <Fold title="Can't Hurt Me" tag="Goggins · mental toughness, taken to the extreme" items={[
              ['The 40% rule', 'When your mind says you are done, you are at roughly 40% of capacity. The claim is not scientific precision — it is that your perceived limit arrives long before your actual one.'],
              ['The Accountability Mirror', 'Look at yourself and state your actual flaws and actual situation out loud, with no excuses. Brutal honesty about where you are is the starting point for changing it.'],
              ['Callousing the mind', 'You build toughness the way you build a callus — repeated deliberate exposure to what you want to avoid. Every hard thing done voluntarily makes the next one smaller.'],
              ['Taking souls', 'When someone expects you to break, exceed what they thought possible. Reframing suffering as a competition you are winning changes your relationship to it entirely.'],
              ['The cookie jar', 'Keep a mental list of hard things you have already survived. When you are struggling, reach into it for evidence you have done worse. This is the same mechanism as confidence-from-evidence.'],
              ['The honest caveat', 'Goggins is an outlier and his methods cost him his body and relationships. Take the mindset — voluntary discomfort, radical accountability, your limit is further than it feels — and do not take the self-destruction.'],
            ]} />

            <Fold title="Deep Work" tag="Newport · the skill that is becoming rare" items={[
              ['Deep work is becoming both rarer and more valuable', 'The ability to focus without distraction on something cognitively demanding is a genuine competitive advantage precisely because almost nobody can do it anymore.'],
              ['Attention residue is the hidden cost', 'Every switch — a notification, a quick check — leaves residue that degrades focus long after. This is why five hours of interrupted work produces less than 90 uninterrupted minutes.'],
              ['Schedule it, ritualise it', 'Same time, same place, same starting ritual, fixed duration. Deep work almost never happens when you leave it to whenever you feel like it.'],
              ['Embrace boredom deliberately', 'If you reach for your phone every idle moment, you train an inability to sustain attention. Being bored on purpose — walking with no headphones, queueing without scrolling — is training.'],
              ['Quit social media, or at least audit it', 'Judge each tool by whether it substantially serves your actual goals, not whether it has some benefit. Most fail that test.'],
            ]} />

            <Fold title="Mindset" tag="Dweck · fixed vs growth, properly understood" items={[
              ['Two beliefs about ability', 'Fixed mindset: ability is innate and effort exposes your limits. Growth mindset: ability is developed, so effort is the mechanism. The belief itself changes behaviour in the face of difficulty.'],
              ['Fixed mindset makes you avoid challenge', 'If failure means you lack talent, the rational move is to only attempt what you can already do. This is why talented people often stall — challenge feels threatening rather than useful.'],
              ['Praise process, not talent', 'Being told "you are so clever" makes you protect the label. Being told "that was good work" makes you repeat the work. Apply this to how you talk about yourself too.'],
              ['"Not yet" is the whole reframe', 'Replacing "I cannot do this" with "I cannot do this yet" is small and genuinely changes how you respond to being stuck.'],
              ['The common misreading', 'Growth mindset is not just effort or positive thinking — it is effort plus changing strategy when something is not working. Trying harder at a broken method is not growth mindset.'],
            ]} />

            <Fold title="Thinking, Fast and Slow" tag="Kahneman · how your judgement actually fails" items={[
              ['Two systems', 'System 1 is fast, automatic, emotional. System 2 is slow, effortful, logical. Most decisions come from System 1 while you believe they came from System 2.'],
              ['You are overconfident and you cannot feel it', 'The single most useful takeaway. Confidence in a judgement reflects how coherent the story feels, not how likely it is to be right.'],
              ['Loss aversion', 'Losing £100 hurts roughly twice as much as gaining £100 feels good. It explains holding losing trades, staying in bad situations, and most irrational risk decisions.'],
              ['Anchoring and availability', 'The first number mentioned drags every subsequent estimate toward it. And you judge how likely something is by how easily examples come to mind — which is why vivid news distorts risk perception.'],
              ['What to actually do', 'Slow down on decisions that matter, write out the reasoning, seek the disconfirming case, and distrust conclusions that arrived instantly and felt obvious.'],
            ]} />

            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-300/60 pt-2">Money & wealth</p>

            <Fold title="The Psychology of Money" tag="Housel · the best money book on this list" items={[
              ['Behaviour beats intelligence in finance', 'Doing well with money is mostly about temperament — patience, not panicking, avoiding ruin — not about being clever. Ordinary people with good habits routinely out-earn brilliant people with bad ones.'],
              ['Compounding is the whole thing, and it needs time', 'Most of Buffett\'s wealth arrived after he was 60. The variable that matters most is not return rate, it is how long you leave it alone.'],
              ['Never risk what you cannot afford to lose', 'One catastrophic loss erases decades of good returns. Survival is the prerequisite for compounding — "get rich" and "stay rich" are different skills.'],
              ['Wealth is the money you do NOT spend', 'Rich is visible income; wealthy is invisible unspent assets and options. Almost everything that looks like wealth is actually spending.'],
              ['Room for error is a feature', 'Save more than seems necessary and keep more cash than seems optimal. The point of margin is to survive the outcomes you did not forecast.'],
              ['The real goal is control over your time', 'The highest return money buys is not stuff — it is the ability to do what you want, when you want, with whom you want. Optimise for that and most money decisions get simpler.'],
              ['Nobody is as impressed by your stuff as you think', 'People notice the car and imagine themselves in it. Buying things to be admired reliably fails at the one job it was bought for.'],
            ]} />

            <Fold title="Rich Dad Poor Dad" tag="Kiyosaki · read the ideas, distrust the specifics" items={[
              ['Assets vs liabilities, defined usefully', 'An asset puts money in your pocket; a liability takes it out. His point is that most people spend their whole earning life buying liabilities they were told were assets.'],
              ['Financial education is not taught anywhere', 'The genuinely valuable argument in the book: school prepares you to earn a salary and nothing else. Whatever you learn about money, you will have to seek out deliberately.'],
              ['Pay yourself first', 'Money to your investments before your lifestyle, not from whatever is left at the end. Automation makes this real; intention does not.'],
              ['Work to learn, not just to earn', 'Early on, take roles for the skills — sales, negotiation, systems — rather than the marginal extra pay. Skills compound and transfer; a salary does neither.'],
              ['The honest caveat — this one matters', 'The book is motivational, not instructional. The "rich dad" is likely a narrative device, the real-estate and tax advice is dated and US-specific, and Kiyosaki\'s own record and seminar business attract fair criticism. Take the mindset shift about assets and financial literacy; get the actual mechanics from The Psychology of Money and the Money section here.'],
            ]} />

            <Fold title="The Richest Man in Babylon" tag="Clason · the basics, as parables" items={[
              ['Pay yourself 10% first, always', 'Save a tenth of everything you earn before anything else. It is the oldest personal-finance rule there is and it still outperforms most complicated strategies.'],
              ['Make your savings work', 'Idle money is dead money — put it somewhere it earns, and reinvest the earnings. The parable version of compounding.'],
              ['Invest only in what you understand', 'Take advice from people competent in that specific field, not from enthusiastic amateurs. Ages remarkably well as advice about crypto and tips from friends.'],
              ['Guard against loss before chasing gain', 'Protect the principal first. A guaranteed small return beats a probable large loss.'],
              ['Live below your means, permanently', 'Expenses expand to fill income unless you deliberately cap them. Lifestyle creep is what stops high earners from becoming wealthy.'],
            ]} />

            <Fold title="The Millionaire Next Door" tag="Stanley & Danko · what wealthy people actually look like" items={[
              ['Most wealthy people look unremarkable', 'The research finding that made the book: typical millionaires drive used cars, live in ordinary houses and are business owners in dull industries. The visibly flashy are usually leveraged, not wealthy.'],
              ['High income does not equal wealth', 'Plenty of high earners have almost no net worth because their spending scaled with their salary. Wealth is accumulated, not earned.'],
              ['Frugality is the common trait', 'Not deprivation — just an absence of status spending, and knowing where the money actually goes.'],
              ['Beware "economic outpatient care"', 'Financially supporting adult children tends to reduce their own wealth-building. Uncomfortable finding, consistently supported in their data.'],
            ]} />

            <div className="bg-[#111] border border-sky-500/25 rounded-2xl p-5">
              <h3 className="font-bold text-sky-300 mb-2">If you only take five things from all of it</h3>
              <div className="space-y-2">
                {[
                  ['Be genuinely interested in other people', 'Carnegie. Costs nothing, changes every relationship you have, and cannot be faked for long.'],
                  ['Fix the environment, not the willpower', 'Clear. Phone in another room beats deciding to concentrate, every single time.'],
                  ['Your limit is further away than it feels', 'Goggins. When you want to stop, you are nowhere near actually finished.'],
                  ['Time in the market, and never risk ruin', 'Housel. Patience plus survival beats cleverness plus leverage over any long period.'],
                  ['Effort is the mechanism, not the evidence of a limit', 'Dweck. Struggling at something means you are training it, not that you lack talent for it.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-gray-400 text-xs leading-relaxed mb-2">
                Where to apply each of these — the sections that already run on these ideas:
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to="/mind?tab=charisma" className="text-[11px] font-bold bg-sky-500/10 border border-sky-500/25 text-sky-200 px-3 py-1.5 rounded-full">Mind → Charisma</Link>
                <Link to="/mind?tab=focus" className="text-[11px] font-bold bg-sky-500/10 border border-sky-500/25 text-sky-200 px-3 py-1.5 rounded-full">Mind → Focus & Discipline</Link>
                <Link to="/mind?tab=stoic" className="text-[11px] font-bold bg-sky-500/10 border border-sky-500/25 text-sky-200 px-3 py-1.5 rounded-full">Mind → Stoic</Link>
                <Link to="/money?tab=invest" className="text-[11px] font-bold bg-sky-500/10 border border-sky-500/25 text-sky-200 px-3 py-1.5 rounded-full">Money → Investing</Link>
                <Link to="/uni?tab=smarter" className="text-[11px] font-bold bg-sky-500/10 border border-sky-500/25 text-sky-200 px-3 py-1.5 rounded-full">Uni → Get Smarter</Link>
              </div>
            </div>
          </div>
        )}

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
              <h3 className="font-bold mb-2 flex items-center gap-2"><Moon size={16} className="text-sky-400" /> Sleep Is Where Revision Becomes Memory</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Studying puts information into a temporary buffer. Sleep is the process that files it permanently —
                which means an all-nighter does not just make you tired, it deletes most of what you stayed up to learn.
                This tab is sleep as a <span className="text-sky-300 font-semibold">study tool</span>; the wind-down
                ritual itself lives in Mind → Night Routine.
              </p>
            </div>

            <Block title="Why sleep IS revision" items={[
              ['Consolidation happens overnight, not at the desk', 'During deep sleep your brain replays the day\'s new material and moves it from short-term storage into long-term memory. Revision without sleep is loading a file and never hitting save.'],
              ['You need sleep BEFORE learning as well as after', 'A tired brain forms weaker memories in the first place — studies consistently show a sleep-deprived night before studying reduces how much you take in, on top of the damage to consolidation afterwards.'],
              ['REM does the understanding, deep sleep does the facts', 'Deep sleep (early night) handles raw factual recall — definitions, formulas, dates. REM (late night, the part you cut by waking early) handles connecting ideas and problem-solving. Cutting either end of the night costs you a different kind of learning.'],
              ['This is why spaced revision works', 'Reviewing across several nights beats one long session largely because each night of sleep in between does a round of filing. The sleep is not downtime between study sessions — it is part of the method.'],
            ]} />

            <Block title="Exam period — the honest rules" items={[
              ['Never pull an all-nighter before an exam', 'The single worst study decision available. You lose the consolidation of everything you just revised AND sit the exam with impaired recall, attention and decision-making. Sleeping and knowing 80% beats being awake and able to access 50%.'],
              ['A bad night before is survivable — a bad week is not', 'One poor night costs you some sharpness. A fortnight of 5-hour nights during revision genuinely erodes how much of the material ever gets stored. Protect the run-up more than the night itself.'],
              ['Front-load your hardest material earlier in the day', 'You take in new, difficult content best when rested. Leave lighter review, past papers you have seen before, and admin for the evening dip.'],
              ['Review the hardest topic last thing before bed', 'Material studied shortly before sleep gets preferentially consolidated. Ten minutes on the topic you keep forgetting, right before the wind-down, is a genuinely free win.'],
              ['Do not shift your wake time during exam season', 'Waking at 5am for an exam you have never woken up at 5am for means sitting it in a physiological fog. Move your wake time gradually in the week beforehand instead.'],
            ]} />

            <Block title="Naps, caffeine and the study day" items={[
              ['Naps: 20 minutes or 90, never 45', 'A 20-minute nap before 3pm restores alertness with no grogginess. A full 90-minute cycle gives you an extra round of consolidation — genuinely useful mid-revision. Waking at 45 minutes drags you out of deep sleep and feels worse than not napping.'],
              ['The nap-after-learning trick', 'A short nap directly after a heavy study block measurably improves retention of what you just covered. If you have the time in a long revision day, it beats pushing straight into the next hour tired.'],
              ['Caffeine cutoff: 8-10 hours before bed', 'Half of a 2pm coffee is still in you at 8pm. It rarely stops you falling asleep — it quietly strips out the deep sleep doing your consolidation. During exam season this matters more than usual: last coffee by early afternoon.'],
              ['Alcohol destroys the filing, not just the morning', 'It knocks you out then suppresses REM for the whole night. A night out mid-revision-week costs you the consolidation of that day\'s work, not just the next morning.'],
              ['Do not revise in bed', 'It trains your brain that bed is a place for effort and stress, which makes falling asleep harder exactly when you need it most. Desk for work, bed for sleep — the separation is doing real work.'],
            ]} />

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-gray-400 text-xs leading-relaxed mb-2">
                The actual wind-down protocol — the 90-minute ramp, light, temperature, breathing, phone out of the
                room, what to do when you cannot sleep — is one routine and lives in one place rather than being
                repeated here.
              </p>
              <Link to="/mind?tab=night" className="inline-block text-[11px] font-bold bg-sky-500/10 border border-sky-500/25 text-sky-200 px-3 py-1.5 rounded-full">
                Mind → Night Routine
              </Link>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
