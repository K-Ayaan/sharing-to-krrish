import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NoticeDetail from '../screens/notices/NoticeDetail';
import Notices from '../screens/notices/Notices';
import theme from '../theme';
import { stackScreenOptions } from './stackOptions';
import type { NoticesStackParamList } from './types';

const Stack = createNativeStackNavigator<NoticesStackParamList>();

export default function NoticesStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      {/* Tab root: draws its own header (avatar, UID, title) per Notices.png. */}
      <Stack.Screen name="Notices" component={Notices} options={{ headerShown: false }} />
      <Stack.Screen
        name="NoticeDetail"
        component={NoticeDetail}
        options={{
          title: 'Notice Detail',
          headerBackTitle: 'Back',
          // Redesign: pale blue page under the header, dark back button (NoticeDetail.png).
          headerTintColor: theme.color.textPrimary,
          headerStyle: { backgroundColor: theme.color.backgroundCool },
          contentStyle: { backgroundColor: theme.color.backgroundCool },
        }}
      />
    </Stack.Navigator>
  );
}
