import type { ReactNode } from 'react';
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

// Everything the panel needs to render one roll, however the two modes get there.
type RollView = {
  heading: string;
  stage: ReactNode;
  meaning: string | null; // zodiac rolls read through the dice themselves — no line
};

/** The one place standard vs. zodiac branches — everything else reads off the result. */
function viewFor(roll: AstragalomancyRoll): RollView {
  switch (roll.mode) {
    case 'standard': {
      const { total, values, meaning } = roll;
      return {
        heading: `Total ${total}`,
        stage: <StandardDice values={values} />,
        meaning,
      };
    }
    case 'zodiac': {
      const { planet, sign, house } = roll;
      return {
        heading: `${planet.name} · ${sign.name} · ${house.name}`,
        stage: <ZodiacDice roll={roll} />,
        meaning: null,
      };
    }
  }
}

/** One zodiac die: its role caption and a hover panel of the DB keywords. */
function ZodiacDie({ slot, index }: { slot: ZodiacSlot; index: number }) {
  const { role, ref } = slot;
  const { name, keywords, associations, glyph } = ref;
  const items: DetailItem[] = [
    { value: name, lead: true },
    { label: 'Keywords', value: keywords },
    { label: 'Associations', value: associations },
  ];
  return (
    <DetailOverlay
      className="die-slot"
      panelClassName="die-details"
      items={items}
      ariaLabel={`${name} — ${role.toLowerCase()}`}
    >
      <Die variant="zodiac" index={index}>
        <DieGlyph glyph={glyph} />
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
  const { heading, stage, meaning } = viewFor(roll);

  return (
    <ReadingPanel
      sectionClassName="reading-column dice-reading"
      headingClassName="dice-reading-heading"
      titleId="dice-reading-title"
      title={heading}
      onAnalyze={onInterpret}
      isAnalyzing={isInterpreting}
      buttonText="Read the dice"
      loadingButtonText="Reading the dice..."
    >
      <div className="dice-body">
        <div className="dice-stage">{stage}</div>

        {meaning !== null && <p className="dice-meaning">{meaning}</p>}
      </div>
    </ReadingPanel>
  );
}

export default DiceReading;
