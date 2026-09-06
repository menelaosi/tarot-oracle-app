import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Interpretation, { sampleInterpretation } from './components/Interpretation';
import ReadingControls from './components/ReadingControls';
import Spread from './components/Spread';
import type { Reading, SpreadOption } from './types';

const spreadOptions: SpreadOption[] = [
  { value: 'three_card', label: 'Past / Present / Future' },
];

function App() {
  const [spreadType, setSpreadType] = useState('three_card');
  const [question, setQuestion] = useState('');
  const [includeReversals, setIncludeReversals] = useState(true);
  const [reading, setReading] = useState<Reading | null>(null);
  const [interpretation, setInterpretation] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [error, setError] = useState('');

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

      {(reading || interpretation) && (
        <div className="reading-output">
          {reading && (
            <Spread
              reading={reading}
              isInterpreting={isInterpreting}
              onGenerateInterpretation={generateInterpretation}
              onShowSampleInterpretation={() => setInterpretation(sampleInterpretation)}
            />
          )}
        </div>
      )}
      {interpretation && <Interpretation text={interpretation} />}
      {error && <p className="error-message" role="alert">{error}</p>}
    </main>
  );
}

export default App;
