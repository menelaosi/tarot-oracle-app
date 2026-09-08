import { useEffect, useState } from 'react';
import { useRetainedState } from '../../hooks/useRetainedState';
import './tarot.css';
import Interpretation from '../../components/Interpretation';
import ReadingControls from './ReadingControls';
import Spread from './Spread';
import type { Reading, SpreadOption } from './types';

function TarotView() {
  // Retained across tab switches so the drawn spread and its interpretation are
  // still here when you come back.
  const [spreadOptions, setSpreadOptions] = useRetainedState<SpreadOption[]>(
    'tarot:spreadOptions',
    [],
  );
  const [spreadType, setSpreadType] = useRetainedState('tarot:spreadType', 'three_card');
  const [question, setQuestion] = useRetainedState('tarot:question', '');
  const [includeReversals, setIncludeReversals] = useRetainedState('tarot:includeReversals', false);
  const [reading, setReading] = useRetainedState<Reading | null>('tarot:reading', null);
  const [interpretation, setInterpretation] = useRetainedState('tarot:interpretation', '');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (spreadOptions.length > 0) return; // already loaded (retained across mounts)
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
        interpretationError instanceof Error
          ? interpretationError.message
          : 'Something went wrong.',
      );
    } finally {
      setIsInterpreting(false);
    }
  }

  return (
    <>
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
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="workspace-right">
          {interpretation && (
            <Interpretation title="What the pattern says" text={interpretation} />
          )}
        </div>
      </div>
    </>
  );
}

export default TarotView;
