// <AsyncContent query={collections} skeleton={<SkeletonList />} isEmpty={(d) => d.length === 0} empty={<EmptyState … />}>
//   {(items) => items.map(…)}
// </AsyncContent>
// One consistent loading → error → empty → content sequence for every screen that fetches.
import { ReactNode } from 'react';
import type { QueryResult } from '../../services/useQuery';
import ErrorState from './ErrorState';

export type AsyncContentProps<T> = {
  query: QueryResult<T>;
  skeleton: ReactNode;
  children: (data: T) => ReactNode;
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  what?: string;
};

export default function AsyncContent<T>({ query, skeleton, children, isEmpty, empty, what }: AsyncContentProps<T>) {
  if (query.data === undefined) {
    if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} what={what} />;
    return <>{skeleton}</>;
  }
  if (isEmpty?.(query.data) && empty) return <>{empty}</>;
  return <>{children(query.data)}</>;
}
