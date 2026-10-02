/**
 * Parses a datetime-local input value ("YYYY-MM-DDTHH:mm") into a Date whose
 * UTC fields equal the typed wall-clock value.
 * @param value - A datetime-local string, e.g. '1990-06-15T08:30'.
 */
export function dateFromDateTimeLocal(value: string): Date {
  const [datePart, timePart] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}
