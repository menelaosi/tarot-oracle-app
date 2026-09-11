import type { ReactNode } from 'react';
import ButtonComponent from './ButtonComponent';

type ControlsSectionProps = {
  sectionClassName: string;
  gridClassName: string;
  ariaLabel: string;
  children: ReactNode; // Field <label>s; they render before the submit button, which the grid columns rely on.
  onSubmit: () => void;
  isSubmitting: boolean;
  submitText: string;
  submittingText?: string;
};

/**
 * Shared shell for the tarot reading controls and the astrology birth form: a
 * labelled section whose grid holds the fields followed by a primary button.
 */
function ControlsSection({
  sectionClassName,
  gridClassName,
  ariaLabel,
  children,
  onSubmit,
  isSubmitting,
  submitText,
  submittingText,
}: ControlsSectionProps) {
  return (
    <section className={sectionClassName} aria-label={ariaLabel}>
      <div className={gridClassName}>
        {children}
        <ButtonComponent
          className="primary-action"
          onClick={onSubmit}
          isLoading={isSubmitting}
          buttonText={submitText}
          loadingButtonText={submittingText}
        />
      </div>
    </section>
  );
}

export default ControlsSection;
