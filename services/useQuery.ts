// const rates = useQuery('vandhan:rates', getRates);
// Cached, revalidating data hook. First visit shows a skeleton; later visits show the cached
// data instantly and refresh behind it, so the skeleton never flashes on a screen you've seen.
import { useCallback, useEffect, useRef, useState } from 'react';
import { readCache, subscribeToKey, writeCache } from './cache';
import { subscribeToNetwork } from './network';

export type QueryResult<T> = {
  data: T | undefined;
  error: Error | undefined;
  status: 'loading' | 'error' | 'success';
  refreshing: boolean;
  // Pull-to-refresh: shows the spinner.
  refresh: () => Promise<void>;
  // Retry after an error: shows the skeleton again.
  refetch: () => void;
};

export function useQuery<T>(key: string, fetcher: () => Promise<T>): QueryResult<T> {
  const cached = readCache<T>(key);
  const [data, setData] = useState<T | undefined>(cached);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(cached === undefined);
  const [refreshing, setRefreshing] = useState(false);
  const fetcherRef = useRef(fetcher);
  const mounted = useRef(true);
  const requestId = useRef(0);
  fetcherRef.current = fetcher;

  const run = useCallback(
    async (mode: 'initial' | 'silent' | 'refresh') => {
      const id = ++requestId.current;
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      try {
        const result = await fetcherRef.current();
        if (!mounted.current || id !== requestId.current) return;
        writeCache(key, result);
        setData(result);
        setError(undefined);
      } catch (caught) {
        if (!mounted.current || id !== requestId.current) return;
        setError(caught instanceof Error ? caught : new Error(String(caught)));
      } finally {
        if (mounted.current && id === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [key]
  );

  useEffect(() => {
    mounted.current = true;
    const hasCache = readCache<T>(key) !== undefined;
    setData(readCache<T>(key));
    run(hasCache ? 'silent' : 'initial');
    const unsubscribeKey = subscribeToKey(key, () => run('silent'));
    // Coming back online retries anything that failed while offline.
    const unsubscribeNetwork = subscribeToNetwork((online) => {
      if (online) run('silent');
    });
    return () => {
      mounted.current = false;
      unsubscribeKey();
      unsubscribeNetwork();
    };
  }, [key, run]);

  const refresh = useCallback(() => run('refresh'), [run]);
  const refetch = useCallback(() => {
    setError(undefined);
    run('initial');
  }, [run]);

  const status: QueryResult<T>['status'] =
    data !== undefined ? 'success' : error ? 'error' : loading ? 'loading' : 'loading';

  return { data, error, status, refreshing, refresh, refetch };
}
