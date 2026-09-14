import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import IconButton from '../../components/ui/IconButton';
import ListRow from '../../components/ui/ListRow';
import RunningBanner from '../../components/ui/RunningBanner';
import StatusPill, { type StatusTone } from '../../components/ui/StatusPill';
import { mockServicesData, type PillarStatus } from '../../data/mock/mockServicesData';
import { initialsOf, type Pillar } from '../../data/mock/mockUser';
import type { ServicesScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';

function describeStatus(status: PillarStatus): { label: string; tone: StatusTone } {
  switch (status.type) {
    case 'rates_updated': {
      const today = new Date(status.updatedAt).toDateString() === new Date().toDateString();
      return { label: today ? 'Rate updated today' : 'Rates updated', tone: 'success' };
    }
    case 'stock_available':
      return { label: `${status.count} available`, tone: 'info' };
    case 'not_started':
      return { label: 'Get started', tone: 'neutral' };
  }
}

export default function Services({ navigation }: ServicesScreenProps<'Services'>) {
  const { user, announcement, pillars } = mockServicesData;
  const unreadNotificationCount = useUnreadNoticeCount();

  const openPillar = (pillar: Pillar) => {
    if (pillar === 'vandhan') navigation.navigate('VanDhanStack', { screen: 'VanDhanHome' });
    else if (pillar === 'livestock') navigation.navigate('LivestockStack', { screen: 'LivestockHome' });
    else navigation.navigate('LpgStack', { screen: 'LpgHome' });
  };

  // Cross-tab jumps pass `pop: true` so they never stack a duplicate (flow.md).
  const openNotices = () => navigation.navigate('NoticesTab', { screen: 'Notices', pop: true });

  const openAnnouncement = () =>
    navigation.navigate('NoticesTab', {
      screen: 'NoticeDetail',
      initial: false,
      pop: true,
      params: { noticeId: announcement.id },
    });

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar initials={initialsOf(user.fullName)} size="l" />
          <View style={styles.flex}>
            <Text style={styles.uidLabel}>UID</Text>
            <Text numberOfLines={1} style={styles.uid}>
              {user.uid}
            </Text>
          </View>
          <IconButton
            icon="notifications-outline"
            badgeCount={unreadNotificationCount}
            accessibilityLabel="Notifications"
            onPress={openNotices}
          />
        </View>

        <View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>
            Services
          </Text>
          <Text style={styles.subtitle}>Choose a MARCOFED service to continue.</Text>
        </View>

        <RunningBanner
          tone="info"
          icon="megaphone"
          text={announcement.text}
          onPress={openAnnouncement}
          style={styles.fullBleed}
        />

        {pillars.map((summary) => {
          const meta = pillarMeta[summary.pillar];
          const status = describeStatus(summary.status);

          return (
            <Card key={summary.pillar} padded={false}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  uidLabel: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  uid: {
    ...theme.type.headline,
    fontWeight: '400',
    color: theme.color.textPrimary,
  },
  heading: {
    gap: theme.space.xs,
  },
  title: {
    ...theme.type.largeTitle,
    color: theme.color.textPrimary,
  },
  subtitle: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  fullBleed: {
    marginHorizontal: -theme.space.m,
  },
});
