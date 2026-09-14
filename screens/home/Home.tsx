import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import IconButton from '../../components/ui/IconButton';
import QuickActionTile from '../../components/ui/QuickActionTile';
import RunningBanner from '../../components/ui/RunningBanner';
import StatusPill from '../../components/ui/StatusPill';
import TextField from '../../components/ui/TextField';
import { mockHomeData } from '../../data/mock/mockHomeData';
import { getLpgSummary, type LpgSummary } from '../../data/mock/mockLpg';
import { initialsOf } from '../../data/mock/mockUser';
import { useResetOnboarding } from '../../navigation/OnboardingContext';
import type { HomeScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatDate } from '../formatDate';
import { bookingLockLabel, formatDateRange, requestStageMeta } from '../lpg/lpgFormat';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';

const MORNING_ENDS_AT = 12;
const AFTERNOON_ENDS_AT = 17;

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < MORNING_ENDS_AT) return 'Good morning';
  if (hour < AFTERNOON_ENDS_AT) return 'Good afternoon';
  return 'Good evening';
}

type LpgCardCopy = {
  urgent: boolean;
  label: string;
  meta: string;
  title: string;
  body: string;
};

// Every value comes from getLpgSummary() — the same source LpgHome renders.
function describeLpg(summary: LpgSummary): LpgCardCopy {
  if (summary.activeRequest) {
    const { stage, expectedDelivery } = summary.activeRequest;
    return {
      urgent: false,
      label: 'In Progress',
      meta: `LPG · ${requestStageMeta[stage].label}`,
      title: 'Your LPG refill is on its way',
      body: `Expected delivery ${formatDateRange(expectedDelivery.from, expectedDelivery.to)}.`,
    };
  }
  if (summary.canBook) {
    return {
      urgent: true,
      label: 'Action Required',
      meta: 'LPG · Booking open',
      title: 'Your LPG refill is due',
      body: 'Book your refill now to avoid service disruption.',
    };
  }
  return {
    urgent: false,
    label: 'Up to date',
    meta: `LPG · Next booking ${formatDate(summary.nextEligibleAt)}`,
    title: bookingLockLabel(summary.daysUntilEligible),
    body: 'Your last refill has been delivered.',
  };
}

export default function Home({ navigation }: HomeScreenProps<'Home'>) {
  const { user, tagline, announcement } = mockHomeData;
  const unreadNotificationCount = useUnreadNoticeCount();
  const [query, setQuery] = useState('');
  const resetOnboarding = useResetOnboarding();

  // Re-render on focus so a booking made in LPG is reflected when the user comes back.
  useIsFocused();
  const lpg = getLpgSummary();
  const lpgCard = describeLpg(lpg);

  // ---------------------------------------------------------------------------
  // TEMPORARY — TESTING ONLY. NOT PRODUCT BEHAVIOUR.
  // Long-pressing the UID chip (dev builds only, gated on __DEV__) wipes the stored
  // UID and drops back to Onboarding:PhoneEntry so the flow can be re-tested.
  // Delete this, and the long-press on the chip below, once a Settings/profile
  // screen exists and provides a real sign-out.
  // ---------------------------------------------------------------------------
  const confirmDevReset = () =>
    Alert.alert('Reset onboarding?', 'This is for testing only.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => void resetOnboarding() },
    ]);

  // Cross-tab jumps pass `pop: true` at every nested level. In React Navigation 7,
  // navigate only reuses a screen that is currently on top; without `pop` it pushes a
  // duplicate when the target sits lower in a stack the user left mid-flow (flow.md).
  const openNotices = () => navigation.navigate('NoticesTab', { screen: 'Notices', pop: true });

  const openAnnouncement = () =>
    navigation.navigate('NoticesTab', {
      screen: 'NoticeDetail',
      initial: false,
      pop: true,
      params: { noticeId: announcement.id },
    });

  const openRecords = () => navigation.navigate('RecordsTab', { screen: 'Records', pop: true });

  const openServices = () => navigation.navigate('ServicesTab', { screen: 'Services', pop: true });

  const viewRefillDetails = () =>
    navigation.navigate('ServicesTab', {
      screen: 'LpgStack',
      initial: false,
      pop: true,
      params: { screen: 'RequestStatus', initial: false, pop: true },
    });

  const bookRefill = () =>
    navigation.navigate('ServicesTab', {
      screen: 'LpgStack',
      initial: false,
      pop: true,
      params: { screen: 'LpgHome', params: { openRefillSheet: true }, pop: true },
    });

  const accent = lpgCard.urgent ? theme.color.danger : theme.color.primary;

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* TEMPORARY: onLongPress is the dev-only onboarding reset — see confirmDevReset. */}
        <Pressable onLongPress={__DEV__ ? confirmDevReset : undefined}>
          <Card style={styles.profileBar}>
            <Avatar initials={initialsOf(user.fullName)} />
            <Text numberOfLines={1} style={styles.uid}>
              <Text style={styles.uidLabel}>{'UID  '}</Text>
              {user.uid}
            </Text>
            <IconButton
              icon="notifications-outline"
              badgeCount={unreadNotificationCount}
              accessibilityLabel="Notifications"
              onPress={openNotices}
            />
          </Card>
        </Pressable>

        <View style={styles.greeting}>
          <Text accessibilityRole="header" style={styles.title}>
            {greetingFor(new Date())}
          </Text>
          <Text style={styles.tagline}>{tagline}</Text>
        </View>

        <TextField
          accessibilityLabel="Search"
          icon="search"
          onChangeText={setQuery}
          placeholder="Search across Van Dhan, Livestock, LPG, Notices…"
          returnKeyType="search"
          trailing={
            <Ionicons name="mic-outline" size={theme.type.title.fontSize} color={theme.color.textSecondary} />
          }
          value={query}
          variant="search"
        />

        <View style={styles.quickActions}>
          <QuickActionTile
            icon={pillarMeta.vandhan.icon}
            label={pillarMeta.vandhan.label}
            iconColor={pillarMeta.vandhan.colors.icon}
            tint={pillarMeta.vandhan.colors.tint}
            onPress={() =>
              navigation.navigate('ServicesTab', {
                screen: 'VanDhanStack',
                initial: false,
                pop: true,
                params: { screen: 'VanDhanHome', pop: true },
              })
            }
          />
          <QuickActionTile
            icon={pillarMeta.livestock.icon}
            label={pillarMeta.livestock.label}
            iconColor={pillarMeta.livestock.colors.icon}
            tint={pillarMeta.livestock.colors.tint}
            onPress={() =>
              navigation.navigate('ServicesTab', {
                screen: 'LivestockStack',
                initial: false,
                pop: true,
                params: { screen: 'LivestockHome', pop: true },
              })
            }
          />
          <QuickActionTile
            icon={pillarMeta.lpg.icon}
            label={pillarMeta.lpg.label}
            iconColor={pillarMeta.lpg.colors.icon}
            tint={pillarMeta.lpg.colors.tint}
            onPress={() =>
              navigation.navigate('ServicesTab', {
                screen: 'LpgStack',
                initial: false,
                pop: true,
                params: { screen: 'LpgHome', pop: true },
              })
            }
          />
          <QuickActionTile
            icon="document-text"
            label="Notices"
            iconColor={theme.pillarTint.notices.icon}
            tint={theme.pillarTint.notices.tint}
            onPress={openNotices}
          />
          <QuickActionTile
            icon="folder"
            label="My Records"
            iconColor={theme.color.primary}
            tint={theme.color.primaryTint}
            onPress={openRecords}
          />
        </View>

        <RunningBanner
          icon="megaphone"
          text={`${announcement.category}: ${announcement.title}`}
          onPress={openAnnouncement}
          style={styles.fullBleed}
        />

        <Card style={styles.row}>
          <Avatar icon="people" size="l" />
          <View style={styles.flex}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Registered as</Text>
              <Button label="Manage" variant="text" trailingIcon="chevron-forward" onPress={openServices} />
            </View>
            <View style={styles.chips}>
              {user.registeredRoles.map((role) => (
                <StatusPill
                  key={role.pillar}
                  label={role.label}
                  icon={pillarMeta[role.pillar].icon}
                  iconColor={pillarMeta[role.pillar].colors.icon}
                />
              ))}
            </View>
          </View>
        </Card>

        <Card tone={lpgCard.urgent ? 'danger' : 'info'}>
          <View style={styles.row}>
            <Avatar icon={pillarMeta.lpg.icon} iconColor={accent} tint={theme.color.surface} size="l" />
            <View style={styles.flex}>
              <View style={styles.cardHeader}>
                <Text style={[styles.severity, { color: accent }]}>{lpgCard.label}</Text>
                <Text style={styles.meta}>{lpgCard.meta}</Text>
              </View>
              <Text style={styles.cardTitle}>{lpgCard.title}</Text>
              <Text style={styles.body}>{lpgCard.body}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <Button
              label="View Details"
              variant="secondary"
              onPress={viewRefillDetails}
              style={styles.flex}
            />
            <Button
              label="Book Refill"
              icon={pillarMeta.lpg.icon}
              disabled={!lpg.canBook}
              onPress={bookRefill}
              style={styles.flex}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  profileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    paddingVertical: theme.space.s,
  },
  uid: {
    ...theme.type.body,
    color: theme.color.textPrimary,
    flex: 1,
  },
  uidLabel: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  greeting: {
    gap: theme.space.xs,
  },
  title: {
    ...theme.type.largeTitle,
    color: theme.color.textPrimary,
  },
  tagline: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
  fullBleed: {
    marginHorizontal: -theme.space.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.m,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.s,
  },
  cardTitle: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.s,
    marginTop: theme.space.s,
  },
  severity: {
    ...theme.type.caption,
    fontWeight: '600',
  },
  meta: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  body: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    marginTop: theme.space.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.space.s,
    marginTop: theme.space.m,
  },
});
