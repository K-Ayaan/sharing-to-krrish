import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CylinderIllustration from '../../components/ui/CylinderIllustration';
import IconButton from '../../components/ui/IconButton';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import ServiceHeader from '../../components/ui/ServiceHeader';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import TextField from '../../components/ui/TextField';
import { registerLpg } from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import {
  CONSUMER_NUMBER_DIGITS,
  LPG_ID_DIGITS,
  validateConsumerNumber,
  validateLpgId,
} from './lpgFormat';

const { color } = theme.lpg;
const HERO_ART_WIDTH = theme.space.xl * 4;

const digitsOnly = (text: string, max: number) => text.replace(/\D/g, '').slice(0, max);

// LPG isn't linked to a new account automatically (flow.md). LpgHome and the Services card send
// unregistered users here.
export default function LpgRegistration({ navigation }: LpgScreenProps<'LpgRegistration'>) {
  const unreadNotificationCount = useUnreadNoticeCount();
  const [lpgId, setLpgId] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [touched, setTouched] = useState({ lpgId: false, consumerNumber: false });
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const lpgIdError = validateLpgId(lpgId);
  const consumerNumberError = validateConsumerNumber(consumerNumber);
  const canSubmit = !lpgIdError && !consumerNumberError && !submitting;

  const handleRegister = async () => {
    setTouched({ lpgId: true, consumerNumber: true });
    if (!canSubmit) return;
    setSubmitting(true);
    setRegisterError(null);
    try {
      await registerLpg({ lpgId, consumerNumber });
      // Single-screen form: replace, so the finished form never stays in history (flow.md).
      navigation.replace('LpgConnectionLinked');
    } catch (failure) {
      setRegisterError(
        failure instanceof Error ? failure.message : "Couldn't link this connection. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScenicBackdrop />
      <ServiceHeader
        title={pillarMeta.lpg.label}
        icon={pillarMeta.lpg.icon}
        iconColor={pillarMeta.lpg.colors.icon}
        tint={pillarMeta.lpg.colors.tint}
        onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
        trailing={
          <IconButton
            icon="notifications-outline"
            badgeCount={unreadNotificationCount}
            accessibilityLabel="Notifications"
            tint={color.surface}
            onPress={() => navigation.navigate('NoticesTab', { screen: 'Notices', pop: true })}
          />
        }
      />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Text accessibilityRole="header" style={styles.heading}>
            Link your LPG connection
          </Text>
          <CylinderIllustration width={HERO_ART_WIDTH} />
        </View>

        <View style={styles.fields}>
          <TextField
            autoCorrect={false}
            error={registerError ?? (touched.lpgId ? lpgIdError : undefined)}
            icon="card-outline"
            keyboardType="number-pad"
            label="LPG ID"
            variant="inset"
            maxLength={LPG_ID_DIGITS.max}
            onBlur={() => setTouched((current) => ({ ...current, lpgId: true }))}
            onChangeText={(text) => {
              setLpgId(digitsOnly(text, LPG_ID_DIGITS.max));
              setRegisterError(null);
            }}
            placeholder="Enter your LPG ID"
            required
            value={lpgId}
          />
          <TextField
            autoCorrect={false}
            error={touched.consumerNumber ? consumerNumberError : undefined}
            icon="person-outline"
            keyboardType="number-pad"
            label="Consumer number"
            variant="inset"
            maxLength={CONSUMER_NUMBER_DIGITS.max}
            onBlur={() => setTouched((current) => ({ ...current, consumerNumber: true }))}
            onChangeText={(text) => {
              setConsumerNumber(digitsOnly(text, CONSUMER_NUMBER_DIGITS.max));
              setRegisterError(null);
            }}
            onSubmitEditing={handleRegister}
            placeholder="Enter your consumer number"
            required
            returnKeyType="done"
            value={consumerNumber}
          />
        </View>

        <Card tone="info" style={styles.infoRow}>
          <Avatar icon="information" iconColor={theme.color.background} tint={color.primary} />
          <Text style={[styles.secondary, styles.flex]}>
            Find these on your IOCL passbook or a past delivery receipt.
          </Text>
        </Card>

        <View style={styles.spacer} />

        <Button
          label="Link connection"
          trailingIcon="arrow-forward"
          disabled={!canSubmit}
          onPress={handleRegister}
        />
        <TabBarSpacer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  heading: {
    ...theme.type.largeTitle,
    fontWeight: '800',
    color: color.textPrimary,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.space.m,
    gap: theme.space.l,
  },
  flex: {
    flex: 1,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  fields: {
    gap: theme.space.m,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  spacer: {
    flex: 1,
  },
});
