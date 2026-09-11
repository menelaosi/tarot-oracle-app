import type { ReactElement } from 'react';
import Markdown from 'react-markdown';

type WorkspaceLayoutProps = {
  controls: ReactElement; // the controls section — ReadingControls / BirthdayControl (both wrap ControlsSection)
  main: ReactElement | null; // the left-hand subject — Spread / AstrologyReading — or null before it exists
  error: string;
  onDismissError?: () => void; // clears the error line; renders a dismiss control when provided
  pending?: boolean; // a reading is being generated — show a placeholder in the right column
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
  onDismissError,
  pending = false,
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
              {onDismissError && (
                <button
                  type="button"
                  className="error-dismiss"
                  onClick={onDismissError}
                  aria-label="Dismiss"
                >
                  ×
                </button>
              )}
            </p>
          )}
        </div>
        <div className="workspace-right">
          {pending ? (
            <p className="reading-pending" role="status">
              Consulting the oracle…
            </p>
          ) : (
            interpretation && (
              <section className="interpretation" aria-labelledby="interpretation-title">
                <h2 id="interpretation-title">{interpretationTitle}</h2>
                <div className="interpretation-copy">
                  <Markdown>{interpretation}</Markdown>
                </div>
              </section>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default WorkspaceLayout;
