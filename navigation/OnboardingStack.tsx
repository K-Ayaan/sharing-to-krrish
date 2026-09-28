import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AadhaarEntry from '../screens/onboarding/AadhaarEntry';
import Consent from '../screens/onboarding/Consent';
import EmailEntry from '../screens/onboarding/EmailEntry';
import PhoneEntry from '../screens/onboarding/PhoneEntry';
import PhoneOtp from '../screens/onboarding/PhoneOtp';
import ProfileDetails from '../screens/onboarding/ProfileDetails';
import RegistrationComplete from '../screens/onboarding/RegistrationComplete';
import { stackScreenOptions } from './stackOptions';
import type { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

// Contact number first (OTP-verified), then Aadhaar — the identity every account maps to (flow.md).
// Aadhaar itself is never OTP-verified; the phone OTP only proves the number is reachable.
export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false }}>
      <Stack.Screen name="PhoneEntry" component={PhoneEntry} />
      <Stack.Screen name="PhoneOtp" component={PhoneOtp} />
      <Stack.Screen name="AadhaarEntry" component={AadhaarEntry} />
      <Stack.Screen name="EmailEntry" component={EmailEntry} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
      <Stack.Screen name="Consent" component={Consent} />
      <Stack.Screen name="RegistrationComplete" component={RegistrationComplete} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
