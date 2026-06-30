import { HashRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Plan from './pages/Plan';
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
      </Routes>
    </HashRouter>
  );
}
