import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Services from '../screens/services/Services';
import LivestockStack from './LivestockStack';
import LpgStack from './LpgStack';
import { stackScreenOptions } from './stackOptions';
import type { ServicesStackParamList } from './types';
import VanDhanStack from './VanDhanStack';

const Stack = createNativeStackNavigator<ServicesStackParamList>();

// Pillar stacks nest here rather than at the root so the tab bar stays visible;
// their own headers inherit this stack's back button to Services.
export default function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Services" component={Services} options={{ headerShown: false }} />
      <Stack.Screen name="VanDhanStack" component={VanDhanStack} options={{ headerShown: false }} />
      <Stack.Screen name="LivestockStack" component={LivestockStack} options={{ headerShown: false }} />
      <Stack.Screen name="LpgStack" component={LpgStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
