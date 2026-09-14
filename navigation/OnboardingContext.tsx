import { createContext, useContext } from 'react';

export type SessionActions = {
  /** Persists the UID and swaps the root navigator to MainTabs. */
  completeOnboarding: (uid: string) => Promise<void>;
  /**
   * TEMPORARY — dev/testing only. Clears the stored UID and returns to onboarding.
   * Replace with a real sign-out once a Settings/profile screen exists.
   */
  resetOnboarding: () => Promise<void>;
};

const noop = async () => {};

export const SessionContext = createContext<SessionActions>({
  completeOnboarding: noop,
  resetOnboarding: noop,
});

export function useCompleteOnboarding() {
  return useContext(SessionContext).completeOnboarding;
}

/** TEMPORARY — dev/testing only. See SessionActions.resetOnboarding. */
export function useResetOnboarding() {
  return useContext(SessionContext).resetOnboarding;
}
