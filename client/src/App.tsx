import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Interpretation from './components/Interpretation';
import ReadingControls from './components/ReadingControls';
import Spread from './components/Spread';
import type { Reading, SpreadOption } from './types';

function App() {
  const [spreadOptions, setSpreadOptions] = useState<SpreadOption[]>([]);
  const [spreadType, setSpreadType] = useState('three_card');
  const [question, setQuestion] = useState('');
  const [includeReversals, setIncludeReversals] = useState(false);
  const [reading, setReading] = useState<Reading | null>(null);
  const [interpretation, setInterpretation] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/spreads')
      .then((response) => {
        if (!response.ok) throw new Error('The spreads could not be loaded.');
        return response.json() as Promise<SpreadOption[]>;
      })
      .then((options) => {
        setSpreadOptions(options);
        if (!options.some((option) => option.id === spreadType)) {
          setSpreadType(options[0]?.id ?? '');
        }
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Something went wrong.');
      });
    // Runs once on mount; spreadType is only read to keep a still-valid selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function drawCards() {
    setIsDrawing(true);
    setError('');
    setInterpretation('');

    try {
      const response = await fetch('/api/readings/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadType, question, includeReversals }),
      });

      if (!response.ok) throw new Error('The cards could not be drawn.');
      setReading((await response.json()) as Reading);
    } catch (drawError) {
      setError(drawError instanceof Error ? drawError.message : 'Something went wrong.');
    } finally {
      setIsDrawing(false);
    }
  }

  async function generateInterpretation() {
    if (!reading) return;

    setIsInterpreting(true);
    setError('');

    try {
      const response = await fetch(`/api/readings/${reading.id}/interpret`, { method: 'POST' });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'The interpretation could not be generated.');
      }

      const payload = (await response.json()) as { interpretation: string };
      setInterpretation(payload.interpretation);
    } catch (interpretationError) {
      setError(
        interpretationError instanceof Error ? interpretationError.message : 'Something went wrong.',
      );
    } finally {
      setIsInterpreting(false);
    }
  }

  return (
    <main className="app-shell">
      <Header />

      <ReadingControls
        spreadType={spreadType}
        question={question}
        includeReversals={includeReversals}
        spreadOptions={spreadOptions}
        isDrawing={isDrawing}
        onSpreadTypeChange={setSpreadType}
        onQuestionChange={setQuestion}
        onIncludeReversalsChange={setIncludeReversals}
        onDraw={drawCards}
      />

      <div className="workspace">
        <div className="workspace-left">
          {reading && (
            <Spread
              reading={reading}
              includeReversals={includeReversals}
              isInterpreting={isInterpreting}
              onGenerateInterpretation={generateInterpretation}
            />
          )}
          {error && <p className="error-message" role="alert">{error}</p>}
        </div>

        <div className="workspace-right">
          {interpretation && <Interpretation text={interpretation} />}
        </div>
      </div>
    </main>
  );
}

export default App;
