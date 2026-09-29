import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LivestockBrowse from '../screens/livestock/LivestockBrowse';
import LivestockDetail from '../screens/livestock/LivestockDetail';
import LivestockRegister from '../screens/livestock/LivestockRegister';
import PlaceholderScreen from './PlaceholderScreen';
import { stackScreenOptions } from './stackOptions';
import type { LivestockScreenProps, LivestockStackParamList } from './types';

const Stack = createNativeStackNavigator<LivestockStackParamList>();

// design/flow.md § ServicesStack › LivestockStack. Producer screens (ReportStock onward) are
// SPEC-ONLY — no mockup exists, so they stay placeholders until their design is settled.
export default function LivestockStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="LivestockBrowse" component={LivestockBrowse} />
      <Stack.Screen name="LivestockDetail" component={LivestockDetail} />
      <Stack.Screen name="LivestockRegister" component={LivestockRegister} />

      <Stack.Screen name="ReportStock" options={{ headerShown: true, title: 'Report Stock' }}>
        {({ navigation }: LivestockScreenProps<'ReportStock'>) => (
          <PlaceholderScreen
            name="ReportStock"
            tag="SPEC-ONLY"
            reference="SDD §4.2.1 / S-20. No visual design."
            actions={[{ label: 'My batches', onPress: () => navigation.navigate('MyBatches') }]}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="MyBatches" options={{ headerShown: true, title: 'My Batches' }}>
        {({ navigation }: LivestockScreenProps<'MyBatches'>) => (
          <PlaceholderScreen
            name="MyBatches"
            tag="SPEC-ONLY"
            reference="SDD S-21. No visual design."
            actions={[
              { label: 'Open a batch', onPress: () => navigation.navigate('BatchDetail', {}) },
              { label: 'Biosecurity alerts', variant: 'secondary', onPress: () => navigation.navigate('BiosecurityAlerts') },
            ]}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="BatchDetail" options={{ headerShown: true, title: 'Batch' }}>
        {({ navigation }: LivestockScreenProps<'BatchDetail'>) => (
          <PlaceholderScreen
            name="BatchDetail"
            tag="SPEC-ONLY"
            reference="SDD S-22. No visual design."
            actions={[{ label: 'View certificate', onPress: () => navigation.navigate('Certificate', {}) }]}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Certificate" options={{ headerShown: true, title: 'Certificate' }}>
        {() => <PlaceholderScreen name="Certificate" tag="SPEC-ONLY" reference="SDD S-23. No visual design." />}
      </Stack.Screen>

      <Stack.Screen name="BiosecurityAlerts" options={{ headerShown: true, title: 'Alerts' }}>
        {() => <PlaceholderScreen name="BiosecurityAlerts" tag="SPEC-ONLY" reference="SDD S-24. No visual design." />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
