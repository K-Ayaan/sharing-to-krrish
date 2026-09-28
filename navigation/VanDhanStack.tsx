import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppearanceProvider } from '../components/ui/Appearance';
import CollectionSubmitted from '../screens/vandhan/CollectionSubmitted';
import GrievanceStatus from '../screens/vandhan/GrievanceStatus';
import KendraInfo from '../screens/vandhan/KendraInfo';
import LogCollection from '../screens/vandhan/LogCollection';
import PickupDetails from '../screens/vandhan/PickupDetails';
import SchedulePickup from '../screens/vandhan/SchedulePickup';
import VanDhanHome from '../screens/vandhan/VanDhanHome';
import VanDhanRegistration from '../screens/vandhan/VanDhanRegistration';
import theme from '../theme';
import { stackScreenOptions } from './stackOptions';
import type { VanDhanStackParamList } from './types';

const Stack = createNativeStackNavigator<VanDhanStackParamList>();

const { color } = theme.vandhan;

// Inner screens use the native iOS large title with a chevron-only back button (iOS 26 draws it in a
// glass circle), which is what the Van Dhan mockups show. The whole stack uses the green-on-cream
// Van Dhan appearance (redesign batch 3); MainTabs also turns the active tab green while it's shown.
export default function VanDhanStack() {
  return (
    <AppearanceProvider appearance="vandhan">
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
        <Stack.Screen
          name="VanDhanHome"
          component={VanDhanHome}
          options={{ title: 'Van Dhan', headerShown: false }}
        />
        <Stack.Screen
          name="VanDhanRegistration"
          component={VanDhanRegistration}
          options={{ title: 'Van Dhan', headerShown: false }}
        />
        {/* LogCollection.png shows a small centred title, not a large one. */}
        <Stack.Screen
          name="LogCollection"
          component={LogCollection}
          options={{ title: 'Log a collection', headerLargeTitleEnabled: false }}
        />
        <Stack.Screen
          name="CollectionSubmitted"
          component={CollectionSubmitted}
          options={{ title: 'Van Dhan', headerShown: false }}
        />
        <Stack.Screen
          name="SchedulePickup"
          component={SchedulePickup}
          options={{ title: 'Schedule a pickup' }}
        />
        <Stack.Screen name="PickupDetails" component={PickupDetails} options={{ title: 'Pickup details' }} />
        <Stack.Screen name="KendraInfo" component={KendraInfo} options={{ title: 'Kendra information' }} />
        <Stack.Screen
          name="GrievanceStatus"
          component={GrievanceStatus}
          options={{ title: 'Grievance status' }}
        />
      </Stack.Navigator>
    </AppearanceProvider>
  );
}
