import DetailOverlay, { type DetailItem } from '../../../components/DetailOverlay';
import ReadingPanel from '../../../components/ReadingPanel';
import type { AstragalomancyRoll, HouseRef, PlanetRef, SignRef, ZodiacRoll } from '../types';
import Die, { DieGlyph, Pips } from './Die';

type DiceReadingProps = {
  roll: AstragalomancyRoll;
  isInterpreting: boolean;
  onInterpret: () => void;
};

type ZodiacSlot = { role: string; ref: PlanetRef | SignRef | HouseRef };

function headingFor(roll: AstragalomancyRoll): string {
  return roll.mode === 'standard'
    ? `Total ${roll.total}`
    : `${roll.planet.name} · ${roll.sign.name} · ${roll.house.name}`;
}

/** One zodiac die: its role caption and a hover panel of the DB keywords. */
function ZodiacDie({ slot, index }: { slot: ZodiacSlot; index: number }) {
  const { role, ref } = slot;
  const items: DetailItem[] = [
    { value: ref.name, lead: true },
    { label: 'Keywords', value: ref.keywords },
    { label: 'Associations', value: ref.associations },
  ];
  return (
    <DetailOverlay
      className="die-slot"
      panelClassName="die-details"
      items={items}
      ariaLabel={`${ref.name} — ${role.toLowerCase()}`}
    >
      <Die variant="zodiac" index={index}>
        <DieGlyph glyph={ref.glyph} />
      </Die>
      <span className="die-caption">{role}</span>
    </DetailOverlay>
  );
}

/** The three zodiac dice: planet = situation, sign = emotions, house = impact. */
function ZodiacDice({ roll: { planet, sign, house } }: { roll: ZodiacRoll }) {
  return [
    { role: 'Situation', ref: planet },
    { role: 'Emotions', ref: sign },
    { role: 'Impact', ref: house },
  ].map((slot, index) => <ZodiacDie key={slot.role} slot={slot} index={index} />);
}

/** The three rolled six-sided dice, each showing its pip face. */
function StandardDice({ values }: { values: number[] }) {
  return values.map((value, index) => (
    <div className="die-slot" key={index}>
      <Die variant="standard" index={index}>
        <Pips value={value} />
      </Die>
    </div>
  ));
}

/** The landed dice plus the interpret action, in the shared ReadingPanel. */
function DiceReading({ roll, isInterpreting, onInterpret }: DiceReadingProps) {
  const isStandard = roll.mode === 'standard';
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
          {isStandard ? <StandardDice values={roll.values} /> : <ZodiacDice roll={roll} />}
        </div>

        {isStandard && <p className="dice-meaning">{roll.meaning}</p>}
      </div>
    </ReadingPanel>
  );
}

export default DiceReading;
