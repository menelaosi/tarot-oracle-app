import type { ReactElement } from 'react';
import Interpretation from './Interpretation';

type WorkspaceLayoutProps = {
  /** the controls section — ReadingControls / BirthdayControl (both wrap ControlsSection) */
  controls: ReactElement;
  /** the left-hand subject — Spread / AstrologyReading — or null before it exists */
  main: ReactElement | null;
  error: string;
  interpretationTitle: string;
  interpretation: string;
};

/**
 * Shared body for the Tarot and Astrology views: the controls, then a two-column
 * workspace — subject (and any error) on the left, Claude's reading on the right.
 */
function WorkspaceLayout({
  controls,
  main,
  error,
  interpretationTitle,
  interpretation,
}: WorkspaceLayoutProps) {
  return (
    <>
      {controls}
      <div className="workspace">
        <div className="workspace-left">
          {main}
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="workspace-right">
          {interpretation && (
            <Interpretation title={interpretationTitle} text={interpretation} />
          )}
        </div>
      </div>
    </>
  );
}

export default WorkspaceLayout;
