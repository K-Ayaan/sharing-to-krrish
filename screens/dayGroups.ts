import { formatDate, isToday } from './formatDate';

function isYesterday(iso: string) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return new Date(iso).toDateString() === yesterday.toDateString();
}

/** "Today, 12 Aug 2025" / "Yesterday, 11 Aug 2025" / "10 Aug 2025" */
export function dayLabel(iso: string) {
  if (isToday(iso)) return `Today, ${formatDate(iso)}`;
  if (isYesterday(iso)) return `Yesterday, ${formatDate(iso)}`;
  return formatDate(iso);
}

export type DayGroup<T> = { key: string; label: string; items: T[] };

/** Newest first, one group per local calendar day. Compares instants, so mixed ISO offsets sort correctly. */
export function groupByDay<T>(items: readonly T[], dateOf: (item: T) => string): DayGroup<T>[] {
  const sorted = [...items].sort((a, b) => new Date(dateOf(b)).getTime() - new Date(dateOf(a)).getTime());
  const groups: DayGroup<T>[] = [];

  for (const item of sorted) {
    const iso = dateOf(item);
    const key = new Date(iso).toDateString();
    const current = groups[groups.length - 1];
    if (current && current.key === key) {
      current.items.push(item);
    } else {
      groups.push({ key, label: dayLabel(iso), items: [item] });
    }
  }

  return groups;
}
