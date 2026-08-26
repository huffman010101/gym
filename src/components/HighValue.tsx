import { useState } from 'react';
import { Crown, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';

/* Self-contained, same pattern as the routine components. */
function Block({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
      <h3 className="font-bold mb-3 text-rose-300">{title}</h3>
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
          <p className="text-xs text-rose-400/70 mt-0.5">{tag}</p>
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

const LOSING = [
  'Over-explaining and justifying',
  'Changing your opinion to match hers',
  'Double-texting when anxious',
  'Interviewing her with rapid questions',
  'Apologising for taking up space',
  'Visibly thrown when teased',
];

const HOLDING = [
  'Amused, not defensive, when tested',
  'Your opinion survives disagreement',
  'One text, then you get on with your day',
  'Sharing, not interrogating',
  'Comfortable taking up space',
  'Teasing back without needing to win',
];

export default function HighValue() {
  return (
    <div className="fade-up stagger space-y-4">
      <div className="card-premium p-5">
        <h3 className="font-bold mb-2 flex items-center gap-2"><Crown size={16} className="text-rose-400" /> High Value — the direct answer</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          It is not frame OR looks. Looks decide whether you get noticed. Frame decides what happens next.
          And your actual life is what produces both — it is the only one of the three that cannot be faked.
          Ranked by how much they move the needle, and how fast you can change them:
        </p>
      </div>

      <div className="bg-gradient-to-br from-rose-500/15 to-[#111] border border-rose-500/30 rounded-2xl p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-rose-300/70 mb-3">The hierarchy</p>
        <div className="space-y-3">
          {[
            ['Your life — the actual source', 'What you are building, who your friends are, what you would be doing tonight if she cancelled. Everything else on this list is downstream of this. It is the slowest to build and the only one that generates the rest for free.'],
            ['Your body and grooming — the entry ticket', 'This is what decides whether you get the first look and the first reply. It is also the MOST fixable thing here: body fat, skin, hair, fit of your clothes. Months, not years. Most men who think they have a "looks problem" have a grooming and body-fat problem.'],
            ['Your frame — what happens after', 'Attention is easy to get and easy to lose. Frame is why interest survives the first test. An attractive man who is needy fades within weeks; an average-looking man who is genuinely grounded does very well.'],
            ['Warmth plus competence', 'People judge you on two axes. Competent but cold gets respect, not desire. Warm but with nothing going on gets liked, not wanted. Both together is the rare combination that reads as high value.'],
            ['Non-neediness — a by-product, not a technique', 'You cannot perform this. It comes from genuinely having a full life and real options. Every attempt to fake it — waiting hours to reply on purpose, pretending to be busy — is detectable, and detection is worse than neediness itself.'],
          ].map(([t, d], i) => (
            <div key={t} className="flex gap-3">
              <span className="text-rose-400/70 font-black text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-200">{t}</p>
                <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frame, concretely */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1 text-center">What frame looks like in practice</p>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 text-center">
          Frame is your version of reality staying steady when someone tests it. Not coldness. Unbothered.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <XCircle size={14} className="text-red-400 flex-shrink-0" />
              <p className="font-black text-[12px] text-red-300 whitespace-nowrap">Losing it</p>
            </div>
            <ul className="space-y-1.5">
              {LOSING.map(x => (
                <li key={x} className="text-[11px] text-gray-400 leading-snug flex gap-1.5">
                  <span className="text-red-400/60 flex-shrink-0">·</span>{x}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
              <p className="font-black text-[12px] text-emerald-300 whitespace-nowrap">Holding it</p>
            </div>
            <ul className="space-y-1.5">
              {HOLDING.map(x => (
                <li key={x} className="text-[11px] text-gray-300 leading-snug flex gap-1.5">
                  <span className="text-emerald-400/60 flex-shrink-0">·</span>{x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed mt-3 text-center">
          The test: can you hear &quot;no&quot; and be the same person ten seconds later?
        </p>
      </div>

      <Block title="Looks vs frame — settled" items={[
        ['Looks get you in the room', 'They decide the first look, the first reply, whether someone is curious. Pretending they do not matter is a lie that keeps men from fixing the easiest thing on the list.'],
        ['Frame decides whether you stay', 'Nobody keeps chasing someone who folds the moment they are tested, however good-looking. Interest that is won by appearance is lost by behaviour.'],
        ['Looks are the fastest fix, so start there', 'Body fat down, skin sorted, hair that suits your face, clothes that fit your shoulders. That is a few months and it changes how strangers respond to you. Frame takes longer because it is built from actual experience.'],
        ['Neither is the real answer', 'Both are outputs. A man with a good body, a full life and real standards ends up with both by default. That is why the hierarchy above starts where it does.'],
      ]} />

      <Block title="The mindset that does not move" items={[
        ['"I don\'t give a shit" — the version that actually works', 'Genuinely caring about nothing is a pose, and it collapses the moment something matters. The real thing is two separate dials: care intensely about your standards, care very little about approval. Most men have those the wrong way round.'],
        ['Stop outsourcing your mood', 'If how you feel about yourself depends on whether someone replies, you have handed a stranger the switch. The question is not "does she like me" — it is "did I do what I said I would today". One of those you control.'],
        ['Want it, do not need it', 'Outcome independence is not pretending you do not care. It is being able to be disappointed without being destabilised. You can want the outcome fully and still be the same person if it does not happen.'],
        ['A full week protects you better than a mantra', 'This is structural, not psychological. If your week contains training, work you care about, and mates, then any one person is a small share of your life — so a bad night stays a bad night. Nothing you tell yourself replaces that.'],
        ['Confidence is built from evidence, not affirmations', 'Every time you do what you said you would do, you add to a file that says you are reliable. That is why it survives rejection — it was never based on someone else\'s opinion. Confidence built purely on results or attention disappears the moment those do.'],
        ['You will still feel it — that is fine', 'The goal is not feeling nothing. It is not being ruled by what you feel. Behaving the same whether or not it stung IS the trait. Anyone claiming they feel nothing is either lying or has stopped caring about anything, which is worse.'],
      ]} />

      <Fold title="Chasing ambition instead of girls" tag="Why this works — and where it becomes an excuse" items={[
        ['The men who do well are mostly not optimising for it', 'That is not a coincidence, it is the mechanism. Attention that is not being sought reads completely differently to attention that is.'],
        ['What a mission actually gives you', 'Somewhere to be. Something to talk about that is not her. A legitimate reason to end the night. And far less time to sit analysing one conversation.'],
        ['It fixes the maths honestly', 'You do not have to perform being busy if your attention is genuinely scarce. That is the whole difference between abundance and acting it out.'],
        ['The practical test', 'Your week should contain things that would happen exactly the same if she never replied. If cancelling one plan empties your week, the problem is the week.'],
        ['Where it becomes a cop-out', 'Being honest: "I am focusing on my goals" can quietly become a way to avoid all social risk. It works when your life is genuinely full. It does not work as a reason to stay in and never put yourself in a position to be rejected.'],
      ]} />

      <Fold title="Why girls go for &quot;bad boys&quot;" tag="It is not the badness — it is what comes bundled with it" items={[
        ['It is never the cruelty', 'Nobody is attracted to being treated badly. They are attracted to traits that happen to be common in men who do not care about being liked — and those traits are completely separable from the behaviour.'],
        ['Decisiveness', 'He makes the plan, picks the place, leads. He does not ask permission for every small thing or outsource the decision back to her. Most men underestimate how attractive it is simply to decide something.'],
        ['Willingness to be disliked', 'He has opinions that survive disagreement and does not adjust himself to be approved of. That is the single biggest one — because it cannot be faked and everyone can sense it.'],
        ['He is not auditioning', 'No trying to impress, no CV of achievements, no anxiety about how it is landing. He assumes he is fine as he is, which reads as status whether or not it is earned.'],
        ['Unpredictability', 'Not knowing exactly what happens next is genuinely stimulating. The reliable-but-boring man loses on novelty, not on character.'],
        ['What actually happens next', 'Those relationships very often go badly, because the same indifference that was attractive turns into unreliability and disregard. That is not a moral point, it is just what tends to happen.'],
        ['The actual move', 'Take the traits, leave the damage. Decisive AND warm. Willing to be disliked AND kind. Non-needy AND reliable. That combination beats both the bad boy and the nice guy, and almost nobody runs it.'],
        ['Why "nice guys" lose — the honest reason', 'It is not niceness. It is niceness as a transaction: being agreeable in exchange for interest, then resenting it when the exchange is not honoured. Agreeableness with no standards underneath reads as having no self. Be kind because that is who you are, not because it is a payment.'],
      ]} />

      <Fold title="The chasing paradox" tag="Why wanting to be chased is the thing stopping it" items={[
        ['Wanting it is itself the tell', 'Being desperate for people to chase you is outcome-dependence — you are handing them control of how you feel. That is the exact opposite of the quality that makes people chase.'],
        ['Acting busy is not being busy', 'Deliberately waiting three hours to reply while staring at your phone is not abundance, it is anxiety with a timer. People read the difference remarkably fast — through your questions, your energy, what you bring up.'],
        ['The men it actually happens to are not running tactics', 'They train, they have work they care about, they have friends, and they are relaxed because they genuinely have somewhere else to be. The relaxation is the attractive part, and it is real rather than performed.'],
        ['Attention and connection are different goals', 'Optimising for "everyone wants me" gets you a lot of shallow interest and very little you would actually want. One person you genuinely click with beats a phone full of half-conversations, and the men who have the second usually stopped chasing the first.'],
        ['The honest version', 'Build the body, the routine, the skill, the friendships because they make your life better. The attraction is a side effect. Build them FOR attraction and it reads as performance — which is the one thing that cannot be hidden.'],
      ]} />

      <Fold title="What kills attraction fastest" tag="Mostly avoidable, mostly invisible to you" items={[
        ['Validation-seeking', 'Fishing for compliments, checking how you came across, asking whether she likes you. It signals that your self-image is her job to maintain.'],
        ['Constant availability', 'Always free, always replying instantly, rearranging everything around her. Not because being available is bad — because it reveals there was nothing else there.'],
        ['Trying to impress', 'Bragging, name-dropping, steering every topic to your achievements. Genuinely impressive things get mentioned once, in passing, or discovered by someone else.'],
        ['Early jealousy or possessiveness', 'Reads as insecurity with no basis yet, and it is one of very few things that can end interest in a single conversation.'],
        ['Mentioning other women\'s interest in you', 'Intended as social proof, received as insecurity. If it were true you would not need to say it.'],
        ['Being a different person in a group', 'Louder with the lads, quieter with her, or the reverse. Inconsistency reads as a lack of a real self underneath, and people notice it faster than you would think.'],
      ]} />

      <Fold title="Night out — what actually puts them off" tag="Mostly small things you will not notice yourself doing" items={[
        ['Hovering', 'Staying in her orbit all night, reappearing every ten minutes. It signals that she is your whole evening. Talk, enjoy it, then genuinely go and be somewhere else.'],
        ['Not having your own night', 'If you have no mates around you and nothing going on, the entire evening visibly rests on her. Have your own night and let her be part of it, not the point of it.'],
        ['Buying drinks to buy interest', 'It converts an interaction into a transaction, and both of you feel it. Buy a drink because you are getting one anyway, never as an opener or an apology.'],
        ['Being drunk', 'Obvious, ignored constantly. Nothing you have built survives being sloppy — and your judgement about how it is going goes first.'],
        ['Ignoring the group', 'Her friends have an effective veto and they will use it. Being good company to all of them does more than anything you say to her directly. Trying to isolate her early gets you vetoed instantly.'],
        ['Not reading the moment', 'Talking at her over loud music for forty minutes when she wants to dance or be with her friends. The venue tells you what kind of interaction is on offer — match it.'],
        ['Re-approaching after a soft no', 'The polite exit is still a no. Going back to try again turns a neutral night into a story her friends tell.'],
        ['Being a different person when your mates arrive', 'Louder, cruder, or suddenly ignoring her. Inconsistency between the two versions is noticed immediately and kills more than either version would alone.'],
        ['Phone out', 'Checking it mid-conversation says the room is more interesting than she is. Cheapest fix on this list — pocket, face down, gone.'],
      ]} />

      <Fold title="Reading whether she is actually interested" tag="Better than running tests on people" items={[
        ['Why "tests" are the wrong frame', 'Games select for people who respond to games, and you have to keep running them forever. What you actually want is to read signals accurately and screen for someone worth your time.'],
        ['Politeness is not interest', 'Replying is not interest. Laughing is not interest. Being friendly in a group is not interest. Most misreadings come from counting basic manners as signals.'],
        ['The real signals', 'She initiates. She makes time when it is inconvenient. She re-engages the conversation after it dies. She asks about you rather than only answering. She brings you into her group.'],
        ['The one clean test that is not a game', 'Propose something specific — a day, a thing, a time. Genuine interest makes time. Ambivalence produces vague replies and no counter-offer. One clear invitation tells you more than a week of texting.'],
        ['If you have to decode it, that is the answer', 'Real interest is rarely subtle for long. Spending hours interpreting a message is itself the information.'],
        ['Screen her too', 'This runs both ways and most men forget it entirely. How does she treat staff? Do her words match her actions? Is she the same when it is inconvenient? How does she talk about people who are not there? You are choosing as well.'],
        ['Standards you would actually enforce', 'A standard you would never act on is a preference. Worked through properly in Mind → Security.'],
      ]} />

      <Fold title="An Instagram people watch" tag="The principle — full guide in Looks → Style" items={[
        ['The one rule underneath all of it', 'A high-value profile is evidence of a life, not an advert for one. Every specific tactic is downstream of that, and none of them work if the life is not there.'],
        ['Why it belongs to this section at all', 'A grid is just non-neediness made visible. Posting constantly, chasing likes, deleting underperformers and checking who viewed are the same outcome-dependence discussed above, wearing a different outfit.'],
        ['The full breakdown is in Looks → Style', 'Profile setup, the first nine tiles, post ideas, what kills it, and a 30-day reset — all in one place there rather than split across two sections.'],
      ]} />

      <Block title="Build it in this order" items={[
        ['1. Body', 'Most controllable, biggest visible return, and it changes how you carry yourself as much as how you look. Start here — see The Program.'],
        ['2. Grooming, skin, style', 'Days to weeks for a real change. The cheapest points available and most men leave them on the table. See the Looks section.'],
        ['3. Something you are genuinely into', 'Football, Muay Thai, building something, a skill you are getting good at. This is the actual source of everything above — it gives you somewhere else to be and something to talk about that is not her.'],
        ['4. A social circle', 'How other people treat you is read instantly and cannot be self-reported. Being visibly valued by your friends does more than anything you could say about yourself.'],
        ['5. Conversation and warmth', 'Presence, listening, teasing without cruelty, making people feel like the only person in the room. See the Charisma tab.'],
        ['6. Standards', 'Know what you actually want and be willing to walk away from what you do not. Standards you would enforce are the difference between confidence and an impression of it.'],
      ]} />
    </div>
  );
}
