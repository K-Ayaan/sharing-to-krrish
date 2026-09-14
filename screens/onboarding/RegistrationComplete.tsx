import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import IconButton from '../../components/ui/IconButton';
import Toast from '../../components/ui/Toast';
import { useCompleteOnboarding } from '../../navigation/OnboardingContext';
import { session } from '../../navigation/session';
import type { OnboardingScreenProps } from '../../navigation/types';
import theme from '../../theme';
import OnboardingLayout, { ONBOARDING_STEPS } from './OnboardingLayout';

export default function RegistrationComplete({ route }: OnboardingScreenProps<'RegistrationComplete'>) {
  const { uid } = route.params;
  const completeOnboarding = useCompleteOnboarding();
  const [toast, setToast] = useState<string | null>(null);

  // Registration is done the moment this screen exists, so persist immediately —
  // quitting here must not send the user through onboarding again.
  useEffect(() => {
    session.saveUid(uid).catch((error) => console.warn('Could not persist UID.', error));
  }, [uid]);

  const copyUid = async () => {
    await Clipboard.setStringAsync(uid);
    setToast('MARCOFED ID copied');
  };

  return (
    <OnboardingLayout
      step={ONBOARDING_STEPS}
      centered
      title="Registration complete!"
      subtitle="This is your MARCOFED ID across every service."
      hero={
        <Avatar
          icon="checkmark"
          iconColor={theme.color.success}
          tint={theme.color.successTint}
          size="xl"
        />
      }
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
        <Avatar icon="document-text" size="l" />
        <View style={styles.uidText}>
          <Text style={styles.uidLabel}>Your MARCOFED ID (UID)</Text>
          <Text selectable style={styles.uid}>
            {uid}
          </Text>
        </View>
        <IconButton
          icon="copy-outline"
          color={theme.color.primary}
          accessibilityLabel="Copy MARCOFED ID"
          onPress={copyUid}
        />
      </Card>
      <Card tone="info" style={styles.row}>
        <Avatar icon="information" iconColor={theme.color.background} tint={theme.color.primary} />
        <Text style={styles.info}>
          Keep this ID safe. You'll need it when accessing any service, at the kendra, or when
          contacting support.
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
  uidText: {
    flex: 1,
    gap: theme.space.xs / 2,
  },
  uidLabel: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  uid: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  info: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    flex: 1,
  },
});
