import { useState } from 'react';
import WorkspaceLayout from '../../components/WorkspaceLayout';
import { useError } from '../../hooks/useError';
import { useRetainedState } from '../../hooks/useRetainedState';
import { interpretRoll, rollDice } from './api';
import AstragalomancyControls from './components/AstragalomancyControls';
import DiceReading from './components/DiceReading';
import './astragalomancy.css';
import type { AstragalomancyMode, AstragalomancyReading } from './types';

/** Astragalomancy: pick a dice set, ask a question, roll, and read what lands. */
function AstragalomancyView() {
  // Retained across tab switches so the landed dice and reading survive.
  const [mode, setMode] = useRetainedState<AstragalomancyMode>('astragalomancy:mode', 'zodiac');
  const [question, setQuestion] = useRetainedState('astragalomancy:question', '');
  const [reading, setReading] = useRetainedState<AstragalomancyReading | null>(
    'astragalomancy:reading',
    null,
  );
  const [interpretation, setInterpretation] = useRetainedState('astragalomancy:interpretation', '');
  const [isRolling, setIsRolling] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const { error, clearError, failWith } = useError();

  async function roll() {
    setIsRolling(true);
    clearError();
    setInterpretation(''); // a fresh roll invalidates the previous reading

    try {
      setReading(await rollDice(mode, question));
    } catch (rollError) {
      failWith(rollError);
    } finally {
      setIsRolling(false);
    }
  }

  async function interpret() {
    if (!reading) return;

    setIsInterpreting(true);
    clearError();

    try {
      setInterpretation(await interpretRoll(reading.id));
    } catch (interpretError) {
      failWith(interpretError);
    } finally {
      setIsInterpreting(false);
    }
  }

  return (
    <WorkspaceLayout
      controls={
        <AstragalomancyControls
          mode={mode}
          question={question}
          isRolling={isRolling}
          onModeChange={setMode}
          onQuestionChange={setQuestion}
          onRoll={roll}
        />
      }
      main={
        reading ? (
          // key remounts the dice on each roll so the tumble animation replays.
          <DiceReading
            key={reading.id}
            roll={reading.roll}
            isInterpreting={isInterpreting}
            onInterpret={interpret}
          />
        ) : null
      }
      error={error}
      onDismissError={clearError}
      pending={isInterpreting}
      interpretationTitle="What the dice say"
      interpretation={interpretation}
    />
  );
}

export default AstragalomancyView;
