// Offline capture (SDD §8.8, S-07 "Waiting to sync"). Entries made without a connection are held
// here and sent automatically when the network returns — the user never re-enters them.
// Held in memory for now; persist to device storage when the real backend lands.
import { useSyncExternalStore } from 'react';
import { getIsOnline, subscribeToNetwork } from './network';

export type PendingEntry = {
  id: string;
  label: string;
  pillar: 'vandhan' | 'livestock' | 'lpg' | 'microfinance';
  createdAt: string;
  send: () => void;
};

let pending: PendingEntry[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function enqueue(entry: Omit<PendingEntry, 'id' | 'createdAt'>) {
  pending = [
    ...pending,
    { ...entry, id: `pending-${Date.now()}-${pending.length}`, createdAt: new Date().toISOString() },
  ];
  emit();
}

function flush() {
  if (!getIsOnline() || pending.length === 0) return;
  const toSend = pending;
  pending = [];
  toSend.forEach((entry) => entry.send());
  emit();
}

subscribeToNetwork((online) => {
  if (online) flush();
});

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getPending() {
  return pending;
}

export function usePendingEntries() {
  return useSyncExternalStore(subscribe, getPending);
}
