import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lock, Zap, MessageCircle, Eye, Heart, Flame, DoorOpen } from 'lucide-react';
import BottomNav from '../components/BottomNav';

function Row({ text }: { text: string }) {
  return (
    <li className="text-sm text-gray-300 leading-snug flex items-start gap-2">
      <span className="text-pink-400 mt-1 flex-shrink-0">•</span>
      <span>{text}</span>
    </li>
  );
}

function Block({ icon: Icon, title, rows }: { icon: typeof Zap; title: string; rows: string[] }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Icon size={15} className="text-pink-400" />
        <h3 className="font-black text-sm">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {rows.map(r => <Row key={r} text={r} />)}
      </ul>
    </div>
  );
}

export default function CheatSheet() {
  const [pw, setPw] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try { setUnlocked(localStorage.getItem('gymforge_secret_unlocked') === '1'); } catch {}
  }, []);

  const tryUnlock = () => {
    if (pw.trim().toLowerCase() === 'roy') {
      setUnlocked(true);
      try { localStorage.setItem('gymforge_secret_unlocked', '1'); } catch {}
    } else {
      setPw('');
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-pink-950/40 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/mind?tab=secret" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Mind
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-pink-500/10 rounded-xl flex items-center justify-center">
            <BookOpen className="text-pink-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Cheat Sheet</h1>
            <p className="text-gray-500 text-sm">Check before you go out — everything, one page</p>
          </div>
        </div>

        {!unlocked ? (
          <div className="fade-up">
            <div className="card-premium p-8 text-center">
              <Lock size={28} className="text-pink-400 mx-auto mb-4" />
              <h3 className="font-black text-lg mb-1">Members Only</h3>
              <p className="text-gray-500 text-sm mb-6">This page is password-protected.</p>
              <div className="flex gap-2 max-w-xs mx-auto">
                <input
                  type="password"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && tryUnlock()}
                  placeholder="Password"
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500/50"
                />
                <button onClick={tryUnlock}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                  Unlock
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="fade-up stagger space-y-3">
            <Block icon={Flame} title="Frame — hold it all night" rows={[
              'She\'s not above you — you\'re both finding out if there\'s a fit.',
              'Qualify her back: is she actually interesting, not just "will she like me".',
              'A no is poor fit found early, not a loss. Stay level either way.',
              'Don\'t over-explain, don\'t fix silences by rushing, don\'t fold on your opinions.',
            ]} />
            <Block icon={Eye} title="Before you leave the house" rows={[
              'Immaculate baseline: pressed clothes, clean shoes, groomed — not for tonight, always.',
              'Decide your standards now, not mid-conversation: what you won\'t tolerate.',
              'Small group (2-3), go earlier than the crowd, max 2 drinks of lubricant.',
              'Remind yourself: unbothered, amused, not wounded by anything that happens tonight.',
            ]} />
            <Block icon={DoorOpen} title="Warm up & position" rows={[
              'Talk to everyone for the first 30 min — bouncers, bartenders, groups. Warm the engine.',
              'Stand where traffic flows, near the bar, not hidden in a booth.',
              'Eye contact + smile as people pass. Held twice = green light.',
            ]} />
            <Block icon={Zap} title="The approach" rows={[
              'Within 3 seconds of noticing her — hesitation kills it before you move.',
              'Front or side, never behind. Relaxed pace, comfortable distance.',
              'Be direct: "This is random, but I saw you and had to say hi. I\'m [name]."',
              'Loud venue: skip clever openers, lean in, keep it simple.',
              'Greet her friends early and win them — ignoring them ends nights fast.',
            ]} />
            <Block icon={MessageCircle} title="Conversation" rows={[
              'Statements over questions: "you seem like the friend who plans everything" > "what do you do?"',
              'Tease lightly and warmly, never at real insecurities.',
              'Push-pull: show interest, then playfully withdraw it. Tension over flatness.',
              'Take her through emotions, not one flat note: funny → competitive → sincere → funny again.',
              'Give her the floor — ask, then actually listen and use the answer.',
            ]} />
            <Block icon={Heart} title="Reading her, honestly" rows={[
              'Interested: questions back, extends the chat, stays close, remembers details.',
              'Polite: short answers, no questions back, looks for an exit.',
              'Believe the pattern, not one ambiguous moment. Never argue with a no.',
              'If it\'s flat — smile, wish her well, exit like it cost you nothing.',
            ]} />
            <Block icon={Zap} title="Closing" rows={[
              'Ask at the peak, not the fizzle: "I need to run, but want to continue this — number?"',
              'If hesitant: "fair, then let\'s do this properly" — no sulking, ever.',
              'Suggest a quieter spot if the vibe\'s building — always an invite, never a pull.',
            ]} />
            <Block icon={MessageCircle} title="Texting after" rows={[
              'Callback to something specific within a day, not generic "hey".',
              'Mirror her length and pace roughly — don\'t triple-text, don\'t play games either.',
              'Every message does a job: a question, a bit, or a plan. Get to the date.',
              'One follow-up max if she goes quiet, then let it breathe.',
            ]} />
            <div className="bg-pink-500/5 border border-pink-500/20 rounded-2xl px-4 py-3.5">
              <p className="text-xs text-pink-200/80 leading-relaxed">
                Full breakdowns for every point above live in Mind → Secret. This page is the fast-scan version —
                open it, remind yourself of the frame, go.
              </p>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
