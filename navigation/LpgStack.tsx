import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ComplaintCategory from '../screens/lpg/ComplaintCategory';
import ComplaintDetails from '../screens/lpg/ComplaintDetails';
import ComplaintSubmitted from '../screens/lpg/ComplaintSubmitted';
import EnterBookingReference from '../screens/lpg/EnterBookingReference';
import LpgHome from '../screens/lpg/LpgHome';
import RequestStatus from '../screens/lpg/RequestStatus';
import theme from '../theme';
import { stackScreenOptions } from './stackOptions';
import type { LpgStackParamList } from './types';

const Stack = createNativeStackNavigator<LpgStackParamList>();

export default function LpgStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...stackScreenOptions,
        headerLargeTitleEnabled: true,
        headerLargeTitleShadowVisible: false,
        headerLargeTitleStyle: { color: theme.color.textPrimary },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      {/* Pillar home: visible back chevron to Services (flow.md). */}
      <Stack.Screen name="LpgHome" component={LpgHome} options={{ title: 'LPG' }} />
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
  );
}
