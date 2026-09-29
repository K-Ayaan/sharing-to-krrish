import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Services from '../screens/services/Services';
import { stackScreenOptions } from './stackOptions';
import LivestockStack from './LivestockStack';
import LpgStack from './LpgStack';
import MicroFinanceStack from './MicroFinanceStack';
import VanDhanStack from './VanDhanStack';
import type { ServicesStackParamList } from './types';

const Stack = createNativeStackNavigator<ServicesStackParamList>();

// design/flow.md § ServicesStack — hub + 5 nested pillar stacks. Opening a pillar you're not
// registered for should route to that pillar's Register screen first (SDD §2.5) once real data
// exists; the shell just wires the routes for now.
export default function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false }}>
      <Stack.Screen name="ServicesHub" component={Services} />

      <Stack.Screen name="VanDhan" component={VanDhanStack} />
      <Stack.Screen name="Livestock" component={LivestockStack} />
      <Stack.Screen name="Lpg" component={LpgStack} />
      <Stack.Screen name="MicroFinance" component={MicroFinanceStack} />
    </Stack.Navigator>
  );
}
