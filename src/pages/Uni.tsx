import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Brain, Sun, Briefcase, Moon, Loader2, AlertCircle, ChevronDown, Sparkles, Clock, Upload, FileText, X, Lightbulb, BookOpen } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DailyHabits from '../components/DailyHabits';
import BookNotes from '../components/BookNotes';
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
              ['Structure the block, not the hours', 'One 90-minute revision block = one topic, and it ends with recall or a past-paper question, not with rereading. "Studied for 4 hours" measures nothing; "closed the book and could reproduce it" measures everything.'],
            ]} />
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-gray-400 text-xs leading-relaxed mb-2">
                Focus itself &mdash; deep work blocks, phone in another room, the 5-minute rule, environment design,
                attention training &mdash; is the Mind section's subject, not restated here. Learn the system there and
                point it at the revision above.
              </p>
              <Link to="/mind?tab=focus" className="inline-block text-[11px] font-bold bg-sky-500/10 border border-sky-500/25 text-sky-200 px-3 py-1.5 rounded-full">
                Mind &rarr; Focus &amp; Discipline
              </Link>
            </div>
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

        {/* ===== BOOK NOTES ===== */}
        {tab === 'books' && <BookNotes />}

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
