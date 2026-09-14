import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecordDetail from '../screens/records/RecordDetail';
import Records from '../screens/records/Records';
import { stackScreenOptions } from './stackOptions';
import type { RecordsStackParamList } from './types';

const Stack = createNativeStackNavigator<RecordsStackParamList>();

export default function RecordsStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      {/* Tab root: draws its own header (avatar, UID, bell, title) per Records.png. */}
      <Stack.Screen name="Records" component={Records} options={{ headerShown: false }} />
      {/* Title is set per record type by the screen. */}
      <Stack.Screen
        name="RecordDetail"
        component={RecordDetail}
        options={{ title: 'Record', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  );
}
