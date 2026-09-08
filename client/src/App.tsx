import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import TabNav from './components/TabNav';

// Each feature is its own chunk — the astrology ephemeris only loads on /astrology.
const TarotView = lazy(() => import('./features/tarot/TarotView'));
const AstrologyView = lazy(() => import('./features/astrology/AstrologyView'));

function App() {
  return (
    <main className="app-shell">
      <Header />
      <TabNav />

      <Suspense fallback={<p className="route-loading">Loading…</p>}>
        <Routes>
          <Route path="/" element={<Navigate to="/tarot" replace />} />
          <Route path="/tarot" element={<TarotView />} />
          <Route path="/astrology" element={<AstrologyView />} />
          <Route path="*" element={<Navigate to="/tarot" replace />} />
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
