import { useState, type ReactNode } from 'react';
import { ChevronDown, Shuffle, Plus, X, Lock, Flame } from 'lucide-react';

/*
 * Mind → My Notes: the owner's own rules, organised and kept short, with a
 * daily view that surfaces three of them each day. Notes they add here join
 * the daily rotation. Girls, kissing and texting stay behind the Game Plan lock.
 */

const K_NOTES = 'gymforge_my_notes';

type Group = { title: string; tag: string; locked?: boolean; items: [string, string][] };

const GROUPS: Group[] = [
  {
    title: 'Who I am', tag: 'The mindset everything else comes from', items: [
      ['Act like the man I want to be', 'Walk, talk and decide like your dream self today, not when you feel ready. Confidence is built from doing the things you said you would do.'],
      ['My validation is the only one I need', 'Stop seeking approval and stop complaining. Take responsibility for your own success and never blame other people.'],
      ['Love your life', 'Drop the energy drainers and put everything into what you want. Train hard. Think about what you have earned and how hard you work — you are not easy to impress.'],
      ['Accept who I am', 'Everything is in God\'s hands. Let go, have fun, and believe in yourself.'],
      ['Numb to failure', 'Step outside a little delusional. Rejection is not deep, you have high standards, and everyone will have forgotten the moment in a year. The win is in the approach, not the outcome.'],
      ['Abundance', 'If one person does not like you, plenty do. Seek new experiences and discover other people\'s lives.'],
      ['Control the reaction', 'Assume good intent. Do not defend yourself or explain. Keep your frame: chill, not the class clown making jokes all lesson.'],
    ],
  },
  {
    title: 'How I carry myself', tag: 'Voice, body, eyes', items: [
      ['Voice', 'Loud, clear and slow. Lower the tone, pronounce every word with energy and authority. Breathe from the stomach, not the chest.'],
      ['Body', 'Walk slower, head straight, good posture. Relaxed and fluid: if you want to stretch, lean back, order a drink or move, do it. Freezing up looks more nervous than moving.'],
      ['Expression', 'Look friendly, smile when you walk past people, react expressively and exaggerate words a little. Energy is attractive.'],
      ['Eye contact', 'About 70%: eye to eye to mouth and back, then look to the side for the rest. Hold a deep gaze, then look away as if nothing happened. If it feels too intense, look at the middle of the forehead.'],
      ['Stop scanning the room', 'Looking around for approval reads as desperate. Enjoy your own company and your own people, focus on yourself — that is what makes others gravitate to you. Do not hand out attention cheaply.'],
    ],
  },
  {
    title: 'How I talk to people', tag: 'Interested, positive, playful', items: [
      ['Be interested, be positive', 'Make them talk about themselves — around 75% of the time. "Tell me about yourself", what they do for fun, then go into specifics. No one-word questions, no interrupting, open mind.'],
      ['Remember the details', 'Use their name. Pick up small details and bring them up later: "you said you liked this — have you tried that?" People melt when you remember.'],
      ['Treat everyone like you already know them', 'Assume they like you and everyone is your friend. Ask name, where they are from, what they do, and build off it.'],
      ['Statements over questions', 'Make assumptions and playful guesses instead of interviewing. Be direct and say what you want.'],
      ['Tease, lightly', 'Take the piss in good fun about light stuff, never sensitive topics like their body. Once you are close, treat them like an annoying little sister: a head shake, a sigh, a side-eye smile.'],
      ['Funny and high-energy', 'Give weird, ridiculous answers to open a conversation. Make them laugh, goof around, cheer people up — bring happiness, no negativity.'],
      ['When they test you', 'A jab like "why do you think you are so hot?" — do not defend or explain. Smile, laugh, agree and exaggerate, or change the subject. Shrug it off.'],
      ['Mirror and connect', 'Smile when they smile, share the same experience, make natural touches, make them feel good. Be knowledgeable and try new things so you have something to share.'],
      ['Little tricks', 'Nod slightly as you ask something — people tend to mirror it.'],
    ],
  },
  {
    title: 'Girls', tag: 'No pedestal, no thirst', locked: true, items: [
      ['Her 10 is another man\'s 5', 'Acknowledge you want her, then remember she is just a girl. The pedestal is what makes you freeze; treat her like anyone else.'],
      ['Assume she likes you', 'Have the attitude that she wants you. You are choosing too — seeing if she fits your life, not auditioning.'],
      ['Do not be thirsty', 'At parties you do not need to talk to everyone; just vibe. Do not fall in love first.'],
      ['Compliments', 'Say what you genuinely like, from confidence, not as a fan. Turn it up only when she is clearly into you, and do not overdo it.'],
      ['Read her', 'If she matches your energy, leans in, keeps the conversation going — go. If she goes cold or pulls away, let it go with a smile.'],
    ],
  },
  {
    title: 'The kiss', tag: 'Only when the vibe is already there', locked: true, items: [
      ['Be close first', 'You cannot kiss someone from across the table. Sit or stand next to her.'],
      ['The signal', 'While she is talking, glance at her lips for a second, then back to her eyes. Hold eye contact and go quiet.'],
      ['Watch her reaction', 'Stays where she is or moves closer: good. Pulls back: stop and carry on talking — no hard feelings.'],
      ['Lead', '"Come here", hand to her cheek or waist, lean in 90% and let her close the last 10%. That last bit is her yes.'],
      ['Anything further', 'Only what you have both clearly said yes to. Never the neck or the mouth — that is a line, not a vibe.'],
    ],
  },
  {
    title: 'Texting', tag: 'Texting is not dating', locked: true, items: [
      ['Getting the number is the win', 'Then turn it into a plan. She owes you nothing over text; do not stress if she is slow.'],
      ['Match her energy', 'Similar length and pace. Ask about her. Be busy on your grind so you are not replying instantly.'],
      ['Compliments sparingly', 'One genuine one, not back to back.'],
      ['Leave some space', 'After a good connection, do not be over-available. Space builds desire.'],
    ],
  },
];

const BEFORE_OUT: string[] = [
  'Beat your chest and say "I love myself" out loud. Feel stupid, do it anyway.',
  'Picture yourself as the guy who already has everything he wants — satisfied, not hungry.',
  'Walk out the door as your dream self: slow walk, head up, a smile for people you pass.',
  'Remember: in a year nobody remembers tonight. The win is the approach.',
  'Goal for the night: have the best time in the room. Everything else is a bonus.',
];

// Short versions for the daily rotation.
const DAILY: string[] = [
  'Act like the man you want to be — today, not when you feel ready.',
  'The only validation you need is your own.',
  'No complaining, no blaming. Take responsibility.',
  'Speak loud, clear and slow. Lower the tone.',
  'Breathe from your stomach.',
  'Walk slower, head straight, good posture.',
  'Stop looking around the room. Enjoy your own company.',
  'Smile when you walk past people.',
  'Be interested, not interesting. Let them talk.',
  'Use people\'s names.',
  'Remember one detail about someone and bring it up later.',
  'Statements over questions.',
  'Tease lightly — never about sensitive stuff.',
  'Do not defend yourself. Smile and shrug it off.',
  'Assume they already like you.',
  'Treat everyone like you already know them.',
  'Rejection is not deep. The win is in the approach.',
  'Everyone forgets the moment in a year.',
  'No pedestal. She is just a girl.',
  'Do not chase attention. Do not hand it out cheaply either.',
  'Drop the energy drainers. Put everything into what you want.',
  'Keep your frame — chill, not the class clown.',
  'Assume good intent. Control your reaction.',
  'React expressively. Energy is attractive.',
  'Eye contact: eye, eye, mouth, then look away like nothing happened.',
  'Train hard today.',
  'Make someone laugh today.',
  'Make someone feel good today.',
  'Be direct. Say what you want.',
  'Let go and have fun. It is in God\'s hands.',
];

function dayNumber() {
  const d = new Date();
  return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 864e5);
}

function Fold({ title, tag, open, onToggle, children }: { title: string; tag: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{title}</p>
          <p className="text-xs text-pink-400/70 mt-0.5">{tag}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 space-y-3">{children}</div>}
    </div>
  );
}

export default function MyNotes({ unlocked }: { unlocked: boolean }) {
  const [mine, setMine] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(K_NOTES) || '[]') as string[]; } catch { return []; }
  });
  const [draft, setDraft] = useState('');
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState<Record<string, boolean>>({ 'Who I am': true });

  const saveMine = (next: string[]) => {
    setMine(next);
    try { localStorage.setItem(K_NOTES, JSON.stringify(next)); } catch { /* quota */ }
  };
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    saveMine([t, ...mine]);
    setDraft('');
  };

  // Three a day, stepping through the whole pool so nothing repeats for days.
  const pool = [...mine, ...DAILY];
  const start = ((dayNumber() + offset) * 3) % pool.length;
  const today = [0, 1, 2].map(i => pool[(start + i) % pool.length]).filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="space-y-4">
      {/* ---------- daily view ---------- */}
      <div className="bg-[#111] border border-pink-500/30 rounded-2xl p-5" data-testid="notes-today">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-hud text-[12px] font-bold uppercase tracking-[0.22em] text-pink-300">Today's three</h3>
          <button onClick={() => setOffset(o => o + 1)} className="text-[11px] text-gray-500 hover:text-pink-300 inline-flex items-center gap-1"><Shuffle size={12} /> Another three</button>
        </div>
        <ol className="space-y-2.5">
          {today.map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="font-orbitron text-pink-300/80 text-sm w-4 flex-shrink-0">{i + 1}</span>
              <span className="text-[15px] text-gray-100 leading-snug">{t}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-gray-600 mt-3">New three every day, drawn from your notes below and anything you add.</p>
      </div>

      {/* ---------- before going out ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-gray-100 flex items-center gap-2 mb-2.5"><Flame size={15} className="text-pink-400" /> Before you go out</h3>
        <ul className="space-y-1.5">
          {BEFORE_OUT.map(t => <li key={t} className="text-sm text-gray-400 flex gap-2"><span className="text-pink-400">▸</span>{t}</li>)}
        </ul>
      </div>

      {/* ---------- the notes, organised ---------- */}
      {GROUPS.map(g => (
        g.locked && !unlocked ? (
          <div key={g.title} className="bg-[#111] border border-white/8 rounded-2xl px-5 py-4 flex items-center justify-between">
            <p className="font-bold text-gray-500">{g.title}</p>
            <span className="text-[11px] text-gray-600 inline-flex items-center gap-1"><Lock size={11} /> Unlock in Game Plan</span>
          </div>
        ) : (
          <Fold key={g.title} title={g.title} tag={g.tag} open={!!open[g.title]} onToggle={() => setOpen(o => ({ ...o, [g.title]: !o[g.title] }))}>
            {g.items.map(([t, d]) => (
              <div key={t}>
                <p className="font-semibold text-sm text-gray-200">{t}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </Fold>
        )
      ))}

      {/* ---------- your own additions ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-gray-100 mb-1">Add a note</h3>
        <p className="text-xs text-gray-500 mb-3">Something you heard, read or learned the hard way. Keep it to one line; it joins the daily three.</p>
        <div className="flex gap-2">
          <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="e.g. Slow down when you feel nervous"
            className="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-pink-400/50" aria-label="New note" />
          <button onClick={add} disabled={!draft.trim()} className="rounded-xl px-3 border border-pink-300/40 text-pink-100 disabled:opacity-35" aria-label="Add note"><Plus size={16} /></button>
        </div>
        {mine.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {mine.map((t, i) => (
              <li key={t + i} className="flex items-start justify-between gap-2 text-sm text-gray-300 bg-black/25 rounded-lg px-3 py-2">
                <span>{t}</span>
                <button onClick={() => saveMine(mine.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-300 flex-shrink-0" aria-label="Delete note"><X size={14} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
