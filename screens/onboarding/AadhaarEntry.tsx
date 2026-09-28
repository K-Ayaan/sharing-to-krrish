import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import InfoToggle from '../../components/ui/InfoToggle';
import TextField from '../../components/ui/TextField';
import Toast from '../../components/ui/Toast';
import { verifyAadhaar } from '../../data/mock/mockOnboarding';
import { useCompleteOnboarding } from '../../navigation/OnboardingContext';
import type { OnboardingScreenProps } from '../../navigation/types';
import theme from '../../theme';
import AadhaarInfoSheet from './AadhaarInfoSheet';
import { AADHAAR_LENGTH, formatAadhaar, validateAadhaar } from './aadhaar';
import OnboardingLayout from './OnboardingLayout';

const { color } = theme.onboarding;

// Step 3, after the contact number is OTP-verified. Aadhaar is the user's identity (flow.md): every
// account is mapped to an Aadhaar number, validated here by its check digit — Aadhaar itself has no
// OTP step. The full number stays on this screen; later steps only ever see a masked number and a
// reference. A number that already has an account signs straight in.
export default function AadhaarEntry({ navigation, route }: OnboardingScreenProps<'AadhaarEntry'>) {
  const { phone } = route.params;
  const [digits, setDigits] = useState('');
  const [touched, setTouched] = useState(false);
  const [consented, setConsented] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const completeOnboarding = useCompleteOnboarding();
  const error = validateAadhaar(digits);
  const showError = touched && !!error;

  const handleContinue = async () => {
    setTouched(true);
    if (error || !consented || verifying) return;
    setVerifying(true);
    try {
      const result = await verifyAadhaar(digits);
      if (result.status === 'existing') {
        // This Aadhaar already has a MARCOFED account: sign in, skip registration.
        await completeOnboarding(result.uid);
        return;
      }
      navigation.navigate('EmailEntry', { identity: result.identity, phone });
    } catch {
      setToast("Couldn't verify this Aadhaar number. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <OnboardingLayout
      step={3}
      title="Verify your identity"
      onBack={() => navigation.goBack()}
      footer={
        <Button
          label="Continue"
          trailingIcon="arrow-forward"
          disabled={!!error || !consented || verifying}
          onPress={handleContinue}
        />
      }
      overlay={
        <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
      }
    >
      <View style={styles.group}>
        <TextField
          autoComplete="off"
          autoCorrect={false}
          error={showError ? error : undefined}
          keyboardType="number-pad"
          label="Aadhaar number"
          maxLength={AADHAAR_LENGTH + 2}
          onBlur={() => setTouched(true)}
          onChangeText={(text) => setDigits(text.replace(/\D/g, '').slice(0, AADHAAR_LENGTH))}
          placeholder="XXXX XXXX XXXX"
          required
          shape="rounded"
          textContentType="none"
          trailing={
            <Ionicons
              name="finger-print"
              size={theme.type.largeTitle.fontSize + theme.space.xs}
              color={color.primary}
            />
          }
          value={formatAadhaar(digits)}
        />
        {showError ? null : <Text style={styles.hint}>Enter your 12-digit Aadhaar number</Text>}
      </View>

      <InfoToggle label="Why do we need this?" onPress={() => setWhyOpen(true)} />

      {/* Kept beyond the reference image: an Aadhaar that is already registered signs in here and
          never reaches the Consent step, so consent for the lookup is captured on this screen. */}
      <Checkbox
        checked={consented}
        onChange={setConsented}
        label="I agree to my Aadhaar number being used only to link me to my MARCOFED account."
      />

      <AadhaarInfoSheet visible={whyOpen} onClose={() => setWhyOpen(false)} />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: theme.space.s,
  },
  hint: {
    ...theme.type.body,
    color: color.textSecondary,
    paddingHorizontal: theme.space.xs,
  },
});
