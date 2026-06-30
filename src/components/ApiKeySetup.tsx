import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { setApiKey } from '../lib/anthropic';

export default function ApiKeySetup({ onSet }: { onSet: () => void }) {
  const [key, setKey] = useState('');
  const valid = key.startsWith('sk-ant-') && key.length > 20;

  const handleSubmit = () => {
    if (!valid) return;
    setApiKey(key);
    onSet();
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
            <Dumbbell className="text-orange-500" size={20} />
          </div>
          <div>
            <h2 className="font-black text-lg">GymForge</h2>
            <p className="text-gray-500 text-xs">Enter your Anthropic API key to get started</p>
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          GymForge uses Claude AI to generate your personalised plans.
          Get a free key at{' '}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noreferrer"
            className="text-orange-400 hover:text-orange-300 underline"
          >
            console.anthropic.com
          </a>
          . Your key is stored only in your browser.
        </p>

        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="sk-ant-..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-all mb-4 font-mono text-sm"
          autoFocus
        />

        <button
          onClick={handleSubmit}
          disabled={!valid}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all"
        >
          Start Building My Plan
        </button>
      </div>
    </div>
  );
}
