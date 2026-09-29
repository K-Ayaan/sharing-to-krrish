import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AskUs from '../screens/askus/AskUs';
import { stackScreenOptions } from './stackOptions';
import type { AskUsStackParamList } from './types';

const Stack = createNativeStackNavigator<AskUsStackParamList>();

// design/flow.md § AskUsStack
export default function AskUsStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false }}>
      <Stack.Screen name="AskUs" component={AskUs} />
    </Stack.Navigator>
  );
}
