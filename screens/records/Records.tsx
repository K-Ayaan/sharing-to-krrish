// records.png, completed against SDD S-04: everything the person has done across all five
// services, newest first, grouped by month, filterable by service.
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, FileSearch } from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import FilterChip from '../../components/ui/FilterChip';
import IconTile from '../../components/ui/IconTile';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { SkeletonList } from '../../components/ui/Skeleton';
import StatusPill from '../../components/ui/StatusPill';
import type { PillarKey } from '../../data/mock/mockUser';
import type { RecordsScreenProps } from '../../navigation/types';
import { PILLAR_ORDER } from '../../services/homeService';
import { getRecords, type RecordSummary } from '../../services/recordsService';
import { useQuery } from '../../services/useQuery';
import { getProfile } from '../../services/userService';
import theme from '../../theme';
import { formatDate, formatMonthYear } from '../../utils/format';
import { pillarMeta } from '../pillarMeta';
import { recordIcon, recordTone } from './recordFormat';

type Filter = 'all' | PillarKey;

const SHORT_LABEL: Record<PillarKey, string> = {
  vandhan: 'Van Dhan',
  livestock: 'Livestock',
  lpg: 'LPG',
  microfinance: 'Micro-Finance',
};

function groupByMonth(records: RecordSummary[]) {
  const groups: { title: string; items: RecordSummary[] }[] = [];
  for (const record of records) {
    const title = formatMonthYear(record.at);
    const last = groups[groups.length - 1];
    if (last && last.title === title) last.items.push(record);
    else groups.push({ title, items: [record] });
  }
  return groups;
}

export default function Records({ navigation }: RecordsScreenProps<'RecordsList'>) {
  const records = useQuery('records', getRecords);
  const profile = useQuery('profile', getProfile);
  const [filter, setFilter] = useState<Filter>('all');

  const groups = useMemo(() => {
    const items = (records.data ?? []).filter((r) => filter === 'all' || r.pillar === filter);
    return groupByMonth(items);
  }, [records.data, filter]);

  return (
    <Screen
      inTabs
      refreshing={records.refreshing}
      onRefresh={records.refresh}
      header={
        <ScreenHeader
          layout="hero"
          title="Records"
          landscape="green"
          right={
            profile.data ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open settings"
                onPress={() => navigation.navigate('HomeTab', { screen: 'Settings', initial: false })}
              >
                <Avatar name={profile.data.name} photoUri={profile.data.photoUri} size={40} />
              </Pressable>
            ) : null
          }
        />
      }
      contentStyle={styles.content}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroller}
        accessibilityRole="radiogroup"
      >
        <FilterChip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
        {PILLAR_ORDER.map((pillar) => (
          <FilterChip
            key={pillar}
            label={SHORT_LABEL[pillar]}
            icon={pillarMeta[pillar].icon}
            selected={filter === pillar}
            onPress={() => setFilter(pillar)}
          />
        ))}
      </ScrollView>

      <AsyncContent
        query={records}
        what="your records"
        skeleton={<SkeletonList count={6} thumb={48} />}
        isEmpty={() => groups.length === 0}
        empty={
          <EmptyState
            icon={FileSearch}
            title={filter === 'all' ? 'No records yet' : `No ${pillarMeta[filter].label} records yet`}
            body="Anything you submit, book or apply for — in the app, on WhatsApp or by phone — shows up here."
          />
        }
      >
        {() => (
          <View style={styles.groups}>
            {groups.map((group) => (
              <View key={group.title} style={styles.group}>
                <Text accessibilityRole="header" style={styles.month}>
                  {group.title}
                </Text>
                {group.items.map((record) => (
                  <ListRow
                    key={record.id}
                    card
                    title={record.title}
                    subtitle={record.subtitle}
                    leading={<IconTile icon={recordIcon(record)} size="medium" bg={theme.color.surfaceMuted} color={theme.color.textPrimary} />}
                    meta={
                      <View style={styles.dateRow}>
                        <CalendarDays size={13} color={theme.color.textSecondary} strokeWidth={2} />
                        <Text style={styles.date}>{formatDate(record.at)}</Text>
                      </View>
                    }
                    trailing={<StatusPill tone={recordTone(record)} label={record.statusLabel} size="small" />}
                    onPress={() => navigation.navigate('RecordDetail', { recordId: record.id })}
                    accessibilityLabel={`${record.title}, ${record.subtitle}, ${formatDate(record.at)}, ${record.statusLabel}`}
                  />
                ))}
              </View>
            ))}
          </View>
        )}
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.m,
  },
  // flexGrow 0 keeps the horizontal scroller one chip tall; the row direction is explicit.
  chipScroller: {
    flexGrow: 0,
    marginHorizontal: -theme.size.screenPadding,
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
    paddingHorizontal: theme.size.screenPadding,
  },
  groups: {
    gap: theme.space.l,
  },
  group: {
    gap: theme.space.s + 2,
  },
  month: {
    ...theme.type.body,
    fontSize: 15,
    fontWeight: '500',
    color: theme.color.textSecondary,
    marginTop: theme.space.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  date: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
});
