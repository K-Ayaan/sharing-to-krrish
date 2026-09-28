import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import IconButton from '../../components/ui/IconButton';
import ListRow from '../../components/ui/ListRow';
import QuickActionTile from '../../components/ui/QuickActionTile';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import StatusPill from '../../components/ui/StatusPill';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import TextField from '../../components/ui/TextField';
import { isLpgRegistered } from '../../data/mock/mockLpg';
import { initialsOf } from '../../data/mock/mockUser';
import { getVanDhanRegistration } from '../../data/mock/mockVanDhan';
import type { HomeScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatDate } from '../formatDate';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import { useUserProfile } from '../useUserProfile';
import { getRecentActivity, type Activity } from './recentActivity';

const MORNING_ENDS_AT = 12;
const AFTERNOON_ENDS_AT = 17;
const MIN_TOUCH_TARGET = theme.space.xl + theme.space.xs;

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < MORNING_ENDS_AT) return 'Good Morning';
  if (hour < AFTERNOON_ENDS_AT) return 'Good Afternoon';
  return 'Good Evening';
}

// "Good Afternoon, Abhishek" — first name only, read from the live profile so Settings edits show.
function firstNameOf(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? '';
}

export default function Home({ navigation }: HomeScreenProps<'Home'>) {
  const profile = useUserProfile();
  const unreadNotificationCount = useUnreadNoticeCount();
  const [query, setQuery] = useState('');

  // Re-render on focus so registering or booking inside a pillar is reflected on return.
  useIsFocused();
  const lpgRegistered = isLpgRegistered();
  const vanDhan = getVanDhanRegistration();
  const activity = getRecentActivity();

  // Services aren't linked automatically: Van Dhan and LPG roles appear only once registered.
  // Everyone registered for Van Dhan is a producer.
  const registeredRoles = profile.registeredRoles.filter((role) => {
    if (role.pillar === 'lpg') return lpgRegistered;
    if (role.pillar === 'vandhan') return vanDhan.isRegistered;
    return true;
  });

  const openSettings = () => navigation.navigate('Settings');

  // Cross-tab jumps pass `pop: true` at every nested level. In React Navigation 7,
  // navigate only reuses a screen that is currently on top; without `pop` it pushes a
  // duplicate when the target sits lower in a stack the user left mid-flow (flow.md).
  const openNotices = () => navigation.navigate('NoticesTab', { screen: 'Notices', pop: true });

  const openRecords = () => navigation.navigate('RecordsTab', { screen: 'Records', pop: true });

  const openServices = () => navigation.navigate('ServicesTab', { screen: 'Services', pop: true });

  // Registration gate: unregistered users land on the pillar's registration screen.
  const openVanDhan = () =>
    navigation.navigate('ServicesTab', {
      screen: 'VanDhanStack',
      initial: false,
      pop: true,
      params: { screen: vanDhan.isRegistered ? 'VanDhanHome' : 'VanDhanRegistration', pop: true },
    });

  const openLpg = () =>
    navigation.navigate('ServicesTab', {
      screen: 'LpgStack',
      initial: false,
      pop: true,
      params: { screen: lpgRegistered ? 'LpgHome' : 'LpgRegistration', pop: true },
    });

  // Activity rows open the matching record or notice in its own tab, with that tab's list kept
  // underneath (`initial: false`) so back returns to My Records / Notices.
  const openActivity = ({ target }: Activity) =>
    target.kind === 'record'
      ? navigation.navigate('RecordsTab', {
          screen: 'RecordDetail',
          params: { recordId: target.recordId },
          initial: false,
          pop: true,
        })
      : navigation.navigate('NoticesTab', {
          screen: 'NoticeDetail',
          params: { noticeId: target.noticeId },
          initial: false,
          pop: true,
        });

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScenicBackdrop />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card style={styles.profileBar}>
          {/* UID chip → Settings. The bell is a sibling, not nested, so VoiceOver reaches both. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Settings. ${profile.fullName}, UID ${profile.uid}`}
            onPress={openSettings}
            style={({ pressed }) => [styles.uidChip, pressed && styles.pressed]}
          >
            <Avatar initials={initialsOf(profile.fullName)} />
            <Text numberOfLines={1} style={styles.uid}>
              <Text style={styles.uidLabel}>{'UID  '}</Text>
              {profile.uid}
            </Text>
            <Ionicons name="chevron-forward" size={theme.type.body.fontSize} color={theme.color.textSecondary} />
          </Pressable>
          <IconButton
            icon="notifications-outline"
            badgeCount={unreadNotificationCount}
            accessibilityLabel="Notifications"
            onPress={openNotices}
          />
        </Card>

        <Text accessibilityRole="header" style={styles.title}>
          {[greetingFor(new Date()), firstNameOf(profile.fullName)].filter(Boolean).join(', ')}
        </Text>

        <TextField
          accessibilityLabel="Search"
          icon="search"
          onChangeText={setQuery}
          placeholder="Search across Van Dhan, Livestock, Notices…"
          returnKeyType="search"
          trailing={
            <Ionicons name="mic-outline" size={theme.type.title.fontSize} color={theme.color.textSecondary} />
          }
          value={query}
          variant="search"
        />

        {/* All five always show. Van Dhan and LPG are greyed out until registered; tapping one opens its
            registration screen. Livestock never needs registration. */}
        <View style={styles.quickActions}>
          <QuickActionTile
            icon={pillarMeta.vandhan.icon}
            label={pillarMeta.vandhan.label}
            iconColor={pillarMeta.vandhan.colors.icon}
            tint={pillarMeta.vandhan.colors.tint}
            muted={!vanDhan.isRegistered}
            onPress={openVanDhan}
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
            muted={!lpgRegistered}
            onPress={openLpg}
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

        {/* No announcements on Home: updates live only in Notices. */}
        <Card style={styles.row}>
          <Avatar icon="people" size="l" />
          <View style={styles.flex}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Registered as</Text>
              <Button label="Manage" variant="text" trailingIcon="chevron-forward" onPress={openServices} />
            </View>
            <View style={styles.chips}>
              {registeredRoles.map((role) => (
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

        {/* Replaces the LPG status card (redesign): refills are booked and tracked in Services → LPG. */}
        <Card padded={false} elevated>
          <View style={styles.activityHeader}>
            <Text accessibilityRole="header" style={styles.cardTitle}>
              Recent activities
            </Text>
            <Button label="View all" variant="text" trailingIcon="chevron-forward" onPress={openRecords} />
          </View>
          {activity.length === 0 ? (
            <Text style={styles.empty}>Nothing yet — your collections, requests and notices will show here.</Text>
          ) : (
            activity.map((item, index) => (
              <ListRow
                key={item.id}
                icon={item.icon}
                iconColor={item.iconColor}
                iconBackground={item.tint}
                iconShape="circle"
                title={item.title}
                subtitle={item.subtitle}
                meta={formatDate(item.occurredAt)}
                divider={index < activity.length - 1}
                onPress={() => openActivity(item)}
              />
            ))
          )}
        </Card>
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
  flex: {
    flex: 1,
  },
  profileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    paddingVertical: theme.space.s,
  },
  uidChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    minHeight: MIN_TOUCH_TARGET,
  },
  pressed: {
    opacity: 0.7,
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
  title: {
    ...theme.type.display,
    color: theme.color.textPrimary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.space.s,
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
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.s,
    paddingHorizontal: theme.space.m,
    paddingTop: theme.space.m,
    paddingBottom: theme.space.xs,
  },
  empty: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    padding: theme.space.m,
  },
});
