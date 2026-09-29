import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NoticeDetail from '../screens/notices/NoticeDetail';
import Notices from '../screens/notices/Notices';
import { stackScreenOptions } from './stackOptions';
import type { NoticesStackParamList } from './types';

const Stack = createNativeStackNavigator<NoticesStackParamList>();

// design/flow.md § NoticesStack
export default function NoticesStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="NoticesList" component={Notices} />
      <Stack.Screen name="NoticeDetail" component={NoticeDetail} />
    </Stack.Navigator>
  );
}
