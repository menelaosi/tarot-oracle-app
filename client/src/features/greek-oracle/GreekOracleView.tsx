import { useState } from 'react';
import WorkspaceLayout from '../../components/WorkspaceLayout';
import { useRetainedState } from '../../hooks/useRetainedState';
import { messageFrom } from '../../lib/http';
import { drawLetter, interpretLetter } from './api';
import GreekOracleControls from './components/GreekOracleControls';
import LetterReading from './components/LetterReading';
import './greek-oracle.css';
import type { GreekReading } from './types';

/** Greek Alphabet Oracle: ask a question, draw a letter, read what it says. */
function GreekOracleView() {
  // Retained across tab switches so the drawn letter and its reading survive.
  const [question, setQuestion] = useRetainedState('greek:question', '');
  const [reading, setReading] = useRetainedState<GreekReading | null>('greek:reading', null);
  const [interpretation, setInterpretation] = useRetainedState('greek:interpretation', '');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [error, setError] = useState('');

  async function draw() {
    setIsDrawing(true);
    setError('');
    setInterpretation(''); // a fresh draw invalidates the previous letter's reading

    try {
      setReading(await drawLetter(question));
    } catch (drawError) {
      setError(messageFrom(drawError));
    } finally {
      setIsDrawing(false);
    }
  }

  async function interpret() {
    if (!reading) return;

    setIsInterpreting(true);
    setError('');

    try {
      setInterpretation(await interpretLetter(reading.id));
    } catch (interpretError) {
      setError(messageFrom(interpretError));
    } finally {
      setIsInterpreting(false);
    }
  }

  return (
    <WorkspaceLayout
      controls={
        <GreekOracleControls
          question={question}
          isDrawing={isDrawing}
          onQuestionChange={setQuestion}
          onDraw={draw}
        />
      }
      main={
        reading ? (
          <LetterReading
            letter={reading.letter}
            isInterpreting={isInterpreting}
            onInterpret={interpret}
          />
        ) : null
      }
      error={error}
      interpretationTitle="What the letter says"
      interpretation={interpretation}
    />
  );
}

export default GreekOracleView;
