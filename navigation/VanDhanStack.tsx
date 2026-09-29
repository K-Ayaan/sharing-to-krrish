import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CollectionDetail from '../screens/vandhan/CollectionDetail';
import GrievanceStatus from '../screens/vandhan/GrievanceStatus';
import RaiseGrievance from '../screens/vandhan/RaiseGrievance';
import SubmitCollection from '../screens/vandhan/SubmitCollection';
import VanDhanHub from '../screens/vandhan/VanDhanHub';
import VanDhanRegister from '../screens/vandhan/VanDhanRegister';
import { stackScreenOptions } from './stackOptions';
import type { VanDhanStackParamList } from './types';

const Stack = createNativeStackNavigator<VanDhanStackParamList>();

// design/flow.md § ServicesStack › VanDhanStack
export default function VanDhanStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="VanDhanHub" component={VanDhanHub} />
      <Stack.Screen name="VanDhanRegister" component={VanDhanRegister} />
      <Stack.Screen name="SubmitCollection" component={SubmitCollection} />
      <Stack.Screen name="CollectionDetail" component={CollectionDetail} />
      <Stack.Screen name="VanDhanRaiseGrievance" component={RaiseGrievance} />
      <Stack.Screen name="VanDhanGrievanceStatus" component={GrievanceStatus} />
    </Stack.Navigator>
  );
}
