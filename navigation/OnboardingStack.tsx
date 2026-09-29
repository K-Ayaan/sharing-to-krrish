import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneEntry from '../screens/onboarding/PhoneEntry';
import AllSet from '../screens/onboarding/AllSet';
import OtpVerify from '../screens/onboarding/OtpVerify';
import ProfileDetails from '../screens/onboarding/ProfileDetails';
import { stackScreenOptions } from './stackOptions';
import type { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

// design/flow.md § AuthStack (named "Onboarding" to match the sibling iOS app). Registration
// starts from the mobile number and verifies it by OTP.
export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="PhoneEntry" component={PhoneEntry} />
      <Stack.Screen name="OtpVerify" component={OtpVerify} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
      <Stack.Screen name="AllSet" component={AllSet} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
