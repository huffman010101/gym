import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react';
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
import Feed from './pages/Feed';
import Knowledge from './pages/Knowledge';
import CheatSheet from './pages/CheatSheet';
import Backtest from './pages/Backtest';
import VideoNotes from './pages/VideoNotes';
import ApiKeySetup from './components/ApiKeySetup';
import { JarvisBoot } from './components/Jarvis';
import { getApiKey } from './lib/anthropic';

// Opening a section should start at its top, not wherever the last screen was scrolled.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

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

// When another device's changes land, remount the pages so they re-read
// storage — but never while you are typing, and keep the scroll position.
function useSyncEpoch() {
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    const bump = () => {
      const el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
        el.addEventListener('blur', bump, { once: true });
        return;
      }
      const y = window.scrollY;
      setEpoch(e => e + 1);
      requestAnimationFrame(() => window.scrollTo(0, y));
    };
    window.addEventListener('gymforge-synced', bump);
    return () => window.removeEventListener('gymforge-synced', bump);
  }, []);
  return epoch;
}

export default function App() {
  const [hasKey, setHasKey] = useState(false);
  const epoch = useSyncEpoch();

  useEffect(() => {
    setHasKey(!!getApiKey());
  }, []);

  return (
    <ErrorBoundary>
      <HashRouter>
      <ScrollToTop />
      <OfflineBanner />
      <JarvisBoot />
      {!hasKey && <ApiKeySetup onSet={() => setHasKey(true)} />}
      <Fragment key={epoch}>
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
        <Route path="/feed" element={<Feed />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/cheatsheet" element={<CheatSheet />} />
        <Route path="/backtest" element={<Backtest />} />
        <Route path="/videonotes" element={<VideoNotes />} />
      </Routes>
      </Fragment>
    </HashRouter>
    </ErrorBoundary>
  );
}
