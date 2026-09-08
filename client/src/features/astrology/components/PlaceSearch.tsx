import { useEffect, useId, useState } from 'react';
import { searchPlaces, type Place } from '../lib/geocode';

type PlaceSearchProps = {
  value: Place | null;
  onChange: (place: Place | null) => void;
};

const MIN_QUERY = 3;

/**
 * Combobox that geocodes as you type. `value` set = a place is chosen; clearing
 * or editing the text drops back to search mode (`onChange(null)`).
 */
function PlaceSearch({ value, onChange }: PlaceSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const listId = useId();

  // Debounce keystrokes and cancel the in-flight request when the query changes
  // or the component unmounts, so results can't land out of order.
  useEffect(() => {
    const term = query.trim();
    if (term.length < MIN_QUERY || term === value?.label) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      searchPlaces(term, controller.signal)
        .then((places) => {
          setResults(places);
          setOpen(true);
        })
        .catch(() => {
          if (!controller.signal.aborted) setResults([]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, value?.label]);

  function choose(place: Place) {
    onChange(place);
    setQuery(place.label);
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="place-search">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        autoComplete="off"
        placeholder="Start typing a city…"
        value={value ? value.label : query}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          if (value) onChange(null);
          if (next.trim().length < MIN_QUERY) setOpen(false);
        }}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        // Delay the close so an option's onMouseDown (below) fires before the list unmounts.
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      />
      {loading && <span className="place-search-status">Searching…</span>}
      {open && results.length > 0 && (
        <ul className="place-search-list" id={listId} role="listbox">
          {results.map((place) => (
            <li key={`${place.latitude},${place.longitude}`}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={() => choose(place)}
              >
                {place.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaceSearch;
