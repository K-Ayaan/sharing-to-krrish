import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MicroFinanceApplicationStatus from '../screens/microfinance/MicroFinanceApplicationStatus';
import MicroFinanceApply from '../screens/microfinance/MicroFinanceApply';
import MicroFinanceDocuments from '../screens/microfinance/MicroFinanceDocuments';
import MicroFinanceRaiseGrievance from '../screens/microfinance/MicroFinanceRaiseGrievance';
import MicroFinanceRegister from '../screens/microfinance/MicroFinanceRegister';
import MicroFinanceRepayments from '../screens/microfinance/MicroFinanceRepayments';
import { stackScreenOptions } from './stackOptions';
import type { MicroFinanceStackParamList } from './types';

const Stack = createNativeStackNavigator<MicroFinanceStackParamList>();

// design/flow.md § ServicesStack › MicroFinanceStack — SPEC-ONLY throughout (SDD §4.5 / S-50-54).
// Per the SDD: "a demonstrable capability... not a live lending or core banking system" — copy on
// the real screens must say so.
export default function MicroFinanceStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MicroFinanceRegister" component={MicroFinanceRegister} />
      <Stack.Screen name="MicroFinanceApply" component={MicroFinanceApply} />
      <Stack.Screen name="MicroFinanceDocuments" component={MicroFinanceDocuments} />
      <Stack.Screen name="MicroFinanceApplicationStatus" component={MicroFinanceApplicationStatus} />

      <Stack.Screen name="MicroFinanceRepayments" component={MicroFinanceRepayments} />

      <Stack.Screen name="MicroFinanceRaiseGrievance" component={MicroFinanceRaiseGrievance} />
    </Stack.Navigator>
  );
}
