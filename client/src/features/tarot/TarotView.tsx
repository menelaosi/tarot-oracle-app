import { useEffect, useState } from 'react';
import WorkspaceLayout from '../../components/WorkspaceLayout';
import { useRetainedState } from '../../hooks/useRetainedState';
import { messageFrom } from '../../lib/http';
import { drawReading, interpretReading, loadSpreads } from './api';
import ReadingControls from './ReadingControls';
import Spread from './Spread';
import './tarot.css';
import type { Reading, SpreadOption } from './types';

/** Tarot section: spread controls, the drawn cards, and Claude's interpretation. */
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
    loadSpreads()
      .then((options) => {
        setSpreadOptions(options);
        if (!options.some((option) => option.id === spreadType)) {
          setSpreadType(options[0]?.id ?? '');
        }
      })
      .catch((loadError: unknown) => setError(messageFrom(loadError)));
    // Runs once on mount; spreadType is only read to keep a still-valid selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function drawCards() {
    setIsDrawing(true);
    setError('');
    setInterpretation(''); // a fresh draw invalidates the previous reading's interpretation

    try {
      setReading(await drawReading({ spreadType, question, includeReversals }));
    } catch (drawError) {
      setError(messageFrom(drawError));
    } finally {
      setIsDrawing(false);
    }
  }

  async function generateInterpretation() {
    if (!reading) return;

    setIsInterpreting(true);
    setError('');

    try {
      setInterpretation(await interpretReading(reading.id));
    } catch (interpretationError) {
      setError(messageFrom(interpretationError));
    } finally {
      setIsInterpreting(false);
    }
  }

  return (
    <WorkspaceLayout
      controls={
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
      }
      main={
        reading ? (
          <Spread
            reading={reading}
            includeReversals={includeReversals}
            isInterpreting={isInterpreting}
            onGenerateInterpretation={generateInterpretation}
          />
        ) : null
      }
      error={error}
      interpretationTitle="What the pattern says"
      interpretation={interpretation}
    />
  );
}

export default TarotView;
