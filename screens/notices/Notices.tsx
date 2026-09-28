import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import FilterChip from '../../components/ui/FilterChip';
import IconButton from '../../components/ui/IconButton';
import ProfileChip from '../../components/ui/ProfileChip';
import ListRow from '../../components/ui/ListRow';
import SoftBackdrop from '../../components/ui/SoftBackdrop';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import {
  getLastFetchedAt,
  getNotices,
  refreshNotices,
  type NoticePillar,
} from '../../data/mock/mockNotices';
import type { NoticesScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatTime } from '../formatDate';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import { useUserProfile } from '../useUserProfile';
import { groupNoticesByDay, lastUpdatedLabel, noticePillarMeta } from './noticeFormat';

type NoticeFilter = 'all' | Exclude<NoticePillar, 'general'>;

// No Micro-Finance chip, even though Notices.png shows one — intentional (flow.md, CLAUDE.md).
const FILTERS: NoticeFilter[] = ['all', 'vandhan', 'livestock', 'lpg'];

export default function Notices({ navigation }: NoticesScreenProps<'Notices'>) {
  const [filter, setFilter] = useState<NoticeFilter>('all');
  // The header bell (redesign) toggles "Unread only" here, on top of the pillar filter — every other
  // screen's bell leads to this list, so on this screen it filters instead.
  const [unreadOnly, setUnreadOnly] = useState(false);
  const unreadCount = useUnreadNoticeCount();
  const [refreshing, setRefreshing] = useState(false);
  const [fetchedAt, setFetchedAt] = useState(getLastFetchedAt);
  const profile = useUserProfile();
  // Settings lives in the Home tab; opening it from here switches tabs, with Home beneath it.
  const openSettings = () => navigation.navigate('HomeTab', { screen: 'Settings', initial: false });

  // Re-render on focus so a notice opened in NoticeDetail shows as read on return.
  useIsFocused();
  const notices = getNotices();
  const visible = notices.filter(
    (notice) => (filter === 'all' || notice.pillar === filter) && (!unreadOnly || !notice.read)
  );
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
      <SoftBackdrop />
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
          <ProfileChip fullName={profile.fullName} uid={profile.uid} onPress={openSettings} />
          <IconButton
            icon={unreadOnly ? 'notifications' : 'notifications-outline'}
            color={unreadOnly ? theme.color.primary : theme.color.textPrimary}
            badgeCount={unreadCount}
            selected={unreadOnly}
            accessibilityLabel="Show unread notices only"
            onPress={() => setUnreadOnly((current) => !current)}
          />
        </View>

        <Text accessibilityRole="header" style={styles.title}>
          Notices
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
                label={noticePillarMeta[id].label}
                icon={noticePillarMeta[id].icon}
                iconColor={noticePillarMeta[id].colors.icon}
                selected={filter === id}
                onPress={() => setFilter(id)}
              />
            )
          )}
        </ScrollView>

        <View style={styles.lastUpdatedRow}>
          <Avatar icon="refresh" iconColor={theme.color.textPrimary} />
          <Text style={styles.lastUpdated}>{lastUpdatedLabel(fetchedAt)} · Pull down to refresh</Text>
        </View>

        {groups.length === 0 ? (
          <Card>
            <Text style={[styles.secondary, styles.centered]}>
              {unreadOnly ? "You're all caught up — no unread notices." : 'No notices here yet.'}
            </Text>
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
                  <Card key={notice.id} padded={false} elevated>
                    <ListRow
                      icon={meta.icon}
                      iconColor={meta.colors.icon}
                      iconBackground={meta.colors.tint}
                      title={notice.title}
                      subtitle={notice.summary}
                      // Time top-right, the unread dot beneath it (and "Unread" for VoiceOver), then a chevron.
                      timestamp={formatTime(notice.publishedAt)}
                      unread={!notice.read}
                      onPress={() => navigation.navigate('NoticeDetail', { noticeId: notice.id })}
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
  lastUpdatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.s,
  },
  lastUpdated: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
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
