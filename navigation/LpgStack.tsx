import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LpgHub from '../screens/lpg/LpgHub';
import LpgMyComplaints from '../screens/lpg/LpgMyComplaints';
import LpgRaiseComplaint from '../screens/lpg/LpgRaiseComplaint';
import LpgRegister from '../screens/lpg/LpgRegister';
import { stackScreenOptions } from './stackOptions';
import type { LpgStackParamList } from './types';

const Stack = createNativeStackNavigator<LpgStackParamList>();

// design/flow.md § ServicesStack › LpgStack.
export default function LpgStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="LpgHub" component={LpgHub} />
      <Stack.Screen name="LpgRegister" component={LpgRegister} />
      <Stack.Screen name="LpgRaiseComplaint" component={LpgRaiseComplaint} />
      <Stack.Screen name="LpgMyComplaints" component={LpgMyComplaints} />
    </Stack.Navigator>
  );
}
