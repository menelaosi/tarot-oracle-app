import DetailOverlay, { type DetailItem } from '../../../components/DetailOverlay';
import ReadingPanel from '../../../components/ReadingPanel';
import type { AstragalomancyRoll, HouseRef, PlanetRef, SignRef } from '../types';
import Die, { Pips } from './Die';

type DiceReadingProps = {
  roll: AstragalomancyRoll;
  isInterpreting: boolean;
  onInterpret: () => void;
};

// Variation selector U+FE0E forces text (monochrome) rendering, so the zodiac
// sign symbols don't fall back to colour emoji glyphs on some platforms.
const TEXT_PRESENTATION = '︎';

function headingFor(roll: AstragalomancyRoll): string {
  return roll.mode === 'standard'
    ? `Total ${roll.total}`
    : `${roll.planet.name} · ${roll.sign.name} · ${roll.house.name}`;
}

/** One zodiac die with its role caption and a hover panel of its DB keywords. */
function ZodiacDie({
  role,
  face,
  name,
  reference,
  index,
}: {
  role: string;
  face: string;
  name: string;
  reference: PlanetRef | SignRef | HouseRef;
  index: number;
}) {
  const items: DetailItem[] = [
    { value: name, lead: true },
    { label: 'Keywords', value: reference.keywords },
    { label: 'Associations', value: reference.associations },
  ];
  return (
    <DetailOverlay
      className="die-slot"
      panelClassName="die-details"
      items={items}
      ariaLabel={`${name} — ${role.toLowerCase()}`}
    >
      <Die variant="zodiac" index={index}>
        <span className="die-glyph">{face + TEXT_PRESENTATION}</span>
      </Die>
      <span className="die-caption">{role}</span>
    </DetailOverlay>
  );
}

/** The three landed dice plus the interpret action, in the shared ReadingPanel. */
function DiceReading({ roll, isInterpreting, onInterpret }: DiceReadingProps) {
  return (
    <ReadingPanel
      sectionClassName="dice-reading"
      headingClassName="dice-reading-heading"
      titleId="dice-reading-title"
      title={headingFor(roll)}
      onAnalyze={onInterpret}
      isAnalyzing={isInterpreting}
      buttonText="Read the dice"
      loadingButtonText="Reading the dice..."
    >
      <div className="dice-body">
        <div className="dice-stage">
          {roll.mode === 'standard' ? (
            roll.values.map((value, index) => (
              <div className="die-slot" key={index}>
                <Die variant="standard" index={index}>
                  <Pips value={value} />
                </Die>
              </div>
            ))
          ) : (
            <>
              <ZodiacDie
                role="Situation"
                face={roll.planet.glyph}
                name={roll.planet.name}
                reference={roll.planet}
                index={0}
              />
              <ZodiacDie
                role="Emotions"
                face={roll.sign.glyph}
                name={roll.sign.name}
                reference={roll.sign}
                index={1}
              />
              <ZodiacDie
                role="Impact"
                face={String(roll.house.number)}
                name={roll.house.name}
                reference={roll.house}
                index={2}
              />
            </>
          )}
        </div>

        {roll.mode === 'standard' && <p className="dice-meaning">{roll.meaning}</p>}
      </div>
    </ReadingPanel>
  );
}

export default DiceReading;
