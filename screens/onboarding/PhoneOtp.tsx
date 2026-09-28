import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import OtpInput from '../../components/ui/OtpInput';
import Toast from '../../components/ui/Toast';
import {
  COUNTRY_CODE,
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
  resendPhoneOtp,
  verifyPhoneOtp,
} from '../../data/mock/mockOnboarding';
import type { OnboardingScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatPhone } from './formatPhone';
import OnboardingLayout from './OnboardingLayout';

const TICK_MS = 1000;
const SECONDS_PER_MINUTE = 60;

function formatCountdown(seconds: number) {
  const minutes = String(Math.floor(seconds / SECONDS_PER_MINUTE)).padStart(2, '0');
  const rest = String(seconds % SECONDS_PER_MINUTE).padStart(2, '0');
  return `${minutes}:${rest}`;
}

// Step 2. Confirms the contact number is reachable. Identity is settled by Aadhaar on the next step
// (flow.md): this number is never used to sign in, it just has to be a number we can reach.
export default function PhoneOtp({ navigation, route }: OnboardingScreenProps<'PhoneOtp'>) {
  const { phone, txnId } = route.params;
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_SECONDS);
  const [toast, setToast] = useState<string | null>(null);
  const verifying = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), TICK_MS);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleChange = (value: string) => {
    setCode(value);
    if (error) setError(null);
  };

  const handleComplete = async (value: string) => {
    if (verifying.current) return;
    verifying.current = true;
    try {
      await verifyPhoneOtp(txnId, value);
      navigation.navigate('AadhaarEntry', { phone });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Verification failed. Please try again.');
      setCode('');
    } finally {
      verifying.current = false;
    }
  };

  const handleResend = async () => {
    try {
      await resendPhoneOtp(txnId);
      setCode('');
      setError(null);
      setSecondsLeft(OTP_RESEND_SECONDS);
      setToast('A new OTP has been sent');
    } catch (failure) {
      setToast(failure instanceof Error ? failure.message : "Couldn't resend the OTP.");
    }
  };

  const canResend = secondsLeft <= 0;

  return (
    <OnboardingLayout
      step={2}
      title="Verify your contact number"
      subtitle={`Enter the ${OTP_LENGTH}-digit code sent to ${COUNTRY_CODE} ${formatPhone(phone)}.`}
      onBack={() => navigation.goBack()}
      overlay={
        <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
      }
    >
      <View style={styles.group}>
        <OtpInput
          autoFocus
          error={!!error}
          length={OTP_LENGTH}
          value={code}
          onChange={handleChange}
          onComplete={handleComplete}
        />
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
      </View>

      <View style={styles.resend}>
        <Text style={styles.hint}>Didn't receive the code?</Text>
        <Button label="Resend OTP" variant="text" disabled={!canResend} onPress={handleResend} />
        {canResend ? null : <Text style={styles.hint}>in {formatCountdown(secondsLeft)}</Text>}
      </View>

      <Text style={[styles.hint, styles.centered]}>
        Wrong number? Go back to change it.
      </Text>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: theme.space.s,
  },
  error: {
    ...theme.type.caption,
    color: theme.color.danger,
  },
  resend: {
    alignItems: 'center',
    gap: theme.space.xs,
    marginTop: theme.space.s,
  },
  hint: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.onboarding.color.textSecondary,
  },
  centered: {
    textAlign: 'center',
  },
});
