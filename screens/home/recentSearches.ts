// What the person searched for before, newest first. Kept for the session only — a real
// implementation would persist this per user alongside the rest of the profile.
import { useSyncExternalStore } from 'react';

const MAX = 6;

let recents: string[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function rememberSearch(term: string) {
  const trimmed = term.trim();
  if (!trimmed) return;
  const without = recents.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
  recents = [trimmed, ...without].slice(0, MAX);
  emit();
}

export function forgetSearch(term: string) {
  recents = recents.filter((item) => item !== term);
  emit();
}

export function clearSearches() {
  recents = [];
  emit();
}

export function useRecentSearches() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => recents,
    () => recents
  );
}
