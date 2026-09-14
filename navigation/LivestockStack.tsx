import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LivestockHome from '../screens/livestock/LivestockHome';
import StockDetails from '../screens/livestock/StockDetails';
import theme from '../theme';
import { stackScreenOptions } from './stackOptions';
import type { LivestockStackParamList } from './types';

const Stack = createNativeStackNavigator<LivestockStackParamList>();

export default function LivestockStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...stackScreenOptions,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      {/* Pillar home: large title with a visible back chevron to Services (flow.md). */}
      <Stack.Screen
        name="LivestockHome"
        component={LivestockHome}
        options={{
          title: 'Livestock',
          headerLargeTitleEnabled: true,
          headerLargeTitleShadowVisible: false,
          headerLargeTitleStyle: { color: theme.color.textPrimary },
        }}
      />
      <Stack.Screen name="StockDetails" component={StockDetails} options={{ title: 'Stock details' }} />
    </Stack.Navigator>
  );
}
