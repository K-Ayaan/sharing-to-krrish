import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneEntry from '../screens/onboarding/PhoneEntry';
import OtpEntry from '../screens/onboarding/OtpEntry';
import EmailEntry from '../screens/onboarding/EmailEntry';
import ProfileDetails from '../screens/onboarding/ProfileDetails';
import Consent from '../screens/onboarding/Consent';
import RegistrationComplete from '../screens/onboarding/RegistrationComplete';
import { stackScreenOptions } from './stackOptions';
import type { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false }}>
      <Stack.Screen name="PhoneEntry" component={PhoneEntry} />
      <Stack.Screen name="OtpEntry" component={OtpEntry} />
      <Stack.Screen name="EmailEntry" component={EmailEntry} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
      <Stack.Screen name="Consent" component={Consent} />
      <Stack.Screen name="RegistrationComplete" component={RegistrationComplete} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
