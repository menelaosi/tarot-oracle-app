import Markdown from 'react-markdown';

type InterpretationProps = {
  title: string;
  text: string;
};

/** Renders a Claude Markdown reading in the scrolling right-hand panel. */
function Interpretation({ title, text }: InterpretationProps) {
  return (
    <section className="interpretation" aria-labelledby="interpretation-title">
      <h2 id="interpretation-title">{title}</h2>
      <div className="interpretation-copy">
        <Markdown>{text}</Markdown>
      </div>
    </section>
  );
}

export default Interpretation;
