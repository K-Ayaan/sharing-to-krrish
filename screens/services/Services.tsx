import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/ui/Card';
import FilterChip from '../../components/ui/FilterChip';
import IconButton from '../../components/ui/IconButton';
import ProfileChip from '../../components/ui/ProfileChip';
import ListRow from '../../components/ui/ListRow';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import StatusPill, { type StatusTone } from '../../components/ui/StatusPill';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import { isLpgRegistered } from '../../data/mock/mockLpg';
import {
  mockServicesData,
  type PillarStatus,
  type PillarSummary,
} from '../../data/mock/mockServicesData';
import type { Pillar } from '../../data/mock/mockUser';
import { isVanDhanRegistered } from '../../data/mock/mockVanDhan';
import type { ServicesScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import { useUserProfile } from '../useUserProfile';

const GET_STARTED = { label: 'Get started', tone: 'neutral' as const };

type RegistrationFilter = 'all' | 'registered' | 'unregistered';

const FILTERS: { id: RegistrationFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'registered', label: 'Registered' },
  { id: 'unregistered', label: 'Not registered' },
];

const EMPTY_MESSAGE: Record<Exclude<RegistrationFilter, 'all'>, string> = {
  registered: "You haven't registered for any services yet.",
  unregistered: "You're registered for every service.",
};

function describeStatus(status: PillarStatus): { label: string; tone: StatusTone } {
  switch (status.type) {
    case 'rates_updated': {
      const today = new Date(status.updatedAt).toDateString() === new Date().toDateString();
      return { label: today ? 'Rate updated today' : 'Rates updated', tone: 'success' };
    }
    case 'stock_available':
      return { label: `${status.count} available`, tone: 'info' };
    case 'not_started':
      return GET_STARTED;
  }
}

export default function Services({ navigation }: ServicesScreenProps<'Services'>) {
  const { pillars } = mockServicesData;
  const profile = useUserProfile();
  // Settings lives in the Home tab; opening it from here switches tabs, with Home beneath it.
  const openSettings = () => navigation.navigate('HomeTab', { screen: 'Settings', initial: false });
  const unreadNotificationCount = useUnreadNoticeCount();
  const [filter, setFilter] = useState<RegistrationFilter>('all');

  // Re-render on focus so the cards reflect a registration completed inside a pillar.
  useIsFocused();
  const vanDhanRegistered = isVanDhanRegistered();
  const lpgRegistered = isLpgRegistered();

  const statusFor = (summary: PillarSummary) => {
    if (summary.pillar === 'vandhan' && !vanDhanRegistered) return GET_STARTED;
    if (summary.pillar === 'lpg' && lpgRegistered) return { label: 'Linked', tone: 'success' as const };
    return describeStatus(summary.status);
  };

  // Livestock never needs registration (buyer-only, ungated), so it always counts as registered.
  const isRegistered = (pillar: Pillar) =>
    pillar === 'vandhan' ? vanDhanRegistered : pillar === 'lpg' ? lpgRegistered : true;

  const visiblePillars = pillars.filter(
    (summary) => filter === 'all' || isRegistered(summary.pillar) === (filter === 'registered')
  );

  // Registration gate: Van Dhan and LPG open their registration screen until the pillar's own
  // isRegistered flag is set; registered users go straight to the pillar home. Livestock is ungated.
  const openPillar = (pillar: Pillar) => {
    if (pillar === 'vandhan') navigation.navigate('VanDhanStack', { screen: vanDhanRegistered ? 'VanDhanHome' : 'VanDhanRegistration' });
    else if (pillar === 'livestock') navigation.navigate('LivestockStack', { screen: 'LivestockHome' });
    else navigation.navigate('LpgStack', { screen: lpgRegistered ? 'LpgHome' : 'LpgRegistration' });
  };

  // Cross-tab jumps pass `pop: true` so they never stack a duplicate (flow.md).
  const openNotices = () => navigation.navigate('NoticesTab', { screen: 'Notices', pop: true });

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScenicBackdrop />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ProfileChip fullName={profile.fullName} uid={profile.uid} layout="stacked" onPress={openSettings} />
          <IconButton
            icon="notifications-outline"
            badgeCount={unreadNotificationCount}
            accessibilityLabel="Notifications"
            tint={theme.color.surface}
            onPress={openNotices}
          />
        </View>

        {/* No subtitle and no announcement banner: updates live only in Notices. */}
        <Text accessibilityRole="header" style={styles.title}>
          Services
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.fullBleed}
          contentContainerStyle={styles.chips}
        >
          {FILTERS.map(({ id, label }) => (
            <FilterChip key={id} label={label} selected={filter === id} onPress={() => setFilter(id)} />
          ))}
        </ScrollView>

        {filter !== 'all' && visiblePillars.length === 0 ? (
          <Card>
            <Text style={styles.subtitle}>{EMPTY_MESSAGE[filter]}</Text>
          </Card>
        ) : null}

        {visiblePillars.map((summary) => {
          const meta = pillarMeta[summary.pillar];
          const status = statusFor(summary);

          return (
            <Card key={summary.pillar} padded={false} elevated>
              <ListRow
                size="large"
                icon={meta.icon}
                iconColor={meta.colors.icon}
                iconBackground={meta.colors.tint}
                title={summary.title}
                subtitle={summary.description}
                titleAccessory={<StatusPill label={status.label} tone={status.tone} />}
                onPress={() => openPillar(summary.pillar)}
              />
            </Card>
          );
        })}
        <TabBarSpacer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.color.backgroundWarm,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.m,
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
  subtitle: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  fullBleed: {
    marginHorizontal: -theme.space.m,
  },
  chips: {
    gap: theme.space.s,
    paddingHorizontal: theme.space.m,
  },
});
