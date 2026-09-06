import Markdown from 'react-markdown';

type InterpretationProps = {
  text: string
};

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
