import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppearanceProvider } from '../components/ui/Appearance';
import ComplaintCategory from '../screens/lpg/ComplaintCategory';
import ComplaintDetails from '../screens/lpg/ComplaintDetails';
import ComplaintSubmitted from '../screens/lpg/ComplaintSubmitted';
import EnterBookingReference from '../screens/lpg/EnterBookingReference';
import LpgConnectionLinked from '../screens/lpg/LpgConnectionLinked';
import LpgHome from '../screens/lpg/LpgHome';
import LpgRegistration from '../screens/lpg/LpgRegistration';
import RequestStatus from '../screens/lpg/RequestStatus';
import theme from '../theme';
import { stackScreenOptions } from './stackOptions';
import type { LpgStackParamList } from './types';

const Stack = createNativeStackNavigator<LpgStackParamList>();

const { color } = theme.lpg;

// The whole stack uses the LPG appearance (redesign batch 5): the app's blue on a pale blue-white page
// with blue leaves and hills. Inner screens keep the native large title (the user chose this over the
// reference images' in-page titles); their subtitle and illustration sit in a PageIntro row.
export default function LpgStack() {
  return (
    <AppearanceProvider appearance="lpg">
      <Stack.Navigator
        screenOptions={{
          ...stackScreenOptions,
          headerLargeTitleEnabled: true,
          headerLargeTitleShadowVisible: false,
          headerLargeTitleStyle: { color: color.textPrimary },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: color.textPrimary,
          headerStyle: { backgroundColor: color.background },
          headerLargeStyle: { backgroundColor: color.background },
          contentStyle: { backgroundColor: color.background },
        }}
      >
        {/* Service entry screens draw their own ServiceHeader (flow.md). */}
        <Stack.Screen name="LpgHome" component={LpgHome} options={{ title: 'LPG', headerShown: false }} />
        <Stack.Screen
          name="LpgRegistration"
          component={LpgRegistration}
          options={{ title: 'LPG', headerShown: false }}
        />
        {/* The success screen carries its own centred heading and, as in LpgConnectionLinked.png, no
          header — "Go to LPG" or the edge swipe leave it. */}
        <Stack.Screen
          name="LpgConnectionLinked"
          component={LpgConnectionLinked}
          options={{ title: '', headerShown: false }}
        />
        <Stack.Screen
          name="EnterBookingReference"
          component={EnterBookingReference}
          options={{ title: 'Enter booking reference' }}
        />
        <Stack.Screen name="RequestStatus" component={RequestStatus} options={{ title: 'Request status' }} />
        <Stack.Screen
          name="ComplaintCategory"
          component={ComplaintCategory}
          options={{ title: 'Raise a complaint' }}
        />
        <Stack.Screen
          name="ComplaintDetails"
          component={ComplaintDetails}
          options={{ title: 'Complaint details' }}
        />
        {/* The confirmation carries its own centred heading. */}
        <Stack.Screen
          name="ComplaintSubmitted"
          component={ComplaintSubmitted}
          options={{ title: '', headerLargeTitleEnabled: false }}
        />
      </Stack.Navigator>
    </AppearanceProvider>
  );
}
