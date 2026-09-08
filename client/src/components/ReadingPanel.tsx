import type { ReactNode } from 'react';
import ButtonComponent from './ButtonComponent';

type ReadingPanelProps = {
  sectionClassName: string;
  headingClassName: string;
  titleId: string;
  title: ReactNode;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  buttonText: string;
  loadingButtonText: string;
  children: ReactNode;
};

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
          actionType="secondary"
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
