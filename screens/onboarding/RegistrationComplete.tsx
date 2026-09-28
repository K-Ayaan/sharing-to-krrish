import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import IconButton from '../../components/ui/IconButton';
import SuccessBadge from '../../components/ui/SuccessBadge';
import Toast from '../../components/ui/Toast';
import { useCompleteOnboarding } from '../../navigation/OnboardingContext';
import { session } from '../../navigation/session';
import type { OnboardingScreenProps } from '../../navigation/types';
import theme from '../../theme';
import OnboardingLayout from './OnboardingLayout';

const { color } = theme.onboarding;
// IDs shrink to fit on one line on narrow phones rather than wrapping or overflowing.
const MIN_ID_SCALE = 0.75;

// The outcome of registration, not a numbered step: no "Create your account" header, progress bar or
// "Step N of M", although RegistrationComplete.png shows them — sign-in never reaches this screen, so
// counting it would make the flow look a step longer than it is. No back chevron either: the account
// already exists once this screen mounts, and flow.md forbids going back into the finished form.
export default function RegistrationComplete({ route }: OnboardingScreenProps<'RegistrationComplete'>) {
  const { uid, maskedAadhaar } = route.params;
  const completeOnboarding = useCompleteOnboarding();
  const [toast, setToast] = useState<string | null>(null);

  // Registration is done the moment this screen exists, so persist immediately —
  // quitting here must not send the user through onboarding again.
  useEffect(() => {
    session.saveUid(uid).catch((error) => console.warn('Could not persist UID.', error));
  }, [uid]);

  const copy = async (value: string, message: string) => {
    await Clipboard.setStringAsync(value);
    setToast(message);
  };

  return (
    <OnboardingLayout
      centered
      title="Registration complete!"
      subtitle="This is your MARCOFED ID across every service."
      hero={<SuccessBadge />}
      footer={
        <Button
          label="Go to Home"
          trailingIcon="arrow-forward"
          onPress={() => completeOnboarding(uid)}
        />
      }
      overlay={
        <Toast
          visible={toast !== null}
          message={toast ?? ''}
          onHide={() => setToast(null)}
          bottomOffset={theme.space.xl * 2}
        />
      }
    >
      <Card style={styles.row}>
        <Avatar icon="document-text" />
        <View style={styles.grow}>
          <Text numberOfLines={1} style={styles.caption}>
            Your MARCOFED ID (UID)
          </Text>
          <Text
            selectable
            adjustsFontSizeToFit
            minimumFontScale={MIN_ID_SCALE}
            numberOfLines={1}
            style={styles.uid}
          >
            {uid}
          </Text>
        </View>
        <IconButton
          icon="copy-outline"
          color={color.primary}
          tint={color.primaryTint}
          accessibilityLabel="Copy MARCOFED ID"
          onPress={() => copy(uid, 'MARCOFED ID copied')}
        />
      </Card>

      <Card style={styles.row}>
        <Avatar icon="finger-print" />
        <View style={styles.grow}>
          <Text numberOfLines={1} style={styles.caption}>
            Linked Aadhaar
          </Text>
          <Text adjustsFontSizeToFit minimumFontScale={MIN_ID_SCALE} numberOfLines={1} style={styles.value}>
            {maskedAadhaar}
          </Text>
        </View>
        {/* Copies only the masked number — the full Aadhaar never reaches this screen. */}
        <IconButton
          icon="copy-outline"
          color={color.primary}
          tint={color.primaryTint}
          accessibilityLabel="Copy linked Aadhaar"
          onPress={() => copy(maskedAadhaar, 'Linked Aadhaar copied')}
        />
      </Card>

      <Card tone="info" style={styles.row}>
        <Avatar icon="information" iconColor={theme.color.background} tint={color.primary} />
        <Text style={[styles.info, styles.grow]}>
          Keep this ID safe for the kendra and support. To sign in on another phone, just verify your
          Aadhaar again.
        </Text>
      </Card>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  grow: {
    flex: 1,
    minWidth: 0,
  },
  caption: {
    ...theme.type.caption,
    color: color.textSecondary,
  },
  uid: {
    ...theme.type.title,
    fontWeight: '800',
    color: color.textPrimary,
  },
  value: {
    ...theme.type.headline,
    color: color.textPrimary,
  },
  info: {
    ...theme.type.body,
    color: color.textSecondary,
  },
});
