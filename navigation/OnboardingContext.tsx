import { createContext, useContext } from 'react';

export type SessionActions = {
  /** Persists the UID and swaps the root navigator to MainTabs. */
  completeOnboarding: (uid: string) => Promise<void>;
  /**
   * Clears the stored UID and swaps the root navigator back to Onboarding.
   * Settings calls this only after the user confirms the logout dialog.
   */
  signOut: () => Promise<void>;
};

const noop = async () => {};

export const SessionContext = createContext<SessionActions>({
  completeOnboarding: noop,
  signOut: noop,
});

export function useCompleteOnboarding() {
  return useContext(SessionContext).completeOnboarding;
}

export function useSignOut() {
  return useContext(SessionContext).signOut;
}
