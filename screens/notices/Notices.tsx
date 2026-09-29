// notices-page.png, completed against SDD S-03: announcements, alerts and scheme news across every
// service, newest first, with read state. The date sits on the title line so each card stays
// compact.
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BellOff, ChevronRight } from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import FilterChip from '../../components/ui/FilterChip';
import IconTile from '../../components/ui/IconTile';
import { UnreadDot } from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { SkeletonList } from '../../components/ui/Skeleton';
import type { NoticeCategory } from '../../data/mock/mockNotices';
import type { NoticesScreenProps } from '../../navigation/types';
import { getNotices } from '../../services/noticesService';
import { useQuery } from '../../services/useQuery';
import { getProfile } from '../../services/userService';
import theme from '../../theme';
import { formatDayMonth } from '../../utils/format';
import { NOTICE_FILTERS, noticeLook } from './noticeFormat';

export default function Notices({ navigation }: NoticesScreenProps<'NoticesList'>) {
  const notices = useQuery('notices', getNotices);
  const profile = useQuery('profile', getProfile);
  const [filter, setFilter] = useState<NoticeCategory | 'all'>('all');
  const visible = (notices.data ?? []).filter((n) => filter === 'all' || n.category === filter);

  return (
    <Screen
      inTabs
      refreshing={notices.refreshing}
      onRefresh={notices.refresh}
      header={
        <ScreenHeader
          layout="hero"
          title="Notices"
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
      {/* Filter by what the notice is about. Reading one marks it read, so there's no
          "mark all as read" shortcut. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroller}
        accessibilityRole="radiogroup"
      >
        <FilterChip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
        {NOTICE_FILTERS.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            icon={noticeLook[option.value].icon}
            selected={filter === option.value}
            onPress={() => setFilter(option.value)}
          />
        ))}
      </ScrollView>

      <AsyncContent
        query={notices}
        what="notices"
        skeleton={<SkeletonList count={6} thumb={42} lines={2} />}
        isEmpty={() => visible.length === 0}
        empty={
          <EmptyState icon={BellOff} title="No notices yet" body="Rate changes, schedules and alerts from MARCOFED will appear here." />
        }
      >
        {() => (
          <View style={styles.list}>
            {visible.map((notice) => {
              const look = noticeLook[notice.category];
              return (
                <Card
                  key={notice.id}
                  padded={false}
                  style={styles.card}
                  onPress={() => navigation.navigate('NoticeDetail', { noticeId: notice.id })}
                  accessibilityLabel={`${notice.read ? '' : 'Unread. '}${notice.title}. ${notice.summary}. ${formatDayMonth(notice.publishedAt)}`}
                >
                  <View style={styles.row}>
                    <IconTile icon={look.icon} bg={look.bg} color={look.fg} size="medium" />
                    <View style={styles.text}>
                      <View style={styles.titleRow}>
                        <Text numberOfLines={1} style={[styles.title, !notice.read && styles.titleUnread]}>
                          {notice.title}
                        </Text>
                        {!notice.read ? <UnreadDot /> : null}
                        <Text style={styles.date}>{formatDayMonth(notice.publishedAt)}</Text>
                      </View>
                      <Text numberOfLines={2} style={styles.body}>
                        {notice.summary}
                      </Text>
                    </View>
                    <ChevronRight size={18} color={theme.color.textPrimary} strokeWidth={2} />
                  </View>
                </Card>
              );
            })}
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
  list: {
    gap: theme.space.s,
  },
  card: {
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  text: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  title: {
    ...theme.type.body,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.color.textPrimary,
    flexShrink: 1,
  },
  titleUnread: {
    fontWeight: '700',
  },
  date: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    marginLeft: 'auto',
    paddingLeft: theme.space.s,
  },
  body: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
});
