import { Link } from 'react-router-dom';
import { ChevronLeft, Coffee } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { skinsOn } from '../lib/themes';

/*
 * Section skins: the header art and full-page backdrop for Gym (the Bat),
 * Mind (the Cave, with Alfred) and Looks (Aura). All artwork is original
 * SVG/CSS — no studio logos. Each hero carries the section title and the
 * back link, replacing SectionHeader on that page. When skins are switched
 * off in the theme picker, pages fall back to the plain SectionHeader.
 */

export { skinsOn };

const dayIndex = (n: number) => {
  const d = new Date();
  return (d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % n;
};

function Back() {
  return (
    <Link to="/" className="relative z-10 inline-flex items-center gap-1 font-hud text-[11px] font-bold uppercase tracking-[0.22em] text-white/60 hover:text-white">
      <ChevronLeft size={14} /> Command
    </Link>
  );
}

/* Fixed full-page backdrop that covers the global HUD grid on skinned pages. */
export function SkinBackdrop({ kind }: { kind: 'bat' | 'cave' | 'aura' }) {
  return <div aria-hidden className={`skin-backdrop skin-backdrop-${kind}`} />;
}

/* ============================ GYM — THE BAT ============================ */

// Deterministic Gotham skyline: [x, width, height].
const TOWERS: [number, number, number][] = [
  [0, 26, 58], [24, 18, 84], [40, 30, 46], [68, 22, 102], [88, 34, 64], [120, 16, 120], [134, 28, 74],
  [160, 24, 52], [182, 36, 92], [216, 20, 66], [234, 30, 110], [262, 22, 56], [282, 34, 86],
  [314, 18, 132], [330, 30, 70], [358, 22, 96], [378, 24, 60],
];

export function BatHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative -mx-5 mb-5 overflow-hidden" data-testid="bat-hero">
      <svg viewBox="0 0 400 210" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="bat-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#030405" />
            <stop offset="70%" stopColor="#0d1014" />
            <stop offset="100%" stopColor="#14171c" />
          </linearGradient>
          <linearGradient id="bat-beam" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0.04" />
          </linearGradient>
          <radialGradient id="bat-disc">
            <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#facc15" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="210" fill="url(#bat-sky)" />
        <ellipse cx="300" cy="40" rx="140" ry="26" fill="#2a2f38" opacity="0.35" />
        <ellipse cx="120" cy="24" rx="120" ry="18" fill="#2a2f38" opacity="0.25" />
        <g className="bat-sway">
          <polygon points="300,170 318,170 330,62 230,62" fill="url(#bat-beam)" />
          <ellipse cx="282" cy="58" rx="64" ry="36" fill="url(#bat-disc)" />
          <g transform="translate(238 38) scale(0.44)" fill="#07080a">
            <path d="M100 18 l-5 -12 l-3 14 C 80 22 70 20 60 12 C 58 26 48 34 30 34 C 36 40 38 48 34 56 C 18 52 8 42 2 30 C 4 52 22 72 58 76 C 62 66 72 60 84 62 C 90 64 96 70 100 78 C 104 70 110 64 116 62 C 128 60 138 66 142 76 C 178 72 196 52 198 30 C 192 42 182 52 166 56 C 162 48 164 40 170 34 C 152 34 142 26 140 12 C 130 20 120 22 108 20 l-3 -14 z" />
          </g>
        </g>
        {TOWERS.map(([x, w, h], i) => (
          <g key={i}>
            <rect x={x} y={210 - h} width={w} height={h} fill="#06070a" />
            {Array.from({ length: Math.floor(h / 16) }).map((_, r) =>
              (i * 7 + r * 3) % 4 === 0 ? <rect key={r} x={x + 4 + ((i + r) % 2) * (w - 12)} y={210 - h + 8 + r * 15} width="4" height="5" fill="#facc15" opacity={0.35 + ((i + r) % 3) * 0.15} /> : null,
            )}
          </g>
        ))}
        <rect x="292" y="166" width="34" height="44" fill="#06070a" />
        <rect x="300" y="160" width="18" height="10" rx="2" fill="#1c1f25" />
      </svg>
      <div className="bat-rain absolute inset-0 pointer-events-none" />
      <div className="relative px-5 pt-6 pb-7">
        <Back />
        <p className="relative font-hud text-[10px] uppercase tracking-[0.35em] text-yellow-300/80 mt-7">Wayne // Training</p>
        <h1 className="relative font-orbitron text-4xl font-black text-white tracking-wider leading-none mt-1" style={{ textShadow: '0 0 18px rgba(250,204,21,0.25)' }}>{title}</h1>
        <p className="relative text-gray-400 text-xs mt-2 max-w-[60%]">{subtitle}</p>
      </div>
    </div>
  );
}

/* ====================== MIND — THE CAVE, AND ALFRED ====================== */

const ALFRED = [
  'Shall I put the kettle on, sir, or shall we skip straight to the hard part?',
  'You do not have to feel ready, sir. You only have to start.',
  'The same small thing, every day. It is terribly dull, sir, and it works.',
  'If you fall today, sir, we will simply pick you up tomorrow. That is rather the point.',
  'Your phone can wait, sir. It has never once improved your character.',
  'I have taken the liberty of assuming you will keep your word to yourself today.',
  'Fear is information, sir, not instruction.',
  'A gentleman is calm, sir — not because nothing is happening, but because he has decided how to respond.',
  'Rest is part of the work, sir. Even the cave has its quiet hours.',
  'One honest conversation will do more for you than a hundred clever lines, sir.',
  'You were not built to be comfortable, sir. You were built to be useful.',
  'Discipline is simply remembering what you want, sir.',
  'Being disliked by some is the price of being someone, sir. It is a fair price.',
  'Breakfast, sir, then the world.',
];

export function alfredLine() {
  return ALFRED[dayIndex(ALFRED.length)];
}

function Screen({ x, y, w, h, kind, delay }: { x: number; y: number; w: number; h: number; kind: number; delay: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill="#03111c" stroke="#38bdf8" strokeOpacity="0.55" strokeWidth="1" />
      <rect x={x} y={y} width={w} height={h} rx="2" fill="#38bdf8" className="cave-flicker" style={{ animationDelay: delay }} opacity="0.08" />
      {kind === 0 && [0, 1, 2, 3].map(i => <rect key={i} x={x + 4} y={y + 5 + i * 6} width={(w - 8) * (0.4 + ((i * 37) % 50) / 100)} height="2" fill="#7dd3fc" opacity="0.7" />)}
      {kind === 1 && [0, 1, 2, 3, 4].map(i => <rect key={i} x={x + 4 + i * ((w - 8) / 5)} y={y + h - 4 - (6 + ((i * 29) % 16))} width={(w - 8) / 5 - 2} height={6 + ((i * 29) % 16)} fill="#38bdf8" opacity="0.75" />)}
      {kind === 2 && <polyline points={Array.from({ length: 9 }).map((_, i) => `${x + 3 + i * ((w - 6) / 8)},${y + h / 2 + Math.sin(i * 1.3) * (h / 4)}`).join(' ')} fill="none" stroke="#7dd3fc" strokeWidth="1.2" />}
      {kind === 3 && (
        <g>
          <circle cx={x + w / 2} cy={y + h / 2} r={h / 2.6} fill="none" stroke="#38bdf8" strokeOpacity="0.6" />
          <circle cx={x + w / 2} cy={y + h / 2} r={h / 5} fill="none" stroke="#38bdf8" strokeOpacity="0.4" />
          <line x1={x + w / 2} y1={y + h / 2} x2={x + w / 2 + h / 2.6} y2={y + h / 2} stroke="#7dd3fc" className="cave-radar" style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }} />
        </g>
      )}
      {kind === 4 && <g transform={`translate(${x + w / 2 - 14} ${y + h / 2 - 6}) scale(0.14)`} fill="#7dd3fc"><path d="M100 18 l-5 -12 l-3 14 C 80 22 70 20 60 12 C 58 26 48 34 30 34 C 36 40 38 48 34 56 C 18 52 8 42 2 30 C 4 52 22 72 58 76 C 62 66 72 60 84 62 C 90 64 96 70 100 78 C 104 70 110 64 116 62 C 128 60 138 66 142 76 C 178 72 196 52 198 30 C 192 42 182 52 166 56 C 162 48 164 40 170 34 C 152 34 142 26 140 12 C 130 20 120 22 108 20 l-3 -14 z" /></g>}
    </g>
  );
}

export function CaveHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative -mx-5 mb-4 overflow-hidden" data-testid="cave-hero">
      <svg viewBox="0 0 400 230" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="cave-glow" cx="50%" cy="62%" r="55%">
            <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="230" fill="#02040a" />
        <rect width="400" height="230" fill="url(#cave-glow)" />
        {/* stalactites */}
        <path d="M0 0 H400 V14 L388 34 L376 12 L362 46 L350 16 L336 28 L322 10 L306 52 L292 14 L278 26 L262 8 L246 40 L232 12 L216 22 L200 6 L186 30 L172 10 L156 44 L140 14 L126 24 L110 8 L96 38 L80 12 L66 26 L50 10 L36 48 L22 14 L10 26 L0 12 Z" fill="#05070c" />
        {/* waterfall glint on the left wall */}
        <rect x="14" y="40" width="3" height="150" fill="#7dd3fc" opacity="0.08" className="cave-fall" />
        {/* suit case on the right */}
        <rect x="338" y="92" width="44" height="98" rx="3" fill="#0b1220" stroke="#94a3b8" strokeOpacity="0.35" />
        <path d="M360 104 c-6 0 -8 6 -8 10 c0 4 3 7 8 7 c5 0 8 -3 8 -7 c0 -4 -2 -10 -8 -10 z M346 126 h28 l6 52 h-40 z" fill="#111827" />
        <rect x="338" y="92" width="44" height="98" rx="3" fill="#94a3b8" opacity="0.05" />
        {/* the Bat-computer */}
        <Screen x={92} y={96} w={46} h={30} kind={0} delay="0s" />
        <Screen x={142} y={82} w={56} h={36} kind={1} delay="0.7s" />
        <Screen x={202} y={82} w={56} h={36} kind={4} delay="1.3s" />
        <Screen x={262} y={96} w={46} h={30} kind={2} delay="0.4s" />
        <Screen x={142} y={122} w={56} h={26} kind={3} delay="1.9s" />
        <Screen x={202} y={122} w={56} h={26} kind={0} delay="2.4s" />
        <path d="M110 176 Q200 158 290 176 L300 186 Q200 168 100 186 Z" fill="#0f172a" stroke="#38bdf8" strokeOpacity="0.25" />
        <rect x="186" y="186" width="28" height="20" fill="#0b1220" />
        {/* platform and rock */}
        <path d="M0 230 V196 Q60 184 120 204 T260 200 T400 192 V230 Z" fill="#04060b" />
        {/* bats */}
        <g className="cave-bat" fill="#0b0f19"><g transform="scale(0.09)"><path d="M100 18 l-5 -12 l-3 14 C 80 22 70 20 60 12 C 58 26 48 34 30 34 C 36 40 38 48 34 56 C 18 52 8 42 2 30 C 4 52 22 72 58 76 C 62 66 72 60 84 62 C 90 64 96 70 100 78 C 104 70 110 64 116 62 C 128 60 138 66 142 76 C 178 72 196 52 198 30 C 192 42 182 52 166 56 C 162 48 164 40 170 34 C 152 34 142 26 140 12 C 130 20 120 22 108 20 l-3 -14 z" /></g></g>
        <g className="cave-bat cave-bat-2" fill="#0b0f19"><g transform="scale(0.07)"><path d="M100 18 l-5 -12 l-3 14 C 80 22 70 20 60 12 C 58 26 48 34 30 34 C 36 40 38 48 34 56 C 18 52 8 42 2 30 C 4 52 22 72 58 76 C 62 66 72 60 84 62 C 90 64 96 70 100 78 C 104 70 110 64 116 62 C 128 60 138 66 142 76 C 178 72 196 52 198 30 C 192 42 182 52 166 56 C 162 48 164 40 170 34 C 152 34 142 26 140 12 C 130 20 120 22 108 20 l-3 -14 z" /></g></g>
      </svg>
      <div className="relative px-5 pt-6 pb-24">
        <Back />
        <p className="relative font-hud text-[10px] uppercase tracking-[0.35em] text-sky-300/80 mt-6">The Cave // Mind</p>
        <h1 className="relative font-orbitron text-4xl font-black text-white tracking-wider leading-none mt-1" style={{ textShadow: '0 0 18px rgba(56,189,248,0.35)' }}>{title}</h1>
        <p className="relative text-gray-400 text-xs mt-2 max-w-[70%]">{subtitle}</p>
      </div>
    </div>
  );
}

export function AlfredCard() {
  return (
    <div className="relative rounded-2xl border border-slate-300/20 bg-gradient-to-br from-slate-200/[0.06] to-transparent px-4 py-3 mb-4 flex gap-3" data-testid="alfred">
      <div className="w-9 h-9 rounded-full border border-slate-300/30 bg-slate-200/[0.06] flex items-center justify-center flex-shrink-0">
        <Coffee size={16} className="text-slate-200" />
      </div>
      <div className="min-w-0">
        <p className="font-hud text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300/80">Alfred</p>
        <p className="text-sm text-gray-200 leading-relaxed italic">“{alfredLine()}”</p>
      </div>
    </div>
  );
}

/* The cave's equipment, one station per Mind tab — this is the Mind tab bar. */
export function Stations<T extends string>({ items, active, onChange }: {
  items: { id: T; name: string; label: string; icon: LucideIcon }[]; active: T; onChange: (id: T) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5 mb-5" role="tablist" aria-label="Cave stations">
      {items.map(({ id, name, label, icon: Icon }) => {
        const on = id === active;
        return (
          <button key={id} role="tab" aria-selected={on} onClick={() => onChange(id)}
            className={`rounded-xl border px-1 py-2 text-center transition-all ${on
              ? 'border-sky-300/60 bg-sky-400/[0.12] shadow-[0_0_16px_rgb(var(--a-400)/0.25)]'
              : 'border-white/8 bg-black/30 hover:border-sky-300/30'}`}>
            <Icon size={17} className={`mx-auto ${on ? 'text-sky-200' : 'text-sky-400/70'}`} />
            <p className={`font-hud text-[10px] font-bold uppercase tracking-wide mt-1 leading-tight ${on ? 'text-white' : 'text-gray-300'}`}>{name}</p>
            <p className="text-[9px] text-gray-500 leading-tight mt-0.5">{label}</p>
          </button>
        );
      })}
    </div>
  );
}

/* ============================== LOOKS — AURA ============================== */

const AURA_LINES = [
  'Aura is what people feel before you speak — posture, scent, calm eyes.',
  'Slow movements, steady eye contact, clean skin, a scent people remember.',
  'Nobody can see your bone structure from across a room. They can see how you carry it.',
  'Grooming says you respect yourself. Posture says you expect respect.',
  'The glow-up is boring in private: SPF, sleep, water, training. Loud in public.',
  'Smell good, stand tall, speak slowly. Three free upgrades.',
  'Your aura is the sum of what you do when nobody is watching.',
];

export function AuraHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative -mx-5 mb-5 overflow-hidden" data-testid="aura-hero">
      <div className="absolute inset-0 bg-[#07040d]" />
      <div className="aura-orb aura-orb-1" />
      <div className="aura-orb aura-orb-2" />
      <div className="aura-orb aura-orb-3" />
      <svg viewBox="0 0 400 220" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="aura-core">
            <stop offset="0%" stopColor="#f5d0fe" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#a78bfa" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="118" r="92" fill="url(#aura-core)" />
        <circle cx="300" cy="118" r="62" fill="none" stroke="#e9d5ff" strokeOpacity="0.35" className="aura-ring" />
        <circle cx="300" cy="118" r="78" fill="none" stroke="#f9a8d4" strokeOpacity="0.25" className="aura-ring aura-ring-2" />
        <circle cx="300" cy="118" r="94" fill="none" stroke="#c4b5fd" strokeOpacity="0.18" className="aura-ring aura-ring-3" />
        {/* head-and-shoulders silhouette */}
        <path d="M300 74 c-15 0 -24 12 -24 27 c0 13 7 23 16 27 l-2 8 c-22 4 -40 16 -46 40 h112 c-6 -24 -24 -36 -46 -40 l-2 -8 c9 -4 16 -14 16 -27 c0 -15 -9 -27 -24 -27 z"
          fill="#0b0613" stroke="#f0abfc" strokeOpacity="0.6" strokeWidth="1.2" />
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} cx={220 + ((i * 53) % 170)} cy={30 + ((i * 71) % 170)} r={((i % 3) + 1) * 0.9} fill="#fdf4ff" className="aura-spark" style={{ animationDelay: `${(i % 7) * 0.6}s` }} />
        ))}
      </svg>
      <div className="relative px-5 pt-6 pb-7">
        <Back />
        <p className="relative font-hud text-[10px] uppercase tracking-[0.35em] text-pink-200/80 mt-7">Looks // Presence</p>
        <h1 className="relative font-orbitron text-4xl font-black tracking-[0.18em] leading-none mt-1 aura-text">{title}</h1>
        <p className="relative text-gray-300/80 text-xs mt-2 max-w-[55%]">{subtitle}</p>
        <p className="relative text-[12px] text-fuchsia-100/90 italic mt-3 max-w-[58%] leading-snug">{AURA_LINES[dayIndex(AURA_LINES.length)]}</p>
      </div>
    </div>
  );
}
