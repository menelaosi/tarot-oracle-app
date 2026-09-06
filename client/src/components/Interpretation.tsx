import Markdown from 'react-markdown';

type InterpretationProps = {
  text: string
};

export const sampleInterpretation = `# Reading: What Should I Do Next?

**Past — Nine of Cups (upright)**

This card marks a period of comfort, emotional stability, and even luxury — the suit of Cups pointing to feelings, relationship, and emotional attunement, while its numerology signals fruition, attainment, and culmination. This suggests your past was a phase of arriving somewhere emotionally satisfying — a sense of having gotten what you wanted, feelings settled, needs met. It reads as a completed emotional chapter, a resting point of contentment, rather than something still unfolding.

**Present — Ace of Wands (upright)**

Now you're in Fire territory: creation, willpower, inspiration, desire. The Wands associations point to energy, vitality, ambition, and spontaneity, and the numerology of the Ace reinforces new beginnings, opportunity, potential, and inspiration. Where the past was about emotional culmination, the present is about ignition — a fresh spark, a new drive or idea wanting to be acted on. This is a starting point, not a continuation of the comfort from before. Something is asking to be created, initiated, or pursued with will and passion.

**Future — Ace of Cups (upright)**

The trajectory moves toward new love, overflowing feelings, and creativity — again Cups, again an Ace, again signaling new beginnings and unity. This suggests that the fire of the present (inspiration, willpower, new action) is moving toward a fresh emotional opening — not a return to the old comfort of the Nine of Cups, but a *new* wellspring of feeling, connection, or creative/emotional fulfillment.

---

### Synthesis

The arc here moves from **completion (Nine of Cups)** → **ignition (Ace of Wands)** → **new emotional beginning (Ace of Cups)**. Notably, both the past and future involve the Cups suit — emotion, relationship, feelings — while the present is the odd one out, driven by Fire/Wands energy. This suggests that what stands between your past emotional fulfillment and a future new emotional opening is an act of will, initiation, or creative action.

Based only on what's in this reading, the next step is to follow the present spark with deliberate action while staying open to the emotional renewal ahead.`;

function Interpretation({ text }: InterpretationProps) {
  return (
    <section className="interpretation" aria-labelledby="interpretation-title">
      <h2 id="interpretation-title">What the pattern says</h2>
      <div className="interpretation-copy">
        <Markdown>{text}</Markdown>
      </div>
    </section>
  );
}

export default Interpretation;
