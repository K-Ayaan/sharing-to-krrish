import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GrievanceStatus from '../screens/vandhan/GrievanceStatus';
import KendraInfo from '../screens/vandhan/KendraInfo';
import LogCollection from '../screens/vandhan/LogCollection';
import PickupDetails from '../screens/vandhan/PickupDetails';
import SchedulePickup from '../screens/vandhan/SchedulePickup';
import VanDhanHome from '../screens/vandhan/VanDhanHome';
import theme from '../theme';
import { stackScreenOptions } from './stackOptions';
import type { VanDhanStackParamList } from './types';

const Stack = createNativeStackNavigator<VanDhanStackParamList>();

// Inner screens use the native iOS large title with a chevron-only back button,
// which is what the Van Dhan mockups show.
export default function VanDhanStack() {
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
      <Stack.Screen name="VanDhanHome" component={VanDhanHome} options={{ title: 'Van Dhan' }} />
      <Stack.Screen name="LogCollection" component={LogCollection} options={{ title: 'Log a collection' }} />
      <Stack.Screen name="SchedulePickup" component={SchedulePickup} options={{ title: 'Schedule a pickup' }} />
      <Stack.Screen name="PickupDetails" component={PickupDetails} options={{ title: 'Pickup details' }} />
      <Stack.Screen name="KendraInfo" component={KendraInfo} options={{ title: 'Kendra information' }} />
      <Stack.Screen name="GrievanceStatus" component={GrievanceStatus} options={{ title: 'Grievance status' }} />
    </Stack.Navigator>
  );
}
