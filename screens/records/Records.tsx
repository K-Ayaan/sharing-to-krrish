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
import StatusPill from '../../components/ui/StatusPill';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import type { Pillar } from '../../data/mock/mockUser';
import type { RecordsScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { groupByDay } from '../dayGroups';
import { formatTime } from '../formatDate';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import { useUserProfile } from '../useUserProfile';
import { getRecords, summarize } from './recordSource';

type RecordFilter = 'all' | Pillar;

// No Micro-Finance chip, even though Records.png shows one — intentional (flow.md, CLAUDE.md).
const FILTERS: RecordFilter[] = ['all', 'vandhan', 'livestock', 'lpg'];

const EMPTY_MESSAGES: Record<RecordFilter, string> = {
  all: 'No records yet. Collections, pickups, refills and complaints will appear here.',
  vandhan: 'No Van Dhan records yet.',
  // Livestock records are the enquiries started from StockDetails (flow.md).
  livestock: 'No Livestock enquiries yet. Calls and WhatsApp messages you start from a stock listing appear here.',
  lpg: 'No LPG records yet.',
};

export default function Records({ navigation }: RecordsScreenProps<'Records'>) {
  const [filter, setFilter] = useState<RecordFilter>('all');
  const unreadNotificationCount = useUnreadNoticeCount();
  const profile = useUserProfile();
  // Settings lives in the Home tab; opening it from here switches tabs, with Home beneath it.
  const openSettings = () => navigation.navigate('HomeTab', { screen: 'Settings', initial: false });

  // Re-derive on focus so records created elsewhere (a logged collection, an LPG booking)
  // are here when the user switches back to this tab.
  useIsFocused();
  const summaries = getRecords().map(summarize);
  const visible = filter === 'all' ? summaries : summaries.filter((summary) => summary.pillar === filter);
  const groups = groupByDay(visible, (summary) => summary.occurredAt);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScenicBackdrop tone="blue" />
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
          My Records
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.fullBleed}
          contentContainerStyle={styles.chips}
        >
          {FILTERS.map((id) =>
            id === 'all' ? (
              <FilterChip key={id} label="All" selected={filter === id} onPress={() => setFilter(id)} />
            ) : (
              <FilterChip
                key={id}
                label={pillarMeta[id].label}
                icon={pillarMeta[id].icon}
                iconColor={pillarMeta[id].colors.icon}
                selected={filter === id}
                onPress={() => setFilter(id)}
              />
            )
          )}
        </ScrollView>

        {groups.length === 0 ? (
          <Card>
            <Text style={[styles.secondary, styles.centered]}>{EMPTY_MESSAGES[filter]}</Text>
          </Card>
        ) : (
          groups.map((group) => (
            <View key={group.key} style={styles.group}>
              <Text accessibilityRole="header" style={styles.groupLabel}>
                {group.label}
              </Text>
              {group.items.map((summary) => {
                const meta = pillarMeta[summary.pillar];
                return (
                  <Card key={summary.recordId} padded={false} elevated>
                    <ListRow
                      icon={meta.icon}
                      iconColor={meta.colors.icon}
                      iconBackground={meta.colors.tint}
                      title={summary.title}
                      subtitle={`${meta.label} · ${summary.subtitle} · ${formatTime(summary.occurredAt)}`}
                      titleAccessory={
                        <StatusPill label={summary.status.label} tone={summary.status.tone} />
                      }
                      onPress={() => navigation.navigate('RecordDetail', { recordId: summary.recordId })}
                    />
                  </Card>
                );
              })}
            </View>
          ))
        )}
        <TabBarSpacer />
      </ScrollView>
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
  centered: {
    textAlign: 'center',
  },
  fullBleed: {
    marginHorizontal: -theme.space.m,
  },
  chips: {
    gap: theme.space.s,
    paddingHorizontal: theme.space.m,
  },
  group: {
    gap: theme.space.s,
  },
  groupLabel: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    fontWeight: '500',
    color: theme.color.textSecondary,
  },
});
