import { HashRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Plan from './pages/Plan';
import Programs from './pages/Programs';
import FoodLog from './pages/FoodLog';
import Physique from './pages/Physique';
import LooksMax from './pages/LooksMax';
import Combat from './pages/Combat';
import Mind from './pages/Mind';
import Football from './pages/Football';
import Padel from './pages/Padel';
import Money from './pages/Money';
import Uni from './pages/Uni';
import Journey from './pages/Journey';
import Guide from './pages/Guide';
import Feed from './pages/Feed';
import Knowledge from './pages/Knowledge';
import CheatSheet from './pages/CheatSheet';
import Dating from './pages/Dating';
import Backtest from './pages/Backtest';
import ApiKeySetup from './components/ApiKeySetup';
import { getApiKey } from './lib/anthropic';

function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  if (!offline) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-black text-center text-[12px] font-bold py-1.5 px-4">
      Offline — all guides and your checklist work. AI features need signal.
    </div>
  );
}

export default function App() {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    setHasKey(!!getApiKey());
  }, []);

  return (
    <ErrorBoundary>
      <HashRouter>
      <OfflineBanner />
      {!hasKey && <ApiKeySetup onSet={() => setHasKey(true)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/food" element={<FoodLog />} />
        <Route path="/physique" element={<Physique />} />
        <Route path="/looksmax" element={<LooksMax />} />
        <Route path="/combat" element={<Combat />} />
        <Route path="/mind" element={<Mind />} />
        <Route path="/football" element={<Football />} />
        <Route path="/padel" element={<Padel />} />
        <Route path="/money" element={<Money />} />
        <Route path="/uni" element={<Uni />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/cheatsheet" element={<CheatSheet />} />
        <Route path="/dating" element={<Dating />} />
        <Route path="/backtest" element={<Backtest />} />
      </Routes>
    </HashRouter>
    </ErrorBoundary>
  );
}
