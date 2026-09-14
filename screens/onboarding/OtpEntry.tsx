import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import OtpInput from '../../components/ui/OtpInput';
import Toast from '../../components/ui/Toast';
import { OTP_LENGTH, OTP_RESEND_SECONDS, sendOtp, verifyOtp } from '../../data/mock/mockOnboarding';
import type { OnboardingScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatPhoneWithCode } from './formatPhone';
import OnboardingLayout from './OnboardingLayout';

const TICK_MS = 1000;
const SECONDS_PER_MINUTE = 60;

function formatCountdown(seconds: number) {
  const minutes = String(Math.floor(seconds / SECONDS_PER_MINUTE)).padStart(2, '0');
  const rest = String(seconds % SECONDS_PER_MINUTE).padStart(2, '0');
  return `${minutes}:${rest}`;
}

export default function OtpEntry({ navigation, route }: OnboardingScreenProps<'OtpEntry'>) {
  const { phone } = route.params;
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_SECONDS);
  const [toast, setToast] = useState<string | null>(null);
  const verifying = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), TICK_MS);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleComplete = async (value: string) => {
    if (verifying.current) return;
    verifying.current = true;
    try {
      await verifyOtp(phone, value);
      navigation.navigate('EmailEntry', { phone });
    } finally {
      verifying.current = false;
    }
  };

  const handleResend = async () => {
    await sendOtp(phone);
    setCode('');
    setSecondsLeft(OTP_RESEND_SECONDS);
    setToast('A new code has been sent');
  };

  const canResend = secondsLeft <= 0;

  return (
    <OnboardingLayout
      step={2}
      title="Enter the OTP"
      subtitle={`We've sent a ${OTP_LENGTH}-digit code to\n${formatPhoneWithCode(phone)}`}
      onBack={() => navigation.goBack()}
      overlay={
        <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
      }
    >
      <OtpInput
        autoFocus
        length={OTP_LENGTH}
        value={code}
        onChange={setCode}
        onComplete={handleComplete}
      />
      <View style={styles.resend}>
        <Text style={styles.hint}>Didn't receive the code?</Text>
        <Button label="Resend code" variant="text" disabled={!canResend} onPress={handleResend} />
        {canResend ? null : <Text style={styles.hint}>in {formatCountdown(secondsLeft)}</Text>}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  resend: {
    alignItems: 'center',
    gap: theme.space.xs,
  },
  hint: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
});
