// phone number verification.png — the OTP goes to the number entered on the previous screen. That
// number is shown here, read-only, with Edit going back to change it, so there's one place a phone
// number is typed rather than two.
import { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, CheckCircle2, Phone } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import OtpInput from '../../components/ui/OtpInput';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import TextField, { FieldTrailingText } from '../../components/ui/TextField';
import { useToast } from '../../components/ui/Toast';
import { OTP_RESEND_SECONDS } from '../../data/mock/mockOnboarding';
import type { OnboardingScreenProps } from '../../navigation/types';
import { describeError, ValidationError } from '../../services/client';
import { sendPhoneOtp, verifyOtp } from '../../services/onboardingService';
import theme from '../../theme';
import { formatPhone, maskPhone } from '../../utils/format';

const OTP_LENGTH = 6;
const formatCountdown = (seconds: number) => `00:${String(seconds).padStart(2, '0')}`;

export default function OtpVerify({ navigation, route }: OnboardingScreenProps<'OtpVerify'>) {
  const { phone } = route.params;
  const toast = useToast();
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const resend = async () => {
    setSending(true);
    try {
      await sendPhoneOtp(phone);
      setCode('');
      setCodeError(null);
      setSecondsLeft(OTP_RESEND_SECONDS);
      toast.show({ message: `OTP sent to ${maskPhone(phone)}`, tone: 'success' });
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  const onVerify = async () => {
    setVerifying(true);
    try {
      await verifyOtp(code);
      // Verified — the OTP step shouldn't be reachable again with Back.
      navigation.replace('ProfileDetails', { phone });
    } catch (caught) {
      if (caught instanceof ValidationError) setCodeError(caught.message);
      else toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Screen
      scroll={false}
      header={
        <ScreenHeader
          layout="stacked"
          onBack={navigation.goBack}
          title="Verify your phone number"
          subtitle="We’ll send a 6-digit OTP to confirm your number."
          landscape="green"
        />
      }
      footer={
        <Button
          label="Verify & Continue"
          trailingIcon={ArrowRight}
          onPress={onVerify}
          loading={verifying}
          disabled={code.length < OTP_LENGTH}
        />
      }
    >
      <TextField
        label="Phone Number"
        labelPosition="inside"
        icon={Phone}
        value={formatPhone(phone)}
        editable={false}
        plainWhenReadOnly
        onChangeText={() => {}}
        trailing={
          // Back to where the number was typed, rather than a second place to type it.
          <FieldTrailingText onPress={() => navigation.goBack()}>Edit</FieldTrailingText>
        }
      />

      <Button label="OTP Sent" icon={CheckCircle2} variant="tonal" disabled onPress={() => {}} />

      <View style={styles.otp}>
        <OtpInput
          value={code}
          onChange={(value) => {
            setCode(value);
            setCodeError(null);
            // All six in — close the keyboard instead of making them dismiss it.
            if (value.length === OTP_LENGTH) Keyboard.dismiss();
          }}
          error={!!codeError}
        />
        {codeError ? (
          <Text accessibilityLiveRegion="polite" style={styles.codeError}>
            {codeError}
          </Text>
        ) : null}
      </View>

      {secondsLeft > 0 ? (
        <Text style={styles.resend}>Resend OTP in {formatCountdown(secondsLeft)}</Text>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={resend}
          disabled={sending}
          hitSlop={10}
          style={styles.resendButton}
        >
          <Text style={styles.resendAction}>{sending ? 'Sending…' : 'Resend OTP'}</Text>
        </Pressable>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  otp: {
    marginTop: theme.space.s,
    gap: theme.space.s,
  },
  codeError: {
    ...theme.type.caption,
    color: theme.color.alert.fg,
    textAlign: 'center',
  },
  resend: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    textAlign: 'center',
    marginTop: theme.space.s,
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: theme.space.s,
  },
  resendAction: {
    ...theme.type.bodyStrong,
    color: theme.pillarTint.vandhan.icon,
  },
});
