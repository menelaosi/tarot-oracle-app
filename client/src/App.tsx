import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import TabNav from './components/TabNav';

// Each feature is its own chunk — the astrology ephemeris only loads on /astrology.
const TarotView = lazy(() => import('./features/tarot/TarotView'));
const AstrologyView = lazy(() => import('./features/astrology/AstrologyView'));
const TransitView = lazy(() => import('./features/astrology/TransitView'));

// Masthead copy per section, keyed by pathname. Unknown paths (including "/"
// before it redirects, and the "*" catch-all) fall back to Tarot.
const HEADERS: Record<string, { title: string; intro: string }> = {
  '/tarot': {
    title: 'Tarot Reader',
    intro: 'Select a spread and optionally ask a question below',
  },
  '/astrology': {
    title: 'Astrology Chart',
    intro: 'Enter your birth info to generate your chart',
  },
  '/transits': {
    title: "Today's Transits",
    intro: 'See how the current sky moves across your natal chart',
  },
};

/** App shell: masthead + tab nav, then the lazily-loaded feature view for the route. */
function App() {
  const { pathname } = useLocation();
  const header = HEADERS[pathname] ?? HEADERS['/tarot'];

  return (
    <main className="app-shell">
      <Header title={header.title} intro={header.intro} />
      <TabNav />

      <Suspense fallback={<p className="route-loading">Loading…</p>}>
        <Routes>
          <Route path="/" element={<Navigate to="/tarot" replace />} />
          <Route path="/tarot" element={<TarotView />} />
          <Route path="/astrology" element={<AstrologyView />} />
          <Route path="/transits" element={<TransitView />} />
          <Route path="*" element={<Navigate to="/tarot" replace />} />
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
