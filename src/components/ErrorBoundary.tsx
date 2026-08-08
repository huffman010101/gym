import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';

/*
 * Why this exists: a malformed AI result saved in localStorage used to blank the
 * entire app. `layering.combos.map(...)` threw during render, React unmounted
 * everything, and because the bad object was persisted it happened again on
 * every visit — permanently black until storage was cleared by hand.
 *
 * Validation now stops bad data being saved, but this is the backstop so no
 * single bad object can ever take the whole app down again. It also gives a way
 * out from inside the app, since a user cannot clear localStorage themselves.
 */

// Only AI/derived caches. Never the daily habit ticks, streaks, body metrics,
// photos or the API key — those are real user data, not recoverable output.
const DERIVED_KEYS = [
  'gymforge_layering',
  'gymforge_face_scan',
  'gymforge_studypack',
  'gymforge_subject_concepts',
  'gymforge_knowledge_generated',
  'gymforge_chart_annotations',
  'gymforge_chartquiz_score',
];

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // No remote logging in this app — surface it where it can actually be read.
    console.error('Render error caught by boundary:', error, info.componentStack);
  }

  private clearDerived = () => {
    for (const k of DERIVED_KEYS) {
      try { localStorage.removeItem(k); } catch { /* ignore */ }
    }
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white px-5 py-10">
        <div className="max-w-md mx-auto">
          <div className="bg-[#111] border border-red-500/25 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={17} className="text-red-400" />
              <h1 className="font-black text-lg">This screen hit an error</h1>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Something on this page failed to render. Nothing you have tracked is lost — your habits, streaks,
              measurements and photos are stored separately and untouched.
            </p>

            <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">What went wrong</p>
              <p className="text-red-300/90 text-xs font-mono leading-relaxed break-words">{error.message}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-white/10 hover:bg-white/15 text-gray-200 font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2"
              >
                <RotateCcw size={15} /> Reload the page
              </button>
              <button
                onClick={this.clearDerived}
                className="w-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-200 font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2"
              >
                <Trash2 size={15} /> Clear saved AI results and reload
              </button>
            </div>

            <p className="text-gray-600 text-[11px] leading-relaxed mt-3">
              If a reload does not help, the second button discards saved AI output — fragrance combos, face scan,
              study pack, generated knowledge and chart annotations. Those regenerate. Your tracked data is not touched.
            </p>
          </div>
        </div>
      </main>
    );
  }
}
