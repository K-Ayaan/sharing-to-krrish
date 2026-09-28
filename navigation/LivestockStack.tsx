import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppearanceProvider } from '../components/ui/Appearance';
import LivestockHome from '../screens/livestock/LivestockHome';
import StockDetails from '../screens/livestock/StockDetails';
import theme from '../theme';
import { stackScreenOptions } from './stackOptions';
import type { LivestockStackParamList } from './types';

const Stack = createNativeStackNavigator<LivestockStackParamList>();

const { color } = theme.livestock;

// The whole stack uses the rose-on-cream Livestock appearance (redesign batch 4); MainTabs also turns
// the active tab rose while it's shown. StockDetails keeps a small centred title, as in StockDetails.png.
export default function LivestockStack() {
  return (
    <AppearanceProvider appearance="livestock">
      <Stack.Navigator
        screenOptions={{
          ...stackScreenOptions,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: color.textPrimary,
          headerStyle: { backgroundColor: color.background },
          contentStyle: { backgroundColor: color.background },
        }}
      >
        {/* Service entry screen: draws its own ServiceHeader (flow.md). */}
        <Stack.Screen
          name="LivestockHome"
          component={LivestockHome}
          options={{ title: 'Livestock', headerShown: false }}
        />
        <Stack.Screen name="StockDetails" component={StockDetails} options={{ title: 'Stock details' }} />
      </Stack.Navigator>
    </AppearanceProvider>
  );
}
