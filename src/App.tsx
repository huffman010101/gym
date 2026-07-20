import { HashRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Plan from './pages/Plan';
import FoodLog from './pages/FoodLog';
import TrainingLog from './pages/TrainingLog';
import Physique from './pages/Physique';
import Dashboard from './pages/Dashboard';
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
import CheatSheet from './pages/CheatSheet';
import Dating from './pages/Dating';
import ApiKeySetup from './components/ApiKeySetup';
import { getApiKey } from './lib/anthropic';

export default function App() {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    setHasKey(!!getApiKey());
  }, []);

  return (
    <HashRouter>
      {!hasKey && <ApiKeySetup onSet={() => setHasKey(true)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/food" element={<FoodLog />} />
        <Route path="/training" element={<TrainingLog />} />
        <Route path="/physique" element={<Physique />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
        <Route path="/cheatsheet" element={<CheatSheet />} />
        <Route path="/dating" element={<Dating />} />
      </Routes>
    </HashRouter>
  );
}
