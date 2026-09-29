import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useSyncExternalStore } from 'react';

// Assume online until NetInfo reports otherwise, so the first render never flashes offline UI.
let online = true;
const listeners = new Set<(online: boolean) => void>();

function resolveOnline(state: NetInfoState) {
  if (state.isConnected === false) return false;
  // null means "not determined yet" — don't treat that as offline.
  return state.isInternetReachable !== false;
}

NetInfo.addEventListener((state) => {
  const next = resolveOnline(state);
  if (next === online) return;
  online = next;
  listeners.forEach((listener) => listener(online));
});

export function getIsOnline() {
  return online;
}

export function subscribeToNetwork(listener: (online: boolean) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useIsOnline() {
  return useSyncExternalStore(subscribeToNetwork, getIsOnline);
}
