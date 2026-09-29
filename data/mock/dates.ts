// Mock dates are relative to "now" so the data always reads as current (today, 7 days ago…),
// matching the mockups on the day they were drawn (19 Sep 2026).
const DAY_MS = 24 * 60 * 60 * 1000;

export function daysAgo(days: number, hour = 10, minute = 0) {
  const date = new Date(Date.now() - days * DAY_MS);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function daysFromNow(days: number, hour = 10, minute = 0) {
  return daysAgo(-days, hour, minute);
}

export function addDays(iso: string, days: number) {
  return new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
}

export function isSameDay(a: string, b: Date = new Date()) {
  const date = new Date(a);
  return (
    date.getFullYear() === b.getFullYear() &&
    date.getMonth() === b.getMonth() &&
    date.getDate() === b.getDate()
  );
}
