import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Button from '../../components/ui/Button';
import KeyboardDoneBar from '../../components/ui/KeyboardDoneBar';
import TextField from '../../components/ui/TextField';
import Toast from '../../components/ui/Toast';
import { COUNTRY_CODE, PHONE_LENGTH, sendPhoneOtp } from '../../data/mock/mockOnboarding';
import type { OnboardingScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatPhone } from './formatPhone';
import OnboardingLayout from './OnboardingLayout';

const DONE_BAR_ID = 'phone-entry-done';

// Step 1. A contact number only — identity comes from Aadhaar on step 3. The OTP on the next step
// just confirms we can reach this number; it is never used to sign in.
export default function PhoneEntry({ navigation }: OnboardingScreenProps<'PhoneEntry'>) {
  const [digits, setDigits] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const valid = digits.length === PHONE_LENGTH;

  const handleChange = (text: string) => {
    const raw = text.replace(/\D/g, '');
    // Autofill can include the country code; keep the national number.
    setDigits(raw.length > PHONE_LENGTH ? raw.slice(-PHONE_LENGTH) : raw);
  };

  const handleContinue = async () => {
    if (!valid || sending) return;
    setSending(true);
    try {
      const session = await sendPhoneOtp(digits);
      navigation.navigate('PhoneOtp', { phone: digits, txnId: session.txnId });
    } catch {
      setToast("Couldn't send the OTP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <OnboardingLayout
      step={1}
      title="Your contact number"
      overlay={
        <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
      }
      footer={
        <Button
          label="Continue"
          trailingIcon="arrow-forward"
          disabled={!valid || sending}
          onPress={handleContinue}
        />
      }
    >
      <TextField
        accessibilityLabel="Contact phone number"
        autoComplete="tel"
        autoFocus
        inputAccessoryViewID={DONE_BAR_ID}
        keyboardType="number-pad"
        label="Phone number"
        leading={<Text style={styles.countryCode}>{COUNTRY_CODE}</Text>}
        maxLength={PHONE_LENGTH + 1}
        onChangeText={handleChange}
        onSubmitEditing={handleContinue}
        placeholder="98765 43210"
        required
        returnKeyType="done"
        textContentType="telephoneNumber"
        value={formatPhone(digits)}
      />
      <KeyboardDoneBar nativeID={DONE_BAR_ID} />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  countryCode: {
    ...theme.type.headline,
    fontSize: theme.type.headline.fontSize + 1,
    color: theme.onboarding.color.textPrimary,
  },
});
