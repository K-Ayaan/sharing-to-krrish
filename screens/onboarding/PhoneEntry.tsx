// aadhaar login.png, reworked: registration starts from the mobile number, not Aadhaar (the user
// dropped Aadhaar from onboarding on 23 Sep 2026). A single field, so it's a fixed layout rather
// than a scrolling page. The hills fill whatever space is left and end above the Continue button.
import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, ChevronRight, Info, Phone } from 'lucide-react-native';
import BrandMark from '../../components/ui/BrandMark';
import Button from '../../components/ui/Button';
import Landscape, { LeafSprig } from '../../components/ui/Landscape';
import Screen from '../../components/ui/Screen';
import TextField from '../../components/ui/TextField';
import { useToast } from '../../components/ui/Toast';
import type { OnboardingScreenProps } from '../../navigation/types';
import { describeError, ValidationError } from '../../services/client';
import { sendPhoneOtp } from '../../services/onboardingService';
import { validatePhone } from '../../services/userService';
import theme from '../../theme';
import WhyPhoneSheet from './WhyPhoneSheet';

const PHONE_DIGITS = 10;

export default function PhoneEntry({ navigation, route }: OnboardingScreenProps<'PhoneEntry'>) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const toast = useToast();
  // Coming back from the OTP screen to correct the number keeps what was typed.
  const [digits, setDigits] = useState(route.params?.phone ?? '');
  const [error, setError] = useState<string | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const compact = height < 720;

  const onContinue = async () => {
    const problem = validatePhone(digits);
    if (problem) {
      setError(problem);
      return;
    }
    setSending(true);
    try {
      const { phone } = await sendPhoneOtp(digits);
      navigation.navigate('OtpVerify', { phone });
    } catch (caught) {
      if (caught instanceof ValidationError) setError(caught.message);
      else toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen
      scroll={false}
      backdrop={
        <View style={styles.cornerLeaves}>
          <LeafSprig size={200} />
        </View>
      }
      footer={
        <Button
          label="Continue"
          trailingIcon={ArrowRight}
          onPress={onContinue}
          loading={sending}
          disabled={digits.length === 0}
        />
      }
      contentStyle={[styles.content, { paddingTop: insets.top + (compact ? theme.space.xl : theme.space.xxxl + theme.space.l) }]}
    >
      <View style={styles.brand}>
        <BrandMark size={compact ? 84 : 100} />
        <Text accessibilityRole="header" style={[styles.welcome, compact && styles.welcomeCompact]}>
          Welcome!
        </Text>
        <Text style={styles.subtitle}>Let’s connect you to{'\n'}government services</Text>
      </View>

      <TextField
        label="Mobile Number"
        labelPosition="notched"
        notchBackground={theme.color.background}
        icon={Phone}
        iconDivider
        placeholder="98765 43210"
        value={digits}
        onChangeText={(text) => {
          const next = text.replace(/\D/g, '').slice(0, PHONE_DIGITS);
          setDigits(next);
          setError(null);
          // Nothing left to type — put the keyboard away rather than make them dismiss it.
          if (next.length === PHONE_DIGITS) Keyboard.dismiss();
        }}
        keyboardType="number-pad"
        maxLength={PHONE_DIGITS}
        returnKeyType="done"
        onSubmitEditing={onContinue}
        error={error}
        leading={<Text style={styles.countryCode}>+91</Text>}
        helper="We’ll send a 6-digit OTP to this number."
        containerStyle={compact ? styles.fieldCompact : styles.field}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Why do we need this?"
        // Close the keyboard first and let it finish: opening the sheet over a closing keyboard
        // makes both animate at once and the sheet judders.
        onPress={() => {
          if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            setTimeout(() => setWhyOpen(true), theme.motion.base);
          } else {
            setWhyOpen(true);
          }
        }}
        hitSlop={8}
        style={({ pressed }) => [styles.why, pressed && styles.pressed]}
      >
        <View style={styles.whyIcon}>
          <Info size={16} color={theme.color.surface} fill={theme.pillarTint.vandhan.icon} strokeWidth={2} />
        </View>
        <Text style={styles.whyText}>Why do we need this?</Text>
        <ChevronRight size={16} color={theme.pillarTint.vandhan.icon} strokeWidth={2.25} />
      </Pressable>

      {/* Shrinks (cropping from the top) when the keyboard or a short screen needs the room. */}
      <View style={styles.landscape} pointerEvents="none">
        <Landscape width={width} height={width * 0.5} spread="full" houses />
      </View>

      <WhyPhoneSheet visible={whyOpen} onClose={() => setWhyOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 0,
  },
  cornerLeaves: {
    position: 'absolute',
    top: -30,
    left: -70,
    opacity: 0.7,
    transform: [{ scaleX: -1 }, { rotate: '160deg' }],
  },
  brand: {
    alignItems: 'center',
  },
  welcome: {
    ...theme.type.display,
    fontSize: 34,
    lineHeight: 42,
    color: theme.color.textPrimary,
    marginTop: theme.space.l,
  },
  welcomeCompact: {
    fontSize: 30,
    lineHeight: 38,
    marginTop: theme.space.m,
  },
  subtitle: {
    ...theme.type.body,
    fontSize: 16,
    lineHeight: 23,
    color: theme.color.textSecondary,
    textAlign: 'center',
    marginTop: theme.space.xs,
  },
  countryCode: {
    ...theme.type.body,
    fontSize: 16,
    fontWeight: '500',
    color: theme.color.textPrimary,
  },
  field: {
    marginTop: theme.space.xxl,
  },
  fieldCompact: {
    marginTop: theme.space.xl,
  },
  why: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.space.s,
    marginTop: theme.space.m,
    marginLeft: theme.space.xs,
  },
  pressed: {
    opacity: 0.6,
  },
  whyIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyText: {
    ...theme.type.body,
    fontSize: 13,
    color: theme.pillarTint.vandhan.icon,
    fontWeight: '500',
  },
  landscape: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginHorizontal: -theme.size.screenPadding,
    marginTop: theme.space.l,
  },
});
