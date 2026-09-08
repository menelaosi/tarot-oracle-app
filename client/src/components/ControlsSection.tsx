import type { ReactNode } from 'react';
import ButtonComponent from './ButtonComponent';

type ControlsSectionProps = {
  sectionClassName: string;
  gridClassName: string;
  ariaLabel: string;
  children: ReactNode;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitText: string;
  submittingText?: string;
};

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
          actionType="primary"
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
