import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home/Home';
import Settings from '../screens/home/Settings';
import theme from '../theme';
import { stackScreenOptions } from './stackOptions';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      {/* Opened from the UID chip on any tab: native large title and a chevron-only back button to Home. */}
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          title: 'Settings',
          headerLargeTitleEnabled: true,
          headerLargeTitleShadowVisible: false,
          headerLargeTitleStyle: { color: theme.color.textPrimary },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          // Redesign: warm cream page under the large title, dark back chevron (iOS 26 draws it in a
          // glass circle, as in Settings.png).
          headerTintColor: theme.color.textPrimary,
          headerLargeStyle: { backgroundColor: theme.color.backgroundWarm },
          headerStyle: { backgroundColor: theme.color.backgroundWarm },
          contentStyle: { backgroundColor: theme.color.backgroundWarm },
        }}
      />
    </Stack.Navigator>
  );
}
