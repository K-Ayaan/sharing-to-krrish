import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AskUs from '../screens/askus/AskUs';
import { stackScreenOptions } from './stackOptions';
import type { AskUsStackParamList } from './types';

const Stack = createNativeStackNavigator<AskUsStackParamList>();

export default function AskUsStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      {/* Tab root: draws its own header (avatar, UID, bell, title), like Records. */}
      <Stack.Screen name="AskUs" component={AskUs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
