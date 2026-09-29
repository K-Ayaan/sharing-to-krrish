// Lets a component deep inside a page ask <Screen> to scroll it fully into view — used when
// something grows in place (an accordion answer, a revealed step) and would otherwise unfold
// below the fold. A component outside a Screen simply gets a no-op.
import { createContext, useContext, type RefObject } from 'react';
import type { View } from 'react-native';

export type ScrollIntoView = (ref: RefObject<View | null>) => void;

const noop: ScrollIntoView = () => {};

export const ScrollIntoViewContext = createContext<ScrollIntoView>(noop);

export function useScrollIntoView() {
  return useContext(ScrollIntoViewContext);
}
