import { useState, type ReactNode } from 'react';

export type DetailItem = {
  label?: string;
  value: string | readonly string[] | null | undefined;
  lead?: boolean; // Render as the larger lead line (a card meaning, the oracle text).
};

type DetailOverlayProps = {
  children: ReactNode; // The always-visible surface the panel anchors to (a card, the letter disc).
  items: readonly DetailItem[]; // Rows for the panel; empty or absent values are skipped.
  status?: string; // A line shown before the rows — typically a loading or error message.
  className?: string; // Extra class on the anchor element, e.g. "tarot-card" / "letter-disc".
  panelClassName?: string; // Extra class on the floating panel, for per-feature positioning.
  ariaLabel?: string; // When set, the anchor becomes an image role with this name (children stay decorative).
  onReveal?: () => void; // Fired each time the panel is revealed — e.g. to lazy-load the details.
};

// Longest a string[] value is shown before it's truncated.
const MAX_LIST_ITEMS = 6;

function toText(value: DetailItem['value']): string {
  if (Array.isArray(value)) return value.slice(0, MAX_LIST_ITEMS).join(' · ');
  return typeof value === 'string' ? value : '';
}

/**
 * Wraps a surface and floats a details panel over it on hover or keyboard focus.
 * Presentational only — the caller supplies the rows and, via `onReveal`, any
 * lazy fetch. Shared by the tarot cards and the Greek oracle letter disc.
 */
function DetailOverlay({
  children,
  items,
  status,
  className,
  panelClassName,
  ariaLabel,
  onReveal,
}: DetailOverlayProps) {
  const [open, setOpen] = useState(false);

  function reveal() {
    setOpen(true);
    onReveal?.();
  }

  const rows = items.filter((item) => toText(item.value) !== '');

  return (
    <div
      className={`detail-overlay${className ? ` ${className}` : ''}`}
      tabIndex={0}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      onMouseEnter={reveal}
      onMouseLeave={() => setOpen(false)}
      onFocus={reveal}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (rows.length > 0 || status) && (
        <div
          className={`detail-panel${panelClassName ? ` ${panelClassName}` : ''}`}
          aria-live="polite"
        >
          {status && <p className="detail-row">{status}</p>}
          {rows.map(({ value, label, lead }, index) => (
            <p key={index} className={`detail-row ${lead ? ' detail-row-lead' : ''}`}>
              {label ? `${label}: ${toText(value)}` : toText(value)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default DetailOverlay;
