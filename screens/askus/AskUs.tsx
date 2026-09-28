import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import type { AppIconName } from '../../components/ui/AppIcon';
import ExpandableRow from '../../components/ui/ExpandableRow';
import GlassCard from '../../components/ui/GlassCard';
import IconButton from '../../components/ui/IconButton';
import ProfileChip from '../../components/ui/ProfileChip';
import SoftBackdrop from '../../components/ui/SoftBackdrop';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import Toast from '../../components/ui/Toast';
import { mockAskUs } from '../../data/mock/mockAskUs';
import type { AskUsScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { CALL_UNAVAILABLE, openPhone } from '../contact';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import { useUserProfile } from '../useUserProfile';

// Icon tile per question (AskUs.png). Colours come from existing tokens; unknown ids fall back to
// a neutral help icon.
const FAQ_ICONS: Record<string, { icon: AppIconName; color: string; tint: string }> = {
  register: { icon: 'document-text-outline', color: theme.color.success, tint: theme.color.successTint },
  aadhaar: { icon: 'id-card-outline', color: theme.color.warning, tint: theme.color.warningTint },
  multiple: {
    icon: 'grid-outline',
    color: theme.pillarTint.notices.icon,
    tint: theme.pillarTint.notices.tint,
  },
  'new-phone': { icon: 'call', color: theme.color.primary, tint: theme.color.primaryTint },
  profile: { icon: 'create-outline', color: theme.color.danger, tint: theme.color.dangerTint },
  updates: { icon: 'megaphone-outline', color: theme.color.success, tint: theme.color.successTint },
};

const FALLBACK_FAQ_ICON = {
  icon: 'help-circle-outline' as const,
  color: theme.color.textSecondary,
  tint: theme.color.surfaceMuted,
};

// Kept deliberately light: one way to reach a person, then the common questions.
// The call hands off to the Phone app — never an in-app call (CLAUDE.md).
export default function AskUs({ navigation }: AskUsScreenProps<'AskUs'>) {
  const { supportPhone, supportHours, faqs } = mockAskUs;
  const profile = useUserProfile();
  // Settings lives in the Home tab; opening it from here switches tabs, with Home beneath it.
  const openSettings = () => navigation.navigate('HomeTab', { screen: 'Settings', initial: false });
  const unreadNotificationCount = useUnreadNoticeCount();
  const [openId, setOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const callSupport = async () => {
    if (!(await openPhone(supportPhone))) setToast(CALL_UNAVAILABLE);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <SoftBackdrop />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ProfileChip fullName={profile.fullName} uid={profile.uid} onPress={openSettings} />
          <IconButton
            icon="notifications-outline"
            badgeCount={unreadNotificationCount}
            accessibilityLabel="Notifications"
            onPress={() => navigation.navigate('NoticesTab', { screen: 'Notices', pop: true })}
          />
        </View>

        <Text accessibilityRole="header" style={styles.title}>
          Ask Us
        </Text>

        <GlassCard>
          <View style={styles.support}>
            <View style={styles.row}>
              <Avatar icon="headset" size="l" tint={theme.color.surface} />
              <View style={styles.flex}>
                <Text style={styles.cardTitle}>Talk to us</Text>
                <Text style={styles.secondary}>
                  Our support team can help with registration, services or your account.
                </Text>
              </View>
            </View>
            <Button label="Call Support" icon="call" trailingIcon="chevron-forward" onPress={callSupport} />
            <View style={styles.hours}>
              <Ionicons
                name="time-outline"
                size={theme.type.body.fontSize}
                color={theme.color.textSecondary}
              />
              <Text style={styles.caption}>{supportHours}</Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              Common questions
            </Text>
            <Text style={styles.secondary}>Find quick answers to the most common questions.</Text>
          </View>
          {faqs.map((faq) => {
            const art = FAQ_ICONS[faq.id] ?? FALLBACK_FAQ_ICON;
            return (
              <Card key={faq.id} padded={false} elevated>
                <ExpandableRow
                  icon={art.icon}
                  iconColor={art.color}
                  iconBackground={art.tint}
                  title={faq.question}
                  subtitle={faq.summary}
                  body={faq.answer}
                  expanded={openId === faq.id}
                  onToggle={() => setOpenId((current) => (current === faq.id ? null : faq.id))}
                />
              </Card>
            );
          })}
        </View>
        <TabBarSpacer />
      </ScrollView>
      <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.color.backgroundCool,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  title: {
    ...theme.type.display,
    color: theme.color.textPrimary,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  support: {
    gap: theme.space.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  cardTitle: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  hours: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.xs,
  },
  caption: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  section: {
    gap: theme.space.s + theme.space.xs,
  },
  sectionHeading: {
    gap: theme.space.xs,
  },
  sectionTitle: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
});
