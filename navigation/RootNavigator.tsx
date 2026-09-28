import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import LoaderScreen from '../components/ui/LoaderScreen';
import MainTabs from './MainTabs';
import { SessionContext, type SessionActions } from './OnboardingContext';
import OnboardingStack from './OnboardingStack';
import { session } from './session';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

type SessionState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'signedIn'; uid: string };

export default function RootNavigator() {
  const [state, setState] = useState<SessionState>({ status: 'loading' });

  // On launch, a stored UID means registration already finished on this device.
  useEffect(() => {
    let cancelled = false;
    session.readUid().then((uid) => {
      if (!cancelled) setState(uid ? { status: 'signedIn', uid } : { status: 'signedOut' });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const actions = useMemo<SessionActions>(
    () => ({
      completeOnboarding: async (uid) => {
        try {
          await session.saveUid(uid);
        } catch (error) {
          console.warn('Could not persist UID; onboarding will show again next launch.', error);
        }
        setState({ status: 'signedIn', uid });
      },
      // Logout from Settings (after its confirmation dialog): clear the stored UID, then swap to
      // Onboarding. The swap unmounts MainTabs, so Settings can't be reached afterwards.
      signOut: async () => {
        await session.clear();
        setState({ status: 'signedOut' });
      },
    }),
    []
  );

  if (state.status === 'loading') {
    return <LoaderScreen />;
  }

  // Swapping the screen set (rather than navigating) removes the other branch from
  // history entirely, so neither side can go back into the other.
  return (
    <SessionContext.Provider value={actions}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.status === 'signedIn' ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        )}
      </Stack.Navigator>
    </SessionContext.Provider>
  );
}
