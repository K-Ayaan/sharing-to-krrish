// Query cache + invalidation. Keys are namespaced ("vandhan:collections"); invalidating a prefix
// ("vandhan") tells every mounted query under it to refetch quietly.
const cache = new Map<string, unknown>();
const subscribers = new Map<string, Set<() => void>>();

export function readCache<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

export function writeCache(key: string, value: unknown) {
  cache.set(key, value);
}

export function subscribeToKey(key: string, onInvalidate: () => void) {
  let set = subscribers.get(key);
  if (!set) {
    set = new Set();
    subscribers.set(key, set);
  }
  set.add(onInvalidate);
  return () => {
    set?.delete(onInvalidate);
  };
}

export function invalidate(...prefixes: string[]) {
  for (const [key, set] of subscribers) {
    if (prefixes.some((prefix) => key === prefix || key.startsWith(`${prefix}:`))) {
      set.forEach((notify) => notify());
    }
  }
  for (const key of [...cache.keys()]) {
    if (prefixes.some((prefix) => key === prefix || key.startsWith(`${prefix}:`))) {
      cache.delete(key);
    }
  }
}

export function clearCache() {
  cache.clear();
}
