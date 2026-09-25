import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Youtube, Loader2, Trash2, Copy, Check, ChevronDown, AlertTriangle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { summariseVideo } from '../lib/generators';
import type { VideoNotes as Notes } from '../lib/generators';

const KEY = 'gymforge_video_notes';

interface SavedNote {
  id: string;
  url: string;
  videoId: string;
  title: string;
  savedAt: string;
  notes: Notes;
}

function load(): SavedNote[] {
  try {
    const raw = localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/* Handles watch?v=, youtu.be/, /shorts/, /embed/ and extra query params. */
export function extractVideoId(url: string): string {
  const s = url.trim();
  const m =
    s.match(/[?&]v=([A-Za-z0-9_-]{11})/) ||
    s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ||
    s.match(/\/shorts\/([A-Za-z0-9_-]{11})/) ||
    s.match(/\/embed\/([A-Za-z0-9_-]{11})/) ||
    s.match(/^([A-Za-z0-9_-]{11})$/);
  return m ? m[1] : '';
}

function NoteCard({ n, onDelete }: { n: SavedNote; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function asText(): string {
    const p = n.notes;
    return [
      p.headline,
      n.title ? `(${n.title})` : '',
      n.url,
      '',
      p.oneLine,
      '',
      'KEY POINTS',
      ...p.keyPoints.map(k => `- ${k}`),
      ...(p.actions.length ? ['', 'DO THIS', ...p.actions.map(a => `- ${a}`)] : []),
      ...(p.quotes?.length ? ['', 'QUOTES', ...p.quotes.map(q => `"${q}"`)] : []),
      ...(p.verdict ? ['', `VERDICT: ${p.verdict}`] : []),
    ].filter(Boolean).join('\n');
  }

  function copy() {
    navigator.clipboard.writeText(asText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }).catch(() => {});
  }

  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-start gap-3 px-4 py-3 text-left">
        {n.videoId && (
          <img
            src={`https://img.youtube.com/vi/${n.videoId}/mqdefault.jpg`}
            alt=""
            className="w-20 h-[45px] object-cover rounded-lg flex-shrink-0 bg-white/5"
            onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-100 leading-snug">{n.notes.headline}</p>
          <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-2">{n.notes.oneLine}</p>
          <p className="text-gray-700 text-[10px] mt-1">{n.savedAt}</p>
        </div>
        <ChevronDown size={16} className={`text-gray-600 flex-shrink-0 mt-1 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-4 pb-4 space-y-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 mb-1.5">Key points</p>
              <ul className="space-y-1.5">
                {n.notes.keyPoints.map(k => (
                  <li key={k} className="text-gray-400 text-[13px] leading-relaxed flex gap-2">
                    <span className="text-red-400/70 flex-shrink-0">•</span><span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>

            {n.notes.actions.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-500/80 mb-1.5">Do this</p>
                <ul className="space-y-1.5">
                  {n.notes.actions.map(a => (
                    <li key={a} className="text-gray-300 text-[13px] leading-relaxed flex gap-2">
                      <span className="text-emerald-400/80 flex-shrink-0">→</span><span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!!n.notes.quotes?.length && (
              <div className="space-y-1.5">
                {n.notes.quotes.map(q => (
                  <p key={q} className="text-gray-400 text-[13px] italic leading-relaxed border-l-2 border-white/10 pl-3">“{q}”</p>
                ))}
              </div>
            )}

            {n.notes.verdict && (
              <div className="bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5">
                <p className="text-gray-400 text-xs leading-relaxed">
                  <span className="font-bold text-gray-300">Verdict:</span> {n.notes.verdict}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              {n.url && (
                <a href={n.url} target="_blank" rel="noreferrer"
                  className="text-[11px] font-bold bg-red-500/10 border border-red-500/25 text-red-200 px-3 py-1.5 rounded-full">
                  Open video
                </a>
              )}
              <button onClick={copy}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-white/8 text-gray-200 px-3 py-1.5 rounded-full">
                {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Copied' : 'Copy notes'}
              </button>
              <button onClick={() => onDelete(n.id)}
                className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 px-2 py-1.5">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoNotes() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [transcript, setTranscript] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<SavedNote[]>(load);

  const videoId = extractVideoId(url);

  function persist(next: SavedNote[]) {
    setSaved(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* quota — notes stay in memory */ }
  }

  /* Best-effort title lookup. oEmbed is the only YouTube endpoint that answers a
   * browser directly; if it is blocked or offline this quietly does nothing and
   * the typed title (or none) is used instead. */
  async function lookupTitle(id: string) {
    if (!id || title) return;
    try {
      const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
      if (!r.ok) return;
      const j = await r.json();
      if (j && typeof j.title === 'string') setTitle(j.title);
    } catch { /* no title, no problem */ }
  }

  async function run() {
    setError('');
    if (transcript.trim().length < 200) {
      setError('Paste the transcript first — at least a few paragraphs. Without it there is nothing to summarise but the title, and that produces invented notes.');
      return;
    }
    setBusy(true);
    try {
      const notes = await summariseVideo(transcript, title || undefined);
      const entry: SavedNote = {
        id: `${Date.now()}`,
        url: url.trim(),
        videoId,
        title: title.trim(),
        savedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        notes,
      };
      persist([entry, ...saved]);
      setUrl(''); setTitle(''); setTranscript('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again.');
    }
    setBusy(false);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-red-950/25 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 bg-red-500/10 rounded-xl flex items-center justify-center">
            <Youtube className="text-red-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Video Notes</h1>
            <p className="text-gray-500 text-sm">Paste a video, keep the substance</p>
          </div>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3.5">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">YouTube link</label>
            <input
              value={url}
              onChange={e => { setUrl(e.target.value); }}
              onBlur={() => lookupTitle(extractVideoId(url))}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full mt-1.5 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-red-500/40 outline-none"
            />
          </div>

          {videoId && (
            <div className="flex items-center gap-3 bg-black/25 rounded-xl p-2.5">
              <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt=""
                className="w-24 h-[54px] object-cover rounded-lg flex-shrink-0 bg-white/5"
                onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }} />
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Video title (optional)"
                className="flex-1 min-w-0 bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none"
              />
            </div>
          )}

          <div>
            <div className="flex items-baseline justify-between gap-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Transcript</label>
              <span className="text-[10px] text-gray-600">{transcript.trim() ? `${transcript.trim().split(/\s+/).length} words` : ''}</span>
            </div>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              rows={7}
              placeholder="Paste the transcript here…"
              className="w-full mt-1.5 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-red-500/40 outline-none resize-y"
            />
          </div>

          {error && (
            <div className="bg-amber-500/8 border border-amber-500/25 rounded-xl px-3.5 py-2.5 flex items-start gap-2">
              <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-200/85 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <button
            onClick={run}
            disabled={busy}
            className="w-full bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-bold text-sm rounded-xl py-3 transition-colors inline-flex items-center justify-center gap-2"
          >
            {busy ? <><Loader2 size={15} className="animate-spin" /> Reading it…</> : 'Summarise and save'}
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 mt-3">
          <p className="text-[11px] font-bold text-gray-300 mb-1.5">Getting the transcript — 10 seconds</p>
          <p className="text-gray-500 text-[11px] leading-relaxed">
            On desktop: under the video, click <span className="text-gray-300">…more</span> → <span className="text-gray-300">Show transcript</span>,
            then select it all and copy. On the phone app: <span className="text-gray-300">…</span> → <span className="text-gray-300">Show transcript</span>.
            You can leave the timestamps in — they get ignored.
          </p>
          <p className="text-gray-600 text-[11px] leading-relaxed mt-2">
            Why paste it rather than just the link? This app is a static page with no server, and YouTube does not
            let a browser fetch captions directly. Anything that promises notes from a link alone is guessing from
            the title — which reads fine and is frequently wrong. One copy-paste is the difference between real
            notes and invented ones.
          </p>
        </div>

        {saved.length > 0 && (
          <div className="mt-6">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-black text-gray-200">Saved notes</h2>
              <span className="text-[11px] text-gray-600">{saved.length}</span>
            </div>
            <div className="space-y-2.5">
              {saved.map(n => (
                <NoteCard key={n.id} n={n} onDelete={id => persist(saved.filter(x => x.id !== id))} />
              ))}
            </div>
            <p className="text-gray-700 text-[10px] leading-relaxed mt-3">
              Saved on this device. They open offline — only the summarising itself needs a connection.
            </p>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
