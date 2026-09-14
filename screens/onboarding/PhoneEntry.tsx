import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';
import { COUNTRY_CODE, PHONE_LENGTH, sendOtp } from '../../data/mock/mockOnboarding';
import type { OnboardingScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatPhone } from './formatPhone';
import OnboardingLayout from './OnboardingLayout';

export default function PhoneEntry({ navigation }: OnboardingScreenProps<'PhoneEntry'>) {
  const [digits, setDigits] = useState('');
  const [sending, setSending] = useState(false);
  const valid = digits.length === PHONE_LENGTH;

  const handleChange = (text: string) => {
    const raw = text.replace(/\D/g, '');
    // Autofill can include the country code; keep the national number.
    setDigits(raw.length > PHONE_LENGTH ? raw.slice(-PHONE_LENGTH) : raw);
  };

  const handleSend = async () => {
    if (!valid || sending) return;
    setSending(true);
    try {
      await sendOtp(`${COUNTRY_CODE}${digits}`);
      navigation.navigate('OtpEntry', { phone: digits });
    } finally {
      setSending(false);
    }
  };

  return (
    <OnboardingLayout
      step={1}
      title="Enter your phone number"
      subtitle="We'll send you a one-time password (OTP) to verify your number."
      footer={
        <Button
          label="Send OTP"
          trailingIcon="arrow-forward"
          disabled={!valid || sending}
          onPress={handleSend}
        />
      }
    >
      <TextField
        accessibilityLabel="Phone number"
        autoComplete="tel"
        autoFocus
        keyboardType="number-pad"
        leading={<Text style={styles.countryCode}>{COUNTRY_CODE}</Text>}
        maxLength={PHONE_LENGTH + 1}
        onChangeText={handleChange}
        onSubmitEditing={handleSend}
        placeholder="98765 43210"
        returnKeyType="done"
        textContentType="telephoneNumber"
        value={formatPhone(digits)}
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  countryCode: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.color.textPrimary,
  },
});
