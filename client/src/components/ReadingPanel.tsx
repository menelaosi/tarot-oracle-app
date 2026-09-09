import type { ReactNode } from 'react';
import ButtonComponent from './ButtonComponent';

type ReadingPanelProps = {
  sectionClassName: string;
  /** Extra heading classes; "section-heading" is always prepended. */
  headingClassName: string;
  /** Links the <h2> to the section via aria-labelledby. */
  titleId: string;
  title: ReactNode;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  buttonText: string;
  loadingButtonText: string;
  children: ReactNode;
};

/**
 * Shared shell for the drawn spread and the cast chart: a titled section with an
 * analyze action in the heading and the visual content ({children}) below.
 */
function ReadingPanel({
  sectionClassName,
  headingClassName,
  titleId,
  title,
  onAnalyze,
  isAnalyzing,
  buttonText,
  loadingButtonText,
  children,
}: ReadingPanelProps) {
  return (
    <section className={sectionClassName} aria-labelledby={titleId}>
      <div className={`section-heading ${headingClassName}`}>
        <h2 id={titleId}>{title}</h2>
        <ButtonComponent
          className="secondary-action"
          onClick={onAnalyze}
          isLoading={isAnalyzing}
          buttonText={buttonText}
          loadingButtonText={loadingButtonText}
        />
      </div>
      {children}
    </section>
  );
}

export default ReadingPanel;
