import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecordDetail from '../screens/records/RecordDetail';
import Records from '../screens/records/Records';
import { stackScreenOptions } from './stackOptions';
import type { RecordsStackParamList } from './types';

const Stack = createNativeStackNavigator<RecordsStackParamList>();

// design/flow.md § RecordsStack
export default function RecordsStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="RecordsList" component={Records} />
      <Stack.Screen name="RecordDetail" component={RecordDetail} />
    </Stack.Navigator>
  );
}
