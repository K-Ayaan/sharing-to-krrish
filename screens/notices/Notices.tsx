import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import FilterChip from '../../components/ui/FilterChip';
import ListRow from '../../components/ui/ListRow';
import {
  getLastFetchedAt,
  getNotices,
  refreshNotices,
  type NoticePillar,
} from '../../data/mock/mockNotices';
import { initialsOf, mockUser } from '../../data/mock/mockUser';
import type { NoticesScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatTime } from '../formatDate';
import { groupNoticesByDay, lastUpdatedLabel, noticePillarMeta } from './noticeFormat';

type NoticeFilter = 'all' | Exclude<NoticePillar, 'general'>;

// No Micro-Finance chip, even though Notices.png shows one — intentional (flow.md, CLAUDE.md).
const FILTERS: NoticeFilter[] = ['all', 'vandhan', 'livestock', 'lpg'];

export default function Notices({ navigation }: NoticesScreenProps<'Notices'>) {
  const [filter, setFilter] = useState<NoticeFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [fetchedAt, setFetchedAt] = useState(getLastFetchedAt);

  // Re-render on focus so a notice opened in NoticeDetail shows as read on return.
  useIsFocused();
  const notices = getNotices();
  const visible = filter === 'all' ? notices : notices.filter((notice) => notice.pillar === filter);
  const groups = groupNoticesByDay(visible);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await refreshNotices();
      setFetchedAt(result.fetchedAt);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.color.primary}
          />
        }
      >
        <View style={styles.header}>
          <Avatar initials={initialsOf(mockUser.fullName)} />
          <Text numberOfLines={1} style={styles.uid}>
            <Text style={styles.uidLabel}>{'UID  '}</Text>
            {mockUser.uid}
          </Text>
        </View>

        <View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>
            Notices
          </Text>
          <Text style={styles.secondary}>Updates that matter to you</Text>
        </View>

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
                label={noticePillarMeta[id].label}
                icon={noticePillarMeta[id].icon}
                iconColor={noticePillarMeta[id].colors.icon}
                selected={filter === id}
                onPress={() => setFilter(id)}
              />
            )
          )}
        </ScrollView>

        <Text style={styles.lastUpdated}>{lastUpdatedLabel(fetchedAt)} · Pull down to refresh</Text>

        {groups.length === 0 ? (
          <Card>
            <Text style={[styles.secondary, styles.centered]}>No notices here yet.</Text>
          </Card>
        ) : (
          groups.map((group) => (
            <View key={group.key} style={styles.group}>
              <Text accessibilityRole="header" style={styles.groupLabel}>
                {group.label}
              </Text>
              {group.notices.map((notice) => {
                const meta = noticePillarMeta[notice.pillar];
                return (
                  <Card key={notice.id} padded={false}>
                    <ListRow
                      icon={meta.icon}
                      iconColor={meta.colors.icon}
                      iconBackground={meta.colors.tint}
                      title={notice.title}
                      subtitle={notice.summary}
                      titleAccessory={<Text style={styles.time}>{formatTime(notice.publishedAt)}</Text>}
                      // Unread rows get ListRow's dot + "Unread" announcement; read rows show nothing.
                      unread={!notice.read}
                      trailing={notice.read ? <></> : undefined}
                      onPress={() => navigation.navigate('NoticeDetail', { noticeId: notice.id })}
                    />
                  </Card>
                );
              })}
            </View>
          ))
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
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
  heading: {
    gap: theme.space.xs,
  },
  title: {
    ...theme.type.largeTitle,
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
  lastUpdated: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    textAlign: 'center',
  },
  group: {
    gap: theme.space.s,
  },
  groupLabel: {
    ...theme.type.body,
    fontWeight: '600',
    color: theme.color.textSecondary,
  },
  time: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
});
