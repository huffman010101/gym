import { useState } from 'react';
import { Anchor, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';

function Block({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
      <h3 className="font-bold mb-3 text-teal-300">{title}</h3>
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
          <p className="text-xs text-teal-400/70 mt-0.5">{tag}</p>
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

const NOT_YET = [
  'Replaying conversations afterwards',
  'Checking how you came across',
  'Needing to be the funniest in the room',
  'Getting defensive at small challenges',
  'Needing people to know your achievements',
  'Comparing yourself constantly',
];

const GETTING_THERE = [
  'Told no, same person ten seconds later',
  'Can be wrong without it being a crisis',
  'Do not need to win the argument',
  'Genuinely happy for other people',
  'Comfortable saying nothing',
  'Same person alone as in a group',
];

export default function Security() {
  return (
    <div className="fade-up stagger space-y-4">
      <div className="card-premium p-5">
        <h3 className="font-bold mb-2 flex items-center gap-2"><Anchor size={16} className="text-teal-400" /> Security — the one underneath everything else</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Every other tab in this section is about how you come across. This one is about not needing to.
          A secure man is not performing security — the moment you are checking whether you seem secure,
          you are not. It is the only trait here that cannot be faked, and it happens to produce most of
          the others for free.
        </p>
      </div>

      <div className="bg-gradient-to-br from-teal-500/15 to-[#111] border border-teal-500/30 rounded-2xl p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-teal-300/70 mb-3">What it actually is</p>
        <div className="space-y-3">
          {[
            ['Your opinion of yourself does not move with the room', 'Praise does not inflate you and criticism does not deflate you, because neither is the source. That stability is the whole thing.'],
            ['It is NOT never feeling insecure', 'Everyone feels it. Secure people feel it and do not reorganise their behaviour around it. The goal was never to stop feeling — it was to stop obeying.'],
            ['It is not arrogance', 'Arrogance is insecurity that got louder — it needs you to agree. Security needs nothing from you, which is why it usually looks quiet and warm rather than impressive.'],
            ['It is not emotional flatness', 'Being unbothered by everything is avoidance wearing confidence as a costume. Secure people care about plenty; they just are not destabilised by it.'],
            ['You can be told you are wrong', 'The clearest single test. If being wrong feels like an attack on who you are, your identity is resting on being right — which is a fragile place to build.'],
          ].map(([t, d], i) => (
            <div key={t} className="flex gap-3">
              <span className="text-teal-400/70 font-black text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-200">{t}</p>
                <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Block title="Where it actually comes from" items={[
        ['Self-trust — the accumulated evidence you keep your word to yourself', 'This is the mechanism, and it is almost the whole answer. Every promise you kept to yourself is a deposit. Every one you broke is a withdrawal. Security is just the balance on that account, and your brain is keeping the ledger whether you like it or not.'],
        ['Which is why discipline and security are the same subject', 'You cannot think your way into feeling reliable. You can only accumulate evidence of it. That is why the gym, the morning routine and the deep work blocks matter far beyond what they obviously do — they are all deposits.'],
        ['Having a life that does not rest on one outcome', 'If one person, one result or one night can shake you, it is because too much of your identity is loaded onto it. A full week is structural protection in a way that no mindset is.'],
        ['Standards you would actually enforce', 'Knowing what you want and what you would walk away from. A standard you would never act on is a preference, and preferences do not hold you up under pressure.'],
        ['Being genuinely known by someone', 'People who have close friendships where they are fully themselves tend to be more secure. Being accepted after being seen properly does something that self-improvement alone does not.'],
      ]} />

      <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1 text-center">An honest self-audit</p>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 text-center">
          Nobody is entirely on one side. The point is which column you are moving toward.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <XCircle size={14} className="text-red-400 flex-shrink-0" />
              <p className="font-black text-[12px] text-red-300 whitespace-nowrap">Not yet</p>
            </div>
            <ul className="space-y-1.5">
              {NOT_YET.map(x => (
                <li key={x} className="text-[11px] text-gray-400 leading-snug flex gap-1.5">
                  <span className="text-red-400/60 flex-shrink-0">·</span>{x}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
              <p className="font-black text-[12px] text-emerald-300 whitespace-nowrap">Getting there</p>
            </div>
            <ul className="space-y-1.5">
              {GETTING_THERE.map(x => (
                <li key={x} className="text-[11px] text-gray-300 leading-snug flex gap-1.5">
                  <span className="text-emerald-400/60 flex-shrink-0">·</span>{x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed mt-3 text-center">
          If you recognised yourself in the left column, that is not a problem — noticing it is
          the first thing that has to happen.
        </p>
      </div>

      <Block title="How to actually build it" items={[
        ['1. Keep small promises to yourself, relentlessly', 'Said you would train at 7, train at 7. Said one episode, watch one. The size does not matter — the evidence does. This is the single highest-leverage habit for security there is, and it works whether or not anyone ever sees it.'],
        ['2. Do hard things voluntarily', 'Cold showers, the last two reps, the conversation you are avoiding, the approach. Each one is proof filed away that you do difficult things. That file is what you draw on under pressure.'],
        ['3. Enforce one standard you have been letting slide', 'Pick one — how you let someone speak to you, what you tolerate from yourself, a boundary you keep abandoning. Enforce it once. Security comes from acting on standards, not having them.'],
        ['4. Say the unpopular thing occasionally', 'Disagree out loud when you actually disagree. Not to be difficult — just to prove to yourself that your opinion can survive someone not liking it.'],
        ['5. Stop asking for reassurance', 'Every time you fish for it, you teach yourself that you needed someone else to settle you. It relieves the feeling now and strengthens it long-term. Sit with the discomfort instead; it passes faster than you expect.'],
        ['6. Get comfortable alone', 'Eat alone, walk without headphones, sit in silence. If your own company is unbearable, you will accept bad company to avoid it — and that shows.'],
        ['7. Fix what you can, accept what you cannot', 'Body, skin, style, skills — fixable, so fix them, and the insecurity dissolves honestly. Height, face structure, your past — not fixable, so the work is acceptance. Confusing the two categories wastes years.'],
      ]} />

      <Fold title="The traps" tag="Ways this goes wrong" items={[
        ['Performing security', 'Working on your posture, your pauses, your unbothered face. The performance IS the insecurity — and other people read the mismatch between the behaviour and the energy almost instantly.'],
        ['Waiting to feel ready', 'Security does not arrive first and then you act. You act, evidence accumulates, and the feeling follows. Waiting for it means waiting forever.'],
        ['Mistaking numbness for peace', 'Deciding to care about nothing is not security, it is withdrawal. Secure people are frequently the most invested — they are just not destabilised by outcomes.'],
        ['Outsourcing it to achievements', 'The next PB, the next grade, the next number will not do it. People who source security from results are permanently one bad result from losing it. The reliability is what holds, not the outcome.'],
        ['Thinking it is a destination', 'It moves. Some weeks you will be solid and some you will not, and that is normal rather than failure. The trend across years is what matters.'],
      ]} />

      <div className="bg-[#111] border border-teal-500/25 rounded-2xl p-5">
        <h3 className="font-bold text-teal-300 mb-2">The honest timeline</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          This is built over years, in private, in unremarkable moments nobody sees. There is no version where
          you decide to be secure on a Sunday and are by Friday.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mt-3">
          The good news is that you are already doing most of it. The training, the routine, the discipline
          work, the standards — every one of those is a deposit in the same account. You do not need a
          separate project for this. You need the boring things you already know about, done for long enough
          that you stop being able to doubt yourself honestly.
        </p>
      </div>
    </div>
  );
}
