import DetailOverlay, { type DetailItem } from '../../../components/DetailOverlay';
import ReadingPanel from '../../../components/ReadingPanel';
import type { GreekLetter } from '../types';

type LetterReadingProps = {
  letter: GreekLetter;
  isInterpreting: boolean;
  onInterpret: () => void;
};

/** The drawn letter shown as a single disc; hovering it reveals the oracle line,
 *  meaning, and keywords from the database. */
function LetterReading({
  letter: { oracle, meaning, keywords, name, letter },
  isInterpreting,
  onInterpret,
}: LetterReadingProps) {
  const items: DetailItem[] = [
    { value: oracle, lead: true },
    { value: meaning },
    { label: 'Keywords', value: keywords },
  ];

  return (
    <ReadingPanel
      sectionClassName="letter-reading"
      headingClassName="letter-reading-heading"
      titleId="letter-reading-title"
      title={`${name} · ${letter}`}
      onAnalyze={onInterpret}
      isAnalyzing={isInterpreting}
      buttonText="Interpret the letter"
      loadingButtonText="Consulting the oracle..."
    >
      <div className="letter-stage">
        <DetailOverlay
          className="letter-disc"
          panelClassName="letter-disc-details"
          items={items}
          ariaLabel={`${name} (${letter})`}
        >
          <span aria-hidden="true">{letter}</span>
        </DetailOverlay>
      </div>
    </ReadingPanel>
  );
}

export default LetterReading;
